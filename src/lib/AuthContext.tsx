import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { AppUser, LocalUserRecord, Organization, UserRole } from '../types';
import { cloudEnabled, supabase } from './supabase';
import { db } from './db';
import { createLocalUser, getLocalSession, localLogin, localLogout, localMfa, makeTotp, verifyLocalEnrollment } from './localAuth';
import QRCode from 'qrcode';
import { nowIso, uid } from './utils';

type Stage = 'loading' | 'first_setup' | 'login' | 'enroll_mfa' | 'challenge_mfa' | 'authenticated';

interface AuthContextValue {
  mode: 'local' | 'cloud';
  stage: Stage;
  user: AppUser | null;
  pendingLocalUser: LocalUserRecord | null;
  mfaQr: string;
  mfaSecret: string;
  error: string;
  login(email: string, password: string): Promise<void>;
  setupFirstAdmin(values: { orgName: string; country: string; name: string; email: string; password: string }): Promise<void>;
  verifyMfa(code: string): Promise<void>;
  logout(): Promise<void>;
  clearError(): void;
  createUser(values: { name: string; email: string; password: string; role: UserRole }): Promise<{ qr: string; secret: string }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const CLOUD_USER_CACHE = 'alza-cloud-user-cache';

function svgQrToDataUrl(qr: string) {
  if (qr.startsWith('data:')) return qr;
  if (qr.trim().startsWith('<svg')) return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(qr)}`;
  return qr;
}

async function cloudProfile(authUser: any): Promise<AppUser> {
  if (!supabase) throw new Error('Cloud client unavailable');
  const { data } = await supabase.from('profiles').select('*').eq('id', authUser.id).maybeSingle();
  return {
    id: authUser.id,
    email: authUser.email ?? '',
    name: data?.name ?? authUser.user_metadata?.name ?? authUser.email ?? 'User',
    role: (data?.role ?? 'auditor') as UserRole,
    orgId: data?.org_id ?? authUser.user_metadata?.org_id ?? '',
    active: data?.active ?? true,
    source: 'supabase'
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [stage, setStage] = useState<Stage>('loading');
  const [user, setUser] = useState<AppUser | null>(null);
  const [pendingLocalUser, setPendingLocalUser] = useState<LocalUserRecord | null>(null);
  const [mfaQr, setMfaQr] = useState('');
  const [mfaSecret, setMfaSecret] = useState('');
  const [factorId, setFactorId] = useState('');
  const [error, setError] = useState('');

  function acceptProfile(profile: AppUser) {
    setUser(profile);
    if (profile.source === 'supabase') localStorage.setItem(CLOUD_USER_CACHE, JSON.stringify(profile));
    setStage('authenticated');
  }

  async function advanceCloudMfa(authUser: any) {
    if (!supabase) return;
    const requireMfa = window.ALZA_CONFIG?.REQUIRE_MFA !== false;
    if (!requireMfa) {
      const profile = await cloudProfile(authUser);
      if (!profile.active) throw new Error('This account is disabled.');
      acceptProfile(profile); return;
    }

    // MFA is checked before reading tenant tables because production RLS requires AAL2.
    const { data: aal, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aalError) throw aalError;
    if (aal.currentLevel === 'aal2') {
      const profile = await cloudProfile(authUser);
      if (!profile.active) throw new Error('This account is disabled.');
      acceptProfile(profile); return;
    }

    const { data: factors, error: factorError } = await supabase.auth.mfa.listFactors();
    if (factorError) throw factorError;
    const verified = factors.totp.find(f => f.status === 'verified');
    if (verified) {
      setFactorId(verified.id);
      setStage('challenge_mfa');
      return;
    }

    const { data: enrollment, error: enrollError } = await supabase.auth.mfa.enroll({ factorType: 'totp', friendlyName: 'ALZA IT Audit Authenticator' });
    if (enrollError) throw enrollError;
    setFactorId(enrollment.id);
    setMfaQr(svgQrToDataUrl(enrollment.totp.qr_code));
    setMfaSecret(enrollment.totp.secret);
    setStage('enroll_mfa');
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (cloudEnabled && supabase) {
          const { data } = await supabase.auth.getSession();
          if (!mounted) return;
          if (data.session?.user) {
            if (!navigator.onLine) {
              const cached = localStorage.getItem(CLOUD_USER_CACHE);
              if (cached) { acceptProfile(JSON.parse(cached)); return; }
            }
            await advanceCloudMfa(data.session.user);
          } else setStage('login');
        } else {
          const session = await getLocalSession();
          if (!mounted) return;
          if (session) { setUser(session); setStage('authenticated'); return; }
          const count = await db.users.count();
          setStage(count === 0 ? 'first_setup' : 'login');
        }
      } catch (e: any) {
        setError(e?.message ?? String(e));
        setStage('login');
      }
    })();
    return () => { mounted = false; };
  }, []);

  async function login(email: string, password: string) {
    setError('');
    try {
      if (cloudEnabled && supabase) {
        const { data, error: signError } = await supabase.auth.signInWithPassword({ email, password });
        if (signError) throw signError;
        if (!data.user) throw new Error('Login failed.');
        await advanceCloudMfa(data.user);
      } else {
        const local = await localLogin(email, password);
        setPendingLocalUser(local);
        if (!local.mfaVerified) {
          const totp = makeTotp(local.email, local.totpSecret);
          setMfaQr(await QRCode.toDataURL(totp.toString()));
          setMfaSecret(local.totpSecret);
          setStage('enroll_mfa');
        } else setStage('challenge_mfa');
      }
    } catch (e: any) { setError(e?.message ?? String(e)); }
  }

  async function setupFirstAdmin(values: { orgName: string; country: string; name: string; email: string; password: string }) {
    setError('');
    if (cloudEnabled) { setError('First cloud administrator must be created in Supabase Auth; see SETUP-SUPABASE.md.'); return; }
    try {
      const ts = nowIso();
      const org: Organization = { id: uid(), orgId: '', name: values.orgName, legalName: values.orgName, country: values.country, createdAt: ts, updatedAt: ts, syncState: 'synced' };
      org.orgId = org.id;
      await db.organizations.add(org);
      const { record, qr, secret } = await createLocalUser(values.email, values.name, values.password, 'super_admin', org.id);
      setPendingLocalUser(record); setMfaQr(qr); setMfaSecret(secret); setStage('enroll_mfa');
    } catch (e: any) { setError(e?.message ?? String(e)); }
  }

  async function verifyMfa(code: string) {
    setError('');
    try {
      if (cloudEnabled && supabase) {
        if (!factorId) throw new Error('MFA factor not available. Please sign in again.');
        const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({ factorId, code });
        if (verifyError) throw verifyError;
        const { data } = await supabase.auth.getUser();
        if (!data.user) throw new Error('Session unavailable after MFA verification.');
        acceptProfile(await cloudProfile(data.user));
      } else {
        if (!pendingLocalUser) throw new Error('Local login session expired. Please sign in again.');
        if (!pendingLocalUser.mfaVerified) await verifyLocalEnrollment(pendingLocalUser.id, code);
        const appUser = await localMfa(pendingLocalUser.id, code);
        setUser(appUser); setStage('authenticated');
      }
    } catch (e: any) { setError(e?.message ?? String(e)); }
  }

  async function logout() {
    if (cloudEnabled && supabase) { await supabase.auth.signOut(); localStorage.removeItem(CLOUD_USER_CACHE); }
    else localLogout();
    setUser(null); setPendingLocalUser(null); setMfaQr(''); setMfaSecret(''); setFactorId(''); setStage('login');
  }

  async function createUser(values: { name: string; email: string; password: string; role: UserRole }) {
    if (!user) throw new Error('Not authenticated.');
    if (cloudEnabled) throw new Error('Use the cloud invitation action for Supabase users.');
    const { qr, secret } = await createLocalUser(values.email, values.name, values.password, values.role, user.orgId);
    return { qr, secret };
  }

  const value = useMemo<AuthContextValue>(() => ({ mode: cloudEnabled ? 'cloud' : 'local', stage, user, pendingLocalUser, mfaQr, mfaSecret, error, login, setupFirstAdmin, verifyMfa, logout, clearError: () => setError(''), createUser }), [stage, user, pendingLocalUser, mfaQr, mfaSecret, error]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used within AuthProvider');
  return value;
}

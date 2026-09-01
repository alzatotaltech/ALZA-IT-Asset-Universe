import * as OTPAuth from 'otpauth';
import QRCode from 'qrcode';
import { db } from './db';
import { uid } from './utils';
import type { AppUser, LocalUserRecord, UserRole } from '../types';

const SESSION_KEY = 'alza-local-session';

function bytesToB64(bytes: Uint8Array) {
  let s = '';
  bytes.forEach(b => s += String.fromCharCode(b));
  return btoa(s);
}
function b64ToBytes(s: string) {
  return Uint8Array.from(atob(s), c => c.charCodeAt(0));
}

async function hashPassword(password: string, saltB64: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: b64ToBytes(saltB64), iterations: 210000, hash: 'SHA-256' }, key, 256);
  return bytesToB64(new Uint8Array(bits));
}

export function makeTotp(email: string, secret?: string) {
  return new OTPAuth.TOTP({
    issuer: 'ALZA IT Audit',
    label: email,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: secret ? OTPAuth.Secret.fromBase32(secret) : new OTPAuth.Secret({ size: 20 })
  });
}

export async function createLocalUser(email: string, name: string, password: string, role: UserRole, orgId: string) {
  const existing = await db.users.where('email').equalsIgnoreCase(email).first();
  if (existing) throw new Error('A local user with this email already exists.');
  const salt = new Uint8Array(16); crypto.getRandomValues(salt);
  const saltB64 = bytesToB64(salt);
  const totp = makeTotp(email);
  const record: LocalUserRecord = {
    id: uid(), email: email.toLowerCase().trim(), name, role, orgId,
    passwordHash: await hashPassword(password, saltB64), passwordSalt: saltB64,
    totpSecret: totp.secret.base32, mfaVerified: false, active: true, createdAt: new Date().toISOString()
  };
  await db.users.add(record);
  return { record, qr: await QRCode.toDataURL(totp.toString()), secret: record.totpSecret };
}

export async function verifyLocalEnrollment(userId: string, code: string) {
  const user = await db.users.get(userId);
  if (!user) throw new Error('User not found.');
  const delta = makeTotp(user.email, user.totpSecret).validate({ token: code, window: 1 });
  if (delta === null) throw new Error('Invalid authenticator code.');
  await db.users.update(userId, { mfaVerified: true });
  return true;
}

export async function localLogin(email: string, password: string) {
  const user = await db.users.where('email').equalsIgnoreCase(email).first();
  if (!user || !user.active) throw new Error('Invalid email or password.');
  const hash = await hashPassword(password, user.passwordSalt);
  if (hash !== user.passwordHash) throw new Error('Invalid email or password.');
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id, firstFactor: true, mfa: false }));
  return user;
}

export async function localMfa(userId: string, code: string) {
  const user = await db.users.get(userId);
  if (!user) throw new Error('User not found.');
  if (!user.mfaVerified) throw new Error('MFA has not been enrolled for this user.');
  const delta = makeTotp(user.email, user.totpSecret).validate({ token: code, window: 1 });
  if (delta === null) throw new Error('Invalid authenticator code.');
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id, firstFactor: true, mfa: true }));
  return toAppUser(user);
}

export async function getLocalSession(): Promise<AppUser | null> {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY); if (!raw) return null;
    const s = JSON.parse(raw); if (!s.mfa) return null;
    const user = await db.users.get(s.userId); if (!user?.active) return null;
    return toAppUser(user);
  } catch { return null; }
}

export function localLogout() { sessionStorage.removeItem(SESSION_KEY); }
export const toAppUser = (u: LocalUserRecord): AppUser => ({ id: u.id, email: u.email, name: u.name, role: u.role, orgId: u.orgId, active: u.active, source: 'local' });

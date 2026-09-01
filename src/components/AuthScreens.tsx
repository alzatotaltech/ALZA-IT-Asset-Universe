import React, { useState } from 'react';
import { ShieldCheck, WifiOff } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { Button, Field, TextInput } from './UI';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  if (auth.stage === 'authenticated') return <>{children}</>;
  return <div className="auth-shell">
    <div className="auth-brand">
      <img src="./alza-logo.png" className="auth-logo" alt="ALZA" />
      <div className="auth-brand-copy"><span>IT AUDIT</span><strong>Complete IT Assurance</strong></div>
    </div>
    <div className="auth-card">
      {auth.stage === 'loading' && <div className="auth-loading"><div className="spinner"/><p>Opening secure workspace…</p></div>}
      {auth.stage === 'first_setup' && <FirstSetup/>}
      {auth.stage === 'login' && <Login/>}
      {(auth.stage === 'enroll_mfa' || auth.stage === 'challenge_mfa') && <Mfa/>}
    </div>
    <div className="auth-foot"><WifiOff size={15}/><span>{auth.mode === 'local' ? 'Offline local workspace' : 'Cloud workspace with offline cache'}</span></div>
  </div>;
}

function ErrorBox() {
  const { error } = useAuth();
  return error ? <div className="alert alert-danger">{error}</div> : null;
}

function FirstSetup() {
  const { setupFirstAdmin } = useAuth();
  const [v,setV] = useState({ orgName: '', country: 'United Arab Emirates', name: '', email: '', password: '' });
  const [busy,setBusy] = useState(false);
  return <form onSubmit={async e => { e.preventDefault(); setBusy(true); await setupFirstAdmin(v); setBusy(false); }}>
    <div className="auth-title"><ShieldCheck/><div><h1>Create secure workspace</h1><p>First-time setup creates your organisation and Super Admin account.</p></div></div>
    <ErrorBox/>
    <div className="form-grid two">
      <Field label="Organisation"><TextInput required value={v.orgName} onChange={e=>setV({...v,orgName:e.target.value})} placeholder="Company name"/></Field>
      <Field label="Country"><TextInput required value={v.country} onChange={e=>setV({...v,country:e.target.value})}/></Field>
      <Field label="Administrator name"><TextInput required value={v.name} onChange={e=>setV({...v,name:e.target.value})}/></Field>
      <Field label="Email"><TextInput type="email" required value={v.email} onChange={e=>setV({...v,email:e.target.value})}/></Field>
      <Field label="Password" hint="Use at least 12 characters."><TextInput type="password" minLength={12} required value={v.password} onChange={e=>setV({...v,password:e.target.value})}/></Field>
    </div>
    <Button disabled={busy}>{busy ? 'Creating…' : 'Create workspace & enrol MFA'}</Button>
  </form>;
}

function Login() {
  const { login, mode } = useAuth();
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [busy,setBusy]=useState(false);
  return <form onSubmit={async e=>{e.preventDefault();setBusy(true);await login(email,password);setBusy(false);}}>
    <div className="auth-title"><ShieldCheck/><div><h1>Secure sign in</h1><p>Email + password + authenticator code are required.</p></div></div>
    <ErrorBox/>
    <Field label="Email"><TextInput autoComplete="username" type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></Field>
    <Field label="Password"><TextInput autoComplete="current-password" type="password" required value={password} onChange={e=>setPassword(e.target.value)}/></Field>
    <Button disabled={busy}>{busy ? 'Signing in…' : 'Continue'}</Button>
    <p className="auth-note">Mode: <strong>{mode === 'cloud' ? 'Shared cloud workspace' : 'Offline local workspace'}</strong></p>
  </form>;
}

function Mfa() {
  const { stage, mfaQr, mfaSecret, verifyMfa } = useAuth();
  const [code,setCode]=useState(''); const [busy,setBusy]=useState(false);
  const enroll = stage === 'enroll_mfa';
  return <form onSubmit={async e=>{e.preventDefault();setBusy(true);await verifyMfa(code);setBusy(false);}}>
    <div className="auth-title"><ShieldCheck/><div><h1>{enroll ? 'Enrol authenticator' : 'Authenticator verification'}</h1><p>{enroll ? 'Scan once with Microsoft Authenticator, Google Authenticator, 1Password or another TOTP app.' : 'Enter the six-digit code from your authenticator app.'}</p></div></div>
    <ErrorBox/>
    {enroll && <div className="mfa-enroll">
      {mfaQr && <img src={mfaQr} alt="MFA QR code" className="mfa-qr"/>}
      {mfaSecret && <div className="mfa-secret"><span>Manual secret</span><code>{mfaSecret}</code></div>}
    </div>}
    <Field label="6-digit code"><TextInput inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,''))} placeholder="000000" className="input otp-input"/></Field>
    <Button disabled={busy || code.length !== 6}>{busy ? 'Verifying…' : enroll ? 'Verify & enable MFA' : 'Verify & open audit workspace'}</Button>
  </form>;
}

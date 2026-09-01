import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { ShieldCheck, WifiOff } from 'lucide-react';
import { useAuth } from '../lib/AuthContext.js';
import { Button, Field, TextInput } from './UI.js';
export function AuthGate({ children }) {
    const auth = useAuth();
    if (auth.stage === 'authenticated')
        return _jsx(_Fragment, { children: children });
    return _jsxs("div", { className: "auth-shell", children: [_jsxs("div", { className: "auth-brand", children: [_jsx("img", { src: "./alza-logo.png", className: "auth-logo", alt: "ALZA" }), _jsxs("div", { className: "auth-brand-copy", children: [_jsx("span", { children: "IT AUDIT" }), _jsx("strong", { children: "Complete IT Assurance" })] })] }), _jsxs("div", { className: "auth-card", children: [auth.stage === 'loading' && _jsxs("div", { className: "auth-loading", children: [_jsx("div", { className: "spinner" }), _jsx("p", { children: "Opening secure workspace\u2026" })] }), auth.stage === 'first_setup' && _jsx(FirstSetup, {}), auth.stage === 'login' && _jsx(Login, {}), (auth.stage === 'enroll_mfa' || auth.stage === 'challenge_mfa') && _jsx(Mfa, {})] }), _jsxs("div", { className: "auth-foot", children: [_jsx(WifiOff, { size: 15 }), _jsx("span", { children: auth.mode === 'local' ? 'Offline local workspace' : 'Cloud workspace with offline cache' })] })] });
}
function ErrorBox() {
    const { error } = useAuth();
    return error ? _jsx("div", { className: "alert alert-danger", children: error }) : null;
}
function FirstSetup() {
    const { setupFirstAdmin } = useAuth();
    const [v, setV] = useState({ orgName: '', country: 'United Arab Emirates', name: '', email: '', password: '' });
    const [busy, setBusy] = useState(false);
    return _jsxs("form", { onSubmit: async (e) => { e.preventDefault(); setBusy(true); await setupFirstAdmin(v); setBusy(false); }, children: [_jsxs("div", { className: "auth-title", children: [_jsx(ShieldCheck, {}), _jsxs("div", { children: [_jsx("h1", { children: "Create secure workspace" }), _jsx("p", { children: "First-time setup creates your organisation and Super Admin account." })] })] }), _jsx(ErrorBox, {}), _jsxs("div", { className: "form-grid two", children: [_jsx(Field, { label: "Organisation", children: _jsx(TextInput, { required: true, value: v.orgName, onChange: e => setV({ ...v, orgName: e.target.value }), placeholder: "Company name" }) }), _jsx(Field, { label: "Country", children: _jsx(TextInput, { required: true, value: v.country, onChange: e => setV({ ...v, country: e.target.value }) }) }), _jsx(Field, { label: "Administrator name", children: _jsx(TextInput, { required: true, value: v.name, onChange: e => setV({ ...v, name: e.target.value }) }) }), _jsx(Field, { label: "Email", children: _jsx(TextInput, { type: "email", required: true, value: v.email, onChange: e => setV({ ...v, email: e.target.value }) }) }), _jsx(Field, { label: "Password", hint: "Use at least 12 characters.", children: _jsx(TextInput, { type: "password", minLength: 12, required: true, value: v.password, onChange: e => setV({ ...v, password: e.target.value }) }) })] }), _jsx(Button, { disabled: busy, children: busy ? 'Creating…' : 'Create workspace & enrol MFA' })] });
}
function Login() {
    const { login, mode } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [busy, setBusy] = useState(false);
    return _jsxs("form", { onSubmit: async (e) => { e.preventDefault(); setBusy(true); await login(email, password); setBusy(false); }, children: [_jsxs("div", { className: "auth-title", children: [_jsx(ShieldCheck, {}), _jsxs("div", { children: [_jsx("h1", { children: "Secure sign in" }), _jsx("p", { children: "Email + password + authenticator code are required." })] })] }), _jsx(ErrorBox, {}), _jsx(Field, { label: "Email", children: _jsx(TextInput, { autoComplete: "username", type: "email", required: true, value: email, onChange: e => setEmail(e.target.value) }) }), _jsx(Field, { label: "Password", children: _jsx(TextInput, { autoComplete: "current-password", type: "password", required: true, value: password, onChange: e => setPassword(e.target.value) }) }), _jsx(Button, { disabled: busy, children: busy ? 'Signing in…' : 'Continue' }), _jsxs("p", { className: "auth-note", children: ["Mode: ", _jsx("strong", { children: mode === 'cloud' ? 'Shared cloud workspace' : 'Offline local workspace' })] })] });
}
function Mfa() {
    const { stage, mfaQr, mfaSecret, verifyMfa } = useAuth();
    const [code, setCode] = useState('');
    const [busy, setBusy] = useState(false);
    const enroll = stage === 'enroll_mfa';
    return _jsxs("form", { onSubmit: async (e) => { e.preventDefault(); setBusy(true); await verifyMfa(code); setBusy(false); }, children: [_jsxs("div", { className: "auth-title", children: [_jsx(ShieldCheck, {}), _jsxs("div", { children: [_jsx("h1", { children: enroll ? 'Enrol authenticator' : 'Authenticator verification' }), _jsx("p", { children: enroll ? 'Scan once with Microsoft Authenticator, Google Authenticator, 1Password or another TOTP app.' : 'Enter the six-digit code from your authenticator app.' })] })] }), _jsx(ErrorBox, {}), enroll && _jsxs("div", { className: "mfa-enroll", children: [mfaQr && _jsx("img", { src: mfaQr, alt: "MFA QR code", className: "mfa-qr" }), mfaSecret && _jsxs("div", { className: "mfa-secret", children: [_jsx("span", { children: "Manual secret" }), _jsx("code", { children: mfaSecret })] })] }), _jsx(Field, { label: "6-digit code", children: _jsx(TextInput, { inputMode: "numeric", pattern: "[0-9]{6}", maxLength: 6, required: true, value: code, onChange: e => setCode(e.target.value.replace(/\D/g, '')), placeholder: "000000", className: "input otp-input" }) }), _jsx(Button, { disabled: busy || code.length !== 6, children: busy ? 'Verifying…' : enroll ? 'Verify & enable MFA' : 'Verify & open audit workspace' })] });
}

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { BarChart3, Boxes, Building2, ClipboardCheck, FileBarChart, FileWarning, Menu, Network, PackageSearch, RadioTower, RefreshCw, Settings, ShieldCheck, UsersRound, Wifi, WifiOff, X } from 'lucide-react';
import { AuthProvider, useAuth } from './lib/AuthContext.js';
import { AuthGate } from './components/AuthScreens.js';
import { Dashboard } from './pages/Dashboard.js';
import { SitesPage } from './pages/Sites.js';
import { PeoplePage } from './pages/People.js';
import { AssetsPage } from './pages/Assets.js';
import { TelecomPage } from './pages/Telecom.js';
import { SoftwarePage } from './pages/Software.js';
import { VendorsPage } from './pages/Vendors.js';
import { AuditsPage } from './pages/Audits.js';
import { AuditWorkspace } from './pages/AuditWorkspace.js';
import { FindingsPage } from './pages/Findings.js';
import { ReconciliationPage } from './pages/Reconciliation.js';
import { ReportsPage } from './pages/Reports.js';
import { AdminPage } from './pages/Admin.js';
import { cloudEnabled } from './lib/supabase.js';
import { syncAll } from './lib/cloudSync.js';
const NAV = [['dashboard', 'Dashboard', _jsx(BarChart3, {}), 'Overview'], ['audits', 'Audits', _jsx(ClipboardCheck, {}), 'Audit'], ['findings', 'Findings', _jsx(FileWarning, {}), 'Audit'], ['reconciliation', 'Reconcile', _jsx(PackageSearch, {}), 'Audit'], ['sites', 'Sites', _jsx(Building2, {}), 'Registers'], ['people', 'People', _jsx(UsersRound, {}), 'Registers'], ['assets', 'Assets', _jsx(Boxes, {}), 'Registers'], ['telecom', 'Telecom', _jsx(RadioTower, {}), 'Registers'], ['software', 'Software', _jsx(Network, {}), 'Registers'], ['vendors', 'Vendors', _jsx(ShieldCheck, {}), 'Registers'], ['reports', 'Reports', _jsx(FileBarChart, {}), 'Output'], ['admin', 'Admin', _jsx(Settings, {}), 'System']];
function Shell() { const auth = useAuth(); const [page, setPage] = useState('dashboard'); const [auditId, setAuditId] = useState(null); const [findingId, setFindingId] = useState(); const [navOpen, setNavOpen] = useState(false); const [online, setOnline] = useState(navigator.onLine); const [syncing, setSyncing] = useState(false); useEffect(() => { const on = () => setOnline(true), off = () => setOnline(false); addEventListener('online', on); addEventListener('offline', off); return () => { removeEventListener('online', on); removeEventListener('offline', off); }; }, []); useEffect(() => { if (cloudEnabled && auth.user && navigator.onLine) {
    syncAll(auth.user.orgId).catch(console.error);
} }, [auth.user?.id]); async function go(p) { setAuditId(null); setPage(p); setNavOpen(false); } async function sync() { if (!cloudEnabled || !auth.user)
    return; setSyncing(true); try {
    await syncAll(auth.user.orgId);
}
finally {
    setSyncing(false);
} } let content; if (auditId)
    content = _jsx(AuditWorkspace, { auditId: auditId, onBack: () => setAuditId(null), openFinding: id => { setAuditId(null); setFindingId(id); setPage('findings'); } });
else
    content = page === 'dashboard' ? _jsx(Dashboard, { openAudit: setAuditId }) : page === 'audits' ? _jsx(AuditsPage, { openAudit: setAuditId }) : page === 'sites' ? _jsx(SitesPage, {}) : page === 'people' ? _jsx(PeoplePage, {}) : page === 'assets' ? _jsx(AssetsPage, {}) : page === 'telecom' ? _jsx(TelecomPage, {}) : page === 'software' ? _jsx(SoftwarePage, {}) : page === 'vendors' ? _jsx(VendorsPage, {}) : page === 'reconciliation' ? _jsx(ReconciliationPage, {}) : page === 'findings' ? _jsx(FindingsPage, { selectedId: findingId, onSelected: () => setFindingId(undefined) }) : page === 'reports' ? _jsx(ReportsPage, {}) : _jsx(AdminPage, {}); const groups = [...new Set(NAV.map(x => x[3]))]; return _jsxs("div", { className: "app-shell", children: [_jsxs("aside", { className: `sidebar ${navOpen ? 'open' : ''}`, children: [_jsxs("div", { className: "side-brand", children: [_jsx("img", { src: "./alza-logo.png" }), _jsxs("div", { children: [_jsx("strong", { children: "IT AUDIT" }), _jsx("span", { children: "Assurance Platform" })] }), _jsx("button", { className: "icon-btn mobile-only", onClick: () => setNavOpen(false), children: _jsx(X, {}) })] }), _jsx("nav", { children: groups.map(g => _jsxs("div", { className: "nav-group", children: [_jsx("span", { children: g }), NAV.filter(x => x[3] === g).filter(x => x[0] !== 'admin' || auth.user?.role === 'super_admin').map(([key, label, icon]) => _jsxs("button", { className: page === key && !auditId ? 'active' : '', onClick: () => go(key), children: [React.cloneElement(icon, { size: 18 }), _jsx("span", { children: label })] }, key))] }, g)) }), _jsxs("div", { className: "side-user", children: [_jsx("div", { className: "avatar", children: auth.user?.name?.slice(0, 2).toUpperCase() }), _jsxs("div", { children: [_jsx("strong", { children: auth.user?.name }), _jsx("span", { children: auth.user?.role.replaceAll('_', ' ') })] }), _jsx("button", { className: "text-action", onClick: auth.logout, children: "Sign out" })] })] }), navOpen && _jsx("div", { className: "nav-backdrop", onClick: () => setNavOpen(false) }), _jsxs("div", { className: "main-shell", children: [_jsxs("header", { className: "topbar", children: [_jsx("button", { className: "icon-btn mobile-only", onClick: () => setNavOpen(true), children: _jsx(Menu, {}) }), _jsxs("div", { className: "top-brand mobile-only", children: [_jsx("img", { src: "./alza-logo.png" }), _jsx("span", { children: "IT Audit" })] }), _jsx("div", { className: "top-spacer" }), _jsxs("div", { className: `connection ${online ? 'online' : 'offline'}`, children: [online ? _jsx(Wifi, { size: 15 }) : _jsx(WifiOff, { size: 15 }), _jsx("span", { children: cloudEnabled ? (online ? 'Cloud connected' : 'Offline — changes queued') : 'Local workspace' })] }), cloudEnabled && _jsx("button", { className: "icon-btn", disabled: syncing || !online, title: "Synchronize", onClick: sync, children: _jsx(RefreshCw, { size: 17, className: syncing ? 'spin' : '' }) })] }), _jsx("main", { className: auditId ? 'main audit-main' : 'main', children: content }), _jsxs("nav", { className: "bottom-nav", children: [NAV.filter(x => ['dashboard', 'audits', 'assets', 'findings', 'reports'].includes(x[0])).map(([key, label, icon]) => _jsxs("button", { className: page === key && !auditId ? 'active' : '', onClick: () => go(key), children: [React.cloneElement(icon, { size: 19 }), _jsx("span", { children: label })] }, key)), _jsxs("button", { onClick: () => setNavOpen(true), children: [_jsx(Menu, { size: 19 }), _jsx("span", { children: "More" })] })] })] })] }); }
export default function App() { return _jsx(AuthProvider, { children: _jsx(AuthGate, { children: _jsx(Shell, {}) }) }); }

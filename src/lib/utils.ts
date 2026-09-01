import type { AuditResponse, AuditScope, Control, Finding, Risk } from '../types';

export const nowIso = () => new Date().toISOString();
export const uid = () => crypto.randomUUID();
export const money = (value?: number, currency = 'AED') =>
  typeof value === 'number' && Number.isFinite(value)
    ? new Intl.NumberFormat('en-AE', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value)
    : '—';
export const fmtDate = (value?: string) => value ? new Intl.DateTimeFormat('en-AE', { dateStyle: 'medium' }).format(new Date(value)) : '—';
export const titleCase = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

export const DEFAULT_SCOPE: AuditScope = {
  core: true,
  physical: true,
  assets: true,
  telecom: true,
  mobile: true,
  byod: true,
  printers: true,
  software: true,
  saas: true,
  m365: true,
  servers: true,
  network: true,
  cloud: true,
  security: true,
  privacy: true,
  backupDr: true,
  ai: true,
  development: false,
  otIot: true,
  cctvAccess: true,
  payment: false,
  warehouse: true,
  compliance: true
};

const DOMAIN_SCOPE_RULES: Array<[RegExp, keyof AuditScope]> = [
  [/development|source code|sdlc|ci\/cd|devops|secure software|application security|api & integration/i, 'development'],
  [/payment|pci|pos & payment/i, 'payment'],
  [/byod|cyod|cope|cobo/i, 'byod'],
  [/printer|mfp|managed print/i, 'printers'],
  [/^telecom|sim, esim|carrier|fixed voice|sip|pbx/i, 'telecom'],
  [/mobile devices|smartphone|tablet|mobile security/i, 'mobile'],
  [/microsoft 365|m365|exchange online|sharepoint|onedrive|teams|entra id/i, 'm365'],
  [/generative ai|shadow ai|ai governance|ai \/ genai/i, 'ai'],
  [/warehouse|barcode|rfid|field devices/i, 'warehouse'],
  [/iot|operational technology|scada|plc|m2m/i, 'otIot'],
  [/cctv|video surveillance|physical access control|biometric/i, 'cctvAccess'],
  [/cloud security|azure|aws|gcp|finops|cloud infrastructure/i, 'cloud'],
  [/servers & operating|storage, nas|virtualisation|hypervisors/i, 'servers'],
  [/backup|restore|business continuity|disaster recovery|rto|rpo/i, 'backupDr'],
  [/privacy|personal data|data protection|data classification|data retention|dlp/i, 'privacy'],
  [/software inventory|software asset|saas|licen[cs]e|application portfolio/i, 'software'],
  [/network|firewall|wifi|wireless|vpn|ztna|dns, dhcp|wan|sd-wan/i, 'network'],
  [/server \/ network room|environmental & facility|ups, generator|visitor, contractor/i, 'physical'],
  [/physical it asset|laptops|desktops|workstations|peripheral|removable media|meeting room|stock|repair|lost, stolen|asset disposal|employee it assignment/i, 'assets'],
  [/legal|regulatory|compliance|governance|policy|risk management|vendor|third-party|contract|procurement|budget|insurance|audit evidence/i, 'compliance'],
  [/security|identity|access|privileged|vulnerability|patch|logging|siem|incident response|awareness|secrets|certificate|endpoint/i, 'security']
];

export function controlIsApplicable(control: Control, scope: AuditScope): boolean {
  const hay = `${control.domain} ${control.subdomain} ${control.tags.join(' ')}`;
  const specific = DOMAIN_SCOPE_RULES.find(([rx]) => rx.test(hay));
  if (specific) return Boolean(scope[specific[1]]);
  return Boolean(scope.core);
}

export function scoreAudit(controls: Control[], responses: AuditResponse[], findings: Finding[]) {
  const byId = new Map(responses.map(r => [r.controlId, r]));
  const multipliers: Record<string, number | null> = {
    compliant: 1,
    mostly_compliant: 0.75,
    partial: 0.5,
    non_compliant: 0,
    not_verified: 0,
    na: null
  };
  let weighted = 0;
  let max = 0;
  let answered = 0;
  for (const c of controls) {
    const r = byId.get(c.id);
    if (!r) continue;
    const m = multipliers[r.status];
    if (m === null) continue;
    max += c.weight;
    weighted += c.weight * m;
    answered += 1;
  }
  const score = max ? Math.round((weighted / max) * 100) : 0;
  const criticalFailures = findings.filter(f => f.risk === 'critical' && f.status !== 'closed').length;
  const highFailures = findings.filter(f => f.risk === 'high' && f.status !== 'closed').length;
  const grade = criticalFailures > 0 || score < 50 ? 'Critical' : score < 70 ? 'Weak' : score < 85 ? 'Moderate' : 'Strong';
  return { score, answered, totalApplicable: controls.length, criticalFailures, highFailures, grade } as const;
}

export function riskRank(r: Risk) {
  return ({ critical: 5, high: 4, medium: 3, low: 2, observation: 1 } as Record<Risk, number>)[r];
}

export async function sha256Blob(blob: Blob) {
  const buffer = await blob.arrayBuffer();
  const digest = await crypto.subtle.digest('SHA-256', buffer);
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
}

export function downloadText(filename: string, content: string, type = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function toCsv(rows: Record<string, unknown>[]) {
  if (!rows.length) return '';
  const keys = [...new Set(rows.flatMap(r => Object.keys(r)))];
  const quote = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  return [keys.map(quote).join(','), ...rows.map(r => keys.map(k => quote(r[k])).join(','))].join('\n');
}

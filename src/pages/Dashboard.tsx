import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { AlertTriangle, Boxes, ClipboardCheck, FileWarning, RadioTower, ShieldCheck, WalletCards } from 'lucide-react';
import { db } from '../lib/db';
import { useAuth } from '../lib/AuthContext';
import { MASTER_CONTROL_COUNT, DOMAIN_COUNT, MASTER_CONTROLS } from '../data/controlLibrary';
import { Card, PageHeader, RiskBadge, Stat, StatusBadge } from '../components/UI';
import { controlIsApplicable, money, scoreAudit } from '../lib/utils';

export function Dashboard({ openAudit }: { openAudit(id: string): void }) {
  const { user } = useAuth();
  const orgId = user!.orgId;
  const data = useLiveQuery(async () => {
    const [sites, assets, telecom, software, audits, responses, findings, vendors] = await Promise.all([
      db.sites.where('orgId').equals(orgId).toArray(),
      db.assets.where('orgId').equals(orgId).toArray(),
      db.telecom.where('orgId').equals(orgId).toArray(),
      db.software.where('orgId').equals(orgId).toArray(),
      db.audits.where('orgId').equals(orgId).toArray(),
      db.responses.where('orgId').equals(orgId).toArray(),
      db.findings.where('orgId').equals(orgId).toArray(),
      db.vendors.where('orgId').equals(orgId).toArray()
    ]);
    return { sites, assets, telecom, software, audits, responses, findings, vendors };
  }, [orgId]);
  if (!data) return <div className="loading-block">Loading dashboard…</div>;

  const activeAudit = [...data.audits].sort((a,b)=>String(b.updatedAt).localeCompare(a.updatedAt))[0];
  const applicable = activeAudit ? MASTER_CONTROLS.filter(c => controlIsApplicable(c, activeAudit.scope)) : [];
  const auditResponses = activeAudit ? data.responses.filter(r=>r.auditId===activeAudit.id) : [];
  const auditFindings = activeAudit ? data.findings.filter(f=>f.auditId===activeAudit.id) : [];
  const score = activeAudit ? scoreAudit(applicable, auditResponses, auditFindings) : null;
  const activeFindings = data.findings.filter(f=>!['closed','remediated'].includes(f.status));
  const leakage = activeFindings.reduce((s,f)=>s+(f.estimatedMonthlyLeakage||0),0);
  const unusedLicenses = data.software.reduce((s,x)=>s+Math.max(0,(x.purchasedLicenses||0)-(x.activeUsers||0)),0);
  const dormantSims = data.telecom.filter(t=>t.status==='active' && t.lastUsedAt && Date.now()-new Date(t.lastUsedAt).getTime()>90*86400000).length;

  return <>
    <PageHeader title="IT Assurance Dashboard" subtitle={`${data.sites.length} site${data.sites.length===1?'':'s'} • ${MASTER_CONTROL_COUNT.toLocaleString()} master controls across ${DOMAIN_COUNT} domains`} />
    <div className="stats-grid">
      <Stat label="Latest audit score" value={score ? `${score.score}%` : '—'} detail={score ? score.grade : 'Create an audit to begin'} />
      <Stat label="Open findings" value={activeFindings.length} detail={`${activeFindings.filter(f=>f.risk==='critical').length} critical • ${activeFindings.filter(f=>f.risk==='high').length} high`} />
      <Stat label="IT assets" value={data.assets.length} detail={`${data.assets.filter(a=>a.status==='in_use').length} in use`} />
      <Stat label="Active telecom" value={data.telecom.filter(t=>t.status==='active').length} detail={`${dormantSims} dormant >90d`} />
      <Stat label="Software / SaaS" value={data.software.length} detail={`${unusedLicenses} potentially unused licences`} />
      <Stat label="Potential leakage" value={money(leakage)} detail="Monthly from recorded findings" />
    </div>

    <div className="dashboard-grid">
      <Card className="score-card">
        <div className="card-head"><div><span className="eyebrow">CURRENT AUDIT</span><h2>{activeAudit?.name ?? 'No audit created'}</h2></div>{activeAudit && <StatusBadge status={activeAudit.state}/>}</div>
        {activeAudit ? <>
          <div className="score-row"><div className={`score-ring grade-${String(score?.grade).toLowerCase()}`} style={{'--score': `${score?.score || 0}%`} as React.CSSProperties}><strong>{score?.score}%</strong><span>{score?.grade}</span></div>
            <div className="score-detail"><div><strong>{score?.answered}</strong><span>controls answered</span></div><div><strong>{applicable.length}</strong><span>applicable controls</span></div><div><strong>{auditFindings.length}</strong><span>findings raised</span></div></div>
          </div>
          <button className="text-action" onClick={()=>openAudit(activeAudit.id)}>Continue fieldwork →</button>
        </> : <p className="muted">Create a site and an audit to activate scoring, evidence capture and findings.</p>}
      </Card>

      <Card>
        <div className="card-head"><div><span className="eyebrow">RISK</span><h2>Finding profile</h2></div><FileWarning size={20}/></div>
        <div className="risk-bars">
          {(['critical','high','medium','low','observation'] as const).map(r=>{ const count=activeFindings.filter(f=>f.risk===r).length; const max=Math.max(1,...(['critical','high','medium','low','observation'] as const).map(x=>activeFindings.filter(f=>f.risk===x).length)); return <div className="risk-bar" key={r}><span><RiskBadge risk={r}/></span><div><i className={`bar risk-bg-${r}`} style={{width:`${(count/max)*100}%`}}/></div><strong>{count}</strong></div>})}
        </div>
      </Card>

      <Card>
        <div className="card-head"><div><span className="eyebrow">ASSET CONTROL</span><h2>Exceptions</h2></div><Boxes size={20}/></div>
        <div className="metric-list">
          <Metric icon={<AlertTriangle/>} label="Assets not verified" value={data.assets.filter(a=>!a.lastVerifiedAt).length}/>
          <Metric icon={<RadioTower/>} label="Active telecom without assignee" value={data.telecom.filter(t=>t.status==='active'&&!t.assignedTo).length}/>
          <Metric icon={<WalletCards/>} label="Financed devices remaining" value={data.assets.filter(a=>a.financeRemainingMonths && a.financeRemainingMonths>0).length}/>
          <Metric icon={<ShieldCheck/>} label="Endpoints not marked encrypted" value={data.assets.filter(a=>['Laptop','Desktop','Mobile','Tablet'].includes(a.category)&&a.encryption===false).length}/>
        </div>
      </Card>

      <Card>
        <div className="card-head"><div><span className="eyebrow">AUDIT PROGRAM</span><h2>Recent audits</h2></div><ClipboardCheck size={20}/></div>
        <div className="compact-list">
          {data.audits.slice().sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)).slice(0,5).map(a=><button key={a.id} onClick={()=>openAudit(a.id)}><span><strong>{a.name}</strong><small>{data.sites.find(s=>s.id===a.siteId)?.name ?? 'Organisation-wide'}</small></span><StatusBadge status={a.state}/></button>)}
          {!data.audits.length && <p className="muted">No audits yet.</p>}
        </div>
      </Card>
    </div>
  </>;
}

function Metric({icon,label,value}:{icon:React.ReactNode;label:string;value:number|string}) { return <div className="metric"><span className="metric-icon">{icon}</span><span>{label}</span><strong>{value}</strong></div>; }

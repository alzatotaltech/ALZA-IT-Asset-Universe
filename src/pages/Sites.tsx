import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { MapPin, Plus, Trash2 } from 'lucide-react';
import { db } from '../lib/db';
import { useAuth } from '../lib/AuthContext';
import { nowIso, uid } from '../lib/utils';
import { saveRecord } from '../lib/cloudSync';
import type { Site } from '../types';
import { Button, Card, Empty, Field, Modal, PageHeader, Select, TextArea, TextInput } from '../components/UI';

export function SitesPage() {
  const { user } = useAuth(); const orgId=user!.orgId;
  const sites=useLiveQuery(()=>db.sites.where('orgId').equals(orgId).toArray(),[orgId])||[];
  const [edit,setEdit]=useState<Site|null>(null); const [open,setOpen]=useState(false);
  return <>
    <PageHeader title="Locations & Sites" subtitle="Offices, farms, warehouses, factories, branches, data rooms and remote sites." actions={<Button onClick={()=>{setEdit(null);setOpen(true)}}><Plus size={16}/> Add site</Button>}/>
    {!sites.length ? <Empty title="No sites yet" text="Add each physical location to start site-based audits and asset verification." action={<Button onClick={()=>setOpen(true)}>Add first site</Button>}/> :
    <div className="cards-list">{sites.sort((a,b)=>a.name.localeCompare(b.name)).map(s=><Card key={s.id} className="row-card clickable" ><button className="row-main" onClick={()=>{setEdit(s);setOpen(true)}}><span className="row-icon"><MapPin/></span><span><strong>{s.name}</strong><small>{[s.code,s.city,s.country].filter(Boolean).join(' • ')}</small></span><span className={`badge risk-${s.criticality}`}>{s.criticality}</span></button><button className="icon-btn danger" onClick={async()=>{if(confirm(`Delete ${s.name}?`)) await db.sites.delete(s.id)}}><Trash2 size={17}/></button></Card>)}</div>}
    {open&&<SiteForm record={edit} onClose={()=>setOpen(false)}/>} 
  </>;
}

function SiteForm({record,onClose}:{record:Site|null;onClose():void}) {
  const {user}=useAuth(); const [v,setV]=useState({name:record?.name||'',code:record?.code||'',address:record?.address||'',city:record?.city||'',country:record?.country||'United Arab Emirates',siteType:record?.siteType||'Office',criticality:record?.criticality||'medium',employees:String(record?.employees??''),itContact:record?.itContact||'',notes:record?.notes||''});
  return <Modal title={record?'Edit site':'Add site'} onClose={onClose}><form onSubmit={async e=>{e.preventDefault();const ts=nowIso();const row:Site={id:record?.id||uid(),orgId:user!.orgId,createdAt:record?.createdAt||ts,updatedAt:ts,createdBy:record?.createdBy||user!.id,updatedBy:user!.id,name:v.name,code:v.code,address:v.address,city:v.city,country:v.country,siteType:v.siteType,criticality:v.criticality as Site['criticality'],employees:v.employees?Number(v.employees):undefined,itContact:v.itContact,active:true,notes:v.notes};await saveRecord('sites',row);onClose();}}>
    <div className="form-grid two"><Field label="Site name"><TextInput required value={v.name} onChange={e=>setV({...v,name:e.target.value})}/></Field><Field label="Site code"><TextInput required value={v.code} onChange={e=>setV({...v,code:e.target.value})} placeholder="DXB-HQ"/></Field><Field label="Site type"><TextInput value={v.siteType} onChange={e=>setV({...v,siteType:e.target.value})}/></Field><Field label="Criticality"><Select value={v.criticality} onChange={e=>setV({...v,criticality:e.target.value as any})}><option>critical</option><option>high</option><option>medium</option><option>low</option></Select></Field><Field label="City"><TextInput value={v.city} onChange={e=>setV({...v,city:e.target.value})}/></Field><Field label="Country"><TextInput value={v.country} onChange={e=>setV({...v,country:e.target.value})}/></Field><Field label="Employees"><TextInput type="number" min="0" value={v.employees} onChange={e=>setV({...v,employees:e.target.value})}/></Field><Field label="IT contact"><TextInput value={v.itContact} onChange={e=>setV({...v,itContact:e.target.value})}/></Field></div>
    <Field label="Address"><TextArea value={v.address} onChange={e=>setV({...v,address:e.target.value})}/></Field><Field label="Notes"><TextArea value={v.notes} onChange={e=>setV({...v,notes:e.target.value})}/></Field><div className="form-actions"><Button variant="secondary" type="button" onClick={onClose}>Cancel</Button><Button>Save site</Button></div>
  </form></Modal>;
}

import { db, tableNames } from './db.js';
import { cloudEnabled, supabase } from './supabase.js';
const TABLE_MAP = {
    organizations: 'organizations', sites: 'sites', people: 'people', assets: 'assets', telecom: 'telecom',
    software: 'software', vendors: 'vendor_contracts', audits: 'audits', responses: 'audit_responses', findings: 'findings', evidence: 'evidence'
};
const snake = (key) => key.replace(/[A-Z]/g, c => `_${c.toLowerCase()}`);
const camel = (key) => key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
function toRemote(row) {
    const out = {};
    for (const [k, v] of Object.entries(row)) {
        if (k === 'blob' || k === 'syncState')
            continue;
        out[snake(k)] = v;
    }
    return out;
}
function fromRemote(row) {
    const out = {};
    for (const [k, v] of Object.entries(row))
        out[camel(k)] = v;
    out.syncState = 'synced';
    return out;
}
export async function pushRecord(table, row) {
    if (!cloudEnabled || !supabase)
        return;
    if (table === 'evidence') {
        const ev = row;
        let remotePath = ev.remotePath;
        if (ev.blob && !remotePath) {
            remotePath = `${ev.orgId}/${ev.auditId}/${ev.id}-${String(ev.name).replace(/[^a-zA-Z0-9._-]/g, '_')}`;
            const { error: uploadError } = await supabase.storage.from('audit-evidence').upload(remotePath, ev.blob, { upsert: true, contentType: ev.mimeType });
            if (uploadError)
                throw uploadError;
            row = { ...row, remotePath };
            await db.evidence.update(ev.id, { remotePath });
        }
    }
    const { error } = await supabase.from(TABLE_MAP[table]).upsert(toRemote(row), { onConflict: 'id' });
    if (error)
        throw error;
    await db[table].update(row.id, { syncState: 'synced' });
}
export async function saveRecord(table, row) {
    await db[table].put({ ...row, syncState: cloudEnabled ? 'local' : 'synced' });
    if (cloudEnabled) {
        try {
            await pushRecord(table, row);
        }
        catch (e) {
            console.error('Cloud sync failed', table, e);
            await db[table].update(row.id, { syncState: 'error' });
        }
    }
}
export async function syncAll(orgId) {
    if (!cloudEnabled || !supabase)
        return { pushed: 0, pulled: 0 };
    let pushed = 0, pulled = 0;
    for (const table of tableNames) {
        const localRows = await db[table].where('orgId').equals(orgId).toArray();
        for (const row of localRows.filter((r) => r.syncState !== 'synced')) {
            try {
                await pushRecord(table, row);
                pushed++;
            }
            catch (e) {
                console.error(e);
            }
        }
        const { data, error } = await supabase.from(TABLE_MAP[table]).select('*').eq('org_id', orgId);
        if (error) {
            console.error('Pull failed', table, error);
            continue;
        }
        for (const remote of data ?? []) {
            const row = fromRemote(remote);
            const local = await db[table].get(row.id);
            if (!local || new Date(row.updatedAt ?? 0) >= new Date(local.updatedAt ?? 0)) {
                await db[table].put({ ...local, ...row });
                pulled++;
            }
        }
    }
    localStorage.setItem('alza-last-sync', new Date().toISOString());
    return { pushed, pulled };
}

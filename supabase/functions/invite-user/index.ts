import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Missing Authorization header');
    const url = Deno.env.get('SUPABASE_URL')!;
    const anon = Deno.env.get('SUPABASE_ANON_KEY')!;
    const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const caller = createClient(url, anon, { global: { headers: { Authorization: authHeader } } });
    const { data: userData, error: userError } = await caller.auth.getUser();
    if (userError || !userData.user) throw new Error('Invalid caller session');
    const aal = await caller.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal.data?.currentLevel !== 'aal2') throw new Error('MFA verification is required');
    const { data: profile, error: profileError } = await caller.from('profiles').select('org_id,role,active').eq('id', userData.user.id).single();
    if (profileError || !profile?.active || profile.role !== 'super_admin') throw new Error('Super Admin permission required');
    const body = await req.json();
    if (!body.email || !body.name || !body.role || body.orgId !== profile.org_id) throw new Error('Invalid invitation request');
    const allowed = ['super_admin','audit_manager','auditor','it_manager','finding_owner','reviewer','read_only'];
    if (!allowed.includes(body.role)) throw new Error('Invalid role');
    const admin = createClient(url, service);
    const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(body.email, { data: { name: body.name, org_id: profile.org_id } });
    if (inviteError) throw inviteError;
    if (!invited.user) throw new Error('Invitation did not return a user');
    const { error: insertError } = await admin.from('profiles').upsert({ id: invited.user.id, org_id: profile.org_id, name: body.name, role: body.role, active: true, updated_at: new Date().toISOString() });
    if (insertError) throw insertError;
    return new Response(JSON.stringify({ ok: true, message: `Invitation sent to ${body.email}` }), { headers: { ...cors, 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } });
  }
});

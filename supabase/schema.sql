-- ALZA IT Audit — Supabase schema, multi-tenant RLS and MFA enforcement
-- Run once in Supabase SQL Editor. MFA (AAL2) is mandatory for all application data.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  org_id text not null,
  name text not null,
  role text not null check (role in ('super_admin','audit_manager','auditor','it_manager','finding_owner','reviewer','read_only')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.current_org_id() returns text language sql stable security definer set search_path=public as $$
  select org_id from public.profiles where id = (select auth.uid()) and active = true limit 1;
$$;
create or replace function public.current_app_role() returns text language sql stable security definer set search_path=public as $$
  select role from public.profiles where id = (select auth.uid()) and active = true limit 1;
$$;
create or replace function public.can_write() returns boolean language sql stable security definer set search_path=public as $$
  select coalesce(public.current_app_role() in ('super_admin','audit_manager','auditor','it_manager','finding_owner','reviewer'),false);
$$;
create or replace function public.can_delete() returns boolean language sql stable security definer set search_path=public as $$
  select coalesce(public.current_app_role() in ('super_admin','audit_manager'),false);
$$;

create table if not exists public.organizations (
  id text primary key, org_id text not null, name text not null, legal_name text, country text, industry text, website text, primary_contact text, notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), created_by text, updated_by text, deleted_at timestamptz
);
create table if not exists public.sites (
  id text primary key, org_id text not null, name text not null, code text not null, address text, city text, country text, site_type text, criticality text, employees integer, it_contact text, active boolean default true, notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), created_by text, updated_by text, deleted_at timestamptz
);
create table if not exists public.people (
  id text primary key, org_id text not null, employee_id text, name text not null, email text, department text, title text, employment_type text, manager text, status text, start_date date, termination_date date, location_id text, notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), created_by text, updated_by text, deleted_at timestamptz
);
create table if not exists public.assets (
  id text primary key, org_id text not null, site_id text, asset_tag text, category text not null, subcategory text, manufacturer text, model text, serial_number text, imei1 text, imei2 text, eid text, hostname text, mac_address text, ip_address text, assigned_to text, department text, location_detail text, ownership_model text not null, supplier text, purchase_date date, purchase_amount numeric, currency text, po_number text, invoice_number text, fixed_asset_number text, warranty_expiry date, contract_id text, finance_months integer, finance_remaining_months integer, monthly_installment numeric, early_termination_liability numeric, status text, condition text, os text, os_version text, encryption boolean, edr text, mdm text, mdm_compliant boolean, last_verified_at timestamptz, verified_by text, notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), created_by text, updated_by text, deleted_at timestamptz
);
create table if not exists public.telecom (
  id text primary key, org_id text not null, site_id text, type text not null, carrier text not null, account_number text, mobile_number text, iccid text, imsi text, eid text, assigned_to text, asset_id text, department text, plan_name text, monthly_charge numeric, currency text, data_allowance_gb numeric, roaming_enabled boolean, idd_enabled boolean, spend_limit numeric, contract_start date, contract_end date, commitment_months integer, device_installment numeric, installment_remaining_months integer, early_termination_liability numeric, last_used_at date, status text, notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), created_by text, updated_by text, deleted_at timestamptz
);
create table if not exists public.software (
  id text primary key, org_id text not null, name text not null, publisher text, category text, deployment text, license_model text, plan_or_version text, business_owner text, technical_owner text, purchased_licenses integer, assigned_licenses integer, active_users integer, annual_cost numeric, currency text, renewal_date date, auto_renew boolean, sso boolean, mfa boolean, data_classification text, business_criticality text, approved boolean, support_status text, contract_id text, notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), created_by text, updated_by text, deleted_at timestamptz
);
create table if not exists public.vendor_contracts (
  id text primary key, org_id text not null, vendor_name text not null, service text not null, contract_number text, internal_owner text, start_date date, end_date date, notice_days integer, auto_renew boolean, monthly_cost numeric, annual_cost numeric, currency text, sla text, data_access boolean, privileged_access boolean, personal_data_processing boolean, security_review boolean, status text, notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), created_by text, updated_by text, deleted_at timestamptz
);
create table if not exists public.audits (
  id text primary key, org_id text not null, name text not null, site_id text, state text, audit_type text, lead_auditor text, client_contact text, start_date date, due_date date, completed_at timestamptz, scope jsonb not null default '{}'::jsonb, notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), created_by text, updated_by text, deleted_at timestamptz
);
create table if not exists public.audit_responses (
  id text primary key, org_id text not null, audit_id text not null, control_id text not null, status text not null, notes text, evidence_count integer, sample_size integer, sample_failed integer, reviewed_by text,
  updated_at timestamptz not null default now(), updated_by text, deleted_at timestamptz,
  unique(audit_id, control_id)
);
create table if not exists public.findings (
  id text primary key, org_id text not null, audit_id text not null, site_id text, control_id text, finding_no text not null, title text not null, condition text not null, risk text not null, impact text, recommendation text, owner text, target_date date, status text not null, management_response text, closure_notes text, estimated_monthly_leakage numeric, verified_at timestamptz, verified_by text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), created_by text, updated_by text, deleted_at timestamptz
);
create table if not exists public.evidence (
  id text primary key, org_id text not null, audit_id text not null, control_id text, finding_id text, asset_id text, name text not null, mime_type text not null, size bigint not null, remote_path text, sha256 text, captured_at timestamptz not null, latitude numeric, longitude numeric, notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), created_by text, updated_by text, deleted_at timestamptz
);

create index if not exists idx_profiles_org on public.profiles(org_id);
create index if not exists idx_sites_org on public.sites(org_id);
create index if not exists idx_people_org on public.people(org_id);
create index if not exists idx_assets_org on public.assets(org_id);
create index if not exists idx_telecom_org on public.telecom(org_id);
create index if not exists idx_software_org on public.software(org_id);
create index if not exists idx_vendor_org on public.vendor_contracts(org_id);
create index if not exists idx_audits_org on public.audits(org_id);
create index if not exists idx_responses_org_audit on public.audit_responses(org_id,audit_id);
create index if not exists idx_findings_org_audit on public.findings(org_id,audit_id);
create index if not exists idx_evidence_org_audit on public.evidence(org_id,audit_id);

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.sites enable row level security;
alter table public.people enable row level security;
alter table public.assets enable row level security;
alter table public.telecom enable row level security;
alter table public.software enable row level security;
alter table public.vendor_contracts enable row level security;
alter table public.audits enable row level security;
alter table public.audit_responses enable row level security;
alter table public.findings enable row level security;
alter table public.evidence enable row level security;

-- Signed-out users get no table access.
revoke all on all tables in schema public from anon;
grant select,insert,update,delete on public.profiles,public.organizations,public.sites,public.people,public.assets,public.telecom,public.software,public.vendor_contracts,public.audits,public.audit_responses,public.findings,public.evidence to authenticated;

-- Profiles: each authenticated user can read their organisation's user list only after MFA.
create policy "profiles_same_org_select" on public.profiles for select to authenticated using (org_id = public.current_org_id());
create policy "profiles_self_update" on public.profiles for update to authenticated using (id=(select auth.uid())) with check (id=(select auth.uid()));
create policy "profiles_mfa" on public.profiles as restrictive for all to authenticated using ((select auth.jwt()->>'aal')='aal2') with check ((select auth.jwt()->>'aal')='aal2');

-- Repeatable tenant policies for application tables.
do $$
declare t text;
begin
  foreach t in array array['organizations','sites','people','assets','telecom','software','vendor_contracts','audits','audit_responses','findings','evidence'] loop
    execute format('create policy %I on public.%I for select to authenticated using (org_id = public.current_org_id())', t||'_tenant_select', t);
    execute format('create policy %I on public.%I for insert to authenticated with check (org_id = public.current_org_id() and public.can_write())', t||'_tenant_insert', t);
    execute format('create policy %I on public.%I for update to authenticated using (org_id = public.current_org_id() and public.can_write()) with check (org_id = public.current_org_id() and public.can_write())', t||'_tenant_update', t);
    execute format('create policy %I on public.%I for delete to authenticated using (org_id = public.current_org_id() and public.can_delete())', t||'_tenant_delete', t);
    execute format('create policy %I on public.%I as restrictive for all to authenticated using ((select auth.jwt()->>''aal'')=''aal2'') with check ((select auth.jwt()->>''aal'')=''aal2'')', t||'_mfa', t);
  end loop;
end $$;

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('audit-evidence','audit-evidence',false,52428800,null)
on conflict (id) do nothing;

create policy "evidence_storage_select" on storage.objects for select to authenticated
using (bucket_id='audit-evidence' and (storage.foldername(name))[1]=public.current_org_id() and (select auth.jwt()->>'aal')='aal2');
create policy "evidence_storage_insert" on storage.objects for insert to authenticated
with check (bucket_id='audit-evidence' and (storage.foldername(name))[1]=public.current_org_id() and public.can_write() and (select auth.jwt()->>'aal')='aal2');
create policy "evidence_storage_update" on storage.objects for update to authenticated
using (bucket_id='audit-evidence' and (storage.foldername(name))[1]=public.current_org_id() and public.can_write() and (select auth.jwt()->>'aal')='aal2');
create policy "evidence_storage_delete" on storage.objects for delete to authenticated
using (bucket_id='audit-evidence' and (storage.foldername(name))[1]=public.current_org_id() and public.can_delete() and (select auth.jwt()->>'aal')='aal2');

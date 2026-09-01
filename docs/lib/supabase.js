import { createClient } from '@supabase/supabase-js';
const cfg = window.ALZA_CONFIG ?? {};
export const cloudEnabled = Boolean(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY);
export const supabase = cloudEnabled
    ? createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    })
    : null;

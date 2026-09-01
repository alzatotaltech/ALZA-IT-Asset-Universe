/**
 * ALZA IT Audit runtime configuration.
 * Leave Supabase values blank for fully offline/local mode.
 * For multi-user cloud mode, fill both values after creating the Supabase project.
 */
window.ALZA_CONFIG = {
  APP_NAME: 'ALZA IT Audit',
  SUPABASE_URL: '',
  SUPABASE_ANON_KEY: '',
  REQUIRE_MFA: true,
  ALLOW_LOCAL_MODE: true
};

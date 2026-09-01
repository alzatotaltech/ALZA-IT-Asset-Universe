# ALZA IT Audit Deployment Notes

## GitHub Pages
Use the repository `/docs` directory as the publishing source. Relative paths are used so the app can run under a GitHub repository subpath.

## Offline/PWA
Open the deployed app once while online and install/add it to the home screen if desired. The service worker caches the application and fetched resources for later offline use. Audit data is written locally first.

## Shared data
GitHub Pages is static hosting. It cannot itself provide a shared database, server-side user management, or cross-device synchronization. Those functions use the optional Supabase configuration and schema included in this package.

## Security
- TOTP MFA QR enrolment is implemented.
- Local passwords are PBKDF2-SHA256 derived with per-user random salt.
- Do not commit service-role/database secrets to a public repository.
- Before commercial deployment, perform independent application security testing and configure production Supabase RLS/auth policies for the intended tenancy model.

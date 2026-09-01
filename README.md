# ALZA IT Audit

Responsive web/PWA IT audit platform for desktop, laptop, tablet, iPhone and Android.

## Branding

The application uses the exact ALZA PNG supplied for this build. The original supplied artwork is preserved at `branding/ALZA-Logo.png`; the same file is used as `public/alza-logo.png`, `docs/alza-logo.png`, and the 512px PWA icon.

## Fastest GitHub Pages deployment

1. Upload this entire repository to GitHub.
2. In the repository open **Settings > Pages**.
3. Select **Deploy from a branch**.
4. Select your main branch and the **/docs** folder.
5. Save. GitHub will publish the PWA from the prebuilt `docs` folder.

The existing `docs/config.js` has cloud values blank, so the app starts in local/offline workspace mode.

## Local test

Because browsers restrict some PWA features when an HTML file is opened directly, serve the `docs` folder over HTTP rather than double-clicking `index.html`.

Python example:

```bash
cd docs
python -m http.server 8080
```

Then browse to `http://localhost:8080`.

## First login / MFA

On a new browser profile, create the organisation and Super Admin. The app displays a QR code to enrol a TOTP authenticator such as Microsoft Authenticator, Google Authenticator, or 1Password. MFA is required before the local workspace opens.

Local mode stores the workspace in that browser/device. This is intended for immediate standalone/offline audit fieldwork.

## Shared multi-user mode

For multiple users sharing the same live data across devices, create a Supabase project, execute `supabase/schema.sql`, then set `SUPABASE_URL` and `SUPABASE_ANON_KEY` in both `public/config.js` and `docs/config.js`.

Do not place a Supabase service-role key or other server secret in this repository.

## Source development

```bash
npm install
npm run dev
```

Production source build:

```bash
npm run build
```

## Included functional areas

The project includes organisation/site registers, people, physical assets and ownership/finance details, SIM/eSIM and telecom, software/SaaS/licensing, vendors/contracts, dynamic IT audit controls, evidence capture, QR/barcode scanning, findings/remediation, reconciliation, dashboards, reports/CSV exports, offline browser storage, MFA flows, cloud sync scaffolding, and Supabase schema.

The master control library contains 118 audit domains generated into 1,416 detailed control tests, with applicability filtering to avoid presenting irrelevant controls during fieldwork.

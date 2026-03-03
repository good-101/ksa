# Cloudflare Free Deploy

This project is prepared to run on:

- Cloudflare Workers
- Cloudflare D1
- Cloudflare static assets from `frontend/`

## 1. Install dependencies

```powershell
npm install
```

## 2. Create the D1 database

```powershell
npx wrangler d1 create ksa_saas
```

Copy the returned `database_id` into [wrangler.toml](/c:/Users/eyad1/OneDrive/Website/wrangler.toml).

## 3. Apply the schema

```powershell
npx wrangler d1 migrations apply DB
```

For local testing:

```powershell
npx wrangler d1 migrations apply DB --local
```

## 4. Run locally with Cloudflare

```powershell
npx wrangler dev
```

## 5. Deploy for free

```powershell
npx wrangler deploy
```

Cloudflare will give you a URL like:

```txt
https://ksa-saas.<your-subdomain>.workers.dev
```

## Default owner login

- Email: `owner@example.com`
- Password: `change-me-now`

Change it after the first login.

## Notes

- The Worker serves the existing frontend files from `frontend/`.
- The old local Node files are still in the repo, but the Cloudflare deployment uses [src/worker.mjs](/c:/Users/eyad1/OneDrive/Website/src/worker.mjs) instead.
- The first deploy auto-creates:
  - one owner account
  - one default site
  - the existing admin slug: `/admin/studio-a9k3m7x2`

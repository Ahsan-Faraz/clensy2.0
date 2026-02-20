# Production Deployment Guide (VPS)

## Strapi + Clensy on clensy.com

When Clensy runs at `clensy.com` and Strapi at `clensy.com/admin`, configure env vars as below.

### Root cause of "non-JSON (text/html)" and empty locations/services

1. **Wrong `NEXT_PUBLIC_STRAPI_URL`** – Must point to Strapi’s base URL.
2. **Missing `STRAPI_API_TOKEN`** – Content API needs a valid token.
3. **Build-time env** – `NEXT_PUBLIC_*` is baked in at build; production builds must use production env.

---

## Production .env (Clensy on VPS)

Set these **before** building/deploying Clensy:

```bash
# Strapi base URL – must match your reverse proxy
# If Strapi is at clensy.com/admin:
NEXT_PUBLIC_STRAPI_URL=https://clensy.com/admin

# Server-side override (avoids client exposure, no rebuild needed)
# Use this if Strapi is at clensy.com/admin
STRAPI_URL=https://clensy.com/admin

# API path (must match strapi1 config/api.ts rest.prefix)
STRAPI_API_PREFIX=admin/api

# Required – create in Strapi Admin → Settings → API Tokens (Full access or Content Manager find)
STRAPI_API_TOKEN=your-production-api-token-here
```

### URL construction

- Base: `https://clensy.com/admin`
- Prefix: `admin/api`
- Endpoint: `redirects` → `https://clensy.com/admin/admin/api/redirects`

This matches a proxy where Strapi is mounted at `/admin`.

---

## Alternative: Strapi API at root level

If your proxy exposes the Strapi API at `clensy.com/api` (not `/admin/api`):

1. Set Strapi `config/api.ts` `rest.prefix: '/api'`
2. Use: `NEXT_PUBLIC_STRAPI_URL=https://clensy.com`, `STRAPI_API_PREFIX=api`

---

## Debugging

Set `DEBUG_STRAPI_URL=1` on the Clensy process to log `STRAPI_URL`, `STRAPI_API_PREFIX`, and whether `STRAPI_API_TOKEN` is set when non-JSON is returned.

---

## Strapi production .env (strapi1)

```bash
STRAPI_PUBLIC_URL=https://clensy.com
# Or, if Strapi is mounted at /admin:
# STRAPI_PUBLIC_URL=https://clensy.com/admin
```

---

## Seed data on VPS

Run the seed script against production Strapi:

```bash
STRAPI_URL=https://clensy.com/admin STRAPI_API_PREFIX=admin/api STRAPI_API_TOKEN=your-token node scripts/seed-from-clensy3/import.mjs
```

---

## Reverse proxy routing

If Clensy gets HTML instead of JSON while Strapi logs show 200, the request may be hitting Next.js instead of Strapi.

Ensure your proxy routes:

- `clensy.com/admin` (and `/admin/*`) → Strapi
- `clensy.com` (all other paths) → Next.js (Clensy)

Example (Nginx):

```nginx
# Strapi at /admin
location /admin {
    proxy_pass http://127.0.0.1:1337;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}

# Clensy (Next.js)
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
}
```

---

## Checklist

- [ ] `STRAPI_API_TOKEN` created in Strapi Admin
- [ ] Clensy production env has `NEXT_PUBLIC_STRAPI_URL` and `STRAPI_URL` correct
- [ ] `STRAPI_API_PREFIX` matches Strapi `config/api.ts` (usually `admin/api`)
- [ ] Production build uses these env values (or rebuild after setting them)
- [ ] Proxy correctly routes `/admin` and subpaths to Strapi (not Next.js)
- [ ] Seed script run against production Strapi so locations/services exist in DB

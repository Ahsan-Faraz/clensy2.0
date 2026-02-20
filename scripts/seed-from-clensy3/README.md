# Clensy-3 Data Migration to Strapi

This script imports all 13 services and 6 locations from Clensy-3-data into Strapi.

## Prerequisites

1. **Strapi schema** – Already updated: `customData` on Service, `imageUrl` on cleaning-area.

2. **API Token** – Required for create/update. In Strapi Admin:
   - Go to **Settings → API Tokens**
   - Create token with **Full access** (or at least create/update for Location + Service)
   - Copy the token

3. **Strapi running** – `cd strapi1 && npm run develop`

## Usage

```bash
cd c:\Users\Lenovo\Desktop\clensy2.0

# With API token (required for create/update):
$env:STRAPI_URL = "http://localhost:1337"
$env:STRAPI_API_PREFIX = "admin/api"
$env:STRAPI_API_TOKEN = "your-token-from-strapi-admin"
npm run seed:strapi

# Or: node scripts/seed-from-clensy3/import.mjs
```

## Data Source

Data is sourced from Clensy-3-data project:
- `Clensy-3-data/models/` - Mongoose models with defaults
- `Clensy-3-data/app/api/cms/` - API routes with default data

## Mapping

- **Locations**: 6 locations (bergen, hudson, essex, passaic, union, morris) – all included
- **Services**: 4 services included (routine-cleaning, airbnb-cleaning, deep-cleaning, moving-cleaning). To add more, create JSON files in `data/services/` following the same structure.

## Strapi API

If your Strapi uses a different API prefix (e.g. clensy2.0 fetches from `/admin/api`), set:

```bash
STRAPI_API_PREFIX=admin/api
```

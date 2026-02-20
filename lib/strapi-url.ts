/**
 * Strapi API URL helpers.
 * Matches strapi1 config/api.ts: rest.prefix = '/admin/api'
 */
const STRAPI_URL = (process.env.NEXT_PUBLIC_STRAPI_URL || 'http://72.60.27.190').replace(/\/+$/, '');
const STRAPI_API_PREFIX = (process.env.STRAPI_API_PREFIX || '/admin/api').replace(/^\/+|\/+$/g, '') || 'api';

/** Base URL for Strapi Content API (e.g. http://localhost:1337/admin/api) */
export function getStrapiApiBase(): string {
  return `${STRAPI_URL}/${STRAPI_API_PREFIX}`;
}

/** Full URL for a Strapi API path (e.g. /locations, /services) */
export function getStrapiApiUrl(path: string, query?: string): string {
  const p = path.startsWith('/') ? path.slice(1) : path;
  const base = getStrapiApiBase();
  return query ? `${base}/${p}?${query}` : `${base}/${p}`;
}

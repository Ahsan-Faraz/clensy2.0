import { fetchSingleType } from '@/lib/strapi-single-type';

// The extras page fetches from /api/cms/extras-service
// but the Strapi single-type is named "extras-cleaning"
export async function GET() {
  return fetchSingleType('extras-cleaning');
}

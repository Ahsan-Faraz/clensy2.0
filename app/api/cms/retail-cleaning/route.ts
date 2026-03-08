import { fetchSingleType } from '@/lib/strapi-single-type';

export async function GET() {
  return fetchSingleType('retail-cleaning');
}

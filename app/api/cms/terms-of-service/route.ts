import { NextResponse } from 'next/server';
import { CMSAdapter } from '@/lib/cms-adapter';
import { defaultTermsData } from '@/lib/terms-privacy-defaults';

export const revalidate = 60;

export async function GET() {
  try {
    const data = await CMSAdapter.getTermsOfService();
    
    if (!data) {
      return NextResponse.json({ success: true, data: defaultTermsData });
    }
    
    return NextResponse.json({ success: true, data }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch (error) {
    console.error('Error fetching terms of service:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch terms of service' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { CMSAdapter } from '@/lib/cms-adapter';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function GET() {
  try {
    const data = await CMSAdapter.getPrivacyPolicy();
    
    if (!data) {
      // Return default data if Strapi doesn't have content yet
      return NextResponse.json({
        success: true,
        data: {
          heroSection: {
            heading: "Privacy Policy",
            description: "Your privacy is important to us. This policy explains how we collect, use, and protect your information."
          },
          companyInfo: {
            websiteUrl: "clensy.com",
            email: "info@clensy.com",
            phone: "(551) 305-4081"
          },
          sections: [],
          smsConsent: {
            description: "By providing your phone number, you consent to receive service-related messages.",
            optOutInstructions: "Reply STOP to unsubscribe at any time."
          }
        }
      });
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching privacy policy:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch privacy policy' },
      { status: 500 }
    );
  }
}

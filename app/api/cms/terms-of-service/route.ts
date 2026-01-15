import { NextResponse } from 'next/server';
import { CMSAdapter } from '@/lib/cms-adapter';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function GET() {
  try {
    const data = await CMSAdapter.getTermsOfService();
    
    if (!data) {
      // Return default data if Strapi doesn't have content yet
      return NextResponse.json({
        success: true,
        data: {
          heroSection: {
            heading: "Terms & Conditions",
            description: "Please read these terms and conditions carefully before using our services"
          },
          companyInfo: {
            websiteUrl: "clensy.com",
            email: "info@clensy.com",
            phone: "(551) 305-4081"
          },
          sections: [
            { title: "1. Service Agreement", content: "By booking a cleaning service with Clensy, you agree to these terms and conditions.", order: 1 },
            { title: "2. Booking and Cancellation", content: "Cancellations must be made at least 24 hours before the scheduled service.", order: 2 },
            { title: "3. Payment Terms", content: "Payment is due upon completion of service unless otherwise arranged.", order: 3 },
            { title: "4. Service Guarantee", content: "We stand behind our work with a 100% satisfaction guarantee.", order: 4 },
          ],
          agreementSection: {
            description: "By booking any service with Clensy LLC, you agree to comply with these Terms & Conditions.",
            lastUpdated: "December 2024"
          }
        }
      });
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching terms of service:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch terms of service' },
      { status: 500 }
    );
  }
}

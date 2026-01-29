import { NextRequest, NextResponse } from "next/server";
import CMSAdapter from "@/lib/cms-adapter";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const populate = searchParams.get('populate') || '*';

    // Fetch landing page directly from Strapi with template relation
    // Try different populate syntaxes for Strapi v5
    // Also populate media fields like heroBackgroundImage
    const populateVariations = [
      `populate[Landing_Page][populate]=*&populate[heroBackgroundImage][populate]=*&populate[ogImage][populate]=*`,
      `populate[Landing_Page][populate]=*&populate=*`,
      `populate[Landing_Page]=*&populate=*`,
      `populate=*`,
      `populate[Landing_Page][fields][0]=*`,
    ];
    
    let data: any = null;
    let response: Response | null = null;
    
    for (const populate of populateVariations) {
      const url = `${STRAPI_URL}/api/landing-page?${populate}`;
      console.log(`Trying populate: ${populate}`);
      
      response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
        },
        cache: 'no-store',
      });
      
      if (response.ok) {
        data = await response.json();
        console.log(`Response structure:`, Object.keys(data.data || {}));
        
        // Check if Landing_Page is populated
        if (data.data?.Landing_Page) {
          console.log(`✅ Landing_Page found with populate: ${populate}`);
          break;
        } else {
          console.log(`❌ Landing_Page not found with populate: ${populate}`);
        }
      } else {
        console.log(`❌ Failed with populate ${populate}: ${response.status}`);
      }
    }

    if (!response || !response.ok) {
      const errorText = response ? await response.text() : 'No successful response';
      console.error('Strapi API error:', response?.status || 'No response', errorText);
      return NextResponse.json(
        { 
          success: false, 
          error: `Failed to fetch landing page: ${response?.status || 500}`,
          details: errorText 
        },
        { status: response?.status || 500 }
      );
    }
    
    // Debug: log the response to help troubleshoot
    console.log('Landing page API response - Landing_Page field:', data?.data?.Landing_Page ? '✅ Found' : '❌ Not found');
    if (!data?.data?.Landing_Page) {
      console.log('Available fields in data.data:', Object.keys(data?.data || {}).slice(0, 20).join(', '));
      console.log('Full data structure:', JSON.stringify(data, null, 2).substring(0, 500));
      
      // Check if the field exists but is null
      if ('Landing_Page' in (data?.data || {})) {
        console.log('⚠️ Landing_Page field exists but is NULL - template not assigned in Strapi');
      } else {
        console.log('⚠️ Landing_Page field does not exist in response - check populate query');
      }
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error fetching landing page:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch landing page",
        message: error.message 
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL = (process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337').replace(/\/+$/, '');
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';

export async function GET(request: NextRequest) {
  try {
    // Try different endpoint formats for Strapi v5 Page Builder plugin
    // The content type is plugin::page-builder.template
    // Strapi v5 might use content-manager API or content API
    const endpoints = [
      // Content API (standard Strapi v5 format)
      `${STRAPI_URL}/api/plugin::page-builder.template`,
      `${STRAPI_URL}/api/plugin::page-builder.template?populate=*`,
      // Content Manager API (admin API)
      `${STRAPI_URL}/api/content-manager/collection-types/plugin::page-builder.template`,
      `${STRAPI_URL}/api/content-manager/collection-types/plugin::page-builder.template?page=1&pageSize=100`,
      // Plugin custom routes (if plugin exposes them)
      `${STRAPI_URL}/api/page-builder/templates`,
      `${STRAPI_URL}/api/page-builder/templates?populate=*`,
    ];
    
    let lastError: any = null;
    let lastResponse: Response | null = null;
    
    for (const url of endpoints) {
      console.log(`Trying endpoint: ${url}`);
      try {
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
          },
          cache: 'no-store',
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Success with endpoint: ${url}`);
          console.log(`Response structure:`, Object.keys(data));
          return NextResponse.json({ success: true, data });
        } else {
          const errorText = await response.text();
          console.log(`❌ Failed with endpoint ${url}: ${response.status}`);
          console.log(`Error details:`, errorText.substring(0, 300));
          lastError = errorText;
          lastResponse = response;
        }
      } catch (err: any) {
        console.log(`Error with endpoint ${url}:`, err.message);
        lastError = err.message;
      }
    }

    // If all endpoints failed, return error with helpful message
    const errorText = lastError || 'All endpoint attempts failed';
    console.error('❌ All Strapi API endpoints failed.');
    console.error('Last status:', lastResponse?.status);
    console.error('Last error:', errorText.substring(0, 500));
    console.error('Attempted endpoints:', endpoints);
    
    // Provide helpful error message
    let helpfulMessage = `Failed to fetch templates. All ${endpoints.length} endpoint attempts failed.`;
    if (lastResponse?.status === 404) {
      helpfulMessage += `\n\nThe Page Builder plugin content type might not be exposed via REST API, or the endpoint path is incorrect.`;
      helpfulMessage += `\n\nPlease check:`;
      helpfulMessage += `\n1. Strapi Admin → Settings → API Tokens → Ensure your token has permissions for 'Template' content type`;
      helpfulMessage += `\n2. Verify the plugin is properly installed: npm list @wecre8websites/strapi-page-builder`;
      helpfulMessage += `\n3. Check Strapi server logs for more details about the 404 error`;
      helpfulMessage += `\n4. Try accessing Strapi Admin → Content Manager → Template to verify templates exist`;
    } else if (lastResponse?.status === 403 || lastResponse?.status === 401) {
      helpfulMessage += `\n\nAuthentication failed. Please check your STRAPI_API_TOKEN environment variable.`;
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: helpfulMessage,
        details: errorText,
        attemptedEndpoints: endpoints,
        lastStatus: lastResponse?.status
      },
      { status: lastResponse?.status || 500 }
    );
  } catch (error: any) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch templates",
        message: error.message 
      },
      { status: 500 }
    );
  }
}

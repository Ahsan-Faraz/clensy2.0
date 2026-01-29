import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const templateId = id;
    
    if (!templateId) {
      return NextResponse.json(
        { success: false, error: 'Template ID is required' },
        { status: 400 }
      );
    }

    // Fetch all templates and filter (more reliable than individual endpoint)
    // Try Strapi v5 standard API format: /api/plugin::page-builder.template
    console.log(`Fetching template with ID: ${templateId}`);
    
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
    
    let allData: any = null;
    let allResponse: Response | null = null;
    
    for (const url of endpoints) {
      console.log(`Trying templates endpoint: ${url}`);
      try {
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
          },
          cache: 'no-store',
        });
        
        if (response.ok) {
          allData = await response.json();
          console.log(`Success fetching templates from: ${url}`);
          allResponse = response;
          break;
        } else {
          const errorText = await response.text();
          console.log(`Failed with ${url}: ${response.status} - ${errorText.substring(0, 200)}`);
        }
      } catch (err: any) {
        console.log(`Error with ${url}:`, err.message);
      }
    }
    
    if (!allResponse || !allData) {
      const errorText = 'All template endpoint attempts failed';
      console.error('Failed to fetch templates list from all endpoints');
      return NextResponse.json(
        { 
          success: false, 
          error: `Failed to fetch templates: 500`,
          details: errorText,
          attemptedEndpoints: endpoints
        },
        { status: 500 }
      );
    }
    
    // allData is already populated in the loop above
    const templates = allData.data || [];
    console.log(`Found ${templates.length} templates`);
    
    // Try to find template by id or documentId (Strapi v5 uses documentId)
    const foundTemplate = templates.find((t: any) => 
      String(t.id) === String(templateId) || 
      String(t.documentId) === String(templateId) ||
      String(t.id) === templateId ||
      String(t.documentId) === templateId
    );
    
    if (foundTemplate) {
      console.log(`Found template:`, {
        id: foundTemplate.id || foundTemplate.documentId,
        name: foundTemplate.name || 'Unnamed',
        hasJson: !!foundTemplate.json,
        jsonKeys: foundTemplate.json ? Object.keys(foundTemplate.json) : [],
        jsonBlocks: foundTemplate.json?.blocks ? foundTemplate.json.blocks.length : 0,
      });
      return NextResponse.json({ success: true, data: foundTemplate });
    } else {
      const availableIds = templates.map((t: any) => ({
        id: t.id,
        documentId: t.documentId,
        name: t.name || 'Unnamed'
      }));
      console.log(`Template ${templateId} not found. Available templates:`, availableIds);
      
      return NextResponse.json(
        { 
          success: false, 
          error: `Template with ID ${templateId} not found.`,
          availableTemplates: availableIds,
          message: `Please use one of the available template IDs: ${availableIds.map((t: any) => t.id || t.documentId).filter(Boolean).join(', ')}`
        },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error("Error fetching template:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch template",
        message: error.message 
      },
      { status: 500 }
    );
  }
}

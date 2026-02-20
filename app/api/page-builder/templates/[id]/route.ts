import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL = (process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337').replace(/\/+$/, '');
const STRAPI_API_PREFIX = (process.env.STRAPI_API_PREFIX || '/admin/api').replace(/^\/+|\/+$/g, '') || 'api';
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

    const prefix = STRAPI_API_PREFIX;
    const endpoints = [
      `${STRAPI_URL}/${prefix}/plugin::page-builder.template`,
      `${STRAPI_URL}/${prefix}/plugin::page-builder.template?populate=*`,
      `${STRAPI_URL}/${prefix}/content-manager/collection-types/plugin::page-builder.template`,
      `${STRAPI_URL}/${prefix}/content-manager/collection-types/plugin::page-builder.template?page=1&pageSize=100`,
      `${STRAPI_URL}/${prefix}/page-builder/templates`,
      `${STRAPI_URL}/${prefix}/page-builder/templates?populate=*`,
    ];
    
    let allData: any = null;
    let allResponse: Response | null = null;
    
    for (const url of endpoints) {
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
          allResponse = response;
          break;
        }
      } catch (err: any) {
        // Endpoint failed, try next
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
    
    // Try to find template by id or documentId (Strapi v5 uses documentId)
    const foundTemplate = templates.find((t: any) => 
      String(t.id) === String(templateId) || 
      String(t.documentId) === String(templateId) ||
      String(t.id) === templateId ||
      String(t.documentId) === templateId
    );
    
    if (foundTemplate) {
      return NextResponse.json({ success: true, data: foundTemplate });
    } else {
      const availableIds = templates.map((t: any) => ({
        id: t.id,
        documentId: t.documentId,
        name: t.name || 'Unnamed'
      }));
      
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

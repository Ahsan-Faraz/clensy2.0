import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { clearLandingPageCache, clearAboutPageCache, clearContactPageCache, clearChecklistPageCache, clearFAQPageCache } from '@/lib/cms-adapter';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';

// Content type configuration
const contentTypeConfig: Record<string, { 
  endpoint: string; 
  templateRelation: string;
  fieldMapping: Record<string, string>;
}> = {
  'landing-page': {
    endpoint: '/api/landing-page',
    templateRelation: 'Landing_Page',
    fieldMapping: {
      'ctaLeftTitle': 'ctaLeftCardTitle',
      'ctaLeftDescription': 'ctaLeftCardDescription',
      'ctaLeftButtonText': 'ctaLeftCardButtonText',
      'ctaRightTitle': 'ctaRightCardTitle',
      'ctaRightDescription': 'ctaRightCardDescription',
      'ctaRightButtonText': 'ctaRightCardButtonText',
    },
  },
  'about': {
    endpoint: '/api/about',
    templateRelation: 'About_Page',
    fieldMapping: {},
  },
  'contact': {
    endpoint: '/api/contact',
    templateRelation: 'Contact_Page',
    fieldMapping: {},
  },
  'checklist-page': {
    endpoint: '/api/checklist-page',
    templateRelation: 'Checklist_Page',
    fieldMapping: {},
  },
  'faq-page': {
    endpoint: '/api/faq-page',
    templateRelation: 'FAQ_Page',
    fieldMapping: {},
  },
};

/**
 * Syncs Page Builder template data to content type fields.
 * Supports landing-page, about, and contact content types.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const contentType = body.contentType || 'landing-page';
    const providedTemplateId = body.templateId; // Template ID from editor
    
    const config = contentTypeConfig[contentType];
    if (!config) {
      return NextResponse.json(
        { error: `Unknown content type: ${contentType}. Supported: ${Object.keys(contentTypeConfig).join(', ')}` },
        { status: 400 }
      );
    }

    if (!STRAPI_API_TOKEN) {
      return NextResponse.json(
        { 
          error: 'STRAPI_API_TOKEN is not configured.',
          instructions: [
            '1. Go to Strapi Admin → Settings → API Tokens',
            '2. Create a new token with Full Access',
            '3. Add to .env: STRAPI_API_TOKEN=your_token_here',
            '4. Restart your Next.js dev server'
          ]
        },
        { status: 500 }
      );
    }

    console.log(`[Sync] Starting sync for ${contentType}, template: ${providedTemplateId || 'auto-detect'}`);

    // Fetch current content to preserve existing fields
    const contentUrl = `${STRAPI_URL}${config.endpoint}?populate=*`;
    const contentResponse = await fetch(contentUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
      },
      cache: 'no-store',
    });

    if (!contentResponse.ok) {
      return NextResponse.json(
        { error: `Failed to fetch ${contentType}: ${contentResponse.status}` },
        { status: 500 }
      );
    }

    const contentResult = await contentResponse.json();
    const currentContent = contentResult.data || {};

    // Use provided templateId if available, otherwise try to find from content type relation
    let templateId = providedTemplateId;
    
    if (!templateId) {
      // Try to get template from content type relation
      const template = currentContent[config.templateRelation];
      if (template) {
        templateId = template.documentId || template.id;
      }
    }

    if (!templateId) {
      return NextResponse.json({
        success: false,
        error: `No template found for ${contentType}. Please attach a template in Strapi Admin or ensure you're editing a valid template.`,
      }, { status: 400 });
    }

    return await syncFromTemplate(templateId, currentContent, contentType, config);

  } catch (error: any) {
    console.error('[Sync] Error:', error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to sync content' },
      { status: 500 }
    );
  }
}

async function syncFromTemplate(
  templateId: string, 
  currentContent: any, 
  contentType: string,
  config: typeof contentTypeConfig[string]
) {
  console.log(`[Sync] Fetching template: ${templateId}`);
  
  // Fetch all templates and find the one we need
  const templatesUrl = `${STRAPI_URL}/api/page-builder/templates`;
  const templatesResponse = await fetch(templatesUrl, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
    },
    cache: 'no-store',
  });

  if (!templatesResponse.ok) {
    const errorText = await templatesResponse.text();
    console.error(`[Sync] Failed to fetch templates: ${templatesResponse.status}`, errorText);
    return NextResponse.json(
      { error: `Failed to fetch templates: ${templatesResponse.status}` },
      { status: 500 }
    );
  }

  const templatesData = await templatesResponse.json();
  const templates = templatesData.data || [];
  
  // Find template by id or documentId
  const template = templates.find((t: any) => 
    String(t.id) === String(templateId) || 
    String(t.documentId) === String(templateId)
  );

  if (!template) {
    const availableIds = templates.map((t: any) => `${t.id}/${t.documentId}: ${t.name}`).join(', ');
    console.error(`[Sync] Template ${templateId} not found. Available: ${availableIds}`);
    return NextResponse.json(
      { error: `Template ${templateId} not found. Available templates: ${availableIds}` },
      { status: 404 }
    );
  }
  
  console.log(`[Sync] Found template: ${template.name} (id=${template.id}, documentId=${template.documentId})`);
  
  const templateJson = template.json || {};
  
  // Page Builder uses "content" array
  const contentArray = templateJson.content || templateJson.blocks || [];
  
  console.log(`[Sync] Template "${template.name || templateId}" has ${contentArray.length} components`);
  
  // Extract component props
  const contentUpdates: any = {};

  if (Array.isArray(contentArray) && contentArray.length > 0) {
    contentArray.forEach((component: any) => {
      if (component.props) {
        Object.keys(component.props).forEach((propKey) => {
          const propValue = component.props[propKey];
          
          // Skip internal fields and Handlebars placeholders
          if (propKey === 'id' || propKey === '_puckId' || propKey.startsWith('_')) return;
          if (typeof propValue === 'string' && propValue.startsWith('{{')) return;
          if (propValue === undefined || propValue === null) return;
          
          // Map field name if needed
          const mappedKey = config.fieldMapping[propKey] || propKey;
          contentUpdates[mappedKey] = propValue;
        });
      }
    });
  }

  console.log(`[Sync] Found ${Object.keys(contentUpdates).length} fields to update for ${contentType}`);

  if (Object.keys(contentUpdates).length === 0) {
    return NextResponse.json({
      success: true,
      message: 'No content changes to sync.',
      contentType,
      fieldsUpdated: 0,
      tip: 'Make sure you have added components to the canvas, edited their values, and clicked Save in the Page Builder.',
    });
  }

  // Preserve existing fields that we're not updating
  const preservedData: any = {};
  if (currentContent) {
    Object.keys(currentContent).forEach(key => {
      if (!['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt', 'locale', 
            config.templateRelation, 'template', 'Template'].includes(key)) {
        preservedData[key] = currentContent[key];
      }
    });
  }

  const updatedData = { ...preservedData, ...contentUpdates };

  // Save to content type
  const updateResponse = await fetch(`${STRAPI_URL}${config.endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
    },
    body: JSON.stringify({ data: updatedData }),
  });

  if (!updateResponse.ok) {
    const errorText = await updateResponse.text();
    return NextResponse.json(
      { error: `Failed to update ${contentType}: ${updateResponse.status} - ${errorText}` },
      { status: 500 }
    );
  }

  // Clear the appropriate cache based on content type and revalidate the path
  try {
    if (contentType === 'about') {
      clearAboutPageCache();
      revalidatePath('/company/about');
    } else if (contentType === 'contact') {
      clearContactPageCache();
      revalidatePath('/contact');
    } else if (contentType === 'checklist-page') {
      clearChecklistPageCache();
      revalidatePath('/company/checklist');
    } else if (contentType === 'faq-page') {
      clearFAQPageCache();
      revalidatePath('/faq');
    } else {
      clearLandingPageCache();
      revalidatePath('/');
    }
  } catch (e) {
    // Ignore cache clear errors
  }

  console.log(`[Sync] Success: Updated ${Object.keys(contentUpdates).length} fields for ${contentType}`);

  return NextResponse.json({
    success: true,
    message: `Content synced to ${contentType}! Refresh your site to see changes.`,
    contentType,
    fieldsUpdated: Object.keys(contentUpdates).length,
    updatedFields: Object.keys(contentUpdates),
    cacheCleared: true,
  });
}

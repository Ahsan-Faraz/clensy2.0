import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { clearLandingPageCache, clearAboutPageCache, clearContactPageCache, clearChecklistPageCache, clearFAQPageCache } from '@/lib/cms-adapter';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';

// Content type configuration
// isSingleType: true = single type, false = collection type (needs contentId)
// fieldMapping: map Page Builder field names to Strapi field names. Use null to skip a field.
const contentTypeConfig: Record<string, { 
  endpoint: string; 
  templateRelation: string;
  fieldMapping: Record<string, string | null>;
  isSingleType: boolean;
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
    isSingleType: true,
  },
  'about': {
    endpoint: '/api/about',
    templateRelation: 'About_Page',
    fieldMapping: {},
    isSingleType: true,
  },
  'contact': {
    endpoint: '/api/contact',
    templateRelation: 'Contact_Page',
    fieldMapping: {},
    isSingleType: true,
  },
  'checklist-page': {
    endpoint: '/api/checklist-page',
    templateRelation: 'Checklist_Page',
    fieldMapping: {},
    isSingleType: true,
  },
  'faq-page': {
    endpoint: '/api/faq-page',
    templateRelation: 'FAQ_Page',
    fieldMapping: {},
    isSingleType: true,
  },
  // Collection types - require contentId
  'service': {
    endpoint: '/api/services', // plural for collection types
    templateRelation: 'Service_Page',
    // Map Page Builder field names to Strapi schema field names
    // null = skip this field (doesn't exist in Strapi)
    fieldMapping: {
      // Service Features - image URL is separate from media field
      'featureSectionImageUrl': null, // Strapi uses media field, not URL string
      'featurePoint1': null, // Strapi uses JSON field 'featureSectionPoints'
      'featurePoint2': null,
      'featurePoint3': null,
      // Trust indicators/stats don't exist in Strapi schema
      'stat1Value': null,
      'stat1Label': null,
      'stat2Value': null,
      'stat2Label': null,
      'stat3Value': null,
      'stat3Label': null,
      'stat4Value': null,
      'stat4Label': null,
      // How it works images - Strapi uses media fields
      'step1ImageUrl': null,
      'step2ImageUrl': null,
      'step3ImageUrl': null,
      // Benefits image - Strapi uses media field
      'benefitsImageUrl': null,
      // CTA fields don't exist in Strapi schema
      'ctaHeading': null,
      'ctaDescription': null,
      'ctaButtonText': null,
      'ctaButtonLink': null,
    },
    isSingleType: false,
  },
  'location': {
    endpoint: '/api/locations', // plural for collection types
    templateRelation: 'Location_Page',
    // Map Page Builder field names to Strapi schema field names
    // Strapi location schema has FLAT fields (not nested): heroTitle, heroSubtitle, contactPhone, contactEmail, aboutTitle, aboutDescription
    fieldMapping: {
      // LocationHero fields -> Strapi flat fields
      'heroTitle': 'heroTitle',
      'heroSubtitle': 'heroSubtitle',
      'heroBackgroundImageUrl': 'heroBackgroundImageUrl',
      'ctaButton1Text': 'ctaButton1Text',
      'ctaButton2Text': 'ctaButton2Text',
      // LocationMainContent fields -> Strapi flat fields
      'phoneNumber': 'contactPhone',
      'emailAddress': 'contactEmail',
      'aboutTitle': 'aboutTitle',
      'aboutDescription': 'aboutDescription',
      'locationName': 'name',
      // Fields that don't exist in Strapi schema - skip them
      'contactTitle': null,
      'phoneLabel': null,
      'emailLabel': null,
      'contactCtaText': null,
      'hoursTitle': null,
      'hours': null, // operatingHours is a component, not a JSON string
      'mapTitle': null,
      'mapCtaText': null,
      'aboutCtaText': null,
      // LocationServices fields don't exist
      'servicesHeading': null,
      'servicesDescription': null,
      // LocationCTA fields don't exist
      'ctaHeading': null,
      'ctaDescription': null,
      'ctaButtonText': null,
      'ctaButtonLink': null,
    },
    isSingleType: false,
  },
};

/**
 * Syncs Page Builder template data to content type fields.
 * Supports single types (landing-page, about, contact) and collection types (service, location).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const contentType = body.contentType || 'landing-page';
    const providedTemplateId = body.templateId; // Template ID from editor
    const contentId = body.contentId; // For collection types
    
    const config = contentTypeConfig[contentType];
    if (!config) {
      return NextResponse.json(
        { error: `Unknown content type: ${contentType}. Supported: ${Object.keys(contentTypeConfig).join(', ')}` },
        { status: 400 }
      );
    }

    // Collection types require a contentId
    if (!config.isSingleType && !contentId) {
      return NextResponse.json(
        { error: `Content ID required for collection type "${contentType}". Make sure to select a specific entry.` },
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

    console.log(`[Sync] Starting sync for ${contentType}, template: ${providedTemplateId || 'auto-detect'}, contentId: ${contentId || 'N/A'}`);

    // Fetch current content to preserve existing fields
    // For collection types, we need to fetch a specific entry
    const contentUrl = config.isSingleType 
      ? `${STRAPI_URL}${config.endpoint}?populate=*`
      : `${STRAPI_URL}${config.endpoint}/${contentId}?populate=*`;
      
    const contentResponse = await fetch(contentUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
      },
      cache: 'no-store',
    });

    if (!contentResponse.ok) {
      return NextResponse.json(
        { error: `Failed to fetch ${contentType}${contentId ? ` (${contentId})` : ''}: ${contentResponse.status}` },
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

    return await syncFromTemplate(templateId, currentContent, contentType, config, contentId);

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
  config: typeof contentTypeConfig[string],
  contentId?: string // For collection types
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
          
          // Check if this field should be skipped (mapped to null)
          if (propKey in config.fieldMapping && config.fieldMapping[propKey] === null) {
            return; // Skip this field - it doesn't exist in Strapi schema
          }
          
          // Map field name if needed
          const mappedKey = config.fieldMapping[propKey] || propKey;
          contentUpdates[mappedKey] = propValue;
        });
      }
    });
  }
  
  console.log(`[Sync] Fields to update:`, Object.keys(contentUpdates));

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

  // Get valid field names from current content (what Strapi actually has)
  // Exclude internal Strapi fields that should never be updated
  // For locations: slug is auto-generated from name, so don't update it
  const excludedFields = new Set(['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt', 'locale', 
    config.templateRelation, 'template', 'Template', 'slug']); // slug is auto-generated
    
  const validFieldNames = new Set(Object.keys(currentContent || {}).filter(key => !excludedFields.has(key)));
  
  // Helper function to set nested object value using dot notation
  const setNestedValue = (obj: any, path: string, value: any) => {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || current[key] === null) {
        current[key] = {};
      }
      current = current[key];
    }
    current[keys[keys.length - 1]] = value;
  };
  
  // Filter contentUpdates to only include fields that exist in Strapi schema
  // Handle both flat fields and nested fields (dot notation)
  const validUpdates: any = {};
  const skippedFields: string[] = [];
  
  Object.keys(contentUpdates).forEach(key => {
    // Check if it's a nested field (contains dot)
    if (key.includes('.')) {
      const topLevelKey = key.split('.')[0];
      // Check if the top-level field exists in Strapi
      if (validFieldNames.has(topLevelKey)) {
        setNestedValue(validUpdates, key, contentUpdates[key]);
      } else {
        skippedFields.push(key);
      }
    } else if (validFieldNames.has(key)) {
      validUpdates[key] = contentUpdates[key];
    } else {
      skippedFields.push(key);
    }
  });
  
  if (skippedFields.length > 0) {
    console.log(`[Sync] Skipped fields not in Strapi schema: ${skippedFields.join(', ')}`);
  }
  
  // Preserve existing fields that we're not updating
  // IMPORTANT: Exclude id and documentId - Strapi rejects them in PUT body
  const preservedData: any = {};
  if (currentContent) {
    validFieldNames.forEach(key => {
      // Deep clone to avoid reference issues with nested objects
      preservedData[key] = JSON.parse(JSON.stringify(currentContent[key]));
    });
  }

  // Deep merge validUpdates into preservedData
  // This handles nested fields properly (e.g., heroSection.title)
  const deepMerge = (target: any, source: any): any => {
    const result = { ...target };
    for (const key of Object.keys(source)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  };

  const updatedData = deepMerge(preservedData, validUpdates);
  
  // Remove fields that shouldn't be sent to Strapi (auto-generated or read-only)
  // slug is auto-generated from name in Strapi, so don't send it
  delete updatedData.slug;
  
  // Helper function to remove 'id' fields from component arrays and objects
  // Strapi rejects 'id' fields in component relations when updating
  const removeIdsFromComponents = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(item => {
        if (typeof item === 'object' && item !== null) {
          const { id, ...rest } = item;
          return removeIdsFromComponents(rest);
        }
        return item;
      });
    } else if (typeof obj === 'object' && obj !== null) {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (key === 'id') {
          // Skip id fields
          continue;
        } else if (Array.isArray(value)) {
          result[key] = removeIdsFromComponents(value);
        } else if (typeof value === 'object' && value !== null) {
          result[key] = removeIdsFromComponents(value);
        } else {
          result[key] = value;
        }
      }
      return result;
    }
    return obj;
  };
  
  // Remove id fields from component fields before sending to Strapi
  // Component fields that typically have id: operatingHours, serviceAreas, seo, openGraph, localSeo, schema, scripts
  const componentFields = ['operatingHours', 'serviceAreas', 'seo', 'openGraph', 'localSeo', 'schema', 'scripts'];
  componentFields.forEach(field => {
    if (updatedData[field]) {
      updatedData[field] = removeIdsFromComponents(updatedData[field]);
    }
  });
  
  // Update the count for the response
  const actualUpdatesCount = Object.keys(validUpdates).length;
  
  // Check if we have any valid updates after filtering
  if (actualUpdatesCount === 0 && Object.keys(contentUpdates).length > 0) {
    console.warn(`[Sync] All ${Object.keys(contentUpdates).length} fields were skipped - none match Strapi schema`);
    return NextResponse.json({
      success: true,
      message: 'No matching fields to sync. The Page Builder fields do not match the Strapi content type schema.',
      contentType,
      fieldsUpdated: 0,
      skippedFields,
      tip: 'The Page Builder component fields need to match your Strapi content type fields.',
    });
  }

  // Save to content type
  // For collection types, we need to update a specific entry
  const updateUrl = config.isSingleType 
    ? `${STRAPI_URL}${config.endpoint}`
    : `${STRAPI_URL}${config.endpoint}/${contentId}`;
    
  console.log(`[Sync] Updating ${contentType} at: ${updateUrl}`);
  console.log(`[Sync] Fields being updated:`, Object.keys(validUpdates));
  
  // NOTE: For collection types (services, locations), each entry should have its own template
  // If all entries share the same template, layout changes will affect all entries
  if (!config.isSingleType && contentId) {
    console.log(`[Sync] Template ID: ${templateId}, Content ID: ${contentId}`);
    console.log(`[Sync] ⚠️  If layout changes affect all ${contentType} entries, each entry needs its own template in Strapi.`);
  }
  
  console.log(`[Sync] Data being sent (first 1000 chars):`, JSON.stringify(updatedData).slice(0, 1000));
    
  const updateResponse = await fetch(updateUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
    },
    body: JSON.stringify({ data: updatedData }),
  });

  if (!updateResponse.ok) {
    const errorText = await updateResponse.text();
    let errorDetails: any = {};
    try {
      errorDetails = JSON.parse(errorText);
    } catch (e) {
      errorDetails = { raw: errorText };
    }
    
    console.error(`[Sync] Failed to update ${contentType}: ${updateResponse.status}`);
    console.error(`[Sync] Strapi error:`, errorDetails);
    console.error(`[Sync] Attempted to update fields:`, Object.keys(validUpdates));
    console.error(`[Sync] Full data sent:`, JSON.stringify(updatedData, null, 2));
    
    return NextResponse.json(
      { 
        error: `Failed to update ${contentType}${contentId ? ` (${contentId})` : ''}: ${updateResponse.status}`,
        details: errorText,
        strapiError: errorDetails,
        attemptedFields: Object.keys(validUpdates),
        skippedFields,
        dataSent: updatedData,
      },
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
    } else if (contentType === 'service') {
      // Revalidate all service pages
      revalidatePath('/services/[slug]', 'page');
      revalidatePath('/services');
    } else if (contentType === 'location') {
      // Revalidate all location pages
      revalidatePath('/locations/[slug]', 'page');
      revalidatePath('/locations');
    } else {
      clearLandingPageCache();
      revalidatePath('/');
    }
  } catch (e) {
    console.warn('[Sync] Cache clear warning:', e);
    // Ignore cache clear errors
  }

  console.log(`[Sync] Success: Updated ${actualUpdatesCount} fields for ${contentType} (skipped ${skippedFields.length})`);

  return NextResponse.json({
    success: true,
    message: `Content synced to ${contentType}! Refresh your site to see changes.`,
    contentType,
    fieldsUpdated: actualUpdatesCount,
    updatedFields: Object.keys(validUpdates),
    skippedFields: skippedFields.length > 0 ? skippedFields : undefined,
    cacheCleared: true,
  });
}

import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = (process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337').replace(/\/+$/, '');
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contentType, contentId, templateId, pageData } = body;

    if (!contentType || !templateId) {
      return NextResponse.json(
        { error: 'contentType and templateId are required' },
        { status: 400 }
      );
    }

    console.log('Saving page builder data:', {
      contentType,
      templateId,
      pageDataType: typeof pageData,
      pageDataKeys: pageData ? Object.keys(pageData) : [],
    });

    // Extract content field updates from pageData
    // pageData contains the template structure (blocks) and component props
    // We need to extract prop values and update the landing page content fields
    const contentUpdates: any = {};
    
    if (pageData?.blocks && Array.isArray(pageData.blocks)) {
      // Extract field values from component blocks
      pageData.blocks.forEach((block: any) => {
        if (block.component && block.props) {
          // Map component props to landing page fields
          // Each component's props correspond to landing page content fields
          Object.keys(block.props).forEach((propKey) => {
            const propValue = block.props[propKey];
            // Only update if it's not a Handlebars expression (starts with {{)
            if (typeof propValue === 'string' && !propValue.startsWith('{{')) {
              contentUpdates[propKey] = propValue;
            } else if (typeof propValue !== 'string') {
              // For non-string values (objects, arrays), save as-is
              contentUpdates[propKey] = propValue;
            }
          });
        }
      });
    }

    console.log('Content field updates extracted:', Object.keys(contentUpdates));

    // First, update the template with the page builder structure (blocks/order)
    // The template's json field stores the page structure
    const templateUpdateUrl = `${STRAPI_URL}/api/page-builder/templates/${templateId}`;
    const templateUpdateResponse = await fetch(templateUpdateUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
      },
      body: JSON.stringify({
        data: {
          json: pageData, // Save the template structure (blocks)
        },
      }),
    });

    if (!templateUpdateResponse.ok) {
      const errorText = await templateUpdateResponse.text();
      console.error('Template update error:', errorText);
      throw new Error(`Failed to update template: ${templateUpdateResponse.status} - ${errorText}`);
    }

    // Update the landing page content fields with edited values
    if (contentType === 'landing-page' && Object.keys(contentUpdates).length > 0) {
      // Fetch current landing page data first to preserve other fields
      const currentPageResponse = await fetch(`${STRAPI_URL}/api/landing-page`, {
        headers: {
          'Content-Type': 'application/json',
          ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
        },
      });

      let currentData: any = {};
      if (currentPageResponse.ok) {
        const currentPageData = await currentPageResponse.json();
        currentData = currentPageData.data?.data || currentPageData.data || {};
      }

      // Merge updates with current data
      const updatedData = {
        ...currentData,
        ...contentUpdates,
        Landing_Page: Number(templateId), // Maintain template relation
      };

      const landingPageUpdateResponse = await fetch(`${STRAPI_URL}/api/landing-page`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
        },
        body: JSON.stringify({
          data: updatedData,
        }),
      });

      if (!landingPageUpdateResponse.ok) {
        const errorText = await landingPageUpdateResponse.text();
        console.error('Landing page update error:', errorText);
        // Don't throw - template update succeeded, content update is secondary
        console.warn('Template saved but content fields update failed');
      } else {
        console.log('Landing page content fields updated successfully');
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Page builder data saved successfully',
      templateUpdated: true,
      contentUpdated: contentType === 'landing-page' && Object.keys(contentUpdates).length > 0,
    });
  } catch (error: any) {
    console.error('Error saving page builder data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save page builder data' },
      { status: 500 }
    );
  }
}

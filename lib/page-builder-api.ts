/**
 * Page Builder API Utilities
 * Handles communication with Strapi Page Builder plugin
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';
const PAGE_BUILDER_API_KEY = process.env.STRAPI_PAGE_BUILDER_API_KEY || '';

interface StrapiResponse<T> {
  data: T;
  meta?: any;
}

/**
 * Fetch a template by ID
 */
export async function fetchTemplate(templateId: number | string) {
  try {
    const url = `${STRAPI_URL}/api/page-builder/templates/${templateId}?populate=*`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch template: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching template:', error);
    throw error;
  }
}

/**
 * Fetch all templates
 */
export async function fetchTemplates() {
  try {
    const url = `${STRAPI_URL}/api/page-builder/templates?populate=*`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch templates: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }
}

/**
 * Fetch Landing Page with template relation
 */
export async function fetchLandingPage() {
  try {
    const url = `${STRAPI_URL}/api/landing-page?populate[Landing_Page][populate]=*`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch landing page: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching landing page:', error);
    throw error;
  }
}

/**
 * Save page builder data to Strapi
 */
export async function savePageBuilderData(
  contentType: string,
  contentId: number | string | null,
  templateId: number | string,
  pageData: any
) {
  try {
    // If contentId exists, update the relation; otherwise create/update the content
    let url: string;
    let method: string;
    let body: any;

    if (contentType === 'landing-page') {
      // For single type, use PUT to update
      url = `${STRAPI_URL}/api/landing-page`;
      method = 'PUT';
      body = {
        data: {
          Landing_Page: templateId,
          // Optionally save page builder data as JSON
          pageBuilderData: pageData,
        },
      };
    } else {
      // For collection types, update the specific entry
      if (contentId) {
        url = `${STRAPI_URL}/api/${contentType}/${contentId}`;
        method = 'PUT';
      } else {
        url = `${STRAPI_URL}/api/${contentType}`;
        method = 'POST';
      }
      body = {
        data: {
          template: templateId,
          pageBuilderData: pageData,
        },
      };
    }

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to save page builder data: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error saving page builder data:', error);
    throw error;
  }
}

/**
 * Get Page Builder configuration
 */
export function getPageBuilderConfig() {
  return {
    strapiUrl: STRAPI_URL,
    apiToken: STRAPI_API_TOKEN,
    apiKey: PAGE_BUILDER_API_KEY,
  };
}

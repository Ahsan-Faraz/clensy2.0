'use client';

import { useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { toast, Toaster } from 'sonner';
import '@wecre8websites/strapi-page-builder-react/editor.css';
import { pageBuilderConfig } from '@/lib/page-builder-components';

// Suppress Puck library warnings in development (these are internal library warnings we can't fix)
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    const msg = args[0];
    if (typeof msg === 'string' && (
      msg.includes('usePuck') ||
      msg.includes('setData') ||
      msg.includes('unnecessary re-renders')
    )) {
      return; // Suppress these specific warnings
    }
    originalWarn.apply(console, args);
  };
}

const PageEditor = dynamic(
  () => import('@wecre8websites/strapi-page-builder-react').then((mod) => mod.Editor),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Page Builder...</p>
        </div>
      </div>
    ),
  }
);

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const PAGE_BUILDER_API_KEY = process.env.NEXT_PUBLIC_PAGE_BUILDER_API_KEY || '';
const STRAPI_CLIENT_TOKEN = process.env.NEXT_PUBLIC_STRAPI_CLIENT_TOKEN || '';

// Content type to API endpoint mapping - use dedicated Page Builder endpoint for raw Strapi data
// Content type configuration
// isSingleType: true = single type (landing-page), false = collection type (services)
const contentTypeConfig: Record<string, { endpoint: string; templateField: string; isSingleType: boolean }> = {
  'landing-page': { endpoint: '/api/page-builder/content/landing-page', templateField: 'Landing_Page', isSingleType: true },
  'about': { endpoint: '/api/page-builder/content/about', templateField: 'About_Page', isSingleType: true },
  'contact': { endpoint: '/api/page-builder/content/contact', templateField: 'Contact_Page', isSingleType: true },
  'checklist-page': { endpoint: '/api/page-builder/content/checklist-page', templateField: 'Checklist_Page', isSingleType: true },
  'faq-page': { endpoint: '/api/page-builder/content/faq-page', templateField: 'FAQ_Page', isSingleType: true },
  // Collection types - require contentId
  'service': { endpoint: '/api/page-builder/content/service', templateField: 'Service_Page', isSingleType: false },
  'location': { endpoint: '/api/page-builder/content/location', templateField: 'Location_Page', isSingleType: false },
};

// Helper to get endpoint URL (with contentId for collection types)
const getEndpointUrl = (contentType: string, contentId?: string | null): string => {
  const config = contentTypeConfig[contentType];
  if (!config) {
    return `/api/page-builder/content/${contentType}`;
  }
  if (config.isSingleType) {
    return config.endpoint;
  }
  // Collection type - append contentId if available
  if (contentId && contentId !== 'undefined' && contentId !== 'null') {
    return `${config.endpoint}?contentId=${contentId}`;
  }
  // Return without contentId - API will return proper error message
  return config.endpoint;
};

// Helper to get template field
const getTemplateField = (contentType: string): string => {
  return contentTypeConfig[contentType]?.templateField || 'Landing_Page';
};

function EditorPageContent() {
  const searchParams = useSearchParams();
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [pageId, setPageId] = useState<string | null>(null);
  const [contentType, setContentType] = useState<string>('landing-page');
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Parse content type from URL - handle both our format and Strapi's format
  // Our format: ?type=about
  // Strapi format: ?_contentType=api::about.about
  const parseContentType = (params: URLSearchParams): string => {
    // Check our format first
    const typeParam = params.get('type');
    if (typeParam) return typeParam;
    
    // Check Strapi's format: api::about.about -> about
    const strapiContentType = params.get('_contentType');
    if (strapiContentType) {
      // Extract content type name from api::about.about or api::landing-page.landing-page
      const match = strapiContentType.match(/api::([^.]+)\./);
      if (match) {
        const extracted = match[1];
        // Map Strapi names to our names
        if (extracted === 'landing-page') return 'landing-page';
        if (extracted === 'about') return 'about';
        if (extracted === 'contact') return 'contact';
        if (extracted === 'checklist-page') return 'checklist-page';
        if (extracted === 'faq-page') return 'faq-page';
        return extracted;
      }
    }
    
    return 'landing-page';
  };

  // Parse template ID from URL - handle both formats
  const parseTemplateId = (params: URLSearchParams): string | null => {
    const template = params.get('template');
    if (template) return template;
    
    const strapiTemplateId = params.get('_templateId');
    if (strapiTemplateId && strapiTemplateId !== 'undefined') return strapiTemplateId;
    
    return null;
  };

  // Get URL params directly (not from state) to avoid stale state issues
  const urlContentType = parseContentType(searchParams);
  const urlTemplateId = parseTemplateId(searchParams);

  useEffect(() => {
    const templateParam = parseTemplateId(searchParams);
    // Strapi passes _contentId for collection type entries
    const pageParam = searchParams.get('page') || searchParams.get('_contentId') || searchParams.get('contentId') || searchParams.get('id');
    const typeParam = parseContentType(searchParams);
    
    // Debug: Log raw params
    const rawContentType = searchParams.get('_contentType');
    const rawType = searchParams.get('type');
    const rawTemplateId = searchParams.get('_templateId');
    const rawTemplate = searchParams.get('template');
    const rawContentId = searchParams.get('_contentId');
    const rawPage = searchParams.get('page');

    console.log(`[Editor] ============ URL PARAMS ============`);
    console.log(`[Editor] Raw: type=${rawType}, _contentType=${rawContentType}`);
    console.log(`[Editor] Raw: template=${rawTemplate}, _templateId=${rawTemplateId}`);
    console.log(`[Editor] Raw: page=${rawPage}, _contentId=${rawContentId}`);
    console.log(`[Editor] Parsed: contentType=${typeParam}, templateId=${templateParam}, contentId=${pageParam}`);
    console.log(`[Editor] =====================================`);

    // Reset all state when content type changes
    setTemplateId(templateParam);
    setPageId(pageParam);
    setContentType(typeParam);
    setInitialData(null);
    setError(null);

    loadInitialData(templateParam, pageParam, typeParam);
  }, [searchParams]);

  const loadInitialData = async (
    templateIdParam: string | null,
    pageIdParam: string | null,
    contentTypeParam: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Check if this is a collection type that requires contentId
      const config = contentTypeConfig[contentTypeParam];
      const isCollectionType = config && !config.isSingleType;
      const hasValidContentId = pageIdParam && pageIdParam !== 'undefined' && pageIdParam !== 'null';
      
      if (isCollectionType && !hasValidContentId) {
        throw new Error(
          `Content ID required for ${contentTypeParam}. ` +
          `Please open this page from Strapi Admin → Content Manager → ${contentTypeParam} → Edit → Click "Open in Page Builder". ` +
          `This ensures the correct entry ID is passed.`
        );
      }

      // Get the correct endpoint for this content type (with contentId for collection types)
      const endpoint = getEndpointUrl(contentTypeParam, pageIdParam);
      const templateField = getTemplateField(contentTypeParam);
      
      console.log(`[Editor] Loading data for ${contentTypeParam}, contentId=${pageIdParam}, endpoint=${endpoint}`);

      // Fetch content for the specified content type
      let pageContent: any = {};
      try {
        const contentResponse = await fetch(endpoint, {
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });
        
        if (contentResponse.ok) {
          const contentData = await contentResponse.json();
          pageContent = contentData.data || {};
          
          // Store globally so render functions can access it
          if (typeof window !== 'undefined') {
            (window as any).__pageBuilderContent = pageContent;
          }
        }
      } catch (e) {
        console.warn(`Could not fetch ${contentTypeParam} content:`, e);
      }

      // If template ID is provided directly, fetch that template
      if (templateIdParam) {
        const templateResponse = await fetch(
          `/api/page-builder/templates/${templateIdParam}`,
          {
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
          }
        );

        if (!templateResponse.ok) {
          const errorText = await templateResponse.text();
          throw new Error(`Failed to fetch template: ${templateResponse.status} - ${errorText}`);
        }

        const templateResult = await templateResponse.json();
        const templateData = templateResult.data || templateResult;
        templateData.content = pageContent;
        
        // IMPORTANT: Use documentId for Page Builder's save functionality (Strapi v5)
        const correctTemplateId = templateData.documentId || templateData.id || templateIdParam;
        console.log(`[Editor] Template fetched, setting templateId to: ${correctTemplateId} (was: ${templateIdParam})`);
        setTemplateId(String(correctTemplateId));
        
        setInitialData(templateData);
      } else {
        // Fetch the content type to get its attached template
        const contentResponse = await fetch(endpoint, {
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });

        if (!contentResponse.ok) {
          const errorText = await contentResponse.text();
          throw new Error(`Failed to fetch ${contentTypeParam}: ${contentResponse.status} - ${errorText}`);
        }

        const contentData = await contentResponse.json();
        
        // The new endpoint returns { success: true, data: {...raw strapi content...} }
        console.log(`[Editor] ${contentTypeParam} response success:`, contentData.success);
        
        // Get the raw Strapi data
        const data = contentData.data || {};
        
        console.log(`[Editor] ${contentTypeParam} data keys:`, Object.keys(data).slice(0, 20));
        console.log(`[Editor] Looking for template field: "${templateField}"`);
        console.log(`[Editor] Template field exists:`, templateField in data);
        
        const template = data[templateField];

        if (template) {
          console.log(`[Editor] Template FOUND:`, { id: template.id, documentId: template.documentId, name: template.name });
        } else {
          console.log(`[Editor] Template NOT FOUND in fields:`, Object.keys(data).join(', '));
        }

        if (template) {
          // Prefer documentId for Strapi v5 (required for Page Builder's internal save)
          const templateIdValue = template.documentId || template.id || template.data?.documentId || template.data?.id;
          if (templateIdValue) {
            console.log(`[Editor] Setting templateId to: ${templateIdValue} (type: ${typeof templateIdValue})`);
            setTemplateId(String(templateIdValue));
            template.content = pageContent;
            setInitialData(template);
          } else {
            throw new Error('Template found but missing ID');
          }
        } else {
          // Try to fetch available templates
          let templatesInfo = '';
          try {
            const templatesResponse = await fetch('/api/page-builder/templates');
            if (templatesResponse.ok) {
              const templatesData = await templatesResponse.json();
              const templates = templatesData.data?.data || templatesData.data || [];
              if (Array.isArray(templates) && templates.length > 0) {
                templatesInfo = ` Available templates: ${templates.map((t: any) => `ID ${t.documentId || t.id} - ${t.name || 'Unnamed'}`).join(', ')}.`;
              }
            }
          } catch (e) {
            // Ignore
          }
          
          throw new Error(
            `No template found for ${contentTypeParam}. ` +
            `Please go to Strapi Admin → Content Manager → ${contentTypeParam.replace('-', ' ')} → Edit, ` +
            `and attach a Template to the "${templateField}" field. ` +
            `Make sure the template is published.` +
            templatesInfo
          );
        }
      }
    } catch (err: any) {
      console.error('Error loading initial data:', err);
      setError(err.message || 'Failed to load page builder data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (pageData: any) => {
    try {
      const saveUrl = `/api/page-builder/save`;
      const response = await fetch(saveUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType,
          contentId: pageId,
          templateId,
          pageData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save');
      }

      toast.success('Page saved successfully!');
    } catch (err: any) {
      console.error('Error saving:', err);
      toast.error(`Error saving: ${err.message}`);
    }
  };

  // Sync changes to the original site
  const [syncing, setSyncing] = useState(false);
  
  const handleSyncToSite = async () => {
    setSyncing(true);
    
    // Use URL-parsed values (more reliable than state which may be stale)
    const syncContentType = parseContentType(searchParams);
    const syncTemplateId = templateId || parseTemplateId(searchParams);
    const syncContentId = searchParams.get('page') || searchParams.get('_contentId'); // For collection types
    
    console.log(`[Sync] Content type: ${syncContentType}, Template ID: ${syncTemplateId}, Content ID: ${syncContentId}`);
    
    if (!syncTemplateId) {
      toast.error('No template ID available. Please reload the editor.');
      setSyncing(false);
      return;
    }
    
    try {
      const response = await fetch('/api/page-builder/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contentType: syncContentType, 
          templateId: syncTemplateId,
          contentId: syncContentId, // For collection types (service, location)
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.instructions) {
          toast.error(result.error, {
            description: result.instructions.join('\n'),
            duration: 8000,
          });
        } else {
          toast.error(result.error || 'Sync failed');
        }
        return;
      }

      if (result.fieldsUpdated === 0) {
        toast.warning(result.message, {
          description: result.tip || 'Add components and edit them first.',
          duration: 5000,
        });
      } else {
        const fieldsPreview = result.updatedFields?.slice(0, 5).join(', ');
        const moreCount = (result.updatedFields?.length || 0) - 5;
        toast.success(`Synced to ${contentType}!`, {
          description: `Updated ${result.fieldsUpdated} fields: ${fieldsPreview}${moreCount > 0 ? ` +${moreCount} more` : ''}`,
          duration: 5000,
        });
      }
    } catch (err: any) {
      console.error('Error syncing:', err);
      toast.error(`Error syncing: ${err.message}`);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Page Builder...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!PAGE_BUILDER_API_KEY || PAGE_BUILDER_API_KEY.trim() === '') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Page Builder API Key Missing</h1>
          <p className="text-gray-600 mb-4">
            The Page Builder requires a valid API key to function.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-left mb-4">
            <p className="text-sm font-semibold mb-2">To fix this:</p>
            <ol className="text-sm list-decimal list-inside space-y-1">
              <li>Sign up for a free API key at <a href="https://pagebuilder.wc8.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">pagebuilder.wc8.io</a></li>
              <li>Add it to your <code className="bg-gray-100 px-1 rounded">.env</code> file:</li>
            </ol>
            <pre className="mt-2 bg-gray-800 text-green-400 p-2 rounded text-xs overflow-x-auto">
NEXT_PUBLIC_PAGE_BUILDER_API_KEY=your_api_key_here
            </pre>
          </div>
        </div>
      </div>
    );
  }

  if (!initialData || !templateId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">No Template Found</h1>
          <p className="text-gray-600 mb-4">
            Please ensure a template is attached to your {contentType} in Strapi.
          </p>
          <p className="text-sm text-gray-500">
            Example: /editor?type=landing-page or /editor?type=about
          </p>
        </div>
      </div>
    );
  }

  const strapiSettings = {
    url: STRAPI_URL,
    authToken: STRAPI_CLIENT_TOKEN || undefined,
    imageUrl: STRAPI_URL,
    locale: 'en',
  };

  const editorConfig = pageBuilderConfig;

  const fetchContent = async (contentId: string) => {
    try {
      // Use urlContentType to avoid stale state issues
      const currentContentType = urlContentType;
      const currentTemplateId = templateId;
      
      if (!currentTemplateId) return null;

      const templateResponse = await fetch(
        `/api/page-builder/templates/${currentTemplateId}`,
        {
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        }
      );

      if (!templateResponse.ok) return null;

      const templateResult = await templateResponse.json();
      const template = templateResult.data || templateResult;
      
      // Fetch content for the current content type (use URL param, not state)
      const currentContentId = searchParams.get('page') || searchParams.get('_contentId');
      const endpoint = getEndpointUrl(currentContentType, currentContentId);
      let pageContent = {};
      try {
        const contentResponse = await fetch(endpoint, {
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });
        
        if (contentResponse.ok) {
          const contentData = await contentResponse.json();
          pageContent = contentData.data || {};
        }
      } catch (e) {
        // Ignore
      }
      
      let templateJson = template.json || template.content || template.templateJson;
      if (!templateJson || !templateJson.blocks || !Array.isArray(templateJson.blocks)) {
        templateJson = { blocks: [] };
      }
      
      const result = {
        templateJson: templateJson,
        content: pageContent,
      };
      
      if (typeof window !== 'undefined') {
        (window as any).__pageBuilderContent = pageContent;
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching content:', error);
      return null;
    }
  };

  let initialTemplateData = undefined;
  const globalContent = typeof window !== 'undefined' ? (window as any).__pageBuilderContent : {};
  
  if (initialData) {
    let templateJson = initialData.json || initialData.templateJson;
    if (!templateJson || !templateJson.blocks || !Array.isArray(templateJson.blocks)) {
      templateJson = { blocks: [] };
    }
    
    initialTemplateData = {
      templateJson: templateJson,
      content: initialData.content || globalContent || {},
    };
  }

  // Get content type display name - use parsed URL directly for accuracy
  const parsedContentType = parseContentType(searchParams);
  const contentTypeDisplay = parsedContentType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  // Debug: log current state vs URL at render time
  console.log(`[Editor Render] State contentType: ${contentType}, Parsed from URL: ${parsedContentType}, TemplateId: ${templateId}`);

  return (
    <div className="w-full h-screen relative">
      <Toaster position="top-right" richColors closeButton />
      
      <PageEditor
        config={editorConfig}
        apiKey={PAGE_BUILDER_API_KEY}
        strapi={strapiSettings}
        fetch={fetchContent}
        contentKey={templateId || undefined}
        {...(initialTemplateData && { data: initialTemplateData })}
      />
      
      {/* Floating buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {/* Content type indicator */}
        <div className="bg-gray-800 text-white text-xs px-3 py-1 rounded-full text-center mb-1">
          Editing: {contentTypeDisplay}
        </div>
        
        <button
          onClick={handleSyncToSite}
          disabled={syncing}
          className={`
            flex items-center gap-2 px-4 py-3 rounded-full shadow-lg
            font-medium text-sm transition-all duration-200
            ${syncing 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 hover:shadow-xl'
            }
            text-white
          `}
          title={`Sync changes to ${contentTypeDisplay}`}
        >
          {syncing ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Syncing...
            </>
          ) : (
            <>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Sync to Site
            </>
          )}
        </button>
        
        <a
          href={
            parsedContentType === 'about' ? '/company/about' :
            parsedContentType === 'contact' ? '/contact' :
            parsedContentType === 'checklist-page' ? '/company/checklist' :
            parsedContentType === 'faq-page' ? '/faq' :
            '/'
          }
          target="_blank"
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all duration-200"
          title={`View ${contentTypeDisplay} page`}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
          </svg>
          View Site
        </a>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Page Builder...</p>
          </div>
        </div>
      }
    >
      <EditorPageContent />
    </Suspense>
  );
}

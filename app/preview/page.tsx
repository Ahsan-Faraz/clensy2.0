'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { pageBuilderConfig } from '@/lib/page-builder-components';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

// Dynamically import the Render component
const PageRender = dynamic(
  () => import('@wecre8websites/strapi-page-builder-react').then((mod) => mod.Render),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    ),
  }
);

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export default function PreviewPage() {
  const [templateData, setTemplateData] = useState<any>(null);
  const [content, setContent] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch landing page with template relation
        const response = await fetch('/api/cms/landing-page', {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch landing page');
        }

        const result = await response.json();
        const landingPageData = result.data?.data || result.data || {};
        
        // Get the template
        const template = landingPageData.Landing_Page;
        
        if (!template || !template.json) {
          throw new Error('No template found. Please attach a template to the landing page in Strapi.');
        }

        // Set template JSON (the block structure)
        setTemplateData(template.json);
        
        // Set content (all landing page fields for Handlebars substitution)
        setContent(landingPageData);
        
        console.log('Preview loaded:', {
          hasTemplate: !!template,
          blocksCount: template.json?.blocks?.length || 0,
          contentFields: Object.keys(landingPageData).length,
        });
      } catch (err: any) {
        console.error('Error loading preview:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading preview...</p>
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
          <a
            href="/editor?type=landing-page"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Open Editor
          </a>
        </div>
      </div>
    );
  }

  if (!templateData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Template</h1>
          <p className="text-gray-600">Please create a template in the Page Builder editor.</p>
        </div>
      </div>
    );
  }

  const strapiConfig = {
    url: STRAPI_URL,
    imageUrl: STRAPI_URL,
    locale: 'en',
  };

  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <PageRender
        config={pageBuilderConfig}
        data={{
          templateJson: templateData,
          content: content,
        }}
        strapi={strapiConfig}
      />
      <Footer />
    </main>
  );
}

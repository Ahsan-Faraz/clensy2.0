'use client';

import { Render } from "@wecre8websites/strapi-page-builder-react";
import { useEffect, useState } from "react";
import pageBuilderConfig from "@/lib/page-builder-components";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

interface PageRendererProps {
  contentType: 'landing-page' | 'about' | 'contact' | 'checklist-page' | 'faq-page';
  fallbackComponent?: React.ReactNode;
}

interface TemplateData {
  templateJson: any;
  content: any;
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export default function PageRenderer({ contentType, fallbackComponent }: PageRendererProps) {
  const [templateData, setTemplateData] = useState<TemplateData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplateData = async () => {
      try {
        // Fetch from our content API that includes template data
        const response = await fetch(`/api/page-builder/content/${contentType}`);
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch content');
        }

        const content = result.data || {};
        const templateField = result.templateField;
        
        // Get the template relation
        const template = templateField ? content[templateField] : null;
        const templateJson = template?.json || { root: { props: {} }, content: [], zones: {} };

        setTemplateData({
          templateJson,
          content,
        });
      } catch (err: any) {
        console.error(`[PageRenderer] Error fetching ${contentType}:`, err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplateData();
  }, [contentType]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading page...</p>
        </div>
      </div>
    );
  }

  // Error state or no template - fall back to original component
  if (error || !templateData?.templateJson?.content?.length) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">No template configured for this page.</p>
          <p className="text-sm text-gray-400 mt-2">Please set up a template in the Page Builder.</p>
        </div>
      </div>
    );
  }

  // Render using Page Builder's Render component
  return (
    <main className="overflow-x-hidden">
      <div className="relative z-50">
        <Navbar />
      </div>
      
      <Render
        config={pageBuilderConfig}
        data={{
          templateJson: templateData.templateJson,
          content: templateData.content,
        }}
        strapi={{
          url: STRAPI_URL,
          imageUrl: STRAPI_URL,
        }}
      />
      
      <Footer />
    </main>
  );
}

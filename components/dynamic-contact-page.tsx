'use client';

import { Render } from "@wecre8websites/strapi-page-builder-react";
import { useEffect, useState } from "react";
import pageBuilderConfig from "@/lib/page-builder-components";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SEOHead from "@/components/seo-head";
import dynamic from 'next/dynamic';

const OriginalContactPageClient = dynamic(() => import('@/app/contact/contact-client'), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  ),
});

interface DynamicContactPageProps {
  schemaJsonLd?: object | null;
  headScripts?: string;
  bodyEndScripts?: string;
  customCss?: string;
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export default function DynamicContactPage({
  schemaJsonLd,
  headScripts,
  bodyEndScripts,
  customCss,
}: DynamicContactPageProps) {
  const [templateData, setTemplateData] = useState<{ templateJson: any; content: any } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usePageBuilder, setUsePageBuilder] = useState(false);

  useEffect(() => {
    const fetchTemplateData = async () => {
      try {
        const response = await fetch('/api/page-builder/content/contact');
        const result = await response.json();

        if (result.success && result.data) {
          const content = result.data;
          const templateField = result.templateField || 'Contact_Page';
          const template = content[templateField];
          
          if (template?.json?.content && template.json.content.length > 0) {
            setTemplateData({
              templateJson: template.json,
              content,
            });
            setUsePageBuilder(true);
          }
        }
      } catch (err) {
        console.error('[DynamicContactPage] Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplateData();
  }, []);

  if (isLoading) {
    return (
      <main className="overflow-x-hidden">
        <SEOHead schemaJsonLd={schemaJsonLd} headScripts={headScripts} bodyEndScripts={bodyEndScripts} customCss={customCss} />
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </main>
    );
  }

  if (usePageBuilder && templateData) {
    return (
      <main className="overflow-x-hidden">
        <SEOHead schemaJsonLd={schemaJsonLd} headScripts={headScripts} bodyEndScripts={bodyEndScripts} customCss={customCss} />
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

  return (
    <OriginalContactPageClient
      schemaJsonLd={schemaJsonLd}
      headScripts={headScripts}
      bodyEndScripts={bodyEndScripts}
      customCss={customCss}
    />
  );
}

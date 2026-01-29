'use client';

import { Render } from "@wecre8websites/strapi-page-builder-react";
import { useEffect, useState, useMemo } from "react";
import pageBuilderConfig from "@/lib/page-builder-components";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SEOHead from "@/components/seo-head";
// Original components for fallback
import HeroSection from "@/components/hero-section";
import HowItWorks from "@/components/how-it-works";
import ComparisonSection from "@/components/comparison-section";
import ChecklistSection from "@/components/checklist-section"; // HARDCODED - not in Page Builder
import ReviewsSection from "@/components/reviews-section";
import CTASection from "@/components/cta-section";

interface DynamicLandingPageProps {
  schemaJsonLd?: object | null;
  additionalSchemas?: object[];
  headScripts?: string;
  bodyEndScripts?: string;
  customCss?: string;
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export default function DynamicLandingPage({
  schemaJsonLd,
  additionalSchemas,
  headScripts,
  bodyEndScripts,
  customCss,
}: DynamicLandingPageProps) {
  const [templateData, setTemplateData] = useState<{ templateJson: any; content: any } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usePageBuilder, setUsePageBuilder] = useState(false);

  useEffect(() => {
    const fetchTemplateData = async () => {
      try {
        const response = await fetch('/api/page-builder/content/landing-page');
        const result = await response.json();

        if (result.success && result.data) {
          const content = result.data;
          const templateField = result.templateField || 'Landing_Page';
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
        console.error('[DynamicLandingPage] Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplateData();
  }, []);

  // Split template content: before and after the hardcoded Checklist position
  // Checklist goes after HowItWorks (or after Hero if no HowItWorks)
  const { beforeChecklist, afterChecklist } = useMemo(() => {
    if (!templateData?.templateJson?.content) {
      return { beforeChecklist: { ...templateData?.templateJson, content: [] }, afterChecklist: { ...templateData?.templateJson, content: [] } };
    }

    const content = templateData.templateJson.content || [];
    let splitIndex = -1;

    // Find the position after HowItWorks
    for (let i = 0; i < content.length; i++) {
      if (content[i].type === 'HowItWorks') {
        splitIndex = i + 1;
        break;
      }
    }

    // If no HowItWorks, put checklist after Hero
    if (splitIndex === -1) {
      for (let i = 0; i < content.length; i++) {
        if (content[i].type === 'Hero') {
          splitIndex = i + 1;
          break;
        }
      }
    }

    // If still no match, put at position 1 (after first component)
    if (splitIndex === -1) {
      splitIndex = Math.min(1, content.length);
    }

    return {
      beforeChecklist: { ...templateData.templateJson, content: content.slice(0, splitIndex) },
      afterChecklist: { ...templateData.templateJson, content: content.slice(splitIndex) },
    };
  }, [templateData]);

  if (isLoading) {
    return (
      <main className="overflow-x-hidden">
        <SEOHead schemaJsonLd={schemaJsonLd} additionalSchemas={additionalSchemas} headScripts={headScripts} bodyEndScripts={bodyEndScripts} customCss={customCss} />
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </main>
    );
  }

  // Use Page Builder rendering with hardcoded ChecklistSection in fixed position
  if (usePageBuilder && templateData) {
    return (
      <main className="overflow-x-hidden">
        <SEOHead schemaJsonLd={schemaJsonLd} additionalSchemas={additionalSchemas} headScripts={headScripts} bodyEndScripts={bodyEndScripts} customCss={customCss} />
        <div className="relative z-50">
          <Navbar />
        </div>
        
        {/* Page Builder content BEFORE Checklist position */}
        {beforeChecklist.content.length > 0 && (
          <Render
            config={pageBuilderConfig}
            data={{ templateJson: beforeChecklist, content: templateData.content }}
            strapi={{ url: STRAPI_URL, imageUrl: STRAPI_URL }}
          />
        )}
        
        {/* HARDCODED Checklist Section - Always appears in this position */}
        <ChecklistSection />
        
        {/* Page Builder content AFTER Checklist position */}
        {afterChecklist.content.length > 0 && (
          <Render
            config={pageBuilderConfig}
            data={{ templateJson: afterChecklist, content: templateData.content }}
            strapi={{ url: STRAPI_URL, imageUrl: STRAPI_URL }}
          />
        )}
        
        <Footer />
      </main>
    );
  }

  // Fallback to original hardcoded layout
  return (
    <main className="overflow-x-hidden">
      <SEOHead schemaJsonLd={schemaJsonLd} additionalSchemas={additionalSchemas} headScripts={headScripts} bodyEndScripts={bodyEndScripts} customCss={customCss} />
      <Navbar />
      <HeroSection />
      <div className="max-w-full">
        <HowItWorks />
        <ChecklistSection />
        <ReviewsSection />
        <ComparisonSection />
        <CTASection />
      </div>
      <Footer />
    </main>
  );
}

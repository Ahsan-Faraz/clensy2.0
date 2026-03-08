'use client';

import { Render } from "@wecre8websites/strapi-page-builder-react";
import { useMemo } from "react";
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
  // SSG: All section data pre-fetched from server
  heroData?: any;
  howItWorksData?: any;
  ctaData?: any;
  comparisonData?: any;
  reviewsData?: any;
  checklistData?: any;

  // SSG: Page builder template data pre-fetched from server
  pageBuilderContent?: any;
  pageBuilderTemplateField?: string;
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export default function DynamicLandingPage({
  schemaJsonLd,
  additionalSchemas,
  headScripts,
  bodyEndScripts,
  customCss,
  heroData,
  howItWorksData,
  ctaData,
  comparisonData,
  reviewsData,
  checklistData,
  pageBuilderContent,
  pageBuilderTemplateField,
}: DynamicLandingPageProps) {
  // Determine if page builder should be used (template data was provided from server)
  const usePageBuilder = Boolean(pageBuilderContent);
  const templateField = pageBuilderTemplateField || 'Landing_Page';

  // Parse page builder template data
  const templateData = useMemo(() => {
    if (!pageBuilderContent) return null;
    const template = pageBuilderContent[templateField];
    if (template?.json?.content && template.json.content.length > 0) {
      return {
        templateJson: template.json,
        content: pageBuilderContent,
      };
    }
    return null;
  }, [pageBuilderContent, templateField]);

  // Split template content for hardcoded sections:
  // 1. Checklist goes after HowItWorks (or after Hero if no HowItWorks)
  // 2. Reviews goes after Comparison (or at the end before CTA)
  const { beforeChecklist, betweenChecklistAndReviews, afterReviews } = useMemo(() => {
    const emptyTemplate = { ...templateData?.templateJson, content: [] };
    
    if (!templateData?.templateJson?.content) {
      return { beforeChecklist: emptyTemplate, betweenChecklistAndReviews: emptyTemplate, afterReviews: emptyTemplate };
    }

    const content = templateData.templateJson.content || [];
    let checklistSplitIndex = -1;
    let reviewsSplitIndex = -1;

    // Find the position after HowItWorks for Checklist
    for (let i = 0; i < content.length; i++) {
      if (content[i].type === 'HowItWorks') {
        checklistSplitIndex = i + 1;
        break;
      }
    }

    // If no HowItWorks, put checklist after Hero
    if (checklistSplitIndex === -1) {
      for (let i = 0; i < content.length; i++) {
        if (content[i].type === 'Hero') {
          checklistSplitIndex = i + 1;
          break;
        }
      }
    }

    // If still no match, put checklist at position 1 (after first component)
    if (checklistSplitIndex === -1) {
      checklistSplitIndex = Math.min(1, content.length);
    }

    // Find the position after Comparison for Reviews
    for (let i = checklistSplitIndex; i < content.length; i++) {
      if (content[i].type === 'Comparison') {
        reviewsSplitIndex = i + 1;
        break;
      }
    }

    // If no Comparison found, put Reviews before CTA (or at the end)
    if (reviewsSplitIndex === -1) {
      for (let i = checklistSplitIndex; i < content.length; i++) {
        if (content[i].type === 'CTA') {
          reviewsSplitIndex = i;
          break;
        }
      }
    }

    // If still no match, put Reviews at the end
    if (reviewsSplitIndex === -1) {
      reviewsSplitIndex = content.length;
    }

    return {
      beforeChecklist: { ...templateData.templateJson, content: content.slice(0, checklistSplitIndex) },
      betweenChecklistAndReviews: { ...templateData.templateJson, content: content.slice(checklistSplitIndex, reviewsSplitIndex) },
      afterReviews: { ...templateData.templateJson, content: content.slice(reviewsSplitIndex) },
    };
  }, [templateData]);

  // Use Page Builder rendering with hardcoded ChecklistSection and ReviewsSection in fixed positions
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
        <ChecklistSection data={checklistData} />
        
        {/* Page Builder content BETWEEN Checklist and Reviews */}
        {betweenChecklistAndReviews.content.length > 0 && (
          <Render
            config={pageBuilderConfig}
            data={{ templateJson: betweenChecklistAndReviews, content: templateData.content }}
            strapi={{ url: STRAPI_URL, imageUrl: STRAPI_URL }}
          />
        )}
        
        {/* HARDCODED Reviews Section */}
        <ReviewsSection data={reviewsData} />
        
        {/* Page Builder content AFTER Reviews (typically CTA) */}
        {afterReviews.content.length > 0 && (
          <Render
            config={pageBuilderConfig}
            data={{ templateJson: afterReviews, content: templateData.content }}
            strapi={{ url: STRAPI_URL, imageUrl: STRAPI_URL }}
          />
        )}
        
        <Footer />
      </main>
    );
  }

  // Fallback to original hardcoded layout (SSG: all data passed as props)
  return (
    <main className="overflow-x-hidden">
      <SEOHead schemaJsonLd={schemaJsonLd} additionalSchemas={additionalSchemas} headScripts={headScripts} bodyEndScripts={bodyEndScripts} customCss={customCss} />
      <Navbar />
      <HeroSection data={heroData} />
      <div className="max-w-full">
        <HowItWorks data={howItWorksData} />
        <ChecklistSection data={checklistData} />
        <ReviewsSection data={reviewsData} />
        <ComparisonSection data={comparisonData} />
        <CTASection data={ctaData} />
      </div>
      <Footer />
    </main>
  );
}

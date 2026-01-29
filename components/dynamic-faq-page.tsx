'use client';

/**
 * FAQ Page - Uses original client component with CMS data
 * 
 * The main FAQ Section (with search, filters, pagination, and accordion) is too complex
 * to be managed via Page Builder, so this page always uses the original client component
 * which fetches data from Strapi CMS.
 * 
 * Content (FAQs, text, images) can be edited in Strapi CMS.
 * Layout is fixed (not changeable via Page Builder drag-and-drop).
 */
import dynamic from 'next/dynamic';

const FAQPageClient = dynamic(() => import('@/app/faq/faq-client'), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  ),
});

interface DynamicFAQPageProps {
  schemaJsonLd?: object | null;
  headScripts?: string;
  bodyEndScripts?: string;
  customCss?: string;
}

export default function DynamicFAQPage({
  schemaJsonLd,
  headScripts,
  bodyEndScripts,
  customCss,
}: DynamicFAQPageProps) {
  // Always use the original client component which fetches from CMS
  // This preserves the interactive FAQ section with search, filters, and accordions
  return (
    <FAQPageClient
      schemaJsonLd={schemaJsonLd}
      headScripts={headScripts}
      bodyEndScripts={bodyEndScripts}
      customCss={customCss}
    />
  );
}

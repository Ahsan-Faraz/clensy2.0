'use client';

/**
 * Checklist Page - Uses original client component with CMS data
 * 
 * The main Checklist Section (with rooms, modals, and interactive tabs) is too complex
 * to be managed via Page Builder, so this page always uses the original client component
 * which fetches data from Strapi CMS.
 * 
 * Content (text, images) can be edited in Strapi CMS.
 * Layout is fixed (not changeable via Page Builder drag-and-drop).
 */
import dynamic from 'next/dynamic';

const ChecklistPageClient = dynamic(() => import('@/app/company/checklist/checklist-client'), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  ),
});

interface DynamicChecklistPageProps {
  schemaJsonLd?: object | null;
  headScripts?: string;
  bodyEndScripts?: string;
  customCss?: string;
}

export default function DynamicChecklistPage({
  schemaJsonLd,
  headScripts,
  bodyEndScripts,
  customCss,
}: DynamicChecklistPageProps) {
  // Always use the original client component which fetches from CMS
  // This preserves the interactive checklist section with modals and tabs
  return (
    <ChecklistPageClient
      schemaJsonLd={schemaJsonLd}
      headScripts={headScripts}
      bodyEndScripts={bodyEndScripts}
      customCss={customCss}
    />
  );
}

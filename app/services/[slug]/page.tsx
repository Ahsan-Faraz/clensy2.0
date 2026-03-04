import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import CMSAdapter from "@/lib/cms-adapter";
import { UnifiedTemplate } from "@/components/service-templates";
import { ServicePageWithSWR } from "@/components/service-page-with-swr";

export const revalidate = 300; // 5 min ISR - targeted revalidateTag on publish

export async function generateStaticParams() {
  const services = await CMSAdapter.getAllServices();
  return services.map((s) => ({ slug: s.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const { isEnabled: isDraftMode } = await draftMode();

  const rawData = await CMSAdapter.getServiceBySlug(
    slug,
    isDraftMode ? "draft" : "published"
  );

  if (!rawData) {
    notFound();
  }

  // Client wrapper with SWR: refetches on focus so Strapi edits appear without full refresh
  return (
    <ServicePageWithSWR
      slug={slug}
      initialRawData={rawData as Record<string, unknown>}
      Template={UnifiedTemplate}
    />
  );
}

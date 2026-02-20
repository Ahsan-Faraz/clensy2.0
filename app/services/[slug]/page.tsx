import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import CMSAdapter from "@/lib/cms-adapter";
import { fetchServicePageBuilderContent } from "@/lib/page-builder-api";
import ServiceDetailContent from "@/components/service-detail-content";

export const revalidate = 60;

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

  const [data, pbResult] = await Promise.all([
    CMSAdapter.getServiceBySlug(slug, isDraftMode ? "draft" : "published"),
    fetchServicePageBuilderContent(slug),
  ]);

  if (!data) {
    notFound();
  }

  const templateData = pbResult
    ? {
        templateJson: pbResult.template,
        content: pbResult.data,
      }
    : null;

  return (
    <ServiceDetailContent
      data={data}
      templateData={templateData}
    />
  );
}

import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import CMSAdapter from "@/lib/cms-adapter";
import { transformServiceData } from "@/lib/service-transformers";
import {
  RoutineTemplate,
  DeepTemplate,
  MovingTemplate,
  PostConstructionTemplate,
  AirbnbTemplate,
  CommercialTemplate,
  ExtrasTemplate,
  OtherCommercialTemplate,
} from "@/components/service-templates";

export const revalidate = 60;

export async function generateStaticParams() {
  const services = await CMSAdapter.getAllServices();
  return services.map((s) => ({ slug: s.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

const TEMPLATE_MAP: Record<string, ComponentType<{ data: Record<string, any> }>> = {
  "routine-cleaning": RoutineTemplate,
  "deep-cleaning": DeepTemplate,
  "moving-cleaning": MovingTemplate,
  "post-construction-cleaning": PostConstructionTemplate,
  "airbnb-cleaning": AirbnbTemplate,
  "office-cleaning": CommercialTemplate,
  "gym-cleaning": CommercialTemplate,
  "medical-cleaning": CommercialTemplate,
  "retail-cleaning": CommercialTemplate,
  "school-cleaning": CommercialTemplate,
  "property-cleaning": CommercialTemplate,
  extras: ExtrasTemplate,
  "other-commercial": OtherCommercialTemplate,
  "other-commercial-cleaning": OtherCommercialTemplate,
};

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

  const Template = TEMPLATE_MAP[slug];
  if (!Template) {
    notFound();
  }

  const data = transformServiceData(slug, rawData as any);

  return <Template data={data} />;
}

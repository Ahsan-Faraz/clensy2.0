import type { ServiceDataBase } from "./types";

export type TemplateSlug =
  | "routine-cleaning"
  | "deep-cleaning"
  | "moving-cleaning"
  | "post-construction-cleaning"
  | "airbnb-cleaning"
  | "office-cleaning"
  | "gym-cleaning"
  | "medical-cleaning"
  | "retail-cleaning"
  | "school-cleaning"
  | "property-cleaning"
  | "extras"
  | "other-commercial";

/**
 * Unified transform — all services now use the same 7-section structure.
 * No slug-based switching needed.
 */
export function transformServiceData(
  _slug: string,
  data: ServiceDataBase
): Record<string, any> {
  return toUnifiedData(data);
}

function toUnifiedData(data: ServiceDataBase): Record<string, any> {
  const trustIndicators = data.serviceTrustIndicators?.length
    ? data.serviceTrustIndicators.map((t) => ({ number: t.number, text: t.text }))
    : [
        { number: "12K+", text: "Happy Customers" },
        { number: "24/7", text: "Customer Support" },
        { number: "4.9", text: "Average Rating", showStars: true },
        { number: "100%", text: "Satisfaction Guarantee" },
      ];

  return {
    name: data.name,
    slug: data.slug,
    serviceType: data.serviceType,
    heroTopLabel: data.heroTopLabel,
    heroHeading: data.heroHeading,
    heroSubheading: data.heroSubheading,
    heroBackgroundImage: data.heroBackgroundImage || data.heroBackgroundImageUrl,
    heroServiceDuration: data.heroServiceDuration,
    heroServiceGuarantee: data.heroServiceGuarantee,
    trustIndicators,
    includedSectionHeading: data.includedSectionHeading,
    includedSectionSubheading: data.includedSectionSubheading,
    cleaningAreas: (data.cleaningAreas || []).map((a) => ({
      ...a,
      image: a.image || a.imageUrl,
    })),
    whyChooseHeading: data.whyChooseHeading || "Why Choose Us",
    whyChooseSubheading: data.whyChooseSubheading || "",
    benefit1Title: data.benefit1Title || "",
    benefit1Description: data.benefit1Description || "",
    benefit1Icon: data.benefit1Icon || "",
    benefit2Title: data.benefit2Title || "",
    benefit2Description: data.benefit2Description || "",
    benefit2Icon: data.benefit2Icon || "",
    benefit3Title: data.benefit3Title || "",
    benefit3Description: data.benefit3Description || "",
    benefit3Icon: data.benefit3Icon || "",
    clientTestimonialsHeading: data.clientTestimonialsHeading || "What Our Clients Say",
    clientTestimonialsSubheading: data.clientTestimonialsSubheading || "",
    clientTestimonials: data.clientTestimonials || [],
    faqs: data.faqs || [],
  };
}

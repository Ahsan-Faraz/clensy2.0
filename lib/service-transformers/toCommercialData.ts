import type { ServiceDataBase } from "./types";

function fromStructOrCustom<T>(structured: T | null | undefined, fromCustom: T | null | undefined): T | null | undefined {
  return structured ?? fromCustom ?? null;
}

export function toCommercialData(data: ServiceDataBase & { serviceTrustIndicators?: any[]; businessBenefits?: any; specializedEquipment?: any; healthAndSafetyStandards?: any }): Record<string, any> {
  const areas = data.cleaningAreas || [];
  const cd = data.customData || {};

  const trustFromData = fromStructOrCustom(data.serviceTrustIndicators, cd.trustIndicators);
  const trustIndicators = trustFromData?.length
    ? trustFromData.map((t) => ({ number: t.number, text: t.text }))
    : [
        { number: "500+", text: "Corporate Clients" },
        { number: "24/7", text: "Business Support" },
        { number: "4.9", text: "Business Rating" },
        { number: "100%", text: "Satisfaction Guarantee" },
      ];

  return {
    name: data.name,
    heroTopLabel: data.heroTopLabel,
    heroHeading: data.heroHeading,
    heroSubheading: data.heroSubheading,
    heroBackgroundImage: data.heroBackgroundImage || data.heroBackgroundImageUrl,
    heroServiceDuration: data.heroServiceDuration,
    heroServiceGuarantee: data.heroServiceGuarantee,
    trustIndicator1Number: trustIndicators[0]?.number || "",
    trustIndicator1Text: trustIndicators[0]?.text || "",
    trustIndicator2Number: trustIndicators[1]?.number || "",
    trustIndicator2Text: trustIndicators[1]?.text || "",
    trustIndicator3Number: trustIndicators[2]?.number || "",
    trustIndicator3Text: trustIndicators[2]?.text || "",
    trustIndicator4Number: trustIndicators[3]?.number || "",
    trustIndicator4Text: trustIndicators[3]?.text || "",
    includedSectionHeading: data.includedSectionHeading,
    includedSectionSubheading: data.includedSectionSubheading,
    area1Title: areas[0]?.title || "",
    area1Description: areas[0]?.description || "",
    area1Features: areas[0]?.features || [],
    area2Title: areas[1]?.title || "",
    area2Description: areas[1]?.description || "",
    area2Features: areas[1]?.features || [],
    area3Title: areas[2]?.title || "",
    area3Description: areas[2]?.description || "",
    area3Features: areas[2]?.features || [],
    cleaningAreas: areas.map((a) => ({
      ...a,
      image: a.image || a.imageUrl,
    })),
    whyChooseHeading: data.whyChooseHeading || cd.whyChooseHeading || data.featureSectionHeading || "Why Choose Us",
    whyChooseSubheading: data.whyChooseSubheading || cd.whyChooseSubheading || data.featureSectionSubheading || "",
    feature1Title: data.benefit1Title || cd.feature1Title || "",
    feature1Description: data.benefit1Description || cd.feature1Description || "",
    feature1Icon: data.benefit1Icon || cd.feature1Icon || "",
    feature2Title: data.benefit2Title || cd.feature2Title || "",
    feature2Description: data.benefit2Description || cd.feature2Description || "",
    feature2Icon: data.benefit2Icon || cd.feature2Icon || "",
    feature3Title: data.benefit3Title || cd.feature3Title || "",
    feature3Description: data.benefit3Description || cd.feature3Description || "",
    feature3Icon: data.benefit3Icon || cd.feature3Icon || "",
    businessBenefits: fromStructOrCustom(data.businessBenefits, cd.businessBenefits),
    specializedEquipment: fromStructOrCustom(data.specializedEquipment, cd.specializedEquipment),
    healthAndSafetyStandards: fromStructOrCustom(data.healthAndSafetyStandards, cd.healthAndSafetyStandards),
    serviceType: data.serviceType,
    clientTestimonials: data.clientTestimonials || [],
    clientTestimonialsHeading: data.clientTestimonialsHeading || "What Our Clients Say",
    clientTestimonialsSubheading: data.clientTestimonialsSubheading || "",
    faqs: data.faqs || [],
  };
}

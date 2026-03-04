import type { ServiceDataBase } from "./types";

export function toOtherCommercialData(data: ServiceDataBase): Record<string, any> {
  const areas = data.cleaningAreas || [];
  const cd = data.customData || {};

  // Trust indicators: prefer structured top-level serviceTrustIndicators, then customData, then defaults
  const trustFromData = cd.trustIndicators;
  const trustIndicators = trustFromData?.length
    ? trustFromData
    : [
        { number: "600+", text: "Commercial Clients" },
        { number: "24/7", text: "Support" },
        { number: "4.9", text: "Rating", showStars: true },
        { number: "100%", text: "Satisfaction" },
      ];

  return {
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
    restaurantsTitle: areas[0]?.title || "",
    restaurantsDescription: areas[0]?.description || "",
    restaurantsFeatures: areas[0]?.features || [],
    warehousesTitle: areas[1]?.title || "",
    warehousesDescription: areas[1]?.description || "",
    warehousesFeatures: areas[1]?.features || [],
    worshipTitle: areas[2]?.title || "",
    worshipDescription: areas[2]?.description || "",
    worshipFeatures: areas[2]?.features || [],
    cleaningAreas: areas.map((a) => ({
      ...a,
      image: a.image || a.imageUrl,
    })),
    whyChooseHeading: data.whyChooseHeading || cd.whyChooseHeading || "Why Choose Us",
    whyChooseSubheading: data.whyChooseSubheading || cd.whyChooseSubheading || "",
    feature1Title: data.benefit1Title || cd.feature1Title || "",
    feature1Description: data.benefit1Description || cd.feature1Description || "",
    feature1Icon: data.benefit1Icon || cd.feature1Icon || "",
    feature2Title: data.benefit2Title || cd.feature2Title || "",
    feature2Description: data.benefit2Description || cd.feature2Description || "",
    feature2Icon: data.benefit2Icon || cd.feature2Icon || "",
    feature3Title: data.benefit3Title || cd.feature3Title || "",
    feature3Description: data.benefit3Description || cd.feature3Description || "",
    feature3Icon: data.benefit3Icon || cd.feature3Icon || "",
    pricingPlans: data.pricingPlans || cd.pricingPlans || [],
    pricingHeading: data.pricingHeading || cd.pricingHeading || "Tailored Cleaning Plans & Pricing",
    pricingSubheading: data.pricingSubheading || cd.pricingSubheading || "",
    pricingCustomSectionHeading: data.pricingCustomSectionHeading || cd.pricingCustomSectionHeading || "Need More Flexibility?",
    pricingCustomSectionDescription: data.pricingCustomSectionDescription || cd.pricingCustomSectionDescription || "",
    clientTestimonials: data.clientTestimonials || cd.clientTestimonials || [],
    faqs: data.faqs || [],
  };
}

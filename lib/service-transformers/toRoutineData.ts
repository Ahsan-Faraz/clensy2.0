import type { ServiceDataBase } from "./types";

export function toRoutineData(data: ServiceDataBase): Record<string, any> {
  const areas = data.cleaningAreas || [];
  const a0 = areas[0] || {};
  const a1 = areas[1] || {};
  const a2 = areas[2] || {};

  return {
    heroTopLabel: data.heroTopLabel,
    heroHeading: data.heroHeading,
    heroSubheading: data.heroSubheading,
    heroBackgroundImage: data.heroBackgroundImage || data.heroBackgroundImageUrl,
    heroServiceDuration: data.heroServiceDuration,
    heroServiceGuarantee: data.heroServiceGuarantee,
    includedSectionHeading: data.includedSectionHeading,
    includedSectionSubheading: data.includedSectionSubheading,
    kitchenTitle: a0.title,
    kitchenDescription: a0.description,
    kitchenFeatures: a0.features || [],
    bathroomTitle: a1.title,
    bathroomDescription: a1.description,
    bathroomFeatures: a1.features || [],
    livingAreasTitle: a2.title,
    livingAreasDescription: a2.description,
    livingAreasFeatures: a2.features || [],
    cleaningAreas: areas.map((a) => ({
      ...a,
      image: a.image || a.imageUrl,
    })),
    featureSectionHeading: data.featureSectionHeading,
    featureSectionSubheading: data.featureSectionSubheading,
    featureSectionImage: data.featureSectionImage,
    featureSectionPoints: data.featureSectionPoints || [],
    howItWorksHeading: data.howItWorksHeading,
    howItWorksSubheading: data.howItWorksSubheading,
    step1Title: data.step1Title,
    step1Description: data.step1Description,
    step1Image: data.step1Image,
    step2Title: data.step2Title,
    step2Description: data.step2Description,
    step2Image: data.step2Image,
    step3Title: data.step3Title,
    step3Description: data.step3Description,
    step3Image: data.step3Image,
    benefitsHeading: data.benefitsHeading,
    benefitsSubheading: data.benefitsSubheading,
    benefitsImage: data.benefitsImage,
    benefit1Title: data.benefit1Title,
    benefit1Description: data.benefit1Description,
    benefit2Title: data.benefit2Title,
    benefit2Description: data.benefit2Description,
    benefit3Title: data.benefit3Title,
    benefit3Description: data.benefit3Description,
    clientTestimonialsHeading: data.clientTestimonialsHeading,
    clientTestimonialsSubheading: data.clientTestimonialsSubheading,
    clientTestimonials: data.clientTestimonials || [],
    frequencyGuideHeading: data.frequencyGuideHeading,
    frequencyGuideSubheading: data.frequencyGuideSubheading,
    frequencyOptions: data.frequencyOptions || [],
    faqs: data.faqs || [],
    trustIndicators: data.customData?.trustIndicators || [
      { number: "12K+", text: "Happy Customers" },
      { number: "24/7", text: "Customer Support" },
      { number: "4.9", text: "Average Rating", showStars: true },
      { number: "100%", text: "Satisfaction Guarantee" },
    ],
  };
}

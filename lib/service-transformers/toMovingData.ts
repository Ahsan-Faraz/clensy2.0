import type { ServiceDataBase } from "./types";

function fromStructOrCustom<T>(structured: T | null | undefined, fromCustom: T | null | undefined): T | null | undefined {
  return structured ?? fromCustom ?? null;
}

export function toMovingData(data: ServiceDataBase & { reduceStressSection?: any; beforeAfter?: any; movingClientTestimonials?: any[]; benefit1Icon?: string; benefit2Icon?: string; benefit3Icon?: string }): Record<string, any> {
  const areas = data.cleaningAreas || [];
  const cd = data.customData || {};
  const beforeAfterItems = fromStructOrCustom(data.beforeAfter?.items, cd.beforeAfter?.items) || [];

  return {
    heroTopLabel: data.heroTopLabel,
    heroHeading: data.heroHeading,
    heroSubheading: data.heroSubheading,
    heroBackgroundImage: data.heroBackgroundImage || data.heroBackgroundImageUrl,
    heroServiceDuration: data.heroServiceDuration,
    heroServiceGuarantee: data.heroServiceGuarantee,
    includedSectionHeading: data.includedSectionHeading,
    includedSectionSubheading: data.includedSectionSubheading,
    moveOutTitle: areas[0]?.title || "",
    moveOutDescription: areas[0]?.description || "",
    moveOutFeatures: areas[0]?.features || [],
    moveInTitle: areas[1]?.title || "",
    moveInDescription: areas[1]?.description || "",
    moveInFeatures: areas[1]?.features || [],
    postRenovationTitle: areas[2]?.title || "",
    postRenovationDescription: areas[2]?.description || "",
    postRenovationFeatures: areas[2]?.features || [],
    cleaningAreas: areas.map((a) => ({
      ...a,
      image: a.image || a.imageUrl,
    })),
    beforeAfterHeading: (data.beforeAfter || cd.beforeAfter)?.heading || "Before & After",
    beforeAfterSubheading: (data.beforeAfter || cd.beforeAfter)?.subheading || "",
    MoveInCleaningDifference: beforeAfterItems.map((i: any) => ({
      beforeImage: i.beforeImage,
      afterImage: i.afterImage,
      heading: i.heading,
      caption: i.caption,
    })),
    benefitsHeading: data.benefitsHeading,
    benefitsSubheading: data.benefitsSubheading,
    benefit1Title: data.benefit1Title,
    benefit1Description: data.benefit1Description,
    benefit1Icon: data.benefit1Icon || cd.benefit1Icon || "",
    benefit2Title: data.benefit2Title,
    benefit2Description: data.benefit2Description,
    benefit2Icon: data.benefit2Icon || cd.benefit2Icon || "",
    benefit3Title: data.benefit3Title,
    benefit3Description: data.benefit3Description,
    benefit3Icon: data.benefit3Icon || cd.benefit3Icon || "",
    clientTestimonials: data.movingClientTestimonials || cd.clientTestimonials || data.clientTestimonials || [],
    reduceStressSection: fromStructOrCustom(data.reduceStressSection, cd.reduceStressSection) || null,
    faqs: data.faqs || [],
  };
}

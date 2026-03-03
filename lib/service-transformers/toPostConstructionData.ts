import type { ServiceDataBase } from "./types";

function fromStructOrCustom<T>(structured: T | null | undefined, fromCustom: T | null | undefined): T | null | undefined {
  return structured ?? fromCustom ?? null;
}

export function toPostConstructionData(data: ServiceDataBase & { beforeAfter?: any; postConstructionStep4Title?: string; postConstructionStep4Description?: string; postConstructionSafety?: any; postConstructionClientTestimonials?: any[] }): Record<string, any> {
  const areas = data.cleaningAreas || [];
  const cd = data.customData || {};
  const beforeAfterItems = fromStructOrCustom(data.beforeAfter?.items, cd.beforeAfter?.items) || [];
  const safety = fromStructOrCustom(data.postConstructionSafety, null);

  return {
    heroTopLabel: data.heroTopLabel,
    heroHeading: data.heroHeading,
    heroSubheading: data.heroSubheading,
    heroBackgroundImage: data.heroBackgroundImage || data.heroBackgroundImageUrl,
    heroServiceDuration: data.heroServiceDuration,
    heroServiceGuarantee: data.heroServiceGuarantee,
    includedSectionHeading: data.includedSectionHeading,
    includedSectionSubheading: data.includedSectionSubheading,
    debrisRemovalTitle: areas[0]?.title || "",
    debrisRemovalDescription: areas[0]?.description || "",
    debrisRemovalFeatures: areas[0]?.features || [],
    dustEliminationTitle: areas[1]?.title || "",
    dustEliminationDescription: areas[1]?.description || "",
    dustEliminationFeatures: areas[1]?.features || [],
    surfaceFinishingTitle: areas[2]?.title || "",
    surfaceFinishingDescription: areas[2]?.description || "",
    surfaceFinishingFeatures: areas[2]?.features || [],
    cleaningAreas: areas.map((a) => ({
      ...a,
      image: a.image || a.imageUrl,
    })),
    beforeAfterHeading: (data.beforeAfter || cd.beforeAfter)?.heading || "Before & After",
    beforeAfterSubheading: (data.beforeAfter || cd.beforeAfter)?.subheading || "",
    postConstructionDifference: beforeAfterItems,
    processHeading: cd.processHeading || "Our Post-Construction Process",
    processSubheading: cd.processSubheading || "",
    step1Title: data.step1Title || cd.step1Title || "",
    step1Description: data.step1Description || cd.step1Description || "",
    step2Title: data.step2Title || cd.step2Title || "",
    step2Description: data.step2Description || cd.step2Description || "",
    step3Title: data.step3Title || cd.step3Title || "",
    step3Description: data.step3Description || cd.step3Description || "",
    step4Title: data.postConstructionStep4Title || cd.step4Title || "",
    step4Description: data.postConstructionStep4Description || cd.step4Description || "",
    safetyHeading: safety?.heading || cd.safetyHeading || "Safety Standards",
    safetySubheading: safety?.subheading || cd.safetySubheading || "",
    ppeTitle: safety?.ppeTitle || cd.ppeTitle || "Personal Protective Equipment",
    ppeDescription: safety?.ppeDescription || cd.ppeDescription || "",
    ppeFeatures: safety?.ppeFeatures || cd.ppeFeatures || [],
    hazmatTitle: safety?.hazmatTitle || cd.hazmatTitle || "Hazardous Material Handling",
    hazmatDescription: safety?.hazmatDescription || cd.hazmatDescription || "",
    hazmatFeatures: safety?.hazmatFeatures || cd.hazmatFeatures || [],
    clientTestimonials: data.postConstructionClientTestimonials || cd.clientTestimonials || [],
    faqs: data.faqs || [],
  };
}

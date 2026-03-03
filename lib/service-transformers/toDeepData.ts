import type { ServiceDataBase } from "./types";

/** Transform string[] to ComparisonFeature[] for ComparisonSection */
function toComparisonFeatures(features: unknown): Array<{ title: string; description: string }> {
  if (!Array.isArray(features)) return [];
  return features.map((f) => {
    if (typeof f === "object" && f !== null && "title" in f && "description" in f) {
      return { title: String((f as any).title), description: String((f as any).description || "") };
    }
    return { title: String(f), description: "" };
  });
}

function fromStructOrCustom<T>(structured: T | null | undefined, fromCustom: T | null | undefined): T | null | undefined {
  return structured ?? fromCustom ?? null;
}

export function toDeepData(data: ServiceDataBase & { beforeAfter?: any; deepCleaningComparison?: any; whenToChoose?: any }): Record<string, any> {
  const areas = data.cleaningAreas || [];
  const cd = data.customData || {};
  const beforeAfterItems = fromStructOrCustom(data.beforeAfter?.items, cd.beforeAfter?.items) || [];
  let comparison = fromStructOrCustom(data.deepCleaningComparison, cd.comparison);
  if (comparison) {
    comparison = { ...comparison };
    if (comparison.regularCleaning?.features) {
      comparison.regularCleaning = {
        ...comparison.regularCleaning,
        features: toComparisonFeatures(comparison.regularCleaning.features),
      };
    }
    if (comparison.deepCleaning?.features) {
      comparison.deepCleaning = {
        ...comparison.deepCleaning,
        features: toComparisonFeatures(comparison.deepCleaning.features),
      };
    }
  }

  return {
    heroTopLabel: data.heroTopLabel,
    heroHeading: data.heroHeading,
    heroSubheading: data.heroSubheading,
    heroBackgroundImage: data.heroBackgroundImage || data.heroBackgroundImageUrl,
    heroServiceDuration: data.heroServiceDuration,
    heroServiceGuarantee: data.heroServiceGuarantee,
    includedSectionHeading: data.includedSectionHeading,
    includedSectionSubheading: data.includedSectionSubheading,
    bathroomTitle: areas[0]?.title || "",
    bathroomDescription: areas[0]?.description || "",
    bathroomFeatures: areas[0]?.features || [],
    kitchenTitle: areas[1]?.title || "",
    kitchenDescription: areas[1]?.description || "",
    kitchenFeatures: areas[1]?.features || [],
    livingAreasTitle: areas[2]?.title || "",
    livingAreasDescription: areas[2]?.description || "",
    livingAreasFeatures: areas[2]?.features || [],
    cleaningAreas: areas.map((a) => ({
      ...a,
      image: a.image || a.imageUrl,
    })),
    differenceHeading: beforeAfterItems[0] ? (data.beforeAfter || cd.beforeAfter)?.heading || "Before & After" : "",
    differenceSubheading: (data.beforeAfter || cd.beforeAfter)?.subheading || "",
    deepCleaningDifference: beforeAfterItems,
    whenToChoose: fromStructOrCustom(data.whenToChoose, cd.whenToChoose),
    comparison,
    clientReviewsHeading: data.clientTestimonialsHeading,
    clientReviewsSubheading: data.clientTestimonialsSubheading,
    clientReviews: data.clientTestimonials || [],
    faqs: data.faqs || [],
  };
}

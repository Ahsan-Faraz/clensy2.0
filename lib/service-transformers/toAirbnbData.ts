import type { ServiceDataBase } from "./types";

function fromStructOrCustom<T>(structured: T | null | undefined, fromCustom: T | null | undefined): T | null | undefined {
  return structured ?? fromCustom ?? null;
}

export function toAirbnbData(data: ServiceDataBase & { beforeAfter?: any; successStories?: any; serviceFeatures?: any[] }): Record<string, any> {
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
    bedroomsTitle: areas[0]?.title || "",
    bedroomsDescription: areas[0]?.description || "",
    bedroomsImage: areas[0]?.image || areas[0]?.imageUrl || "",
    bedroomsFeatures: areas[0]?.features || [],
    bathroomsTitle: areas[1]?.title || "",
    bathroomsDescription: areas[1]?.description || "",
    bathroomsImage: areas[1]?.image || areas[1]?.imageUrl || "",
    bathroomsFeatures: areas[1]?.features || [],
    kitchenTitle: areas[2]?.title || "",
    kitchenDescription: areas[2]?.description || "",
    kitchenImage: areas[2]?.image || areas[2]?.imageUrl || "",
    kitchenFeatures: areas[2]?.features || [],
    cleaningAreas: areas.map((a) => ({
      ...a,
      image: a.image || a.imageUrl,
    })),
    beforeAfterHeading: (data.beforeAfter || cd.beforeAfter)?.heading || "Before & After",
    beforeAfterSubheading: (data.beforeAfter || cd.beforeAfter)?.subheading || "",
    airBNBCleaningDifference: beforeAfterItems,
    benefitsHeading: data.benefitsHeading,
    benefitsSubheading: data.benefitsSubheading,
    benefit1Title: data.benefit1Title,
    benefit1Description: data.benefit1Description,
    benefit1Icon: cd.benefit1Icon || "",
    benefit2Title: data.benefit2Title,
    benefit2Description: data.benefit2Description,
    benefit2Icon: cd.benefit2Icon || "",
    benefit3Title: data.benefit3Title,
    benefit3Description: data.benefit3Description,
    benefit3Icon: cd.benefit3Icon || "",
    serviceFeatures: fromStructOrCustom(data.serviceFeatures, cd.serviceFeatures) || [],
    successStoriesHeading: (data.successStories || cd.successStories)?.heading,
    successStoriesSubheading: (data.successStories || cd.successStories)?.subheading,
    successStories: ((data.successStories || cd.successStories)?.items || []).map((s: any) => ({
      propertyName: s.title,
      metric: s.metric,
      quote: s.description,
      author: s.hostName,
      role: s.hostTitle,
      avatarColor: s.avatarColor || "blue-500",
    })),
    faqs: data.faqs || [],
  };
}

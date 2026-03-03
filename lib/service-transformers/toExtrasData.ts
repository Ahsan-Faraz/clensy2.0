import type { ServiceDataBase } from "./types";

/** Prefer structured Strapi components over customData when present */
function fromStructuredOrCustom<T>(structured: T[] | null | undefined, fromCustom: T[] | undefined, fallback: T[]): T[] {
  if (structured?.length) return structured;
  if (fromCustom?.length) return fromCustom;
  return fallback;
}

export function toExtrasData(data: ServiceDataBase & {
  extrasPricing?: any[];
  premiumExtraServices?: any[];
  howToAddExtraServicesSteps?: any[];
  extrasTrustIndicators?: any[];
  extrasClientTestimonials?: any[];
  pricingHeading?: string | null;
  pricingSubheading?: string | null;
}): Record<string, any> {
  const areas = data.cleaningAreas || [];
  const cd = data.customData || {};

  const trustIndicators = fromStructuredOrCustom(
    data.extrasTrustIndicators,
    cd.trustIndicators,
    [
      { number: "8+", text: "Extra Services" },
      { number: "100%", text: "Customizable" },
      { number: "5.0", text: "Satisfaction Rating", showStars: true },
      { number: "1000+", text: "Extra Services Completed" },
    ]
  );

  const idToArea: Record<string, any> = {};
  areas.forEach((a: any) => {
    const t = (a.title || "").toLowerCase();
    if (t.includes("window")) idToArea.windows = a;
    else if (t.includes("refrigerator") || t.includes("fridge")) idToArea.fridge = a;
    else if (t.includes("oven")) idToArea.oven = a;
    else if (t.includes("cabinet")) idToArea.cabinets = a;
    else if (t.includes("laundry")) idToArea.laundry = a;
    else if (t.includes("blind")) idToArea["wet-wipe-blinds"] = a;
    else if (t.includes("dish")) idToArea["wash-dishes"] = a;
  });

  const fromStructuredPremium = data.premiumExtraServices?.length ? data.premiumExtraServices : null;
  const fromCustomPremium = cd.premiumExtraServices;
  const premiumExtras = (fromStructuredPremium || fromCustomPremium || areas).map((e: any, i: number) => {
    const fromArea = typeof e.title !== "undefined";
    const id = e.serviceId || e.id || (fromArea ? e.title?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") : `extra-${i}`);
    const areaMatch = idToArea[id] || areas.find((a: any) =>
      (a.title || "").toLowerCase().includes((e.name || e.title || "").split(" ")[0]?.toLowerCase() || "")
    );
    return {
      id,
      name: e.name || e.title,
      description: e.description || "",
      image: e.image || e.imageUrl || areaMatch?.imageUrl || areaMatch?.image,
      features: e.features?.length ? e.features : (areaMatch?.features || []),
      price: e.price,
      priceUnit: e.priceUnit,
      icon: e.icon,
    };
  });

  const howToAddExtraServicesSteps = fromStructuredOrCustom(
    data.howToAddExtraServicesSteps,
    cd.howToAddExtraServicesSteps,
    [
      { stepNumber: 1, title: data.step1Title, description: data.step1Description, badge: "8+ specialized extra services available", icon: "Sparkles" },
      { stepNumber: 2, title: data.step2Title, description: data.step2Description, badge: "Mix and match any combination of services", icon: "Check" },
      { stepNumber: 3, title: data.step3Title, description: data.step3Description, badge: "Same-day and next-day scheduling available", icon: "Calendar" },
    ]
  ).map((s: any) => ({
    stepNumber: s.stepNumber,
    title: s.title,
    description: s.description,
    badge: s.badge || "",
    icon: s.icon || "Plus",
  }));

  const fromStructuredPricing = data.extrasPricing?.length ? data.extrasPricing : null;
  const fromCustomPricing = cd.extrasPricing;
  const fromPremiumPricing = premiumExtras.map((e: any) => ({
    serviceId: e.id,
    serviceName: e.name,
    price: e.price || "",
    priceUnit: e.priceUnit || "per service",
    features: e.features || [],
  }));
  const extrasPricing = (fromStructuredPricing || fromCustomPricing || fromPremiumPricing).map((p: any) => ({
    ...p,
    features: p.features?.length ? p.features : (areas.find((a: any) => (a.title || "").toLowerCase().includes((p.serviceName || "").split(" ")[0]?.toLowerCase()))?.features || []),
  }));

  const clientTestimonials = fromStructuredOrCustom(
    data.extrasClientTestimonials,
    cd.clientTestimonials,
    []
  );

  return {
    heroTopLabel: data.heroTopLabel,
    heroHeading: data.heroHeading,
    heroSubheading: data.heroSubheading,
    heroBackgroundImage: data.heroBackgroundImage || (data as any).heroBackgroundImageUrl,
    heroServiceDuration: data.heroServiceDuration,
    heroServiceGuarantee: data.heroServiceGuarantee,
    trustIndicators,
    extrasHeading: data.includedSectionHeading || "Our Premium Extra Services",
    extrasSubheading: data.includedSectionSubheading || "",
    premiumExtraServices: premiumExtras,
    howItWorksHeading: data.howItWorksHeading || "How To Add Extra Services",
    howItWorksSubheading: data.howItWorksSubheading || "",
    howToAddExtraServicesSteps,
    extrasPricing,
    clientTestimonials,
    pricingHeading: data.pricingHeading ?? cd.pricingHeading ?? "Extras Pricing",
    pricingSubheading: data.pricingSubheading ?? cd.pricingSubheading ?? "",
    faqs: data.faqs || [],
  };
}

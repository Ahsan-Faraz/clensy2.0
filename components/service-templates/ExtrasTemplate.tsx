"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import CTASection from "@/components/cta-section";
import {
  ServiceHeroSection,
  TrustIndicatorsSection,
  HowToAddExtrasSection,
  ExtrasPricingSection,
  TestimonialsSection,
  FAQSection,
} from "@/components/service-sections";

const EXTRAS_ICON_MAP: Record<string, keyof typeof LucideIcons> = {
  windows: "Droplets",
  fridge: "Utensils",
  oven: "Sparkles",
  cabinets: "FolderOpen",
  organization: "FolderOpen",
  laundry: "Shirt",
  "wet-wipe-blinds": "Droplets",
  "wash-dishes": "Utensils",
  Sparkles: "Sparkles",
  Droplets: "Droplets",
  Utensils: "Utensils",
  FolderOpen: "FolderOpen",
  Shirt: "Shirt",
  Plus: "Plus",
  Check: "Check",
  Shield: "Shield",
  ArrowRight: "ArrowRight",
};

function getExtrasIcon(iconName: string) {
  const key = iconName || "Plus";
  const componentName = EXTRAS_ICON_MAP[key] || EXTRAS_ICON_MAP[iconName] || "Plus";
  return (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[componentName] || LucideIcons.Plus;
}

interface ExtrasTemplateProps {
  data: Record<string, any>;
}

export default function ExtrasTemplate({ data }: ExtrasTemplateProps) {
  const [activeExtra, setActiveExtra] = useState(data.premiumExtraServices?.[0]?.id || data.premiumExtraServices?.[0]?.serviceId || "windows");
  const extras = (data.premiumExtraServices || []).map((e: any) => ({
    ...e,
    id: e.id || e.serviceId,
  }));
  const activeItem = extras.find((e: any) => e.id === activeExtra) || extras[0];

  const steps = (data.howToAddExtraServicesSteps || [
    { stepNumber: 1, title: data.step1Title, description: data.step1Description },
    { stepNumber: 2, title: data.step2Title, description: data.step2Description },
    { stepNumber: 3, title: data.step3Title, description: data.step3Description },
  ]).filter((s: any) => s.title);

  const pricingCards = (data.extrasPricing || data.premiumExtraServices || [])
    .filter((e: any) => e.price)
    .map((e: any) => ({
      serviceId: e.serviceId || e.id,
      serviceName: e.serviceName || e.name,
      price: e.price,
      priceUnit: e.priceUnit || "per service",
      features: e.features || [],
    }));

  // Trust indicators - handle both flat fields and array format
  const trustIndicators = data.trustIndicators || data.extrasTrustIndicators || [
    { number: data.trustIndicator1Number, text: data.trustIndicator1Text },
    { number: data.trustIndicator2Number, text: data.trustIndicator2Text },
    { number: data.trustIndicator3Number, text: data.trustIndicator3Text },
    { number: data.trustIndicator4Number, text: data.trustIndicator4Text },
  ].filter((t: any) => t.number || t.text);

  // Build heading highlight for "Services" keyword
  const heroHeading = data.heroHeading || "";
  const headingHighlight = heroHeading.includes("Services")
    ? {
        before: heroHeading.split("Services")[0],
        highlight: "Services",
        after: heroHeading.split("Services").slice(1).join("Services"),
      }
    : undefined;

  return (
    <main className="overflow-x-hidden">
      <ServiceHeroSection
        heroTopLabel={data.heroTopLabel}
        heroHeading={heroHeading}
        heroSubheading={data.heroSubheading}
        heroBackgroundImage={data.heroBackgroundImage}
        heroServiceDuration={data.heroServiceDuration}
        heroServiceGuarantee={data.heroServiceGuarantee}
        heroAccentColor="blue"
        badgeText="Customizable Extras"
        badgeVariant="solid"
        headingHighlight={headingHighlight}
      />
      <TrustIndicatorsSection indicators={trustIndicators} />
      {extras.length > 0 && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{data.extrasHeading || data.includedSectionHeading}</h2>
              <p className="text-lg text-gray-600">{data.extrasSubheading || data.includedSectionSubheading}</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-10">
              {extras.slice(0, 8).map((extra: any) => {
                const IconComponent = getExtrasIcon(extra.icon || extra.id);
                return (
                  <div
                    key={extra.id}
                    onClick={() => setActiveExtra(extra.id)}
                    className={`rounded-lg p-4 cursor-pointer transition-all flex items-center ${
                      activeExtra === extra.id ? "bg-blue-100 border-l-4 border-blue-600" : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-full mr-3 flex-shrink-0 ${
                        activeExtra === extra.id ? "bg-blue-600 text-white" : "bg-gray-200"
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{extra.name}</h3>
                      <p className="text-xs text-gray-500">{extra.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            {activeItem && (
              <div className="bg-gray-50 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <div className="relative h-[300px] lg:h-full">
                    <Image
                      src={activeItem.image || "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750845184/image74_pnropc.png"}
                      alt={activeItem.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold mb-4">{activeItem.name}</h3>
                    <p className="text-gray-600 mb-6">{activeItem.description}</p>
                    <ul className="space-y-3">
                      {(activeItem.features || []).map((f: string, i: number) => (
                        <li key={i} className="flex items-start">
                          <LucideIcons.Check className="h-5 w-5 mr-3 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8">
                      <Link
                        href="/booking"
                        className="bg-blue-600 text-white hover:bg-blue-500 px-6 py-2 rounded-lg text-sm font-medium inline-flex items-center transition-all duration-300"
                      >
                        Add This Service <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
      <HowToAddExtrasSection
        heading={data.howItWorksHeading}
        subheading={data.howItWorksSubheading}
        steps={steps.map((s: any) => ({
          stepNumber: s.stepNumber,
          title: s.title,
          description: s.description,
          badge: s.badge,
          icon: s.icon,
        }))}
        mockupExtras={(data.premiumExtraServices || [])
          .filter((e: any) => e.price)
          .slice(0, 4)
          .map((e: any) => ({
            name: e.name,
            price: e.price,
            priceUnit: e.priceUnit,
          }))}
      />
      {pricingCards.length > 0 && (
        <ExtrasPricingSection
          heading={data.pricingHeading || "Extras Pricing"}
          subheading={data.pricingSubheading || "Transparent pricing for our most popular extra services."}
          cards={pricingCards}
        />
      )}
      {(data.clientTestimonials?.length ?? 0) > 0 && (
        <TestimonialsSection
          heading="What Our Clients Say"
          subheading="Hear from clients who have enhanced their cleaning experience with our extra services."
          testimonials={data.clientTestimonials}
        />
      )}
      <FAQSection faqs={data.faqs || []} />
      <CTASection />
    </main>
  );
}

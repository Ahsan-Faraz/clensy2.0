"use client";

import CTASection from "@/components/cta-section";
import {
  ServiceHeroSection,
  TrustIndicatorsSection,
  CleaningAreasSection,
  BenefitsSection,
  TestimonialsSection,
  FAQSection,
} from "@/components/service-sections";

interface UnifiedTemplateProps {
  data: Record<string, any>;
}

/**
 * Unified service template — 7 sections for ALL service types:
 * 1. Hero
 * 2. Trust Indicators
 * 3. What's Included (Zig-Zag cleaning areas)
 * 4. Why Choose This Service (benefits)
 * 5. Testimonials
 * 6. FAQs
 * 7. CTA
 */
export default function UnifiedTemplate({ data }: UnifiedTemplateProps) {
  const cleaningAreas =
    data.cleaningAreas?.map((a: any) => ({
      ...a,
      image: a.image || a.imageUrl,
    })) || [];

  const trustIndicators = data.trustIndicators || [];

  const benefits = [
    { title: data.benefit1Title, description: data.benefit1Description, icon: data.benefit1Icon },
    { title: data.benefit2Title, description: data.benefit2Description, icon: data.benefit2Icon },
    { title: data.benefit3Title, description: data.benefit3Description, icon: data.benefit3Icon },
  ].filter((b) => b.title);

  return (
    <main className="overflow-x-hidden">
      <ServiceHeroSection
        heroTopLabel={data.heroTopLabel}
        heroHeading={data.heroHeading}
        heroSubheading={data.heroSubheading}
        heroBackgroundImage={data.heroBackgroundImage}
        heroServiceDuration={data.heroServiceDuration}
        heroServiceGuarantee={data.heroServiceGuarantee}
        heroAccentColor="blue"
        ctaText="Get a Free Quote"
        ctaLink="/contact"
      />
      {trustIndicators.length > 0 && (
        <TrustIndicatorsSection indicators={trustIndicators} />
      )}
      {cleaningAreas.length > 0 && (
        <CleaningAreasSection
          heading={data.includedSectionHeading}
          subheading={data.includedSectionSubheading}
          areas={cleaningAreas}
        />
      )}
      {benefits.length > 0 && (
        <BenefitsSection
          heading={data.whyChooseHeading || "Why Choose Us"}
          subheading={data.whyChooseSubheading || ""}
          benefits={benefits}
        />
      )}
      {(data.clientTestimonials?.length ?? 0) > 0 && (
        <TestimonialsSection
          heading={data.clientTestimonialsHeading || "What Our Clients Say"}
          subheading={data.clientTestimonialsSubheading || ""}
          testimonials={data.clientTestimonials || []}
        />
      )}
      <FAQSection faqs={data.faqs || []} />
      <CTASection />
    </main>
  );
}

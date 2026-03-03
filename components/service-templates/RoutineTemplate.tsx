"use client";

import CTASection from "@/components/cta-section";
import {
  ServiceHeroSection,
  TrustIndicatorsSection,
  CleaningAreasSection,
  FeatureSection,
  HowItWorksSection,
  BenefitsSection,
  TestimonialsSection,
  FrequencyGuideSection,
  FAQSection,
} from "@/components/service-sections";

interface RoutineTemplateProps {
  data: Record<string, any>;
}

export default function RoutineTemplate({ data }: RoutineTemplateProps) {
  const cleaningAreas = data.cleaningAreas?.map((a: any) => ({
    ...a,
    image: a.image || a.imageUrl,
  })) || [];

  const steps = [
    { title: data.step1Title, description: data.step1Description, image: data.step1Image, badge: "Instant Online Pricing" },
    { title: data.step2Title, description: data.step2Description, image: data.step2Image, linkHref: "/company/checklist", linkText: "See Our Checklist" },
    { title: data.step3Title, description: data.step3Description, image: data.step3Image, linkText: "See Pricing", linkHref: "/booking" },
  ];

  const benefits = [
    { title: data.benefit1Title, description: data.benefit1Description },
    { title: data.benefit2Title, description: data.benefit2Description },
    { title: data.benefit3Title, description: data.benefit3Description },
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
        heroAccentColor="green"
        ctaText="Get a Free Quote"
        ctaLink="/contact"
      />
      <TrustIndicatorsSection indicators={data.trustIndicators} />
      <CleaningAreasSection
        heading={data.includedSectionHeading}
        subheading={data.includedSectionSubheading}
        areas={cleaningAreas}
      />
      <FeatureSection
        heading={data.featureSectionHeading}
        subheading={data.featureSectionSubheading}
        image={data.featureSectionImage}
        points={data.featureSectionPoints || []}
      />
      <HowItWorksSection
        heading={data.howItWorksHeading}
        subheading={data.howItWorksSubheading}
        steps={steps}
      />
      <BenefitsSection
        heading={data.benefitsHeading}
        subheading={data.benefitsSubheading}
        image={data.benefitsImage}
        benefits={benefits}
      />
      <TestimonialsSection
        heading={data.clientTestimonialsHeading}
        subheading={data.clientTestimonialsSubheading}
        testimonials={data.clientTestimonials || []}
      />
      <FrequencyGuideSection
        heading={data.frequencyGuideHeading}
        subheading={data.frequencyGuideSubheading}
        options={data.frequencyOptions || []}
      />
      <FAQSection faqs={data.faqs || []} />
      <CTASection />
    </main>
  );
}

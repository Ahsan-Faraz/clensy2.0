"use client";

import CTASection from "@/components/cta-section";
import {
  ServiceHeroSection,
  CleaningAreasSection,
  BeforeAfterSection,
  BenefitsDarkSection,
  SuccessStoriesSection,
  FAQSection,
} from "@/components/service-sections";

interface AirbnbTemplateProps {
  data: Record<string, any>;
}

export default function AirbnbTemplate({ data }: AirbnbTemplateProps) {
  const cleaningAreas = data.cleaningAreas?.map((a: any) => ({
    ...a,
    image: a.image || a.imageUrl,
  })) || [];
  const beforeAfter = data.airBNBCleaningDifference || [];
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
        ctaText="Schedule Cleaning"
        ctaLink="/contact"
      />
      <CleaningAreasSection
        heading={data.includedSectionHeading}
        subheading={data.includedSectionSubheading}
        areas={cleaningAreas}
      />
      {beforeAfter.length > 0 && (
        <BeforeAfterSection
          heading={data.beforeAfterHeading}
          subheading={data.beforeAfterSubheading}
          items={beforeAfter}
          afterLabelColor="blue"
        />
      )}
      <BenefitsDarkSection
        heading={data.benefitsHeading}
        subheading={data.benefitsSubheading}
        benefits={benefits}
        accentColor="blue"
      />
      <SuccessStoriesSection
        heading={data.successStoriesHeading}
        subheading={data.successStoriesSubheading}
        stories={data.successStories}
      />
      <FAQSection faqs={data.faqs || []} subheading="Common questions about our Airbnb cleaning services." />
      <CTASection />
    </main>
  );
}

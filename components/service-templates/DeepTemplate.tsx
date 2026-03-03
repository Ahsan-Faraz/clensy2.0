"use client";

import CTASection from "@/components/cta-section";
import {
  ServiceHeroSection,
  CleaningAreasSection,
  BeforeAfterSection,
  WhenToChooseSection,
  ComparisonSection,
  TestimonialsSection,
  FAQSection,
} from "@/components/service-sections";

interface DeepTemplateProps {
  data: Record<string, any>;
}

export default function DeepTemplate({ data }: DeepTemplateProps) {
  const cleaningAreas = data.cleaningAreas?.map((a: any) => ({
    ...a,
    image: a.image || a.imageUrl,
  })) || [];
  const beforeAfter = data.deepCleaningDifference || [];
  const whenToChoose = data.whenToChoose?.options || [];
  const comparison = data.comparison;

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
        badgeText="Deep Cleaning Experts"
      />
      <CleaningAreasSection
        heading={data.includedSectionHeading}
        subheading={data.includedSectionSubheading}
        areas={cleaningAreas}
      />
      {beforeAfter.length > 0 && (
        <BeforeAfterSection
          heading={data.differenceHeading}
          subheading={data.differenceSubheading}
          items={beforeAfter}
          afterLabelColor="green"
        />
      )}
      {whenToChoose.length > 0 && (
        <WhenToChooseSection
          heading={data.whenToChoose?.heading}
          subheading={data.whenToChoose?.subheading}
          options={whenToChoose}
        />
      )}
      <TestimonialsSection
        heading={data.clientReviewsHeading}
        subheading={data.clientReviewsSubheading}
        testimonials={data.clientReviews || []}
      />
      {comparison?.regularCleaning && comparison?.deepCleaning && (
        <ComparisonSection
          heading={comparison.heading}
          subheading={comparison.subheading || ""}
          regularCleaning={comparison.regularCleaning}
          deepCleaning={comparison.deepCleaning}
        />
      )}
      <FAQSection faqs={data.faqs || []} />
      <CTASection />
    </main>
  );
}

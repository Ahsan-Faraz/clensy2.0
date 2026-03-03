"use client";

import CTASection from "@/components/cta-section";
import {
  ServiceHeroSection,
  CleaningAreasSection,
  BeforeAfterSection,
  BenefitsDarkSection,
  ReduceStressSection,
  TestimonialsSection,
  FAQSection,
} from "@/components/service-sections";

interface MovingTemplateProps {
  data: Record<string, any>;
}

export default function MovingTemplate({ data }: MovingTemplateProps) {
  const cleaningAreas = data.cleaningAreas?.map((a: any) => ({
    ...a,
    image: a.image || a.imageUrl,
  })) || [];
  const beforeAfter = (data.MoveInCleaningDifference || []).map((i: any) => ({
    heading: i.heading,
    beforeImage: i.beforeImage,
    afterImage: i.afterImage,
    caption: i.caption,
  }));

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
        heroAccentColor="green"
        badgeText="Move-In Cleaning Experts"
        headingHighlight={{ before: "Fresh Start, ", highlight: "Clean Slate", after: "" }}
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
          afterLabelColor="green"
        />
      )}
      <BenefitsDarkSection
        heading={data.benefitsHeading}
        subheading={data.benefitsSubheading}
        benefits={benefits}
        accentColor="green"
      />
      {data.reduceStressSection && data.reduceStressSection.benefits?.length > 0 && (
        <ReduceStressSection
          heading={data.reduceStressSection.heading || "Reduce Your Moving Stress"}
          intro={data.reduceStressSection.intro || data.reduceStressSection.description || ""}
          imageUrl={data.reduceStressSection.imageUrl}
          benefitsSubheading={data.reduceStressSection.benefitsSubheading || "How Professional Moving Cleaning Helps"}
          benefits={data.reduceStressSection.benefits}
        />
      )}
      {(data.clientTestimonials?.length ?? 0) > 0 && (
        <TestimonialsSection
          heading="What Our Clients Say"
          subheading="Read testimonials from customers who have used our moving cleaning services."
          testimonials={data.clientTestimonials}
        />
      )}
      <FAQSection faqs={data.faqs || []} subheading="Get answers to common questions about our moving cleaning services." />
      <CTASection />
    </main>
  );
}

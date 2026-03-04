"use client";

import CTASection from "@/components/cta-section";
import {
  ServiceHeroSection,
  TrustIndicatorsSection,
  CleaningAreasSection,
  BenefitsSection,
  BusinessBenefitsSection,
  SpecializedEquipmentSection,
  HealthAndSafetySection,
  TestimonialsSection,
  FAQSection,
} from "@/components/service-sections";

interface CommercialTemplateProps {
  data: Record<string, any>;
}

export default function CommercialTemplate({ data }: CommercialTemplateProps) {
  const cleaningAreas = data.cleaningAreas?.map((a: any) => ({
    ...a,
    image: a.image || a.imageUrl,
  })) || [];

  const trustIndicators = [
    { number: data.trustIndicator1Number, text: data.trustIndicator1Text },
    { number: data.trustIndicator2Number, text: data.trustIndicator2Text },
    { number: data.trustIndicator3Number, text: data.trustIndicator3Text, showStars: data.trustIndicator3Number?.includes(".") },
    { number: data.trustIndicator4Number, text: data.trustIndicator4Text },
  ].filter((t) => t.number || t.text);

  // Why Choose Us: pass icon field from data (can be Lucide name or image URL)
  const benefits = [
    { title: data.feature1Title, description: data.feature1Description, icon: data.feature1Icon },
    { title: data.feature2Title, description: data.feature2Description, icon: data.feature2Icon },
    { title: data.feature3Title, description: data.feature3Description, icon: data.feature3Icon },
  ].filter((b) => b.title);

  // Gym uses dark variant for Why Choose section
  const benefitsVariant = data.serviceType === "gym" ? "dark" : "light";

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
        badgeText={`${data.name?.split(" ")[0] || "Professional"} Cleaning Experts`}
      />
      {trustIndicators.length > 0 && (
        <TrustIndicatorsSection indicators={trustIndicators} />
      )}
      <CleaningAreasSection
        heading={data.includedSectionHeading}
        subheading={data.includedSectionSubheading}
        areas={cleaningAreas}
      />
      {/* Office: Business Benefits section comes AFTER Why Choose */}
      <BenefitsSection
        heading={data.whyChooseHeading}
        subheading={data.whyChooseSubheading}
        benefits={benefits}
        variant={benefitsVariant as "light" | "dark"}
      />
      {data.serviceType === "office" && data.businessBenefits?.cards?.length > 0 && (
        <BusinessBenefitsSection
          heading={data.businessBenefits.heading}
          subheading={data.businessBenefits.subheading}
          cards={data.businessBenefits.cards}
        />
      )}
      {data.serviceType === "gym" && data.specializedEquipment?.items?.length > 0 && (
        <SpecializedEquipmentSection
          heading={data.specializedEquipment.heading}
          subheading={data.specializedEquipment.subheading}
          items={data.specializedEquipment.items}
        />
      )}
      {data.serviceType === "gym" && data.healthAndSafetyStandards?.items?.length > 0 && (
        <HealthAndSafetySection
          heading={data.healthAndSafetyStandards.heading}
          subheading={data.healthAndSafetyStandards.subheading}
          image={data.healthAndSafetyStandards.image}
          items={data.healthAndSafetyStandards.items}
        />
      )}
      {(data.clientTestimonials?.length ?? 0) > 0 && (
        <TestimonialsSection
          heading={data.clientTestimonialsHeading || "What Our Business Clients Say"}
          subheading={data.clientTestimonialsSubheading || "Discover why businesses trust us for their professional cleaning needs."}
          testimonials={data.clientTestimonials || []}
        />
      )}
      <FAQSection
        faqs={data.faqs || []}
        variant={data.serviceType === "office" ? "dark" : "light"}
      />
      <CTASection />
    </main>
  );
}

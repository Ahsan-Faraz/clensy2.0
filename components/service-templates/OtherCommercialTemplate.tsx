"use client";

import Link from "next/link";
import CTASection from "@/components/cta-section";
import {
  ServiceHeroSection,
  TrustIndicatorsSection,
  CleaningAreasSection,
  BenefitsSection,
  TestimonialsSection,
  FAQSection,
} from "@/components/service-sections";

interface OtherCommercialTemplateProps {
  data: Record<string, any>;
}

export default function OtherCommercialTemplate({ data }: OtherCommercialTemplateProps) {
  const cleaningAreas = data.cleaningAreas?.map((a: any) => ({
    ...a,
    image: a.image || a.imageUrl,
  })) || [];

  const trustIndicators = [
    { number: data.trustIndicator1Number, text: data.trustIndicator1Text },
    { number: data.trustIndicator2Number, text: data.trustIndicator2Text },
    { number: data.trustIndicator3Number, text: data.trustIndicator3Text, showStars: true },
    { number: data.trustIndicator4Number, text: data.trustIndicator4Text },
  ].filter((t) => t.number || t.text);

  const benefits = [
    { title: data.feature1Title, description: data.feature1Description },
    { title: data.feature2Title, description: data.feature2Description },
    { title: data.feature3Title, description: data.feature3Description },
  ].filter((b) => b.title);

  const pricingPlans = data.pricingPlans || [];

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
      />
      <TrustIndicatorsSection indicators={trustIndicators} />
      <CleaningAreasSection
        heading={data.includedSectionHeading}
        subheading={data.includedSectionSubheading}
        areas={cleaningAreas}
      />
      {pricingPlans.length > 0 && (
        <section className="py-24 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{data.pricingHeading}</h2>
              <p className="text-lg text-gray-600">{data.pricingSubheading}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan: any, i: number) => (
                <div
                  key={i}
                  className={`bg-white rounded-2xl p-8 shadow-lg ${
                    plan.isPopular ? "ring-2 ring-blue-500 relative" : ""
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-sm px-4 py-1 rounded-full">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2">{plan.planName}</h3>
                  <p className="text-2xl font-bold text-blue-600 mb-4">{plan.planPrice}</p>
                  <ul className="space-y-2 mb-6">
                    {(plan.planFeatures || []).map((f: string, j: number) => (
                      <li key={j} className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.planButtonLink || "/contact"}
                    className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-medium hover:bg-blue-700"
                  >
                    {plan.planButtonText || "Get Quote"}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      <BenefitsSection
        heading={data.whyChooseHeading}
        subheading={data.whyChooseSubheading}
        benefits={benefits}
      />
      {(data.clientTestimonials?.length ?? 0) > 0 && (
        <TestimonialsSection
          heading="What Our Clients Say"
          subheading="Discover why businesses across different industries trust us for their cleaning needs."
          testimonials={data.clientTestimonials}
        />
      )}
      <FAQSection faqs={data.faqs || []} />
      <CTASection />
    </main>
  );
}

"use client";

import Link from "next/link";
import { Check } from "lucide-react";
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

function getPlanColorClasses(color: string) {
  switch (color) {
    case "blue-600":
      return { bg: "bg-blue-600", hover: "hover:bg-blue-700" };
    case "blue-700":
      return { bg: "bg-blue-700", hover: "hover:bg-blue-800" };
    case "blue-800":
      return { bg: "bg-blue-800", hover: "hover:bg-blue-900" };
    case "indigo-600":
      return { bg: "bg-indigo-600", hover: "hover:bg-indigo-700" };
    case "purple-600":
      return { bg: "bg-purple-600", hover: "hover:bg-purple-700" };
    case "green-600":
      return { bg: "bg-green-600", hover: "hover:bg-green-700" };
    default:
      return { bg: "bg-blue-600", hover: "hover:bg-blue-700" };
  }
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
    { title: data.feature1Title, description: data.feature1Description, icon: data.feature1Icon },
    { title: data.feature2Title, description: data.feature2Description, icon: data.feature2Icon },
    { title: data.feature3Title, description: data.feature3Description, icon: data.feature3Icon },
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
              <p className="text-lg text-gray-700">{data.pricingSubheading}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan: any, i: number) => {
                const colorClasses = getPlanColorClasses(plan.planColor || "blue-600");
                return (
                  <div
                    key={i}
                    className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 ${
                      plan.isPopular ? "relative z-10 transform md:scale-105 shadow-xl hover:scale-110" : ""
                    }`}
                  >
                    {plan.isPopular && (
                      <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                        POPULAR
                      </div>
                    )}
                    <div className={`${colorClasses.bg} py-6 px-6 text-white text-center`}>
                      <h3 className="text-xl font-bold">{plan.planName}</h3>
                      <p className="text-white/80 mt-1">{plan.planSubtitle || "For businesses"}</p>
                    </div>
                    <div className="p-8">
                      <div className="text-center mb-6">
                        <span className="text-4xl font-bold">{plan.planPrice}</span>
                        <span className="text-gray-500 ml-2">{plan.planPriceUnit || "/ visit"}</span>
                      </div>
                      <ul className="space-y-4 mb-8">
                        {(plan.planFeatures || []).map((f: string, j: number) => (
                          <li key={j} className="flex items-start">
                            <Check className="h-5 w-5 mr-3 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="text-center">
                        <Link
                          href={plan.planButtonLink || "/contact"}
                          className={`inline-block ${colorClasses.bg} text-white px-6 py-3 rounded-full text-sm font-medium ${colorClasses.hover} transition-colors duration-300`}
                        >
                          {plan.planButtonText || "Get Quote"}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Need More Flexibility? subsection */}
            <div className="max-w-2xl mx-auto mt-16 bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-center">
                {data.pricingCustomSectionHeading || "Need More Flexibility?"}
              </h3>
              <p className="text-center text-gray-700 mb-8">
                {data.pricingCustomSectionDescription || "We understand that every business has unique requirements. Contact us for a completely customized cleaning plan tailored to your specific needs, budget, and schedule."}
              </p>
              <div className="flex flex-col sm:flex-row sm:justify-center gap-4">
                <Link
                  href="/contact"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-full text-sm font-medium inline-flex items-center justify-center transition-all duration-300"
                >
                  Contact for Custom Quote
                </Link>
                <Link
                  href="tel:+18005551234"
                  className="bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full text-sm font-medium inline-flex items-center justify-center transition-all duration-300"
                >
                  Call (800) 555-1234
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
      <BenefitsSection
        heading={data.whyChooseHeading}
        subheading={data.whyChooseSubheading}
        benefits={benefits}
        variant="light"
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

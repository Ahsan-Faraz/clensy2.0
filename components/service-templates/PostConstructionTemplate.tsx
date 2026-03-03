"use client";

import CTASection from "@/components/cta-section";
import {
  ServiceHeroSection,
  CleaningAreasSection,
  BeforeAfterSection,
  TestimonialsSection,
  FAQSection,
} from "@/components/service-sections";

interface PostConstructionTemplateProps {
  data: Record<string, any>;
}

export default function PostConstructionTemplate({ data }: PostConstructionTemplateProps) {
  const cleaningAreas = data.cleaningAreas?.map((a: any) => ({
    ...a,
    image: a.image || a.imageUrl,
  })) || [];
  const beforeAfter = data.postConstructionDifference || [];
  const processSteps = [
    { title: data.step1Title, description: data.step1Description },
    { title: data.step2Title, description: data.step2Description },
    { title: data.step3Title, description: data.step3Description },
    { title: data.step4Title, description: data.step4Description },
  ].filter((s) => s.title);

  return (
    <main className="overflow-x-hidden">
      <ServiceHeroSection
        heroTopLabel={data.heroTopLabel}
        heroHeading={data.heroHeading}
        heroSubheading={data.heroSubheading}
        heroBackgroundImage={data.heroBackgroundImage}
        heroServiceDuration={data.heroServiceDuration}
        heroServiceGuarantee={data.heroServiceGuarantee}
        heroAccentColor="yellow"
        badgeText="Free On-Site Estimates"
        headingHighlight={
          data.heroHeading?.includes("Construction Zone")
            ? { before: "From ", highlight: "Construction Zone", after: " to Move-In Ready" }
            : undefined
        }
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
          afterLabelColor="yellow"
        />
      )}
      {processSteps.length > 0 && (
        <section className="py-20 bg-gray-900 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{data.processHeading}</h2>
              <p className="text-lg text-white/80">{data.processSubheading}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {processSteps.map((step, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
                  <div className="bg-yellow-500/20 rounded-full w-14 h-14 flex items-center justify-center mb-6 text-yellow-500 font-bold text-xl">
                    {i + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-white/80">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {(data.ppeTitle || data.hazmatTitle) && (
        <section className="py-20 bg-yellow-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{data.safetyHeading}</h2>
              <p className="text-lg text-gray-600">{data.safetySubheading}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.ppeTitle && (
                <div className="bg-white rounded-xl p-8 shadow-md">
                  <h3 className="text-xl font-bold mb-2">{data.ppeTitle}</h3>
                  <p className="text-gray-600 mb-6">{data.ppeDescription}</p>
                  {(data.ppeFeatures || []).map((f: string, i: number) => (
                    <div key={i} className="flex items-start mb-2">
                      <span className="text-yellow-600 mr-2">✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              )}
              {data.hazmatTitle && (
                <div className="bg-white rounded-xl p-8 shadow-md">
                  <h3 className="text-xl font-bold mb-2">{data.hazmatTitle}</h3>
                  <p className="text-gray-600 mb-6">{data.hazmatDescription}</p>
                  {(data.hazmatFeatures || []).map((f: string, i: number) => (
                    <div key={i} className="flex items-start mb-2">
                      <span className="text-yellow-600 mr-2">✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
      {(data.clientTestimonials?.length ?? 0) > 0 && (
        <TestimonialsSection
          heading="What Our Clients Say"
          subheading="Hear from homeowners and contractors who have used our post-construction cleaning services."
          testimonials={data.clientTestimonials}
        />
      )}
      <FAQSection faqs={data.faqs || []} accentColor="yellow" />
      <CTASection />
    </main>
  );
}

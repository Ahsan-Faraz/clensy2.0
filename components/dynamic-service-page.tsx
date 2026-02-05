'use client';

import { Render, RenderBlock } from "@wecre8websites/strapi-page-builder-react";
import { useEffect, useState, useMemo } from "react";
import pageBuilderConfig from "@/lib/page-builder-components";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CTASection from "@/components/cta-section";
import SEOScripts from "@/components/seo-scripts";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";

interface DynamicServicePageProps {
  slug: string;
  serviceData: any;
}

const STRAPI_URL = (process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337').replace(/\/+$/, '');

// Default fallback images
const DEFAULT_IMAGES = {
  hero: "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750838311/home-2573375_1280_ckf686.png",
  kitchen: "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750838451/9_e4iama.png",
  bathroom: "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750839467/image51_rdeigp.png",
  livingAreas: "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750839328/image80_uzyl0v.png",
};

export default function DynamicServicePage({ slug, serviceData }: DynamicServicePageProps) {
  const [templateData, setTemplateData] = useState<{ templateJson: any; content: any } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usePageBuilder, setUsePageBuilder] = useState(false);

  const data = serviceData;

  useEffect(() => {
    const fetchTemplateData = async () => {
      try {
        // Fetch by slug for collection types
        const response = await fetch(`/api/page-builder/content/service?slug=${encodeURIComponent(slug)}`);
        const result = await response.json();

        if (result.success && result.data) {
          const content = result.data;
          const templateField = result.templateField || 'Service_Page';
          const template = content[templateField];
          
          if (template?.json?.content && template.json.content.length > 0) {
            setTemplateData({
              templateJson: template.json,
              content,
            });
            setUsePageBuilder(true);
          }
        }
      } catch (err) {
        console.error('[DynamicServicePage] Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchTemplateData();
    }
  }, [slug]);

  // Get cleaning areas with fallback
  const cleaningAreas = data?.cleaningAreas && data.cleaningAreas.length > 0 
    ? data.cleaningAreas 
    : [
        { title: "Kitchen Excellence", description: "Complete kitchen cleaning including appliances, counters, and surfaces.", image: DEFAULT_IMAGES.kitchen, features: ["Countertops and backsplash cleaned", "Appliance exteriors wiped", "Sink and fixtures sanitized", "Floor swept and mopped"] },
        { title: "Bathroom Refresh", description: "Deep bathroom cleaning for a fresh and sanitized space.", image: DEFAULT_IMAGES.bathroom, features: ["Toilet thoroughly cleaned", "Shower/tub scrubbed", "Mirrors polished", "Floor sanitized"] },
        { title: "Living Area Maintenance", description: "Comprehensive living space cleaning for comfort and cleanliness.", image: DEFAULT_IMAGES.livingAreas, features: ["Furniture dusted", "Floors vacuumed/mopped", "Surfaces wiped down", "Trash removed"] },
      ];

  // Get frequency options with defaults
  const frequencyOptions = data?.frequencyOptions && data.frequencyOptions.length > 0
    ? data.frequencyOptions
    : [
        { title: "Weekly", color: "green", perfectFor: ["Busy families with children", "Homes with pets", "High-traffic areas", "Allergy sufferers"], benefits: "Maintains a consistently clean home with no build-up of dust or allergens.", label: "Most Popular Choice" },
        { title: "Bi-Weekly", color: "blue", perfectFor: ["Couples or small families", "Average-sized homes", "Those who tidy regularly", "Moderate use spaces"], benefits: "Good balance between maintaining cleanliness and budget.", label: "Best Value Option" },
        { title: "Monthly", color: "purple", perfectFor: ["Singles or couples", "Smaller living spaces", "Those who clean regularly", "Limited use areas"], benefits: "Good for getting a professional deep clean while handling regular maintenance yourself.", label: "Budget-Friendly Option" },
      ];

  // Get FAQs with defaults
  const faqs = data?.faqs && data.faqs.length > 0
    ? data.faqs
    : [
        { question: "Do I need to be present during the cleaning?", answer: "No, you don't need to be present. Many of our clients provide a key or access code so we can clean while they're away. Our cleaners are thoroughly vetted and fully insured." },
        { question: "Can I change my cleaning schedule if needed?", answer: "Absolutely! We understand schedules change. You can reschedule cleanings with at least 48 hours notice without any fee." },
        { question: "What cleaning products do you use?", answer: "We use high-quality, eco-friendly cleaning products as our standard. If you have specific product preferences or sensitivities, we're happy to accommodate." },
        { question: "What if I'm not satisfied with the cleaning?", answer: "Your satisfaction is guaranteed. If you're not completely satisfied with any area we've cleaned, contact us within 24 hours and we'll return to reclean at no additional cost." },
      ];

  // Get testimonials with defaults
  const testimonials = data?.clientTestimonials && data.clientTestimonials.length > 0
    ? data.clientTestimonials
    : [];

  if (isLoading) {
    return (
      <main className="overflow-x-hidden">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </main>
    );
  }

  // Use Page Builder rendering with hardcoded complex sections INTERLEAVED at correct positions
  if (usePageBuilder && templateData) {
    // Get the blocks from templateJson
    const blocks = templateData.templateJson?.content || [];
    
    // Define which hardcoded section should appear AFTER which block type
    // Based on original service page order:
    // Hero → TrustIndicators → [ZIGZAG] → Features → HowItWorks → Benefits → [TESTIMONIALS] → [FREQUENCY] → [FAQ] → CTA
    const hardcodedAfterBlock: Record<string, React.ReactNode[]> = {
      'ServiceTrustIndicators': [
        <WhatsIncludedSection 
          key="whats-included"
          heading={data?.includedSectionHeading || `What's Included in Our ${data?.name || 'Cleaning'}`}
          subheading={data?.includedSectionSubheading || "Our comprehensive cleaning service ensures every essential area receives meticulous attention."}
          cleaningAreas={cleaningAreas}
        />
      ],
      'ServiceBenefits': [
        ...(testimonials.length > 0 ? [
          <TestimonialsSection 
            key="testimonials"
            heading={data?.clientTestimonialsHeading || "What Our Clients Say"}
            subheading={data?.clientTestimonialsSubheading || `Hear from our satisfied clients about their experience with our ${data?.name || 'cleaning'} service.`}
            testimonials={testimonials}
          />
        ] : []),
        <FrequencyGuideSection 
          key="frequency-guide"
          heading={data?.frequencyGuideHeading || "How Often Should You Schedule Cleaning?"}
          subheading={data?.frequencyGuideSubheading || "Finding the right cleaning frequency depends on your specific needs and preferences."}
          frequencyOptions={frequencyOptions}
        />,
        <FAQSection 
          key="faq"
          serviceName={data?.name || 'Cleaning'}
          faqs={faqs}
        />
      ],
    };

    // Track which hardcoded sections have been rendered
    const renderedHardcodedSections = new Set<string>();

    // Build the page by rendering blocks and inserting hardcoded sections at correct positions
    const renderContent = () => {
      const content: React.ReactNode[] = [];
      
      blocks.forEach((block: any, index: number) => {
        const blockType = block.type;
        
        // Render the canvas block
        content.push(
          <RenderBlock
            key={`block-${index}`}
            config={pageBuilderConfig}
            block={block}
            content={templateData.content}
            strapi={{ url: STRAPI_URL, imageUrl: STRAPI_URL }}
          />
        );
        
        // Check if any hardcoded sections should appear after this block type
        if (hardcodedAfterBlock[blockType] && !renderedHardcodedSections.has(blockType)) {
          hardcodedAfterBlock[blockType].forEach((section) => {
            content.push(section);
          });
          renderedHardcodedSections.add(blockType);
        }
      });
      
      // If some hardcoded sections weren't rendered (because their trigger block wasn't in canvas),
      // render them at the end in correct order
      const orderedHardcodedKeys = ['ServiceTrustIndicators', 'ServiceBenefits'];
      orderedHardcodedKeys.forEach((key) => {
        if (!renderedHardcodedSections.has(key) && hardcodedAfterBlock[key]) {
          hardcodedAfterBlock[key].forEach((section) => {
            content.push(section);
          });
          renderedHardcodedSections.add(key);
        }
      });
      
      return content;
    };

    return (
      <main className="overflow-x-hidden">
        <div className="relative z-50">
          <Navbar />
        </div>
        
        {/* Render blocks with interleaved hardcoded sections */}
        {renderContent()}

        {/* Fallback CTA */}
        <CTASection />

        <Footer />
        
        {/* SEO Scripts and Schema */}
        {data?.seo && (
          <SEOScripts
            headScripts={data.seo.headScripts}
            bodyStartScripts={data.seo.bodyStartScripts}
            bodyEndScripts={data.seo.bodyEndScripts}
            schemaJsonLd={data.seo.schemaJsonLd}
            customCss={data.seo.customCss}
          />
        )}
      </main>
    );
  }

  // Fallback: Return null and let the original page handle rendering
  return null;
}

// ============================================================================
// HARDCODED SECTIONS - These match the original service page exactly
// ============================================================================

interface WhatsIncludedSectionProps {
  heading: string;
  subheading: string;
  cleaningAreas: Array<{
    title: string;
    description: string;
    image: string;
    imageAlt?: string;
    features: string[];
  }>;
}

function WhatsIncludedSection({ heading, subheading, cleaningAreas }: WhatsIncludedSectionProps) {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{heading}</h2>
          <p className="text-lg text-gray-600">{subheading}</p>
        </div>

        {cleaningAreas.map((area, index) => (
          <div
            key={index}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
              index < cleaningAreas.length - 1 ? 'mb-20' : ''
            }`}
          >
            {index % 2 === 0 ? (
              <>
                <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg order-2 lg:order-1">
                  <Image
                    src={area.image}
                    alt={area.imageAlt || area.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="order-1 lg:order-2">
                  <h3 className="text-2xl font-bold mb-4">{area.title}</h3>
                  <p className="text-gray-600 mb-6">{area.description}</p>
                  {area.features && area.features.length > 0 && (
                    <ul className="space-y-3">
                      {area.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start">
                          <Check className="h-5 w-5 mr-3 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            ) : (
              <>
                <div>
                  <h3 className="text-2xl font-bold mb-4">{area.title}</h3>
                  <p className="text-gray-600 mb-6">{area.description}</p>
                  {area.features && area.features.length > 0 && (
                    <ul className="space-y-3">
                      {area.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start">
                          <Check className="h-5 w-5 mr-3 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={area.image}
                    alt={area.imageAlt || area.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

interface TestimonialsSectionProps {
  heading: string;
  subheading: string;
  testimonials: Array<{
    rating: number;
    review: string;
    clientName: string;
    clientLocation: string;
    avatarBgColor?: string;
  }>;
}

function TestimonialsSection({ heading, subheading, testimonials }: TestimonialsSectionProps) {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{heading}</h2>
          <p className="text-lg text-white/80">{subheading}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl h-full flex flex-col">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating || 5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" />
                ))}
              </div>
              <p className="text-white/80 mb-6 flex-grow">"{testimonial.review}"</p>
              <div className="flex items-center mt-auto">
                <div className={`w-12 h-12 rounded-full bg-${testimonial.avatarBgColor || 'blue'}-500 flex items-center justify-center mr-4`}>
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">{testimonial.clientName}</p>
                  <p className="text-white/60 text-sm">{testimonial.clientLocation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface FrequencyGuideSectionProps {
  heading: string;
  subheading: string;
  frequencyOptions: Array<{
    title: string;
    color: string;
    perfectFor: string[];
    benefits: string;
    label: string;
  }>;
}

function FrequencyGuideSection({ heading, subheading, frequencyOptions }: FrequencyGuideSectionProps) {
  const colorClasses: Record<string, { bg: string; check: string }> = {
    green: { bg: "bg-green-600", check: "text-green-600" },
    blue: { bg: "bg-blue-600", check: "text-blue-600" },
    purple: { bg: "bg-purple-600", check: "text-purple-600" },
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{heading}</h2>
          <p className="text-lg text-gray-600">{subheading}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {frequencyOptions.map((option, index) => {
            const colors = colorClasses[option.color] || colorClasses.blue;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100"
              >
                <div className={`${colors.bg} p-6`}>
                  <h3 className="text-xl font-bold text-white text-center">{option.title}</h3>
                </div>
                <div className="p-6">
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3">Perfect For:</h4>
                    <ul className="space-y-2">
                      {option.perfectFor.map((item, i) => (
                        <li key={i} className="flex items-start">
                          <Check className={`h-5 w-5 mr-2 ${colors.check} flex-shrink-0 mt-0.5`} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3">Benefits:</h4>
                    <p className="text-gray-600">{option.benefits}</p>
                  </div>

                  <div className="text-center pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">{option.label}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="max-w-3xl mx-auto text-center mt-12">
          <p className="text-gray-600 italic">
            "Not sure what frequency is right for you? Contact us for a personalized recommendation based on your specific needs."
          </p>
        </div>
      </div>
    </section>
  );
}

interface FAQSectionProps {
  serviceName: string;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

function FAQSection({ serviceName, faqs }: FAQSectionProps) {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600 text-center mb-12">
            Learn more about our {serviceName} service.
          </p>

          <div className="space-y-8">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-blue-600">
                <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowRight, Star, Clock, Shield } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CTASection from "@/components/cta-section";
import SEOScripts from "@/components/seo-scripts";

interface FAQItem {
  question: string;
  answer: string;
}

interface Testimonial {
  rating: number;
  review: string;
  clientName: string;
  clientLocation: string;
  avatarBgColor?: string;
}

interface CleaningArea {
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
  features: string[];
}

interface FrequencyOption {
  title: string;
  color: string;
  perfectFor: string[];
  benefits: string;
  label: string;
}

interface ServiceData {
  name: string;
  slug: string;
  serviceType: string;
  
  // Hero Section
  heroTopLabel: string;
  heroHeading: string;
  heroSubheading: string;
  heroBackgroundImage: string;
  heroServiceDuration: string;
  heroServiceGuarantee: string;

  // What's Included Section
  includedSectionHeading: string;
  includedSectionSubheading: string;
  cleaningAreas: CleaningArea[];

  // Feature Section
  featureSectionHeading: string;
  featureSectionSubheading: string;
  featureSectionImage: string;
  featureSectionPoints: string[];

  // How It Works Section
  howItWorksHeading: string;
  howItWorksSubheading: string;
  step1Title: string;
  step1Description: string;
  step1Image: string;
  step2Title: string;
  step2Description: string;
  step2Image: string;
  step3Title: string;
  step3Description: string;
  step3Image: string;

  // Benefits Section
  benefitsHeading: string;
  benefitsSubheading: string;
  benefitsImage: string;
  benefit1Title: string;
  benefit1Description: string;
  benefit2Title: string;
  benefit2Description: string;
  benefit3Title: string;
  benefit3Description: string;

  // Client Testimonials Section
  clientTestimonialsHeading: string;
  clientTestimonialsSubheading: string;
  clientTestimonials: Testimonial[];

  // Cleaning Frequency Guide Section
  frequencyGuideHeading: string;
  frequencyGuideSubheading: string;
  frequencyOptions: FrequencyOption[];

  // FAQ Section
  faqs: FAQItem[];
  
  // SEO Fields
  seo?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    canonicalUrl: string;
    robots: string;
    h1: string;
    h2: string;
    h3: string;
    openGraph: {
      title: string;
      description: string;
      image: string;
      type: string;
    };
    twitter: {
      card: string;
      title: string;
      description: string;
    };
    schemaJsonLd: any;
    schemaType: string;
    headScripts: string;
    bodyStartScripts: string;
    bodyEndScripts: string;
    customCss: string;
  };
  imageAlt?: {
    heroBackground: string;
    featureSection: string;
    benefits: string;
    step1: string;
    step2: string;
    step3: string;
  };
}

// Default fallback images
const DEFAULT_IMAGES = {
  hero: "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750838311/home-2573375_1280_ckf686.png",
  kitchen: "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750838451/9_e4iama.png",
  bathroom: "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750839467/image51_rdeigp.png",
  livingAreas: "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750839328/image80_uzyl0v.png",
  feature: "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750839531/image86_di8j8g.png",
  step1: "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750839593/image47_npjiyh.png",
  step2: "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750839700/image21_qgnpkg.png",
  step3: "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750839766/image68_npznqj.png",
  benefits: "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750839832/image84_rjmtgy.png",
};

export default function DynamicServicePage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/cms/services/${slug}`);
        const result = await response.json();
        
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error || 'Service not found');
        }
      } catch (err) {
        console.error("Error fetching service data:", err);
        setError('Failed to load service');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
      setIsLoaded(true);
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <main className="overflow-x-hidden">
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The requested service could not be found.'}</p>
          <Link href="/services" className="bg-black text-white px-6 py-3 rounded-full">
            View All Services
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  // Get cleaning areas with fallback images
  const cleaningAreas = data.cleaningAreas && data.cleaningAreas.length > 0 
    ? data.cleaningAreas 
    : [
        { title: "Kitchen Excellence", description: "", image: DEFAULT_IMAGES.kitchen, features: [] },
        { title: "Bathroom Refresh", description: "", image: DEFAULT_IMAGES.bathroom, features: [] },
        { title: "Living Area Maintenance", description: "", image: DEFAULT_IMAGES.livingAreas, features: [] },
      ];

  // Get frequency options with defaults
  const frequencyOptions = data.frequencyOptions && data.frequencyOptions.length > 0
    ? data.frequencyOptions
    : [
        { title: "Weekly", color: "green", perfectFor: ["Busy families with children", "Homes with pets", "High-traffic areas", "Allergy sufferers"], benefits: "Maintains a consistently clean home with no build-up of dust or allergens.", label: "Most Popular Choice" },
        { title: "Bi-Weekly", color: "blue", perfectFor: ["Couples or small families", "Average-sized homes", "Those who tidy regularly", "Moderate use spaces"], benefits: "Good balance between maintaining cleanliness and budget.", label: "Best Value Option" },
        { title: "Monthly", color: "purple", perfectFor: ["Singles or couples", "Smaller living spaces", "Those who clean regularly", "Limited use areas"], benefits: "Good for getting a professional deep clean while handling regular maintenance yourself.", label: "Budget-Friendly Option" },
      ];

  return (
    <main className="overflow-x-hidden">
      <Navbar />

      {/* Hero Section - Exact match to routine cleaning */}
      <section className="relative min-h-[85vh] bg-black pt-16">
        <div className="absolute inset-0 z-0">
          <Image
            src={data.heroBackgroundImage || DEFAULT_IMAGES.hero}
            alt={data.imageAlt?.heroBackground || data.heroHeading || 'Professional cleaning service'}
            fill
            className="object-cover opacity-70"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-[calc(85vh-64px)]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-block mb-6 px-4 py-1 bg-white/10 backdrop-blur-sm rounded-full"
              >
                <span className="text-white/90 text-sm font-medium">
                  {data.heroTopLabel || "Premium Services"}
                </span>
              </motion.div>

              <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6 hero-text-shadow">
                {data.heroHeading.split(" ").slice(0, 2).join(" ")} <br />
                <span className="text-white">
                  {data.heroHeading.split(" ").slice(2).join(" ")}
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="text-lg text-white/80 mb-8 max-w-xl"
              >
                {data.heroSubheading}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href="/contact"
                  className="bg-white text-black hover:bg-white/90 px-8 py-3 rounded-full text-sm font-medium inline-flex items-center justify-center transition-all duration-300 w-48"
                >
                  <span className="text-center w-full">Get a Free Quote</span>
                </Link>

                <div className="flex items-center sm:mt-0 mt-4">
                  <div className="flex items-center text-white/90 mr-8">
                    <Clock className="h-5 w-5 mr-2 text-[#28A745]" />
                    <span className="text-sm whitespace-nowrap">
                      {data.heroServiceDuration || "2-3 Hour Service"}
                    </span>
                  </div>

                  <div className="flex items-center text-white/90">
                    <Shield className="h-5 w-5 mr-2 text-[#28A745]" />
                    <span className="text-sm whitespace-nowrap">
                      {data.heroServiceGuarantee || "100% Satisfaction"}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <div className="hidden md:block"></div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </section>

      {/* Trust indicators section */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-black mb-2">12K+</div>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-black mb-2">24/7</div>
              <p className="text-gray-600">Customer Support</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-black mb-2">4.9</div>
              <div className="flex items-center mb-2">
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <Star className="h-4 w-4 fill-current text-yellow-500" />
              </div>
              <p className="text-gray-600">Average Rating</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-black mb-2">100%</div>
              <p className="text-gray-600">Satisfaction Guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included Section with Zigzag Layout */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {data.includedSectionHeading || `What's Included in Our ${data.name}`}
            </h2>
            <p className="text-lg text-gray-600">
              {data.includedSectionSubheading || "Our comprehensive cleaning service ensures every essential area receives meticulous attention."}
            </p>
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
                      src={area.image || DEFAULT_IMAGES.kitchen}
                      alt={area.imageAlt || area.title || 'Cleaning service area'}
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
                      src={area.image || DEFAULT_IMAGES.bathroom}
                      alt={area.imageAlt || area.title || 'Cleaning service area'}
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

      {/* Feature Section - Dark background */}
      <section className="relative py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-gray-900 opacity-90"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {data.featureSectionHeading || "Exceptional Cleaning Results, Every Time"}
              </h2>
              <p className="text-lg text-white/80 mb-8">
                {data.featureSectionSubheading || "Our professional cleaners follow a meticulous process to ensure your space receives the highest standard of cleaning."}
              </p>
              <div className="space-y-4">
                {(data.featureSectionPoints && data.featureSectionPoints.length > 0 
                  ? data.featureSectionPoints 
                  : [
                      "Consistently thorough cleaning with attention to detail",
                      "Eco-friendly cleaning products for a healthier environment",
                      "Professionally trained and background-checked staff"
                    ]
                ).map((point, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-white/10 rounded-full p-2 mr-4 flex-shrink-0">
                      <Check className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white/90">{point}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden">
              <Image
                src={data.featureSectionImage || DEFAULT_IMAGES.feature}
                alt={data.imageAlt?.featureSection || "Professional cleaning"}
                fill
                className="object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {data.howItWorksHeading || `How Our ${data.name} Works`}
            </h2>
            <p className="text-lg text-gray-600">
              {data.howItWorksSubheading || "Getting started with our premium cleaning service is seamless and convenient."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-8 transition-all duration-300 hover:shadow-lg relative">
              <div className="absolute -top-4 -left-4 w-14 h-14 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold">
                1
              </div>
              <div className="relative h-40 rounded-xl overflow-hidden mb-6 mt-2">
                <Image
                  src={data.step1Image || DEFAULT_IMAGES.step1}
                  alt={data.imageAlt?.step1 || data.step1Title || "Book Online"}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-4">{data.step1Title || "Book Online"}</h3>
              <p className="text-gray-600 mb-4">
                {data.step1Description || "Schedule your cleaning service online in minutes. Choose your preferred date and time."}
              </p>
              <Link
                href="/booking"
                className="bg-blue-100 text-blue-700 px-8 py-3 rounded-lg text-sm font-medium inline-flex items-center justify-center w-48 hover:bg-blue-200 transition-colors"
              >
                Instant Online Pricing
              </Link>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-8 transition-all duration-300 hover:shadow-lg relative">
              <div className="absolute -top-4 -left-4 w-14 h-14 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold">
                2
              </div>
              <div className="relative h-40 rounded-xl overflow-hidden mb-6 mt-2">
                <Image
                  src={data.step2Image || DEFAULT_IMAGES.step2}
                  alt={data.imageAlt?.step2 || data.step2Title || "We Clean"}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-4">{data.step2Title || "We Clean"}</h3>
              <p className="text-gray-600 mb-4">
                {data.step2Description || "Our professional team arrives promptly and meticulously cleans your space."}
              </p>
              <Link
                href="/company/checklist"
                className="text-black font-medium flex items-center hover:underline"
              >
                See Our Checklist <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-8 transition-all duration-300 hover:shadow-lg relative">
              <div className="absolute -top-4 -left-4 w-14 h-14 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold">
                3
              </div>
              <div className="relative h-40 rounded-xl overflow-hidden mb-6 mt-2">
                <Image
                  src={data.step3Image || DEFAULT_IMAGES.step3}
                  alt={data.imageAlt?.step3 || data.step3Title || "Relax & Enjoy"}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-4">{data.step3Title || "Relax & Enjoy"}</h3>
              <p className="text-gray-600 mb-4">
                {data.step3Description || "Return to a pristine, fresh space. Set up recurring cleanings to maintain it effortlessly."}
              </p>
              <button
                type="button"
                onClick={() => window.location.href = "/booking"}
                className="text-black font-medium flex items-center hover:underline bg-transparent border-none p-0 m-0 cursor-pointer"
              >
                See Pricing <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {data.benefitsHeading || `Why Choose Our ${data.name} Service`}
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {data.benefitsSubheading || "Our premium cleaning service offers exceptional benefits to maintain your space in pristine condition."}
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-gray-100 rounded-full p-2 mr-4 flex-shrink-0">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {data.benefit1Title || "Consistent Excellence"}
                    </h3>
                    <p className="text-gray-600">
                      {data.benefit1Description || "Regular professional cleanings ensure your space maintains a consistently pristine appearance."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-gray-100 rounded-full p-2 mr-4 flex-shrink-0">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {data.benefit2Title || "Reclaimed Time & Energy"}
                    </h3>
                    <p className="text-gray-600">
                      {data.benefit2Description || "Regain your valuable time by entrusting your cleaning needs to our professional team."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-gray-100 rounded-full p-2 mr-4 flex-shrink-0">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {data.benefit3Title || "Enhanced Well-being"}
                    </h3>
                    <p className="text-gray-600">
                      {data.benefit3Description || "Regular professional cleaning significantly reduces allergens, dust, and bacteria."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-[600px] rounded-2xl overflow-hidden">
              <Image
                src={data.benefitsImage || DEFAULT_IMAGES.benefits}
                alt={data.imageAlt?.benefits || "Clean space"}
                fill
                className="object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      {data.clientTestimonials && data.clientTestimonials.length > 0 && (
        <section className="py-20 bg-gray-900 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {data.clientTestimonialsHeading || "What Our Clients Say"}
              </h2>
              <p className="text-lg text-white/80">
                {data.clientTestimonialsSubheading || `Hear from our satisfied clients about their experience with our ${data.name} service.`}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.clientTestimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-white/80 mb-6 flex-grow">
                    "{testimonial.review}"
                  </p>
                  <div className="flex items-center mt-auto">
                    <div className={`w-12 h-12 rounded-full bg-${testimonial.avatarBgColor || 'blue'}-500 flex items-center justify-center mr-4`}>
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
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
      )}

      {/* Cleaning Frequency Guide */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {data.frequencyGuideHeading || "How Often Should You Schedule Cleaning?"}
            </h2>
            <p className="text-lg text-gray-600">
              {data.frequencyGuideSubheading || "Finding the right cleaning frequency depends on your specific needs and preferences."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {frequencyOptions.map((option, index) => {
              const colorClasses: Record<string, { bg: string; check: string }> = {
                green: { bg: "bg-green-600", check: "text-green-600" },
                blue: { bg: "bg-blue-600", check: "text-blue-600" },
                purple: { bg: "bg-purple-600", check: "text-purple-600" },
              };
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
                    <h3 className="text-xl font-bold text-white text-center">
                      {option.title}
                    </h3>
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
              "Not sure what frequency is right for you? Contact us for a
              personalized recommendation based on your specific needs."
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 text-center mb-12">
              Learn more about our {data.name} service.
            </p>

            <div className="space-y-8">
              {data.faqs && data.faqs.length > 0 ? (
                data.faqs.map((faq, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-blue-600">
                    <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))
              ) : (
                <>
                  <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-blue-600">
                    <h3 className="text-xl font-semibold mb-3">Do I need to be present during the cleaning?</h3>
                    <p className="text-gray-600">No, you don't need to be present. Many of our clients provide a key or access code so we can clean while they're away. Our cleaners are thoroughly vetted and fully insured.</p>
                  </div>
                  <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-blue-600">
                    <h3 className="text-xl font-semibold mb-3">Can I change my cleaning schedule if needed?</h3>
                    <p className="text-gray-600">Absolutely! We understand schedules change. You can reschedule cleanings with at least 48 hours notice without any fee.</p>
                  </div>
                  <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-blue-600">
                    <h3 className="text-xl font-semibold mb-3">What cleaning products do you use?</h3>
                    <p className="text-gray-600">We use high-quality, eco-friendly cleaning products as our standard. If you have specific product preferences or sensitivities, we're happy to accommodate.</p>
                  </div>
                  <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-blue-600">
                    <h3 className="text-xl font-semibold mb-3">What if I'm not satisfied with the cleaning?</h3>
                    <p className="text-gray-600">Your satisfaction is guaranteed. If you're not completely satisfied with any area we've cleaned, contact us within 24 hours and we'll return to reclean at no additional cost.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* HTML Block: After FAQ */}
      {data.htmlBlocks && <HTMLBlockRenderer blocks={data.htmlBlocks} placement="after-faq" />}

      {/* HTML Block: Before CTA */}
      {data.htmlBlocks && <HTMLBlockRenderer blocks={data.htmlBlocks} placement="before-cta" />}

      {/* Call to Action */}
      <CTASection />

      {/* HTML Block: After CTA */}
      {data.htmlBlocks && <HTMLBlockRenderer blocks={data.htmlBlocks} placement="after-cta" />}

      {/* HTML Block: Before Footer */}
      {data.htmlBlocks && <HTMLBlockRenderer blocks={data.htmlBlocks} placement="before-footer" />}
      <Footer />
      
      {/* SEO Scripts and Schema */}
      <SEOScripts
        headScripts={data.seo?.headScripts}
        bodyStartScripts={data.seo?.bodyStartScripts}
        bodyEndScripts={data.seo?.bodyEndScripts}
        schemaJsonLd={data.seo?.schemaJsonLd}
        customCss={data.seo?.customCss}
      />
    </main>
  );
}

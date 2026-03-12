"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Check,
  ArrowRight,
  Star,
  Clock,
  Shield,
  Building,
  Users,
  Sparkles,
  Heart,
  Activity,
  Home,
  Key,
  ShoppingBag,
  Smile,
  BookOpen,
  Pencil,
  Dumbbell,
  Stethoscope,
  Building2,
  Briefcase,
  HandCoins,
  HardHat,
  CheckSquare,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CTASection from "@/components/cta-section";

const ICON_MAP: Record<string, any> = {
  Check,
  ArrowRight,
  Star,
  Clock,
  Shield,
  Building,
  Users,
  Sparkles,
  Heart,
  Activity,
  Home,
  Key,
  ShoppingBag,
  Smile,
  BookOpen,
  Pencil,
  Dumbbell,
  Stethoscope,
  Building2,
  Briefcase,
  HandCoins,
  HardHat,
  CheckSquare,
};

// Known field prefixes for zigzag "included" sections across all commercial pages
const KNOWN_PREFIXES = [
  "reception",
  "workstations",
  "meetingRooms",
  "equipment",
  "lockerRooms",
  "studio",
  "examination",
  "restrooms",
  "restaurants",
  "warehouses",
  "worship",
  "lobbies",
  "hallways",
  "stairwells",
  "entrances",
  "salesFloor",
  "fittingRooms",
  "classrooms",
  "cafeterias",
  "section1",
  "section2",
  "section3",
];

export default function CommercialTemplate({ data }: { data: any }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const getIcon = (iconName: string, className = "h-8 w-8 text-[#007BFF]") => {
    const IconComponent = ICON_MAP[iconName] || Building;
    return <IconComponent className={className} />;
  };

  // Auto-detect included items from flat fields or array
  const includedItems = useMemo(() => {
    if (data.includedItems && Array.isArray(data.includedItems)) {
      return data.includedItems;
    }
    const items: Array<{
      title: string;
      description: string;
      image: string;
      features: string[];
    }> = [];
    for (const prefix of KNOWN_PREFIXES) {
      if (data[`${prefix}Title`]) {
        items.push({
          title: data[`${prefix}Title`],
          description: data[`${prefix}Description`] || "",
          image: data[`${prefix}Image`] || "",
          features: data[`${prefix}Features`] || [],
        });
      }
    }
    return items;
  }, [data]);

  // Detect hero icon from data or default
  const heroIcon = data.heroIcon || "Building";

  // Detect pricing plans
  const pricingPlans = data.pricingPlans || [];

  const getPlanColorClasses = (color: string) => {
    const map: Record<string, { bg: string; hover: string }> = {
      "blue-600": { bg: "bg-blue-600", hover: "hover:bg-blue-700" },
      "blue-700": { bg: "bg-blue-700", hover: "hover:bg-blue-800" },
      "indigo-600": { bg: "bg-indigo-600", hover: "hover:bg-indigo-700" },
      "purple-600": { bg: "bg-purple-600", hover: "hover:bg-purple-700" },
      "green-600": { bg: "bg-green-600", hover: "hover:bg-green-700" },
    };
    return map[color] || { bg: "bg-blue-600", hover: "hover:bg-blue-700" };
  };

  return (
    <main className="overflow-x-hidden">
      <Navbar />

      {/* Split Hero Section */}
      <section className="relative min-h-[85vh] bg-black pt-16">
        <div className="absolute inset-0 z-0">
          <Image
            src={
              data.heroBackgroundImage ||
              "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750845773/photo-1497215842964-222b430dc094_myg23r.jpg"
            }
            alt={data.heroHeading || "Commercial cleaning service"}
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
                  {data.heroTopLabel}
                </span>
              </motion.div>

              <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6 hero-text-shadow">
                {data.heroHeading}
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
                  href="/booking"
                  className="bg-white text-black hover:bg-white/90 px-8 py-3 rounded-full text-sm font-medium inline-flex items-center justify-center transition-all duration-300 w-48"
                >
                  <span className="text-center w-full">Get a Free Quote</span>
                </Link>

                <div className="flex items-center sm:mt-0 mt-4">
                  <div className="flex items-center text-white/90 mr-8">
                    {getIcon(heroIcon, "h-5 w-5 mr-2 text-[#007BFF]")}
                    <span className="text-sm whitespace-nowrap">
                      {data.heroServiceDuration}
                    </span>
                  </div>

                  <div className="flex items-center text-white/90">
                    <Shield className="h-5 w-5 mr-2 text-[#007BFF]" />
                    <span className="text-sm whitespace-nowrap">
                      {data.heroServiceGuarantee}
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

      {/* Trust Indicators Section */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-black mb-2">
                {data.trustIndicator1Number}
              </div>
              <p className="text-gray-600">{data.trustIndicator1Text}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-black mb-2">
                {data.trustIndicator2Number}
              </div>
              <p className="text-gray-600">{data.trustIndicator2Text}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-black mb-2">
                {data.trustIndicator3Number}
              </div>
              <div className="flex items-center mb-2">
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <Star className="h-4 w-4 fill-current text-yellow-500" />
              </div>
              <p className="text-gray-600">{data.trustIndicator3Text}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-black mb-2">
                {data.trustIndicator4Number}
              </div>
              <p className="text-gray-600">{data.trustIndicator4Text}</p>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included Section with Zigzag Layout */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {data.includedSectionHeading}
            </h2>
            <p className="text-lg text-gray-600">
              {data.includedSectionSubheading}
            </p>
          </div>

          {includedItems.map((item: any, index: number) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={index}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index < includedItems.length - 1 ? "mb-20" : ""
                }`}
              >
                {isEven ? (
                  <>
                    <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg order-2 lg:order-1">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="order-1 lg:order-2">
                      <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                      <p className="text-gray-600 mb-6">{item.description}</p>
                      <ul className="space-y-3">
                        {item.features.map((feature: string, i: number) => (
                          <li key={i} className="flex items-start">
                            <Check className="h-5 w-5 mr-3 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                      <p className="text-gray-600 mb-6">{item.description}</p>
                      <ul className="space-y-3">
                        {item.features.map((feature: string, i: number) => (
                          <li key={i} className="flex items-start">
                            <Check className="h-5 w-5 mr-3 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing Plans Section (optional - shown if pricingPlans data exists) */}
      {pricingPlans.length > 0 && (
        <section className="py-24 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {data.pricingHeading || "Tailored Cleaning Plans & Pricing"}
              </h2>
              <p className="text-lg text-gray-700">
                {data.pricingSubheading || "Flexible packages designed for your business needs."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan: any, index: number) => (
                <div
                  key={index}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 ${
                    plan.isPopular
                      ? "relative z-10 transform md:scale-105 shadow-xl hover:scale-110"
                      : ""
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                      POPULAR
                    </div>
                  )}
                  <div
                    className={`${
                      getPlanColorClasses(plan.planColor || "blue-600").bg
                    } py-6 px-6 text-white text-center`}
                  >
                    <h3 className="text-xl font-bold">
                      {plan.planName || "Service Plan"}
                    </h3>
                    <p className="text-white/80 mt-1">
                      {plan.planSubtitle || "For businesses"}
                    </p>
                  </div>
                  <div className="p-8">
                    <div className="text-center mb-6">
                      <span className="text-4xl font-bold">
                        {plan.planPrice || "Custom"}
                      </span>
                      <span className="text-gray-500 ml-2">
                        {plan.planPriceUnit || "/ visit"}
                      </span>
                    </div>
                    <ul className="space-y-4 mb-8">
                      {(plan.planFeatures || []).map(
                        (feature: string, i: number) => (
                          <li key={i} className="flex items-start">
                            <Check className="h-5 w-5 mr-3 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        )
                      )}
                    </ul>
                    <div className="text-center">
                      <Link
                        href={plan.planButtonLink || "/contact"}
                        className={`inline-block ${
                          getPlanColorClasses(plan.planColor || "blue-600").bg
                        } text-white px-6 py-3 rounded-full text-sm font-medium ${
                          getPlanColorClasses(plan.planColor || "blue-600").hover
                        } transition-colors duration-300`}
                      >
                        {plan.planButtonText || "Get Quote"}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {data.pricingCustomSectionHeading && (
              <div className="max-w-2xl mx-auto mt-16 bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold mb-6 text-center">
                  {data.pricingCustomSectionHeading}
                </h3>
                <p className="text-center text-gray-700 mb-8">
                  {data.pricingCustomSectionDescription}
                </p>
                <div className="flex flex-col sm:flex-row sm:justify-center gap-4">
                  <Link
                    href={data.pricingCustomButton1Link || "/contact"}
                    className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-full text-sm font-medium inline-flex items-center justify-center transition-all duration-300"
                  >
                    {data.pricingCustomButton1Text || "Contact for Custom Quote"}
                  </Link>
                  <Link
                    href={data.pricingCustomButton2Link || "/contact"}
                    className="bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full text-sm font-medium inline-flex items-center justify-center transition-all duration-300"
                  >
                    {data.pricingCustomButton2Text || "Call Us"}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {data.whyChooseHeading}
            </h2>
            <p className="text-lg text-gray-600">{data.whyChooseSubheading}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-8 shadow-md text-center"
            >
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                {getIcon(data.feature1Icon, "h-6 w-6 text-[#007BFF]")}
              </div>
              <h3 className="text-xl font-bold mb-4">{data.feature1Title}</h3>
              <p className="text-gray-600">{data.feature1Description}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-8 shadow-md text-center"
            >
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                {getIcon(data.feature2Icon, "h-6 w-6 text-[#007BFF]")}
              </div>
              <h3 className="text-xl font-bold mb-4">{data.feature2Title}</h3>
              <p className="text-gray-600">{data.feature2Description}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-8 shadow-md text-center"
            >
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                {getIcon(data.feature3Icon, "h-6 w-6 text-[#007BFF]")}
              </div>
              <h3 className="text-xl font-bold mb-4">{data.feature3Title}</h3>
              <p className="text-gray-600">{data.feature3Description}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Business Benefits Section (optional - shown if businessBenefits data exists) */}
      {data.businessBenefits && Array.isArray(data.businessBenefits) && data.businessBenefits.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {data.businessBenefitsHeading || "Business Benefits of Professional Cleaning"}
              </h2>
              <p className="text-lg text-gray-600">
                {data.businessBenefitsSubheading || "Discover how our cleaning services can positively impact your business."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.businessBenefits.map((benefit: any, index: number) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6">
                  <div
                    className={`${benefit.iconBg || "bg-green-100"} rounded-full w-12 h-12 flex items-center justify-center mb-4`}
                  >
                    {getIcon(benefit.icon || "ArrowRight", `h-6 w-6 ${benefit.iconColor || "text-green-600"}`)}
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Equipment & Protocols Section (optional) */}
      {data.equipmentProtocols && Array.isArray(data.equipmentProtocols) && data.equipmentProtocols.length > 0 && (
        <section className="py-24 bg-blue-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {data.equipmentProtocolsHeading || "Specialized Equipment & Protocols"}
              </h2>
              <p className="text-lg text-gray-600">
                {data.equipmentProtocolsSubheading || "Industry-leading equipment and strict protocols for your facility."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {data.equipmentProtocols.map((item: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl p-6 shadow-md text-center"
                >
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    {getIcon(item.icon || "Shield", "h-8 w-8 text-blue-600")}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Health & Safety Standards Section (optional) */}
      {data.safetyStandards && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {data.safetyStandards.heading || "Health & Safety Standards"}
              </h2>
              <p className="text-lg text-gray-600">
                {data.safetyStandards.subheading || "Our protocols are designed to meet and exceed industry standards."}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {data.safetyStandards.image && (
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Image
                    src={data.safetyStandards.image}
                    alt="Health and safety protocols"
                    width={600}
                    height={400}
                    className="rounded-2xl shadow-lg"
                  />
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold mb-6">
                  {data.safetyStandards.title || "Comprehensive Safety Protocols"}
                </h3>
                <div className="space-y-6">
                  {(data.safetyStandards.items || []).map(
                    (item: any, index: number) => (
                      <div key={index} className="flex items-start">
                        <div className="bg-blue-100 rounded-full p-3 mr-4 flex-shrink-0">
                          <Check className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold mb-2">
                            {item.title}
                          </h4>
                          <p className="text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {data.testimonialsHeading || "What Our Clients Say"}
            </h2>
            <p className="text-lg text-white/80">
              {data.testimonialsSubheading ||
                "Hear from businesses that trust us with their cleaning needs."}
            </p>
          </div>

          {data.testimonials && Array.isArray(data.testimonials) && data.testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.testimonials.map((testimonial: any, index: number) => (
                <div
                  key={index}
                  className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl h-full flex flex-col"
                >
                  <div className="flex items-center mb-4">
                    {Array.from({ length: testimonial.rating || 5 }).map(
                      (_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 text-yellow-400"
                          fill="currentColor"
                        />
                      )
                    )}
                  </div>
                  <p className="text-white/80 mb-6 flex-grow italic">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div className="flex items-center mt-auto">
                    <div
                      className={`w-12 h-12 rounded-full ${
                        testimonial.avatarColor || "bg-blue-500"
                      } flex items-center justify-center mr-4`}
                    >
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-white/60 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl">
                <div className="flex items-center mb-4">
                  <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
                  <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
                  <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
                  <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
                  <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
                </div>
                <p className="text-white/80 mb-6 italic">
                  &ldquo;Clensy has been cleaning our facility for over two years. Their attention
                  to detail and reliability is exceptional. Our clients always comment
                  on how clean and professional our space looks.&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">Satisfied Customer</p>
                    <p className="text-white/60 text-sm">Business Client</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl">
                <div className="flex items-center mb-4">
                  <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
                  <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
                  <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
                  <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
                  <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
                </div>
                <p className="text-white/80 mb-6 italic">
                  &ldquo;The flexibility and quality of Clensy&apos;s service has been a game-changer
                  for our business. They work around our schedule and never disrupt
                  our operations. Highly recommended.&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">Happy Client</p>
                    <p className="text-white/60 text-sm">Commercial Partner</p>
                  </div>
                </div>
              </div>
            </div>
          )}
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
              {data.faqSubheading || "Common questions about our cleaning services."}
            </p>

            <div className="space-y-8">
              {Array.isArray(data.faqs) && data.faqs.length > 0 ? (
                data.faqs.map((faq: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-blue-600"
                  >
                    <h3 className="text-xl font-semibold mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">
                  No FAQs available at this time.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <CTASection />

      <Footer />
    </main>
  );
}

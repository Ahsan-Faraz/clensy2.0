"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Shield } from "lucide-react";

interface ServiceHeroSectionProps {
  heroTopLabel: string;
  heroHeading: string;
  heroSubheading: string;
  heroBackgroundImage: string;
  heroServiceDuration: string;
  heroServiceGuarantee: string;
  heroAccentColor?: "green" | "blue" | "yellow" | "white";
  ctaText?: string;
  ctaLink?: string;
  badgeText?: string;
  /** "outline" = bg-white/10 rounded-full (default), "solid" = bg-blue-600 rounded-lg (extras) */
  badgeVariant?: "outline" | "solid";
  headingHighlight?: { before: string; highlight: string; after: string };
}

const DEFAULT_HERO_IMAGE = "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750838311/home-2573375_1280_ckf686.png";

export default function ServiceHeroSection({
  heroTopLabel,
  heroHeading,
  heroSubheading,
  heroBackgroundImage,
  heroServiceDuration,
  heroServiceGuarantee,
  heroAccentColor = "green",
  ctaText = "Get a Free Quote",
  ctaLink = "/contact",
  badgeText,
  badgeVariant = "outline",
  headingHighlight,
}: ServiceHeroSectionProps) {
  const accentClasses: Record<string, string> = {
    green: "text-[#28A745]",
    blue: "text-blue-300",
    yellow: "text-yellow-500",
    white: "text-white",
  };
  const accent = accentClasses[heroAccentColor] || accentClasses.green;

  const renderHeading = () => {
    if (headingHighlight) {
      return (
        <>
          {headingHighlight.before}
          <span className="text-blue-500">{headingHighlight.highlight}</span>
          {headingHighlight.after}
        </>
      );
    }
    const parts = heroHeading.split(" ");
    if (parts.length >= 4) {
      return (
        <>
          {parts.slice(0, 4).join(" ")} <br />
          <span className="text-white">{parts.slice(4).join(" ")}</span>
        </>
      );
    }
    if (parts.length >= 2) {
      return (
        <>
          {parts.slice(0, 2).join(" ")} <br />
          <span className="text-white">{parts.slice(2).join(" ")}</span>
        </>
      );
    }
    return heroHeading;
  };

  return (
    <section className="relative min-h-[85vh] bg-black pt-16">
      <div className="absolute inset-0 z-0">
        <Image
          src={heroBackgroundImage || DEFAULT_HERO_IMAGE}
          alt="Service hero"
          fill
          className="object-cover opacity-70"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-[calc(85vh-64px)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {heroTopLabel && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-block mb-6 px-4 py-1 bg-white/10 backdrop-blur-sm rounded-full"
              >
                <span className="text-white/90 text-sm font-medium">
                  {heroTopLabel}
                </span>
              </motion.div>
            )}

            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6 hero-text-shadow">
              {renderHeading()}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-lg text-white/80 mb-8 max-w-xl"
            >
              {heroSubheading}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4"
            >
              {badgeText ? (
                <div
                  className={`px-8 py-3 text-sm font-medium inline-flex items-center justify-center w-48 cursor-default select-none ${
                    badgeVariant === "solid"
                      ? "bg-blue-100 text-blue-700 rounded-lg"
                      : heroAccentColor === "blue"
                      ? "bg-blue-100 text-blue-700 rounded-full"
                      : heroAccentColor === "yellow"
                      ? "bg-yellow-100 text-yellow-700 rounded-full"
                      : heroAccentColor === "green"
                      ? "bg-green-100 text-green-700 rounded-full"
                      : "bg-white/10 text-white rounded-full"
                  }`}
                >
                  {badgeText}
                </div>
              ) : (
                <Link
                  href={ctaLink}
                  className="bg-white text-black hover:bg-white/90 px-8 py-3 rounded-full text-sm font-medium inline-flex items-center justify-center transition-all duration-300 w-48"
                >
                  <span className="text-center w-full">{ctaText}</span>
                </Link>
              )}

              <div className="flex items-center sm:mt-0 mt-4">
                <div className="flex items-center text-white/90 mr-8">
                  <Clock className={`h-5 w-5 mr-2 ${accent}`} />
                  <span className="text-sm whitespace-nowrap">
                    {heroServiceDuration}
                  </span>
                </div>
                <div className="flex items-center text-white/90">
                  <Shield className={`h-5 w-5 mr-2 ${accent}`} />
                  <span className="text-sm whitespace-nowrap">
                    {heroServiceGuarantee}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <div className="hidden md:block" />
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
  );
}

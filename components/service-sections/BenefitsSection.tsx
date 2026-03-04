"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Users,
  Clock,
  Sparkles,
  Shield,
  Heart,
  Building,
  Building2,
  HandCoins,
  Activity,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Users,
  Clock,
  Sparkles,
  Shield,
  Heart,
  Building,
  Building2,
  HandCoins,
  Activity,
};

interface Benefit {
  title: string;
  description: string;
  icon?: string; // Lucide icon name OR image URL (flaticon PNG)
}

interface BenefitsSectionProps {
  heading: string;
  subheading: string;
  benefits: Benefit[];
  /** "light" = white bg (office, medical, retail, property, school, other-commercial)
   *  "dark"  = gray-900 bg (gym) */
  variant?: "light" | "dark";
}

function isImageUrl(icon?: string): boolean {
  if (!icon) return false;
  return icon.startsWith("http://") || icon.startsWith("https://") || icon.startsWith("/");
}

export default function BenefitsSection({
  heading,
  subheading,
  benefits,
  variant = "light",
}: BenefitsSectionProps) {
  if (!benefits || benefits.length === 0) return null;

  const isDark = variant === "dark";

  return (
    <section className={isDark ? "py-20 bg-gray-900 text-white" : "py-20 bg-gray-50"}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{heading}</h2>
          <p className={`text-lg ${isDark ? "text-white/80" : "text-gray-600"}`}>
            {subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((b, i) => {
            const iconIsImage = isImageUrl(b.icon);
            const IconComponent = !iconIsImage ? (ICON_MAP[b.icon || "Shield"] || Shield) : null;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                viewport={{ once: true }}
                className={
                  isDark
                    ? "bg-white/10 backdrop-blur-sm p-8 rounded-2xl text-center"
                    : "bg-white p-8 rounded-xl shadow-sm text-center"
                }
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
                    isDark ? "bg-blue-600/20" : "bg-blue-50"
                  }`}
                >
                  {iconIsImage ? (
                    <Image
                      src={b.icon!}
                      alt={b.title}
                      width={32}
                      height={32}
                      className="w-8 h-8"
                    />
                  ) : (
                    IconComponent && (
                      <IconComponent className={`h-8 w-8 ${isDark ? "text-blue-400" : "text-[#007BFF]"}`} />
                    )
                  )}
                </div>
                <h3 className={`text-xl font-bold mb-3 ${isDark ? "text-white" : ""}`}>
                  {b.title}
                </h3>
                <p className={isDark ? "text-white/80" : "text-gray-600"}>
                  {b.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

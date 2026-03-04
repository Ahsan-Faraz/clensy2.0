"use client";

import {
  ArrowRight,
  Shield,
  Clock,
  Star,
  Building,
  Users,
  Heart,
  TrendingUp,
  Award,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  ArrowRight,
  Shield,
  Users,
  Clock,
  Star,
  Building,
  Heart,
  TrendingUp,
  Award,
  Sparkles,
};

const COLOR_MAP: Record<string, string> = {
  green: "bg-green-100 text-green-600",
  blue: "bg-blue-100 text-blue-600",
  purple: "bg-purple-100 text-purple-600",
  orange: "bg-orange-100 text-orange-600",
  red: "bg-red-100 text-red-600",
  teal: "bg-teal-100 text-teal-600",
};

interface BusinessBenefitsSectionProps {
  heading: string;
  subheading: string;
  cards: Array<{
    title: string;
    description: string;
    icon?: string;
    iconColor?: string;
  }>;
}

export default function BusinessBenefitsSection({
  heading,
  subheading,
  cards,
}: BusinessBenefitsSectionProps) {
  if (!cards?.length) return null;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{heading}</h2>
          <p className="text-lg text-gray-600">{subheading}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, i) => {
            const IconComponent = ICON_MAP[card.icon || "Shield"] || Shield;
            const colorClass =
              COLOR_MAP[card.iconColor || "blue"] || "bg-blue-100 text-blue-600";

            return (
              <div
                key={i}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div
                  className={`rounded-full w-12 h-12 flex items-center justify-center mb-4 ${colorClass}`}
                >
                  <IconComponent className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{card.title}</h3>
                <p className="text-gray-600">{card.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

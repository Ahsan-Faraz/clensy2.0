"use client";

import Image from "next/image";
import { Clock, Shield, Users } from "lucide-react";

export interface ReduceStressBenefit {
  icon: "Clock" | "Shield" | "Users";
  title: string;
  description: string;
}

interface ReduceStressSectionProps {
  heading: string;
  intro: string;
  imageUrl?: string;
  benefitsSubheading: string;
  benefits: ReduceStressBenefit[];
}

const ICON_MAP = {
  Clock,
  Shield,
  Users,
};

export default function ReduceStressSection({
  heading,
  intro,
  imageUrl = "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750839832/image84_rjmtgy.png",
  benefitsSubheading,
  benefits,
}: ReduceStressSectionProps) {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            {heading}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{intro}</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 order-2 lg:order-1">
            <Image
              src={imageUrl}
              alt="Professional moving cleaning support"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="order-1 lg:order-2">
            <h3 className="text-xl font-bold text-gray-900 mb-8">
              {benefitsSubheading}
            </h3>
            <div className="space-y-6">
              {benefits.map((benefit, index) => {
                const IconComponent =
                  ICON_MAP[benefit.icon as keyof typeof ICON_MAP] || Clock;
                return (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {benefit.title}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { Sparkles, Shield, Heart, Clock, type LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles,
  Shield,
  Heart,
  Clock,
};

interface SpecializedEquipmentSectionProps {
  heading: string;
  subheading: string;
  items: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
}

export default function SpecializedEquipmentSection({
  heading,
  subheading,
  items,
}: SpecializedEquipmentSectionProps) {
  if (!items?.length) return null;

  return (
    <section className="py-24 bg-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{heading}</h2>
          <p className="text-lg text-gray-600">{subheading}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, i) => {
            const IconComponent =
              ICON_MAP[item.icon || "Shield"] || Shield;

            return (
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow-md text-center hover:shadow-lg transition-shadow"
              >
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

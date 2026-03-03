"use client";

import Image from "next/image";
import { Check } from "lucide-react";

interface HealthAndSafetySectionProps {
  heading: string;
  subheading: string;
  image?: string;
  items: Array<{
    title: string;
    description: string;
  }>;
}

export default function HealthAndSafetySection({
  heading,
  subheading,
  image,
  items,
}: HealthAndSafetySectionProps) {
  if (!items?.length) return null;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{heading}</h2>
          <p className="text-lg text-gray-600">{subheading}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {image && (
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={image}
                alt="Health and safety protocols"
                fill
                className="object-cover rounded-2xl"
              />
            </div>
          )}

          <div className="space-y-6">
            {items.map((item, i) => (
              <div key={i} className="flex items-start">
                <div className="bg-blue-100 rounded-full p-3 mr-4 flex-shrink-0">
                  <Check className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

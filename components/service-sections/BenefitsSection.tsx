"use client";

import Image from "next/image";
import { Check } from "lucide-react";

interface Benefit {
  title: string;
  description: string;
}

interface BenefitsSectionProps {
  heading: string;
  subheading: string;
  image?: string;
  benefits: Benefit[];
}

const DEFAULT_IMAGE =
  "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750839832/image84_rjmtgy.png";

export default function BenefitsSection({
  heading,
  subheading,
  image,
  benefits,
}: BenefitsSectionProps) {
  if (!benefits || benefits.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{heading}</h2>
            <p className="text-lg text-gray-600 mb-8">{subheading}</p>

            <div className="space-y-6">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-start">
                  <div className="bg-gray-100 rounded-full p-2 mr-4 flex-shrink-0">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{b.title}</h3>
                    <p className="text-gray-600">{b.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {image && (
            <div className="relative h-[600px] rounded-2xl overflow-hidden">
              <Image
                src={image || DEFAULT_IMAGE}
                alt={heading || "Benefits"}
                fill
                className="object-cover rounded-2xl"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

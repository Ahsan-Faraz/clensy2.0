"use client";

import Image from "next/image";
import { Check } from "lucide-react";

interface FeatureSectionProps {
  heading: string;
  subheading: string;
  image: string;
  points: string[];
}

const DEFAULT_IMAGE = "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750839531/image86_di8j8g.png";

export default function FeatureSection({
  heading,
  subheading,
  image,
  points,
}: FeatureSectionProps) {
  if (!heading && !subheading && (!points || points.length === 0))
    return null;

  return (
    <section className="relative py-16">
      <div className="absolute inset-0 bg-gradient-to-r from-black to-gray-900 opacity-90" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{heading}</h2>
            <p className="text-lg text-white/80 mb-8">{subheading}</p>
            {points && points.length > 0 && (
              <div className="space-y-4">
                {points.map((point, i) => (
                  <div key={i} className="flex items-start">
                    <div className="bg-white/10 rounded-full p-2 mr-4 flex-shrink-0">
                      <Check className="h-5 w-5 text-green-400" />
                    </div>
                    <p className="text-white/90">{point}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="relative h-[400px] rounded-2xl overflow-hidden">
            <Image
              src={image || DEFAULT_IMAGE}
              alt={heading || "Feature"}
              fill
              className="object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

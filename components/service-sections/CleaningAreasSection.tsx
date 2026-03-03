"use client";

import Image from "next/image";
import { Check } from "lucide-react";

interface CleaningArea {
  title: string;
  description: string;
  image: string;
  imageUrl?: string;
  features: string[];
}

interface CleaningAreasSectionProps {
  heading: string;
  subheading: string;
  areas: CleaningArea[];
}

const DEFAULT_IMAGES = {
  area1: "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750838451/9_e4iama.png",
  area2: "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750839467/image51_rdeigp.png",
  area3: "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750839328/image80_uzyl0v.png",
};

export default function CleaningAreasSection({
  heading,
  subheading,
  areas,
}: CleaningAreasSectionProps) {
  if (!areas || areas.length === 0) return null;

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{heading}</h2>
          <p className="text-lg text-gray-600">{subheading}</p>
        </div>

        {areas.map((area, index) => {
          const imgSrc = area.image || area.imageUrl || DEFAULT_IMAGES[`area${(index % 3) + 1}` as keyof typeof DEFAULT_IMAGES];
          const imageLeft = index % 2 === 0;

          return (
            <div
              key={index}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index < areas.length - 1 ? "mb-20" : ""}`}
            >
              {imageLeft ? (
                <>
                  <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg order-2 lg:order-1">
                    <Image src={imgSrc} alt={area.title} fill className="object-cover" />
                  </div>
                  <div className="order-1 lg:order-2">
                    <h3 className="text-2xl font-bold mb-4">{area.title}</h3>
                    <p className="text-gray-600 mb-6">{area.description}</p>
                    {area.features?.length > 0 && (
                      <ul className="space-y-3">
                        {area.features.map((f, i) => (
                          <li key={i} className="flex items-start">
                            <Check className="h-5 w-5 mr-3 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span>{f}</span>
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
                    {area.features?.length > 0 && (
                      <ul className="space-y-3">
                        {area.features.map((f, i) => (
                          <li key={i} className="flex items-start">
                            <Check className="h-5 w-5 mr-3 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg">
                    <Image src={imgSrc} alt={area.title} fill className="object-cover" />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

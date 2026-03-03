"use client";

import Image from "next/image";

interface Benefit {
  title: string;
  description: string;
  icon?: string;
}

interface BenefitsDarkSectionProps {
  heading: string;
  subheading: string;
  benefits: Benefit[];
  accentColor?: "green" | "blue";
}

export default function BenefitsDarkSection({
  heading,
  subheading,
  benefits,
  accentColor = "green",
}: BenefitsDarkSectionProps) {
  if (!benefits?.length) return null;

  const bgClass = accentColor === "green" ? "bg-[#4CAF50]/20" : "bg-blue-600/20";

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{heading}</h2>
          <p className="text-lg text-white/80">{subheading}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl"
            >
              {b.icon && (
                <div
                  className={`rounded-full w-14 h-14 flex items-center justify-center mb-6 ${bgClass}`}
                >
                  <Image
                    src={b.icon}
                    alt={b.title}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                </div>
              )}
              <h3 className="text-xl font-semibold mb-3">{b.title}</h3>
              <p className="text-white/80">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

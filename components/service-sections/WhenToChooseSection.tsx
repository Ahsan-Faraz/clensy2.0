"use client";

import Image from "next/image";

interface WhenToChooseOption {
  title: string;
  description: string;
  icon?: string;
}

interface WhenToChooseSectionProps {
  heading: string;
  subheading: string;
  options: WhenToChooseOption[];
  accentColor?: "blue" | "yellow";
}

export default function WhenToChooseSection({
  heading,
  subheading,
  options,
  accentColor = "blue",
}: WhenToChooseSectionProps) {
  if (!options || options.length === 0) return null;

  const iconBg = accentColor === "yellow" ? "bg-yellow-500/20" : "bg-blue-600/20";

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{heading}</h2>
          <p className="text-lg text-white/80">{subheading}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {options.map((opt, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl"
            >
              {opt.icon && (
                <div
                  className={`${iconBg} rounded-full w-14 h-14 flex items-center justify-center mb-6`}
                >
                  <Image
                    src={opt.icon}
                    alt={opt.title}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                </div>
              )}
              <h3 className="text-xl font-semibold mb-3">{opt.title}</h3>
              <p className="text-white/80">{opt.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

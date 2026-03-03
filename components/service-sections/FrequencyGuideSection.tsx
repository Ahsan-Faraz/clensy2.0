"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface FrequencyOption {
  title: string;
  color: string;
  perfectFor: string[];
  benefits: string;
  label: string;
}

interface FrequencyGuideSectionProps {
  heading: string;
  subheading: string;
  options: FrequencyOption[];
}

const COLOR_CLASSES: Record<string, string> = {
  green: "bg-green-600",
  blue: "bg-blue-600",
  purple: "bg-purple-600",
};

const CHECK_COLORS: Record<string, string> = {
  green: "text-green-600",
  blue: "text-blue-600",
  purple: "text-purple-600",
};

export default function FrequencyGuideSection({
  heading,
  subheading,
  options,
}: FrequencyGuideSectionProps) {
  if (!options || options.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{heading}</h2>
          <p className="text-lg text-gray-600">{subheading}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {options.map((opt, index) => {
            const bgColor = COLOR_CLASSES[opt.color] || "bg-blue-600";
            const checkColor = CHECK_COLORS[opt.color] || "text-blue-600";
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100"
              >
                <div className={`${bgColor} p-6`}>
                  <h3 className="text-xl font-bold text-white text-center">
                    {opt.title}
                  </h3>
                </div>
                <div className="p-6">
                  {opt.perfectFor?.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold mb-3">Perfect For:</h4>
                      <ul className="space-y-2">
                        {opt.perfectFor.map((item, i) => (
                          <li key={i} className="flex items-start">
                            <Check
                              className={`h-5 w-5 mr-2 ${checkColor} flex-shrink-0 mt-0.5`}
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {opt.benefits && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold mb-3">Benefits:</h4>
                      <p className="text-gray-600">{opt.benefits}</p>
                    </div>
                  )}
                  {opt.label && (
                    <div className="text-center pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500">{opt.label}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="max-w-3xl mx-auto text-center mt-12">
          <p className="text-gray-600 italic">
            Not sure what frequency is right for you? Contact us for a
            personalized recommendation based on your specific needs.
          </p>
        </div>
      </div>
    </section>
  );
}

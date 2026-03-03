"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface ComparisonFeature {
  title: string;
  description: string;
}

interface ComparisonSectionProps {
  heading: string;
  subheading: string;
  regularCleaning: {
    title: string;
    subtitle: string;
    features: ComparisonFeature[];
    frequency: string;
  };
  deepCleaning: {
    title: string;
    subtitle: string;
    features: ComparisonFeature[];
    frequency: string;
  };
}

export default function ComparisonSection({
  heading,
  subheading,
  regularCleaning,
  deepCleaning,
}: ComparisonSectionProps) {
  return (
    <section className="py-24 bg-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{heading}</h2>
          <p className="text-lg text-gray-600">{subheading}</p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="bg-gray-100 p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-800">
                  {regularCleaning.title}
                </h3>
                <p className="text-gray-600 mt-2">
                  {regularCleaning.subtitle}
                </p>
              </div>
              <div className="p-8">
                <ul className="space-y-4">
                  {regularCleaning.features?.map((f, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 mr-3 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">{f.title}</span>
                        <p className="text-sm text-gray-500 mt-1">
                          {f.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                  <p className="text-gray-500">
                    Recommended frequency: <br />
                    <span className="font-semibold text-gray-700">
                      {regularCleaning.frequency}
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden ring-2 ring-blue-500"
            >
              <div className="bg-blue-600 p-6 text-center">
                <h3 className="text-2xl font-bold text-white">
                  {deepCleaning.title}
                </h3>
                <p className="text-blue-100 mt-2">
                  {deepCleaning.subtitle}
                </p>
              </div>
              <div className="p-8">
                <ul className="space-y-4">
                  {deepCleaning.features?.map((f, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 mr-3 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">{f.title}</span>
                        <p className="text-sm text-gray-500 mt-1">
                          {f.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                  <p className="text-gray-500">
                    Recommended frequency: <br />
                    <span className="font-semibold text-blue-600">
                      {deepCleaning.frequency}
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Step {
  title: string;
  description: string;
  image?: string;
  badge?: string;
  linkText?: string;
  linkHref?: string;
}

interface HowItWorksSectionProps {
  heading: string;
  subheading: string;
  steps: Step[];
}

const DEFAULT_STEP_IMAGES = [
  "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750839593/image47_npjiyh.png",
  "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750839700/image21_qgnpkg.png",
  "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750839766/image68_npznqj.png",
];

export default function HowItWorksSection({
  heading,
  subheading,
  steps,
}: HowItWorksSectionProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{heading}</h2>
          <p className="text-lg text-gray-600">{subheading}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 transition-all duration-300 hover:shadow-lg relative"
            >
              <div className="absolute -top-4 -left-4 w-14 h-14 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold">
                {index + 1}
              </div>
              <div className="relative h-40 rounded-xl overflow-hidden mb-6 mt-2">
                <Image
                  src={step.image || DEFAULT_STEP_IMAGES[index % 3]}
                  alt={step.title}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
              <p className="text-gray-600 mb-4">{step.description}</p>
              {step.linkText && step.linkHref ? (
                <Link
                  href={step.linkHref}
                  className="text-black font-medium flex items-center hover:underline"
                >
                  {step.linkText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              ) : step.badge ? (
                <div className="bg-blue-100 text-blue-700 px-8 py-3 rounded-lg text-sm font-medium inline-flex items-center justify-center w-48">
                  {step.badge}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

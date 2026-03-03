"use client";

import { Star } from "lucide-react";

interface Testimonial {
  rating: number;
  review: string;
  clientName: string;
  clientLocation: string;
  avatarBgColor?: string;
}

interface TestimonialsSectionProps {
  heading: string;
  subheading: string;
  testimonials: Testimonial[];
}

export default function TestimonialsSection({
  heading,
  subheading,
  testimonials,
}: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) return null;

  const avatarColors = [
    "bg-rose-500",
    "bg-indigo-500",
    "bg-cyan-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-violet-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-blue-500",
  ];

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{heading}</h2>
          <p className="text-lg text-white/80">{subheading}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl h-full flex flex-col"
            >
              <div className="flex items-center mb-4">
                {[...Array(Math.min(t.rating || 5, 5))].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" />
                ))}
              </div>
              <p className="text-white/80 mb-6 flex-grow">&ldquo;{t.review}&rdquo;</p>
              <div className="flex items-center mt-auto">
                <div
                  className={`w-12 h-12 rounded-full ${t.avatarBgColor || avatarColors[index % avatarColors.length]} flex items-center justify-center mr-4`}
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">{t.clientName}</p>
                  <p className="text-white/60 text-sm">{t.clientLocation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

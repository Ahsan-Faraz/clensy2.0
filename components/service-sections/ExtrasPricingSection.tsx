"use client";

import Link from "next/link";
import { Check, DollarSign, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface ExtrasPricingCard {
  serviceId?: string;
  serviceName: string;
  price: string;
  priceUnit: string;
  features?: string[];
}

interface ExtrasPricingSectionProps {
  heading: string;
  subheading: string;
  cards: ExtrasPricingCard[];
}

export default function ExtrasPricingSection({
  heading,
  subheading,
  cards,
}: ExtrasPricingSectionProps) {
  if (!cards || cards.length === 0) return null;

  const scrollContainer = (direction: "left" | "right") => () => {
    const el = document.querySelector(".extras-pricing-scroll");
    if (el) {
      el.scrollBy({ left: direction === "left" ? -320 : 320, behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{heading}</h2>
          <p className="text-lg text-gray-600 mb-8">{subheading}</p>
          <div className="flex justify-center items-center text-sm text-gray-500">
            <ArrowRight className="h-4 w-4 animate-pulse mr-2" />
            <span>Scroll horizontally to see more pricing options</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <button
            type="button"
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-blue-600 text-white rounded-full p-2 shadow-lg z-20 hover:bg-blue-700 transition-all"
            onClick={scrollContainer("left")}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-blue-600 text-white rounded-full p-2 shadow-lg z-20 hover:bg-blue-700 transition-all"
            onClick={scrollContainer("right")}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="extras-pricing-scroll flex overflow-x-auto py-8 px-4 -mx-4 scrollbar-hide overflow-y-hidden">
            <div className="flex gap-6 px-4 min-w-0">
              {cards.map((card, index) => (
                <div
                  key={card.serviceId || index}
                  className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 flex-shrink-0 w-80 hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-bold">{card.serviceName}</h3>
                  </div>
                  <div className="flex items-center mb-6">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                    <span className="text-3xl font-bold">{card.price}</span>
                    <span className="text-gray-500 ml-2">{card.priceUnit}</span>
                  </div>
                  {(card.features || []).length > 0 && (
                    <ul className="space-y-3 mb-8">
                      {card.features.map((feature, fi) => (
                        <li key={fi} className="flex items-start">
                          <Check className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link
                    href="/booking"
                    className="bg-blue-600 text-white hover:bg-blue-500 px-6 py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-all duration-300 w-full"
                  >
                    Add To Booking
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

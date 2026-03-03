"use client";

import { Star } from "lucide-react";

interface TrustIndicator {
  number: string;
  text: string;
  showStars?: boolean;
}

interface TrustIndicatorsSectionProps {
  indicators: TrustIndicator[];
}

const DEFAULT_INDICATORS: TrustIndicator[] = [
  { number: "12K+", text: "Happy Customers" },
  { number: "24/7", text: "Customer Support" },
  { number: "4.9", text: "Average Rating", showStars: true },
  { number: "100%", text: "Satisfaction Guarantee" },
];

export default function TrustIndicatorsSection({
  indicators = DEFAULT_INDICATORS,
}: TrustIndicatorsSectionProps) {
  const items = indicators.length > 0 ? indicators : DEFAULT_INDICATORS;

  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="text-4xl font-bold text-black mb-2">
                {item.number}
              </div>
              {item.showStars && (
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-current text-yellow-500"
                    />
                  ))}
                </div>
              )}
              <p className="text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

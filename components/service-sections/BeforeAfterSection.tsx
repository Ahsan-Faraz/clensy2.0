"use client";

import Image from "next/image";

interface BeforeAfterItem {
  heading: string;
  beforeImage: string;
  afterImage: string;
  caption: string;
}

interface BeforeAfterSectionProps {
  heading: string;
  subheading: string;
  items: BeforeAfterItem[];
  afterLabelColor?: "green" | "blue" | "yellow";
}

export default function BeforeAfterSection({
  heading,
  subheading,
  items,
  afterLabelColor = "green",
}: BeforeAfterSectionProps) {
  if (!items || items.length === 0) return null;

  const afterBg =
    afterLabelColor === "green"
      ? "bg-green-600/70"
      : afterLabelColor === "blue"
      ? "bg-blue-600/70"
      : "bg-yellow-500/70";
  const afterText = afterLabelColor === "yellow" ? "text-black" : "text-white";

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{heading}</h2>
          <p className="text-lg text-gray-600">{subheading}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-6 shadow-sm"
            >
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <Image
                    src={item.beforeImage}
                    alt={`Before - ${item.heading}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 bg-black/70 text-white px-3 py-1 text-sm">
                    Before
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <Image
                    src={item.afterImage}
                    alt={`After - ${item.heading}`}
                    fill
                    className="object-cover"
                  />
                  <div
                    className={`absolute bottom-0 left-0 ${afterBg} ${afterText} px-3 py-1 text-sm`}
                  >
                    After
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.heading}</h3>
              <p className="text-gray-600">{item.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

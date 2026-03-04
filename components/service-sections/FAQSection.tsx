"use client";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  heading?: string;
  subheading?: string;
  faqs: FAQItem[];
  accentColor?: "blue" | "yellow";
  /** "light" = white bg (default), "dark" = gray-900 bg (office-cleaning) */
  variant?: "light" | "dark";
}

export default function FAQSection({
  heading = "Frequently Asked Questions",
  subheading,
  faqs,
  accentColor = "blue",
  variant = "light",
}: FAQSectionProps) {
  if (!faqs || faqs.length === 0) return null;

  const isDark = variant === "dark";

  if (isDark) {
    return (
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
              {heading}
            </h2>
            {subheading && (
              <p className="text-lg text-gray-300 text-center mb-12">
                {subheading}
              </p>
            )}

            <div className="space-y-8">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl"
                >
                  <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                  <p className="text-white/80">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const borderColor = accentColor === "yellow" ? "border-yellow-500" : "border-blue-600";

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            {heading}
          </h2>
          {subheading && (
            <p className="text-lg text-gray-600 text-center mb-12">
              {subheading}
            </p>
          )}

          <div className="space-y-8">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className={`bg-white p-8 rounded-2xl shadow-sm border-l-4 ${borderColor}`}
              >
                <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

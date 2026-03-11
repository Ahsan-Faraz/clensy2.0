"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SEOHead from "@/components/seo-head";

/** Makes URLs and emails in plain text clickable */
function linkifyContent(text: string): string {
  return text
    .replace(/\n/g, "<br />")
    .replace(/(https?:\/\/[^\s<>"']+)/gi, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>')
    .replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '<a href="mailto:$1" class="text-blue-600 hover:text-blue-800 underline">$1</a>')
    .replace(/•\s+([^\n<]+)/g, "<li>$1</li>")
    .replace(/(<li>[\s\S]*?<\/li>\s*)+/g, (m) => `<ul class="list-disc pl-5 my-1 space-y-0.5">${m.trim()}</ul>`);
}

interface PrivacyPolicySection { title: string; content: string; order: number; }
interface PrivacyPolicyData {
  heroSection: { heading: string; description: string; };
  companyInfo: { websiteUrl: string; email: string; phone: string; };
  sections: PrivacyPolicySection[];
  smsConsent: { description: string; optOutInstructions: string; };
}

interface PrivacyPolicyClientProps { schemaJsonLd?: object | null; headScripts?: string; bodyEndScripts?: string; customCss?: string; }

export default function PrivacyPolicyClient({ schemaJsonLd, headScripts, bodyEndScripts, customCss }: PrivacyPolicyClientProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState<PrivacyPolicyData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/cms/privacy-policy');
        const result = await response.json();
        if (result.success) setData(result.data);
      } catch (error) {
        console.error('Error fetching privacy policy:', error);
      }
    };
    fetchData();
    setIsLoaded(true);
  }, []);

  const heading = data?.heroSection.heading || "Privacy Policy";
  const description = data?.heroSection.description || "Your privacy is important to us. Learn how we collect, use, and protect your information.";
  const policyTitle = data?.companyInfo.websiteUrl ? `${data.companyInfo.websiteUrl} Privacy Policy` : "Clensy Cleaning Privacy Policy";
  const sortedSections = data?.sections?.sort((a, b) => a.order - b.order) ?? [];

  return (
    <>
      <SEOHead schemaJsonLd={schemaJsonLd} headScripts={headScripts} bodyEndScripts={bodyEndScripts} customCss={customCss} />
      <main className="min-h-screen bg-gray-50">
        <Navbar />

        {/* Hero - matches Terms of Service */}
        <section className="relative py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">{heading}</h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={isLoaded ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }} className="text-lg text-white/80 mb-8">
                {description}
              </motion.p>
            </div>
          </div>
        </section>

        {/* Content - matches Terms of Service layout */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg max-w-none">
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{policyTitle}</h2>
                </div>
                <div className="space-y-8">
                  {sortedSections
                    .filter((s) => !s.title.toLowerCase().includes("questions about our privacy"))
                    .map((section, index) => (
                    <div key={index}>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{section.title}</h3>
                      <div
                        className="text-gray-700 [&_a]:text-blue-600 [&_a]:hover:text-blue-800 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1 [&_ul]:space-y-0.5"
                        dangerouslySetInnerHTML={{ __html: linkifyContent(section.content) }}
                      />
                    </div>
                  ))}
                  {!sortedSections.some((s) => s.title.toLowerCase().includes('sms')) && data?.smsConsent && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">SMS Consent and Third-Party Sharing</h3>
                      <div
                        className="text-gray-700 [&_a]:text-blue-600 [&_a]:hover:text-blue-800 [&_a]:underline"
                        dangerouslySetInnerHTML={{ __html: linkifyContent(data.smsConsent.description + "\n\n" + data.smsConsent.optOutInstructions) }}
                      />
                    </div>
                  )}
                  <div className="bg-blue-50 p-6 rounded-lg mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Questions about our Privacy Policy?</h3>
                    <p className="text-gray-700 mb-4">If you have any questions about this Privacy Policy, please contact us:</p>
                    <div className="space-y-2 text-gray-700">
                      <p>Email: <a href={`mailto:${data?.companyInfo.email}`} className="text-blue-600 hover:text-blue-800 underline">{data?.companyInfo.email}</a></p>
                      <p>Phone: <a href={`tel:${data?.companyInfo.phone}`} className="text-blue-600 hover:text-blue-800 underline">{data?.companyInfo.phone}</a></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

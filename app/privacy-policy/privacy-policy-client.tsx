"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SEOHead from "@/components/seo-head";

interface PrivacyPolicySection { title: string; content: string; order: number; }
interface PrivacyPolicyData {
  heroSection: { heading: string; description: string; };
  companyInfo: { websiteUrl: string; email: string; phone: string; };
  sections: PrivacyPolicySection[];
  smsConsent: { description: string; optOutInstructions: string; };
}

interface PrivacyPolicyClientProps { schemaJsonLd?: object | null; headScripts?: string; bodyEndScripts?: string; customCss?: string; }

export default function PrivacyPolicyClient({ schemaJsonLd, headScripts, bodyEndScripts, customCss }: PrivacyPolicyClientProps) {
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
  }, []);

  const heading = data?.heroSection.heading || "Privacy Policy";
  const description = data?.heroSection.description || "Your privacy is important to us. Learn how we collect, use, and protect your information.";
  const policyTitle = data?.companyInfo.websiteUrl ? `${data.companyInfo.websiteUrl} Privacy Policy` : "Clensy Cleaning Privacy Policy";
  const sortedSections = data?.sections?.sort((a, b) => a.order - b.order) ?? [];

  return (
    <>
      <SEOHead schemaJsonLd={schemaJsonLd} headScripts={headScripts} bodyEndScripts={bodyEndScripts} customCss={customCss} />
      <main className="min-h-screen bg-white">
        <Navbar />

        {/* Hero - matches clensy-3 style: Privacy Information label, H1, description */}
        <section className="pt-28 pb-12 md:pt-32 md:pb-16 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Privacy Information</p>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{heading}</h1>
              <p className="text-base text-gray-600 leading-relaxed">{description}</p>
            </div>
          </div>
        </section>

        {/* Content - Clensy Cleaning Privacy Policy + sections */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-8">{policyTitle}</h2>
              <div className="space-y-10">
                {sortedSections.map((section, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h3>
                    <div className="text-gray-700 text-[15px] leading-relaxed whitespace-pre-wrap [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-3 [&_a]:text-blue-600 [&_a]:hover:text-blue-800" dangerouslySetInnerHTML={{ __html: section.content }} />
                  </div>
                ))}
                {!sortedSections.some((s) => s.title.toLowerCase().includes('sms')) && data?.smsConsent && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">SMS Consent and Third-Party Sharing</h3>
                    <p className="text-gray-700 text-[15px] leading-relaxed mb-2">{data.smsConsent.description}</p>
                    <p className="text-gray-700 text-[15px] leading-relaxed">{data.smsConsent.optOutInstructions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

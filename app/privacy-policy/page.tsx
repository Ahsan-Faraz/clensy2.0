import { Metadata } from "next";
import { CMSAdapter } from "@/lib/cms-adapter";
import PrivacyPolicyClient from "./privacy-policy-client";

export const dynamic = 'force-dynamic';
export const revalidate = 60;

const defaultSEO = {
  title: "Privacy Policy | Clensy Cleaning Services",
  description: "Read Clensy's privacy policy. Learn how we collect, use, and protect your personal information.",
  keywords: "privacy policy, data protection, personal information, Clensy privacy",
  canonicalUrl: "https://clensy.com/privacy-policy",
  robots: "index, follow",
  openGraph: { title: "Privacy Policy | Clensy", description: "Your privacy is important to us.", image: "", type: "website" },
  twitter: { card: "summary", title: "Privacy Policy | Clensy", description: "Your privacy is important to us." },
  schemaJsonLd: null,
  scripts: { head: "", bodyStart: "", bodyEnd: "" },
  customCss: "",
};

export async function generateMetadata(): Promise<Metadata> {
  let seo = defaultSEO;
  try {
    const fetchedSeo = await CMSAdapter.getPrivacyPolicySEO();
    if (fetchedSeo) seo = { ...defaultSEO, ...fetchedSeo };
  } catch (error) {
    console.error("Failed to fetch Privacy Policy SEO:", error);
  }

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    robots: seo.robots,
    alternates: { canonical: seo.canonicalUrl },
    openGraph: { title: seo.openGraph.title, description: seo.openGraph.description, url: seo.canonicalUrl, siteName: "Clensy", type: seo.openGraph.type as "website" },
    twitter: { card: seo.twitter.card as "summary", title: seo.twitter.title, description: seo.twitter.description },
  };
}

export default async function PrivacyPolicyPage() {
  let seo = defaultSEO;
  try {
    const fetchedSeo = await CMSAdapter.getPrivacyPolicySEO();
    if (fetchedSeo) seo = { ...defaultSEO, ...fetchedSeo };
  } catch (error) {
    console.error("Failed to fetch Privacy Policy SEO:", error);
  }

  return <PrivacyPolicyClient schemaJsonLd={seo.schemaJsonLd} headScripts={seo.scripts.head} bodyEndScripts={seo.scripts.bodyEnd} customCss={seo.customCss} />;
}

import { Metadata } from "next";
import { CMSAdapter } from "@/lib/cms-adapter";
import TermsOfServiceClient from "./terms-of-service-client";

export const dynamic = 'force-dynamic';
export const revalidate = 60;

const defaultSEO = {
  title: "Terms of Service | Clensy Cleaning Services",
  description: "Read Clensy's terms of service. Understand the terms and conditions for using our professional cleaning services.",
  keywords: "terms of service, terms and conditions, cleaning service terms, Clensy terms",
  canonicalUrl: "https://clensy.com/terms-of-service",
  robots: "index, follow",
  openGraph: { title: "Terms of Service | Clensy", description: "Terms and conditions for using Clensy cleaning services.", image: "", type: "website" },
  twitter: { card: "summary", title: "Terms of Service | Clensy", description: "Terms and conditions for using Clensy cleaning services." },
  schemaJsonLd: null,
  scripts: { head: "", bodyStart: "", bodyEnd: "" },
  customCss: "",
};

export async function generateMetadata(): Promise<Metadata> {
  let seo = defaultSEO;
  try {
    const fetchedSeo = await CMSAdapter.getTermsOfServiceSEO();
    if (fetchedSeo) seo = { ...defaultSEO, ...fetchedSeo };
  } catch (error) {
    console.error("Failed to fetch Terms of Service SEO:", error);
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

export default async function TermsOfServicePage() {
  let seo = defaultSEO;
  try {
    const fetchedSeo = await CMSAdapter.getTermsOfServiceSEO();
    if (fetchedSeo) seo = { ...defaultSEO, ...fetchedSeo };
  } catch (error) {
    console.error("Failed to fetch Terms of Service SEO:", error);
  }

  return <TermsOfServiceClient schemaJsonLd={seo.schemaJsonLd} headScripts={seo.scripts.head} bodyEndScripts={seo.scripts.bodyEnd} customCss={seo.customCss} />;
}

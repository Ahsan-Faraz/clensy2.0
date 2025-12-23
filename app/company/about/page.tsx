import { Metadata } from "next";
import { CMSAdapter } from "@/lib/cms-adapter";
import AboutPageClient from "./about-client";

export const dynamic = 'force-dynamic';
export const revalidate = 60;

const defaultSEO = {
  title: "About Clensy | Professional Cleaning Services in New Jersey",
  description: "Learn about Clensy - New Jersey's trusted professional cleaning company. Our story, mission, and commitment to exceptional cleaning services.",
  keywords: "about clensy, cleaning company, professional cleaners, New Jersey cleaning service",
  canonicalUrl: "https://clensy.com/company/about",
  robots: "index, follow",
  openGraph: {
    title: "About Clensy | Professional Cleaning Services",
    description: "Discover the Clensy difference. Professional, reliable cleaning services.",
    image: "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750847413/shutterstock_2138293517_1_nqcmei.jpg",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Clensy | Professional Cleaning Services",
    description: "Discover the Clensy difference.",
  },
  schemaJsonLd: null,
  scripts: { head: "", bodyStart: "", bodyEnd: "" },
  customCss: "",
};

export async function generateMetadata(): Promise<Metadata> {
  let seo = defaultSEO;
  
  try {
    const fetchedSeo = await CMSAdapter.getAboutPageSEO();
    if (fetchedSeo) {
      seo = { ...defaultSEO, ...fetchedSeo };
    }
  } catch (error) {
    console.error("Failed to fetch About page SEO:", error);
  }

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    robots: seo.robots,
    alternates: { canonical: seo.canonicalUrl },
    openGraph: {
      title: seo.openGraph.title,
      description: seo.openGraph.description,
      url: seo.canonicalUrl,
      siteName: "Clensy",
      images: seo.openGraph.image ? [{ url: seo.openGraph.image, width: 1200, height: 630 }] : [],
      type: seo.openGraph.type as "website",
    },
    twitter: {
      card: seo.twitter.card as "summary_large_image",
      title: seo.twitter.title,
      description: seo.twitter.description,
    },
  };
}

export default async function AboutPage() {
  let seo = defaultSEO;
  
  try {
    const fetchedSeo = await CMSAdapter.getAboutPageSEO();
    if (fetchedSeo) seo = { ...defaultSEO, ...fetchedSeo };
  } catch (error) {
    console.error("Failed to fetch About page SEO:", error);
  }

  return (
    <AboutPageClient
      schemaJsonLd={seo.schemaJsonLd}
      headScripts={seo.scripts.head}
      bodyEndScripts={seo.scripts.bodyEnd}
      customCss={seo.customCss}
    />
  );
}

import { Metadata } from "next";
import { CMSAdapter } from "@/lib/cms-adapter";
import DynamicLandingPage from "@/components/dynamic-landing-page";

// Force dynamic rendering since we fetch from CMS
export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

// Default SEO data as fallback
const defaultSEO = {
  title: "Professional Cleaning Services | Clensy",
  description: "Professional cleaning services for homes and offices in New Jersey. Book online in 30 seconds. 100% satisfaction guaranteed.",
  keywords: "cleaning services, house cleaning, professional cleaners, New Jersey",
  canonicalUrl: "https://clensy.com",
  robots: "index, follow",
  openGraph: {
    title: "Professional Cleaning Services | Clensy",
    description: "Book professional cleaning services online in 30 seconds.",
    image: "",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Cleaning Services | Clensy",
    description: "Book professional cleaning services online in 30 seconds.",
  },
  schemaJsonLd: null,
  additionalSchemas: [],
  scripts: { head: "", bodyStart: "", bodyEnd: "" },
  customCss: "",
};

// Generate dynamic metadata from Strapi
export async function generateMetadata(): Promise<Metadata> {
  let seo = defaultSEO;
  
  try {
    const fetchedSeo = await CMSAdapter.getLandingPageSEO();
    if (fetchedSeo) {
      seo = fetchedSeo;
    }
  } catch (error) {
    console.error("Failed to fetch SEO data:", error);
  }

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    robots: seo.robots,
    alternates: {
      canonical: seo.canonicalUrl,
    },
    openGraph: {
      title: seo.openGraph.title,
      description: seo.openGraph.description,
      url: seo.canonicalUrl,
      siteName: "Clensy",
      images: seo.openGraph.image
        ? [
            {
              url: seo.openGraph.image,
              width: 1200,
              height: 630,
              alt: "Clensy Professional Cleaning Services",
            },
          ]
        : [],
      type: seo.openGraph.type as "website" | "article",
    },
    twitter: {
      card: seo.twitter.card as "summary_large_image" | "summary",
      title: seo.twitter.title,
      description: seo.twitter.description,
    },
  };
}

// Server component that fetches SEO data and renders client component
export default async function Home() {
  let seo = defaultSEO;
  
  try {
    const fetchedSeo = await CMSAdapter.getLandingPageSEO();
    if (fetchedSeo) {
      seo = fetchedSeo;
    }
  } catch (error) {
    console.error("Failed to fetch SEO data for page:", error);
  }

  return (
    <DynamicLandingPage
      schemaJsonLd={seo.schemaJsonLd}
      additionalSchemas={seo.additionalSchemas}
      headScripts={seo.scripts.head}
      bodyEndScripts={seo.scripts.bodyEnd}
      customCss={seo.customCss}
    />
  );
}

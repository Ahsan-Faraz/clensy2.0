import { Metadata } from "next";
import { CMSAdapter } from "@/lib/cms-adapter";
import { fetchLandingPage } from "@/lib/page-builder-api";
import DynamicLandingPage from "@/components/dynamic-landing-page";

// ISR: revalidate every 60 seconds
export const revalidate = 60;

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

/**
 * Home page — Server Component (SSG + ISR)
 * 
 * Fetches ALL CMS data in parallel at build time / every 60s revalidation.
 * Passes pre-fetched data as props so client components render instantly
 * with no loading spinners or client-side API calls.
 */
export default async function Home() {
  // Fetch ALL data in parallel — single server-side round-trip
  const [
    seo,
    heroData,
    howItWorksData,
    ctaData,
    comparisonData,
    reviewsData,
    checklistData,
    services,
    locations,
    pageBuilderResult,
  ] = await Promise.all([
    CMSAdapter.getLandingPageSEO().catch(() => null),
    CMSAdapter.getHeroSection().catch(() => null),
    CMSAdapter.getHowItWorks().catch(() => null),
    CMSAdapter.getCTASection().catch(() => null),
    CMSAdapter.getComparisonSection().catch(() => null),
    CMSAdapter.getReviewsSection().catch(() => null),
    CMSAdapter.getChecklistSection().catch(() => null),
    CMSAdapter.getAllServices().catch(() => []),
    CMSAdapter.getAllLocations().catch(() => []),
    fetchLandingPage().catch(() => null),
  ]);

  const seoData = seo || defaultSEO;

  // Extract page builder content from Strapi response
  const pageBuilderContent = pageBuilderResult?.data || null;

  return (
    <DynamicLandingPage
      schemaJsonLd={seoData.schemaJsonLd}
      additionalSchemas={seoData.additionalSchemas}
      headScripts={seoData.scripts.head}
      bodyEndScripts={seoData.scripts.bodyEnd}
      customCss={seoData.customCss}
      heroData={heroData}
      howItWorksData={howItWorksData}
      ctaData={ctaData}
      comparisonData={comparisonData}
      reviewsData={reviewsData}
      checklistData={checklistData}
      services={services}
      locations={locations}
      pageBuilderContent={pageBuilderContent}
    />
  );
}

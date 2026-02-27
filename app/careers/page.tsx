import { Metadata } from "next";
import { CMSAdapter } from "@/lib/cms-adapter";
import CareersPageClient from "./careers-client";

export const revalidate = 60;

const defaultSEO = {
  title: "Careers | Join The Clensy Team | Clensy Professional Cleaning",
  description: "Build a rewarding career with Clensy. We offer competitive pay, great benefits, and growth opportunities in New Jersey.",
  keywords: "careers, cleaning jobs, Clensy hiring, New Jersey cleaning careers, housekeeping jobs",
  canonicalUrl: "https://clensy.com/careers",
  robots: "index, follow",
  openGraph: {
    title: "Careers | Join The Clensy Team",
    description: "Build a rewarding career with Clensy. Competitive pay, benefits, and growth opportunities.",
    image: "https://www.stathakis.com/hs-fs/hubfs/cleaning-team-more-efficient.png?width=837&height=554&name=cleaning-team-more-efficient.png",
    type: "website" as const,
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Careers | Clensy Professional Cleaning",
    description: "Join our team. Competitive pay, benefits, and growth opportunities.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  let seo = defaultSEO;
  try {
    const fetchedSeo = await CMSAdapter.getCareersPageSEO();
    if (fetchedSeo) seo = { ...defaultSEO, ...fetchedSeo };
  } catch (error) {
    console.error("Failed to fetch Careers page SEO:", error);
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
      type: seo.openGraph.type,
    },
    twitter: {
      card: seo.twitter.card,
      title: seo.twitter.title,
      description: seo.twitter.description,
    },
  };
}

export default async function CareersPage() {
  const careersData = await CMSAdapter.getCareersPage();

  return <CareersPageClient initialCareersData={careersData} />;
}

import { Metadata } from "next";
import { CMSAdapter } from "@/lib/cms-adapter";
import DynamicChecklistPage from "@/components/dynamic-checklist-page";

export const dynamic = 'force-dynamic';
export const revalidate = 60;

const defaultSEO = {
  title: "Our Cleaning Checklist | Clensy Professional Cleaning",
  description: "Explore Clensy's comprehensive cleaning checklist. See exactly what's included in our routine, deep, and move-in/out cleaning services for every room.",
  keywords: "cleaning checklist, house cleaning checklist, professional cleaning checklist, deep cleaning checklist, move out cleaning checklist",
  canonicalUrl: "https://clensy.com/company/checklist",
  robots: "index, follow",
  openGraph: {
    title: "Our Cleaning Checklist | Clensy",
    description: "See our comprehensive cleaning checklist. We don't miss a spot!",
    image: "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750069438/website-images/j5wxvoguffksq4fwffuc.svg",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Cleaning Checklist | Clensy",
    description: "See our comprehensive cleaning checklist. We don't miss a spot!",
  },
  schemaJsonLd: null,
  scripts: { head: "", bodyStart: "", bodyEnd: "" },
  customCss: "",
};

export async function generateMetadata(): Promise<Metadata> {
  let seo = defaultSEO;
  
  try {
    const fetchedSeo = await CMSAdapter.getChecklistPageSEO();
    if (fetchedSeo) seo = { ...defaultSEO, ...fetchedSeo };
  } catch (error) {
    console.error("Failed to fetch Checklist page SEO:", error);
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

export default async function ChecklistPage() {
  let seo = defaultSEO;
  
  try {
    const fetchedSeo = await CMSAdapter.getChecklistPageSEO();
    if (fetchedSeo) seo = { ...defaultSEO, ...fetchedSeo };
  } catch (error) {
    console.error("Failed to fetch Checklist page SEO:", error);
  }

  return (
    <DynamicChecklistPage
      schemaJsonLd={seo.schemaJsonLd}
      headScripts={seo.scripts.head}
      bodyEndScripts={seo.scripts.bodyEnd}
      customCss={seo.customCss}
    />
  );
}

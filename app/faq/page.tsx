import { Metadata } from "next";
import { CMSAdapter } from "@/lib/cms-adapter";
import DynamicFAQPage from "@/components/dynamic-faq-page";

export const dynamic = 'force-dynamic';
export const revalidate = 60;

const defaultSEO = {
  title: "FAQ | Frequently Asked Questions | Clensy Cleaning Services",
  description: "Find answers to common questions about Clensy cleaning services, booking, pricing, and more.",
  keywords: "cleaning FAQ, cleaning questions, house cleaning FAQ, professional cleaning questions",
  canonicalUrl: "https://clensy.com/faq",
  robots: "index, follow",
  openGraph: {
    title: "FAQ | Clensy Cleaning Services",
    description: "Get answers to your cleaning questions.",
    image: "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750847616/shutterstock_2209715823_1_x80cn8.jpg",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ | Clensy Cleaning Services",
    description: "Get answers to your cleaning questions.",
  },
  schemaJsonLd: null,
  scripts: { head: "", bodyStart: "", bodyEnd: "" },
  customCss: "",
};

export async function generateMetadata(): Promise<Metadata> {
  let seo = defaultSEO;
  
  try {
    const fetchedSeo = await CMSAdapter.getFAQPageSEO();
    if (fetchedSeo) seo = { ...defaultSEO, ...fetchedSeo };
  } catch (error) {
    console.error("Failed to fetch FAQ page SEO:", error);
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

export default async function FAQPage() {
  let seo = defaultSEO;
  
  try {
    const fetchedSeo = await CMSAdapter.getFAQPageSEO();
    if (fetchedSeo) seo = { ...defaultSEO, ...fetchedSeo };
  } catch (error) {
    console.error("Failed to fetch FAQ page SEO:", error);
  }

  return (
    <DynamicFAQPage
      schemaJsonLd={seo.schemaJsonLd}
      headScripts={seo.scripts.head}
      bodyEndScripts={seo.scripts.bodyEnd}
      customCss={seo.customCss}
    />
  );
}

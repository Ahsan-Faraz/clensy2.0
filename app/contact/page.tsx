import { Metadata } from "next";
import { CMSAdapter } from "@/lib/cms-adapter";
import ContactPageClient from "./contact-client";

export const dynamic = 'force-dynamic';
export const revalidate = 60;

const defaultSEO = {
  title: "Contact Us | Clensy Professional Cleaning Services",
  description: "Get in touch with Clensy for professional cleaning services in New Jersey. Call us, email us, or fill out our contact form.",
  keywords: "contact clensy, cleaning service contact, New Jersey cleaning company, get a quote",
  canonicalUrl: "https://clensy.com/contact",
  robots: "index, follow",
  openGraph: {
    title: "Contact Clensy | Professional Cleaning Services",
    description: "Ready for a cleaner space? Contact Clensy today.",
    image: "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750847694/shutterstock_2478230727_bt7fos.jpg",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Contact Clensy", description: "Ready for a cleaner space? Contact Clensy today." },
  schemaJsonLd: null,
  scripts: { head: "", bodyStart: "", bodyEnd: "" },
  customCss: "",
};

export async function generateMetadata(): Promise<Metadata> {
  let seo = defaultSEO;
  try {
    const fetchedSeo = await CMSAdapter.getContactPageSEO();
    if (fetchedSeo) seo = { ...defaultSEO, ...fetchedSeo };
  } catch (error) {
    console.error("Failed to fetch Contact page SEO:", error);
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
    twitter: { card: seo.twitter.card as "summary_large_image", title: seo.twitter.title, description: seo.twitter.description },
  };
}

export default async function ContactPage() {
  let seo = defaultSEO;
  try {
    const fetchedSeo = await CMSAdapter.getContactPageSEO();
    if (fetchedSeo) seo = { ...defaultSEO, ...fetchedSeo };
  } catch (error) {
    console.error("Failed to fetch Contact page SEO:", error);
  }

  return <ContactPageClient schemaJsonLd={seo.schemaJsonLd} headScripts={seo.scripts.head} bodyEndScripts={seo.scripts.bodyEnd} customCss={seo.customCss} />;
}

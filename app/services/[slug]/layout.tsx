import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CMSAdapter from "@/lib/cms-adapter";

export const revalidate = 60;

// Generate dynamic metadata from Strapi
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  
  try {
    const service = await CMSAdapter.getServiceBySlug(slug);
    
    if (!service || !service.seo) {
      return {
        title: "Cleaning Service | Clensy",
        description: "Professional cleaning services tailored to your needs.",
      };
    }
    
    const seo = service.seo;
    
    return {
      title: seo.metaTitle,
      description: seo.metaDescription,
      keywords: seo.keywords?.join(', '),
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
                alt: seo.openGraph.title,
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
      other: {
        // Add schema JSON-LD if present
        ...(seo.schemaJsonLd && { 'application/ld+json': JSON.stringify(seo.schemaJsonLd) }),
      },
    };
  } catch (error) {
    console.error("Failed to fetch service SEO:", error);
    return {
      title: "Cleaning Service | Clensy",
      description: "Professional cleaning services tailored to your needs.",
    };
  }
}

export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

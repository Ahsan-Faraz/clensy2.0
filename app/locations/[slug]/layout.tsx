import type { Metadata } from "next";
import CMSAdapter from "@/lib/cms-adapter";

export const revalidate = 60;

// Generate dynamic metadata from Strapi
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const location = await CMSAdapter.getLocationBySlug(slug);
    
    if (!location || !location.seo) {
      return {
        title: "Service Location | Clensy",
        description: "Professional cleaning services in your area.",
      };
    }
    
    const seo = location.seo;
    
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
    console.error("Failed to fetch location SEO:", error);
    return {
      title: "Service Location | Clensy",
      description: "Professional cleaning services in your area.",
    };
  }
}

export default function LocationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Navbar and Footer are provided by parent layout (app/locations/layout.tsx)
  return <>{children}</>;
}

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SEOHead from "@/components/seo-head";

interface PageData {
  id: number;
  title: string;
  slug: string;
  content: string;
  htmlBlocks: string;
  featuredImage: string;
  excludeFromSitemap: boolean;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    canonicalURL: string;
    metaRobots: string;
    structuredData: any;
  };
  openGraph: {
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    twitterCard: string;
  };
  scripts: {
    headScripts: string;
    bodyStartScripts: string;
    bodyEndScripts: string;
  };
}

export default function DynamicPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/cms/pages/${slug}`);
        const result = await response.json();

        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error || "Page not found");
        }
      } catch (err) {
        console.error("Error fetching page:", err);
        setError("Failed to load page");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // Update document title when data loads
  useEffect(() => {
    if (data?.seo?.metaTitle) {
      document.title = data.seo.metaTitle;
    } else if (data?.title) {
      document.title = `${data.title} | Clensy`;
    }
  }, [data]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
          >
            Go Home
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero / Title Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{data.title}</h1>
        </div>
      </section>

      {/* Featured Image */}
      {data.featuredImage && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={data.featuredImage}
              alt={data.title}
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Rich Text Content */}
      {data.content && (
        <section className="py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="prose prose-lg max-w-none 
                prose-headings:text-gray-900 prose-headings:font-bold
                prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-blue-600 prose-a:font-medium prose-a:underline hover:prose-a:text-blue-800
                prose-ul:my-4 prose-li:text-gray-700
                prose-strong:text-gray-900
                prose-blockquote:border-blue-600 prose-blockquote:bg-blue-50 prose-blockquote:rounded-r-lg prose-blockquote:py-2 prose-blockquote:px-4
                prose-img:rounded-xl prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: data.content }}
            />
          </div>
        </section>
      )}

      {/* HTML Blocks (raw HTML like iframes, embeds, maps, booking widgets, etc.) */}
      {data.htmlBlocks && (
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="html-blocks-container"
              dangerouslySetInnerHTML={{ __html: data.htmlBlocks }}
            />
          </div>
        </section>
      )}

      {/* Back Link */}
      <section className="py-8 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </section>

      <Footer />

      {/* SEO Scripts and Schema */}
      <SEOHead
        schemaJsonLd={data.seo?.structuredData}
        headScripts={data.scripts?.headScripts}
        bodyStartScripts={data.scripts?.bodyStartScripts}
        bodyEndScripts={data.scripts?.bodyEndScripts}
      />
    </main>
  );
}

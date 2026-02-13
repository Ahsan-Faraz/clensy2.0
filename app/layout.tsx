import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import "./globals.css"
import Providers from "./providers"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://72.60.27.190';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

/**
 * Parse HTML string and extract meta tag attributes for server-side rendering.
 * This ensures meta tags appear in the raw HTML source (critical for SEO verification).
 */
function parseMetaTags(html: string): Array<Record<string, string>> {
  const metaTags: Array<Record<string, string>> = [];
  const metaRegex = /<meta\s+([^>]*?)\s*\/?>/gi;
  let match;
  while ((match = metaRegex.exec(html)) !== null) {
    const attrs: Record<string, string> = {};
    const attrRegex = /(\w[\w-]*)=["']([^"']*?)["']/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(match[1])) !== null) {
      attrs[attrMatch[1]] = attrMatch[2];
    }
    if (Object.keys(attrs).length > 0) {
      metaTags.push(attrs);
    }
  }
  return metaTags;
}

/**
 * Extract non-meta content (scripts, links, etc.) from HTML string.
 * Returns HTML with meta tags removed.
 */
function getNonMetaHtml(html: string): string {
  return html.replace(/<meta\s+[^>]*?\s*\/?>/gi, '').trim();
}

async function getGlobalScripts(): Promise<{ globalHeadScripts: string; globalBodyEndScripts: string }> {
  try {
    const params = new URLSearchParams({ populate: '*' });
    const base = STRAPI_URL.replace(/\/+$/, '');
    const url = `${base}/api/global-setting?${params.toString()}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
    };
    const response = await fetch(url, { headers, next: { revalidate: 300 } }); // Cache for 5 minutes
    if (!response.ok) return { globalHeadScripts: '', globalBodyEndScripts: '' };
    const json = await response.json();
    const data = json?.data;
    return {
      globalHeadScripts: data?.globalHeadScripts || '',
      globalBodyEndScripts: data?.globalBodyEndScripts || '',
    };
  } catch (error) {
    console.error('Failed to fetch global scripts:', error);
    return { globalHeadScripts: '', globalBodyEndScripts: '' };
  }
}

export const metadata: Metadata = {
  title: "CLENSY - Professional Cleaning Services",
  description: "Professional cleaning services tailored to your needs",
  generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { globalHeadScripts, globalBodyEndScripts } = await getGlobalScripts();

  // Parse meta tags server-side so they appear in raw HTML source
  const metaTags = globalHeadScripts ? parseMetaTags(globalHeadScripts) : [];
  const nonMetaScripts = globalHeadScripts ? getNonMetaHtml(globalHeadScripts) : '';

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="//fonts.googleapis.com/css?family=Montserrat:300,400,400i,500,700&display=swap"
          media="all"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          async
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        />
        {/* Server-rendered meta tags from Strapi (Google Search Console verification, etc.) */}
        {metaTags.map((attrs, i) => (
          <meta key={`global-meta-${i}`} {...attrs} />
        ))}
        {/* Non-meta head scripts (analytics, tracking, etc.) */}
        {nonMetaScripts && (
          <Script
            id="global-head-scripts"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: nonMetaScripts }}
          />
        )}
      </head>
      {/* suppressHydrationWarning avoids extension-added attributes (e.g. cz-shortcut-listen) causing hydration mismatches */}
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
        {/* Global Body End Scripts from Strapi */}
        {globalBodyEndScripts && (
          <Script
            id="global-body-end-scripts"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{ __html: globalBodyEndScripts }}
          />
        )}
      </body>
    </html>
  )
}
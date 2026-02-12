import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import "./globals.css"
import Providers from "./providers"
import GlobalHeadScripts from "@/components/global-head-scripts"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://72.60.27.190';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

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
        {/* Global Head Scripts from Strapi (Google Search Console verification, analytics, etc.) */}
        {globalHeadScripts && (
          <GlobalHeadScripts html={globalHeadScripts} />
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
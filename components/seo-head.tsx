"use client";

import { useEffect } from "react";
import Script from "next/script";

interface SEOHeadProps {
  schemaJsonLd?: object | null;
  additionalSchemas?: object[];
  headScripts?: string;
  bodyStartScripts?: string;
  bodyEndScripts?: string;
  customCss?: string;
}

export default function SEOHead({
  schemaJsonLd,
  additionalSchemas = [],
  headScripts,
  bodyStartScripts,
  bodyEndScripts,
  customCss,
}: SEOHeadProps) {
  // Inject custom CSS
  useEffect(() => {
    if (customCss) {
      const style = document.createElement("style");
      style.id = "cms-custom-css";
      style.textContent = customCss;
      document.head.appendChild(style);

      return () => {
        const existingStyle = document.getElementById("cms-custom-css");
        if (existingStyle) {
          existingStyle.remove();
        }
      };
    }
  }, [customCss]);

  return (
    <>
      {/* Main JSON-LD Schema */}
      {schemaJsonLd && (
        <Script
          id="schema-jsonld-main"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaJsonLd),
          }}
          strategy="afterInteractive"
        />
      )}

      {/* Additional Schemas */}
      {additionalSchemas.map((schema, index) => (
        <Script
          key={`schema-${index}`}
          id={`schema-jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
          strategy="afterInteractive"
        />
      ))}

      {/* Head Scripts (Google Analytics, etc.) */}
      {headScripts && (
        <Script
          id="cms-head-scripts"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: headScripts }}
        />
      )}

      {/* Body Start Scripts */}
      {bodyStartScripts && (
        <Script
          id="cms-body-start-scripts"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: bodyStartScripts }}
        />
      )}

      {/* Body End Scripts */}
      {bodyEndScripts && (
        <Script
          id="cms-body-end-scripts"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{ __html: bodyEndScripts }}
        />
      )}
    </>
  );
}

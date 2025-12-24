"use client";

import { useEffect } from "react";

interface SEOScriptsProps {
  headScripts?: string;
  bodyStartScripts?: string;
  bodyEndScripts?: string;
  schemaJsonLd?: any;
  customCss?: string;
}

export default function SEOScripts({
  headScripts,
  bodyStartScripts,
  bodyEndScripts,
  schemaJsonLd,
  customCss,
}: SEOScriptsProps) {
  useEffect(() => {
    // Inject head scripts
    if (headScripts) {
      const script = document.createElement("script");
      script.innerHTML = headScripts;
      script.setAttribute("data-seo-script", "head");
      document.head.appendChild(script);
    }

    // Inject body start scripts
    if (bodyStartScripts) {
      const script = document.createElement("script");
      script.innerHTML = bodyStartScripts;
      script.setAttribute("data-seo-script", "body-start");
      document.body.insertBefore(script, document.body.firstChild);
    }

    // Inject custom CSS
    if (customCss) {
      const style = document.createElement("style");
      style.innerHTML = customCss;
      style.setAttribute("data-seo-style", "custom");
      document.head.appendChild(style);
    }

    // Cleanup function
    return () => {
      // Remove scripts on unmount
      document.querySelectorAll('[data-seo-script]').forEach((el) => el.remove());
      document.querySelectorAll('[data-seo-style]').forEach((el) => el.remove());
    };
  }, [headScripts, bodyStartScripts, customCss]);

  return (
    <>
      {/* Schema JSON-LD */}
      {schemaJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
        />
      )}
      {/* Body end scripts are injected via useEffect */}
    </>
  );
}


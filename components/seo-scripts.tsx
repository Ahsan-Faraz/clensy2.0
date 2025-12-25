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
      if (document.body) {
        document.body.insertBefore(script, document.body.firstChild);
      } else {
        // If body doesn't exist yet, wait for it
        const observer = new MutationObserver((mutations, obs) => {
          if (document.body) {
            document.body.insertBefore(script, document.body.firstChild);
            obs.disconnect();
          }
        });
        observer.observe(document.documentElement, { childList: true });
      }
    }

    // Inject body end scripts
    if (bodyEndScripts) {
      const script = document.createElement("script");
      script.innerHTML = bodyEndScripts;
      script.setAttribute("data-seo-script", "body-end");
      if (document.body) {
        document.body.appendChild(script);
      } else {
        // If body doesn't exist yet, wait for it
        const observer = new MutationObserver((mutations, obs) => {
          if (document.body) {
            document.body.appendChild(script);
            obs.disconnect();
          }
        });
        observer.observe(document.documentElement, { childList: true });
      }
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
  }, [headScripts, bodyStartScripts, bodyEndScripts, customCss]);

  return (
    <>
      {/* Schema JSON-LD */}
      {schemaJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
        />
      )}
    </>
  );
}




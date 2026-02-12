"use client";

import { useEffect } from "react";

/**
 * Injects raw HTML (meta tags, scripts, etc.) into <head> at runtime.
 * This handles both <meta> tags and <script> tags from Strapi's globalHeadScripts field.
 */
export default function GlobalHeadScripts({ html }: { html: string }) {
  useEffect(() => {
    if (!html) return;

    // Create a temporary container to parse the HTML
    const container = document.createElement("div");
    container.innerHTML = html;

    const injectedElements: Node[] = [];

    // Process each child element
    Array.from(container.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const tagName = el.tagName.toLowerCase();

        if (tagName === "meta") {
          // Create a proper <meta> element
          const meta = document.createElement("meta");
          Array.from(el.attributes).forEach((attr) => {
            meta.setAttribute(attr.name, attr.value);
          });
          document.head.appendChild(meta);
          injectedElements.push(meta);
        } else if (tagName === "script") {
          // Create a proper <script> element (so it actually executes)
          const script = document.createElement("script");
          Array.from(el.attributes).forEach((attr) => {
            script.setAttribute(attr.name, attr.value);
          });
          if (el.textContent) {
            script.textContent = el.textContent;
          }
          document.head.appendChild(script);
          injectedElements.push(script);
        } else if (tagName === "link") {
          // Create a proper <link> element
          const link = document.createElement("link");
          Array.from(el.attributes).forEach((attr) => {
            link.setAttribute(attr.name, attr.value);
          });
          document.head.appendChild(link);
          injectedElements.push(link);
        } else if (tagName === "style") {
          const style = document.createElement("style");
          style.textContent = el.textContent || "";
          document.head.appendChild(style);
          injectedElements.push(style);
        }
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
        // Plain text that might be a raw script — wrap it
        const script = document.createElement("script");
        script.textContent = node.textContent;
        document.head.appendChild(script);
        injectedElements.push(script);
      }
    });

    // Cleanup on unmount
    return () => {
      injectedElements.forEach((el) => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    };
  }, [html]);

  return null;
}

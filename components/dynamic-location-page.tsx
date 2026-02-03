'use client';

import { Render } from "@wecre8websites/strapi-page-builder-react";
import { useEffect, useState, useMemo } from "react";
import pageBuilderConfig from "@/lib/page-builder-components";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SEOScripts from "@/components/seo-scripts";
import Link from "next/link";
import { MapPin, Calendar } from "lucide-react";

interface DynamicLocationPageProps {
  slug: string;
  locationData: any;
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export default function DynamicLocationPage({ slug, locationData }: DynamicLocationPageProps) {
  const [templateData, setTemplateData] = useState<{ templateJson: any; content: any } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usePageBuilder, setUsePageBuilder] = useState(false);

  const data = locationData;

  useEffect(() => {
    const fetchTemplateData = async () => {
      try {
        // Fetch by slug for collection types
        const response = await fetch(`/api/page-builder/content/location?slug=${encodeURIComponent(slug)}`);
        const result = await response.json();

        if (result.success && result.data) {
          const content = result.data;
          const templateField = result.templateField || 'Location_Page';
          const template = content[templateField];
          
          if (template?.json?.content && template.json.content.length > 0) {
            setTemplateData({
              templateJson: template.json,
              content,
            });
            setUsePageBuilder(true);
          }
        }
      } catch (err) {
        console.error('[DynamicLocationPage] Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchTemplateData();
    }
  }, [slug]);

  // Get location name
  const locationName = data?.name || data?.county || slug?.charAt(0).toUpperCase() + slug?.slice(1) || 'Location';

  // Get service areas with fallback
  const serviceAreas = data?.serviceAreas && data.serviceAreas.length > 0 
    ? data.serviceAreas 
    : [];

  // Get hours with fallback
  const hours = data?.contactSection?.hours && data.contactSection.hours.length > 0
    ? data.contactSection.hours
    : [
        { day: "Monday - Friday", hours: "8:00 AM - 6:00 PM" },
        { day: "Saturday", hours: "9:00 AM - 4:00 PM" },
        { day: "Sunday", hours: "Closed" },
      ];

  if (isLoading) {
    return (
      <main className="overflow-x-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </main>
    );
  }

  // Use Page Builder rendering with hardcoded service areas section
  if (usePageBuilder && templateData) {
    return (
      <main className="overflow-x-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <div className="relative z-50">
          <Navbar />
        </div>
        
        {/* Page Builder: All location components */}
        <Render
          config={pageBuilderConfig}
          data={{ templateJson: templateData.templateJson, content: templateData.content }}
          strapi={{ url: STRAPI_URL, imageUrl: STRAPI_URL }}
        />

        {/* HARDCODED: Service Areas Section (if not handled by template) */}
        {serviceAreas.length > 0 && (
          <ServiceAreasSection 
            locationName={locationName}
            serviceAreas={serviceAreas}
          />
        )}

        {/* HARDCODED: Interactive Map Section */}
        <MapSection locationName={locationName} slug={slug} />

        <Footer />
        
        {/* SEO Scripts and Schema */}
        {data?.seo && (
          <SEOScripts
            headScripts={data.seo.headScripts}
            bodyStartScripts={data.seo.bodyStartScripts}
            bodyEndScripts={data.seo.bodyEndScripts}
            schemaJsonLd={data.seo.schemaJsonLd}
            customCss={data.seo.customCss}
          />
        )}
      </main>
    );
  }

  // Fallback: Return null and let the original page handle rendering
  return null;
}

// ============================================================================
// HARDCODED SECTIONS - These match the original location page exactly
// ============================================================================

interface ServiceAreasSectionProps {
  locationName: string;
  serviceAreas: string[];
}

function ServiceAreasSection({ locationName, serviceAreas }: ServiceAreasSectionProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-br from-gray-900 to-blue-900/50 rounded-xl shadow-xl overflow-hidden backdrop-blur-sm border border-blue-900/30">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">
            Service Areas in {locationName} County
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {serviceAreas.map((area) => (
              <div
                key={area}
                className="flex items-center py-3 px-4 bg-gray-700/50 border border-gray-700 rounded-lg hover:bg-blue-900/20 hover:border-blue-500/50 transition-all"
              >
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                <span className="text-white">{area}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface MapSectionProps {
  locationName: string;
  slug: string;
}

function MapSection({ locationName, slug }: MapSectionProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Service Area</h2>
        </div>
        <div className="relative h-[400px] w-full">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-gray-900 flex items-center justify-center">
            <div className="relative">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full bg-white px-4 py-2 rounded-full shadow-lg whitespace-nowrap">
                <span className="font-semibold text-gray-800">
                  {locationName} County
                </span>
              </div>
            </div>
          </div>

          {/* Schedule Service Button */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-blue-800 to-indigo-800 text-white py-4 px-6 flex justify-center z-30">
            <Link
              href={`/booking?location=${slug}`}
              className="flex items-center font-medium hover:text-blue-200 transition-colors"
            >
              <Calendar className="h-5 w-5 mr-2" /> SCHEDULE A CLEANING
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Calendar,
  ChevronRight,
  Clock,
  Mail,
  Loader2,
} from "lucide-react";
import SEOScripts from "@/components/seo-scripts";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Render } from "@wecre8websites/strapi-page-builder-react";
import pageBuilderConfig from "@/lib/page-builder-components";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface LocationData {
  name?: string;
  slug?: string;
  county?: string;
  heroSection: {
    title: string;
    subtitle: string;
    backgroundImage: string;
    ctaButton1: string;
    ctaButton2: string;
  };
  contactSection: {
    title: string;
    phone: string;
    email: string;
    address: string;
    hours: Array<{
      day: string;
      hours: string;
    }>;
  };
  serviceAreas: string[];
  aboutSection: {
    title: string;
    description: string;
  };
  seo?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    canonicalUrl: string;
    robots: string;
    h1: string;
    h2: string;
    h3: string;
    openGraph: {
      title: string;
      description: string;
      image: string;
      type: string;
    };
    twitter: {
      card: string;
      title: string;
      description: string;
    };
    schemaJsonLd: any;
    schemaType: string;
    headScripts: string;
    bodyStartScripts: string;
    bodyEndScripts: string;
    customCss: string;
  };
  localSeo?: {
    city: string;
    county: string;
    state: string;
    zipCode: string;
    serviceType: string;
  };
  imageAlt?: {
    heroBackground: string;
  };
}

export default function DynamicLocationPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [templateData, setTemplateData] = useState<{ templateJson: any; content: any } | null>(null);
  const [usePageBuilder, setUsePageBuilder] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch location data from CMS
        const response = await fetch(`/api/cms/locations/${slug}`);
        const result = await response.json();
        
        if (result.success && result.data) {
          setData(result.data);
        } else {
          setError(result.error || 'Failed to load location data');
        }
        
        // Also fetch Page Builder template data
        try {
          const pbResponse = await fetch(`/api/page-builder/content/location?slug=${encodeURIComponent(slug)}`);
          const pbResult = await pbResponse.json();
          
          if (pbResult.success && pbResult.data) {
            const content = pbResult.data;
            const templateField = pbResult.templateField || 'Location_Page';
            const template = content[templateField];
            
            if (template?.json?.content && template.json.content.length > 0) {
              setTemplateData({
                templateJson: template.json,
                content,
              });
              setUsePageBuilder(true);
            }
          }
        } catch (pbErr) {
          console.warn('[Location Page] Page Builder template not available:', pbErr);
        }
      } catch (err) {
        console.error('Error fetching location data:', err);
        setError('An error occurred while loading location data');
      } finally {
        setIsLoading(false);
        setIsLoaded(true);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center p-8 max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">Location Not Found</h2>
          <p className="mb-6">{error || 'The requested location could not be found.'}</p>
          <Link 
            href="/locations" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Locations
          </Link>
        </div>
      </div>
    );
  }

  const { 
    heroSection, 
    contactSection, 
    serviceAreas, 
    aboutSection 
  } = data;

  const locationName = data.name || data.county || slug.charAt(0).toUpperCase() + slug.slice(1);

  // ==================== PAGE BUILDER RENDERING ====================
  // If Page Builder template exists, use it for layout with hardcoded Service Areas only
  if (usePageBuilder && templateData) {
    // Merge synced template data with CMS data as fallback
    // PRIORITY: templateData.content (synced) > CMS data (initial fetch)
    // This ensures "Sync to Site" changes are reflected immediately
    const tc = templateData.content || {}; // Template content (synced data)
    const mergedContent = {
      ...tc,
      // Use synced template data first, fall back to CMS data if not available
      heroTitle: tc.heroTitle || heroSection?.title,
      heroSubtitle: tc.heroSubtitle || heroSection?.subtitle,
      heroBackgroundImageUrl: tc.heroBackgroundImageUrl || heroSection?.backgroundImage,
      ctaButton1Text: tc.ctaButton1Text || heroSection?.ctaButton1,
      ctaButton2Text: tc.ctaButton2Text || heroSection?.ctaButton2,
      contactTitle: tc.contactTitle || contactSection?.title || 'Contact Information',
      phoneNumber: tc.phoneNumber || contactSection?.phone,
      emailAddress: tc.emailAddress || contactSection?.email,
      hours: tc.hours || JSON.stringify(contactSection?.hours || []),
      locationName: tc.locationName || locationName,
      aboutTitle: tc.aboutTitle || aboutSection?.title,
      aboutDescription: tc.aboutDescription || aboutSection?.description,
    };

    return (
      <main className="overflow-x-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 min-h-screen">
        <div className="relative z-50">
          <Navbar />
        </div>
        
        {/* Page Builder: All location components in their configured order */}
        {/* Wrapper forces transparent background to override any Page Builder library styles */}
        <div className="bg-transparent [&>*]:!bg-transparent [&_[data-puck-render]]:!bg-transparent">
          <Render
            config={pageBuilderConfig}
            data={{ templateJson: templateData.templateJson, content: mergedContent }}
            strapi={{ url: STRAPI_URL, imageUrl: STRAPI_URL }}
          />
        </div>

        {/* Breadcrumb Navigation */}
        <div className="bg-gradient-to-r from-gray-900 to-black py-4 border-y border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center text-sm text-gray-400">
              <Link
                href="/locations"
                className="hover:text-blue-400 transition-colors"
              >
                All Locations
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-white font-medium">{locationName} County</span>
            </div>
          </div>
        </div>

        {/* HARDCODED: Service Areas List - Always at bottom, not in Page Builder */}
        {serviceAreas && serviceAreas.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-gradient-to-br from-gray-900 to-blue-900/50 rounded-xl shadow-xl overflow-hidden backdrop-blur-sm border border-blue-900/30">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white">Service Areas in {locationName} County</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {serviceAreas.map((area: string) => (
                    <div key={area} className="flex items-center py-3 px-4 bg-gray-700/50 border border-gray-700 rounded-lg hover:bg-blue-900/20 hover:border-blue-500/50 transition-all">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      <span className="text-white">{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <Footer />
        
        {/* SEO Scripts */}
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

  // ==================== FALLBACK: Original Hardcoded Rendering ====================
  return (
    <main className="overflow-x-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] bg-black pt-16">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroSection.backgroundImage || 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920'}
            alt={data.imageAlt?.heroBackground || `${locationName} Skyline`}
            fill
            className="object-cover brightness-90"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 gap-8 items-center min-h-[calc(60vh-64px)]">
            <div className="flex flex-col justify-end h-full pb-16">
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
                {heroSection.title}
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl">
                {heroSection.subtitle}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/booking"
                  className="flex px-8 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors items-center"
                >
                  <Calendar className="mr-2 h-5 w-5" /> {heroSection.ctaButton1 || 'Get a Quote'}
                </Link>
                <Link
                  href={`tel:${contactSection.phone?.replace(/[^0-9+]/g, '') || ''}`}
                  className="inline-flex items-center px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-md font-medium hover:bg-white/20 transition-colors"
                >
                  <Phone className="mr-2 h-5 w-5" /> {heroSection.ctaButton2 || 'Contact Us'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <div className="bg-gradient-to-r from-gray-900 to-black py-4 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-sm text-gray-400">
            <Link
              href="/locations"
              className="hover:text-blue-400 transition-colors"
            >
              All Locations
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-white font-medium">{locationName} County</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Contact Info and Hours */}
          <div className="lg:col-span-1 space-y-8">
            {/* Contact Information Card */}
            <div className="bg-gradient-to-br from-blue-900/80 to-gray-900 rounded-xl shadow-xl overflow-hidden backdrop-blur-sm border border-blue-900/30">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white">
                  Contact Information
                </h2>
              </div>
              <div className="p-6 space-y-6">
                {contactSection.phone && (
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-gray-300 font-medium mb-1">Phone</h3>
                      <a
                        href={`tel:${contactSection.phone.replace(/[^0-9+]/g, '')}`}
                        className="text-white hover:text-blue-400 transition-colors"
                      >
                        {contactSection.phone}
                      </a>
                    </div>
                  </div>
                )}

                {contactSection.email && (
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-gray-300 font-medium mb-1">Email</h3>
                      <a
                        href={`mailto:${contactSection.email}`}
                        className="text-white hover:text-blue-400 transition-colors"
                      >
                        {contactSection.email}
                      </a>
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <Link
                    href="/booking"
                    className="inline-block w-full py-3 bg-blue-600 text-white rounded-md text-center font-medium hover:bg-blue-700 transition-colors"
                  >
                    Request a Quote
                  </Link>
                </div>
              </div>
            </div>

            {/* Hours Card */}
            {contactSection.hours && contactSection.hours.length > 0 && (
              <div className="bg-gradient-to-br from-gray-900 to-blue-900/70 rounded-xl shadow-xl overflow-hidden backdrop-blur-sm border border-blue-900/30">
                <div className="p-6 border-b border-gray-700">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <Clock className="h-5 w-5 text-blue-400 mr-2" />
                    Hours of Operation
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {contactSection.hours.map((dayHours, index) => (
                      <div key={dayHours.day}>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 font-medium">{dayHours.day}</span>
                          <span className="text-white">{dayHours.hours}</span>
                        </div>
                        {index < contactSection.hours.length - 1 && (
                          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent my-2"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Map and Description */}
          <div className="lg:col-span-2 space-y-8">
            {/* Interactive Map */}
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
                    href="/booking"
                    className="flex items-center font-medium hover:text-blue-200 transition-colors"
                  >
                    <Calendar className="h-5 w-5 mr-2" /> SCHEDULE A CLEANING
                  </Link>
                </div>
              </div>
            </div>

            {/* About This Location */}
            {aboutSection && (
              <div className="bg-gradient-to-br from-indigo-900/70 to-gray-900 rounded-xl shadow-xl overflow-hidden backdrop-blur-sm border border-indigo-900/30">
                <div className="p-6 border-b border-gray-700">
                  <h2 className="text-xl font-bold text-white">
                    {aboutSection.title || `About ${locationName} County`}
                  </h2>
                </div>
                <div className="p-6">
                  <div className="prose prose-invert max-w-none">
                    {aboutSection.description?.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-gray-300 mb-4 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Link
                      href={`/booking?location=${slug}`}
                      className="inline-block px-8 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                    >
                      Get a Free Quote
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Service Areas Section */}
        {serviceAreas && serviceAreas.length > 0 && (
          <div className="mt-12">
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
        )}
      </div>
      
      {/* SEO Scripts and Schema */}
      {data.seo && (
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

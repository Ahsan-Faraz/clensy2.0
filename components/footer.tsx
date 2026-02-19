"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

interface Service {
  name: string;
  slug: string;
  serviceType: string;
}

interface Location {
  name: string;
  slug: string;
  county: string;
}

// Hardcoded defaults — render these instantly while CMS data loads
const DEFAULT_SERVICES: Service[] = [
  { name: 'Routine Cleaning', slug: 'routine-cleaning', serviceType: 'routine' },
  { name: 'Deep Cleaning', slug: 'deep-cleaning', serviceType: 'deep' },
  { name: 'Airbnb Cleaning', slug: 'airbnb-cleaning', serviceType: 'airbnb' },
  { name: 'Move In/Out Cleaning', slug: 'moving-cleaning', serviceType: 'moving' },
  { name: 'Post-Construction Cleaning', slug: 'post-construction-cleaning', serviceType: 'post-construction' },
  { name: 'Office Cleaning', slug: 'office-cleaning', serviceType: 'office' },
];

const DEFAULT_LOCATIONS: Location[] = [
  { name: 'Bergen County', slug: 'bergen', county: 'Bergen County' },
  { name: 'Hudson County', slug: 'hudson', county: 'Hudson County' },
  { name: 'Essex County', slug: 'essex', county: 'Essex County' },
  { name: 'Passaic County', slug: 'passaic', county: 'Passaic County' },
  { name: 'Union County', slug: 'union', county: 'Union County' },
  { name: 'Morris County', slug: 'morris', county: 'Morris County' },
];

export interface FooterProps {
  services?: Service[];
  locations?: Location[];
}

export default function Footer({ services: propServices, locations: propLocations }: FooterProps) {
  // Fallback state for when no props are provided (non-landing pages)
  const [fetchedServices, setFetchedServices] = useState<Service[]>([]);
  const [fetchedLocations, setFetchedLocations] = useState<Location[]>([]);

  // Fetch from CMS only if no server props were provided (non-landing pages)
  useEffect(() => {
    if (propServices !== undefined && propLocations !== undefined) return;
    const fetchData = async () => {
      try {
        const [servicesRes, locationsRes] = await Promise.all([
          fetch('/api/cms/services'),
          fetch('/api/cms/locations')
        ]);
        const servicesData = await servicesRes.json();
        const locationsData = await locationsRes.json();
        if (servicesData.success && (servicesData.data?.length ?? 0) > 0) {
          setFetchedServices(servicesData.data);
        }
        if (locationsData.success && (locationsData.data?.length ?? 0) > 0) {
          setFetchedLocations(locationsData.data);
        }
      } catch {
        // Silently fail - defaults are already shown
      }
    };
    fetchData();
  }, [propServices, propLocations]);

  // Priority: server props > client-fetched CMS data > hardcoded defaults
  const services = (propServices && propServices.length > 0)
    ? propServices
    : (fetchedServices.length > 0 ? fetchedServices : DEFAULT_SERVICES);
  const locations = (propLocations && propLocations.length > 0)
    ? propLocations
    : (fetchedLocations.length > 0 ? fetchedLocations : DEFAULT_LOCATIONS);

  const bgColor = "bg-black";
  const textColor = "text-white";
  const headingColor = "text-white";
  const borderColor = "border-gray-800";
  const iconColor = "text-gray-400";
  const hoverColor = "text-[#007BFF]";

  return (
    <footer className={`py-16 ${bgColor} relative overflow-hidden`}>
      {/* Animated wavy line at the top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden">
        <svg width="100%" height="20" className="fill-current text-[#111]">
          <motion.path
            d="M0,0 C150,20 350,0 500,10 C650,20 850,0 1000,10 C1150,20 1350,0 1500,10 C1650,20 1850,0 2000,10 L2000,0 L0,0 Z"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="inline-block mb-6">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/clensy-3YxRqAp8bxVkkiFlQmcTlgTeLxuJ4t.png"
                alt="Clensy Logo"
                width={120}
                height={40}
                className="brightness-0 invert"
              />
            </Link>
            <p className={`${textColor} text-sm mb-6`}>
              Professional cleaning services tailored to your needs.
            </p>
            <div className="flex space-x-4 mb-6">
              <motion.a
                href="https://facebook.com/clensycleaning" target="_blank" rel="noopener noreferrer"
                className={`${iconColor} hover:${hoverColor}`}
                whileHover={{ scale: 1.2, color: "#007BFF" }}
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="https://instagram.com/clensycleaning" target="_blank" rel="noopener noreferrer"
                className={`${iconColor} hover:${hoverColor}`}
                whileHover={{ scale: 1.2, color: "#007BFF" }}
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5" />
              </motion.a>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className={`h-5 w-5 ${iconColor}`} />
                <p className={`${textColor} text-sm`}>
                124 Little Falls Rd, Suite C-1, Fairfield, NJ 07004
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className={`h-5 w-5 ${iconColor}`} />
                <a
                  href="tel:+15513054081"
                  className={`${textColor} text-sm hover:${hoverColor}`}
                >
                  (551) 305-4081
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className={`h-5 w-5 ${iconColor}`} />
                <a
                  href="mailto:info@clensy.com"
                  className={`${textColor} text-sm hover:${hoverColor}`}
                >
                  info@clensy.com
                </a>
              </div>
            </div>
          </div>

          {/* Services - Dynamic from Strapi */}
          <div>
            <h3 className={`text-sm font-bold ${headingColor} mb-4`}>
              Services
            </h3>
            <ul className="space-y-2">
              {services.length > 0 ? (
                services.map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`/services/${service.slug}`}
                      className={`text-sm ${textColor} hover:${hoverColor}`}
                    >
                      {service.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li className={`text-sm ${textColor} opacity-50`}>
                  No services available
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className={`text-sm font-bold ${headingColor} mb-4`}>
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/company/checklist"
                  className={`text-sm ${textColor} hover:${hoverColor}`}
                >
                  Cleaning Checklist
                </Link>
              </li>
              <li>
                <Link
                  href="/company/about"
                  className={`text-sm ${textColor} hover:${hoverColor}`}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className={`text-sm ${textColor} hover:${hoverColor}`}
                >
                  Join The Team
                </Link>
              </li>
              {locations.length > 0 && (
                <li>
                  <Link
                    href="/locations"
                    className={`text-sm ${textColor} hover:${hoverColor}`}
                  >
                    Locations
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href="/faq"
                  className={`text-sm ${textColor} hover:${hoverColor}`}
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className={`text-sm ${textColor} hover:${hoverColor}`}
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Locations - Dynamic from Strapi */}
          <div>
            <h3 className={`text-sm font-bold ${headingColor} mb-4`}>
              Locations
            </h3>
            <ul className="space-y-2">
              {locations.length > 0 ? (
                locations.map((location) => (
                  <li key={location.slug}>
                    <Link
                      href={`/locations/${location.slug}`}
                      className={`text-sm ${textColor} hover:${hoverColor}`}
                    >
                      {location.name || location.county}
                    </Link>
                  </li>
                ))
              ) : (
                <li className={`text-sm ${textColor} opacity-50`}>
                  No locations available
                </li>
              )}
            </ul>
          </div>
        </div>

        <div
          className={`border-t ${borderColor} mt-12 pt-8 flex flex-col md:flex-row justify-between items-center`}
        >
          <p className={`${textColor} text-sm`}>
            &copy; {new Date().getFullYear()} Clensy. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/privacy-policy"
              className={`text-sm ${textColor} hover:${hoverColor}`}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className={`text-sm ${textColor} hover:${hoverColor}`}
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

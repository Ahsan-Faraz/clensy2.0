import { MetadataRoute } from 'next';
import CMSAdapter from '@/lib/cms-adapter';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://clensy.com';
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/locations`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/booking`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/company/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/company/checklist`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Dynamic service pages
  let servicePages: MetadataRoute.Sitemap = [];
  try {
    const services = await CMSAdapter.getAllServices();
    servicePages = services
      .filter((service) => service.slug) // Only include services with slugs
      .map((service) => ({
        url: `${baseUrl}/services/${service.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
  } catch (error) {
    console.error('Error fetching services for sitemap:', error);
  }

  // Dynamic location pages
  let locationPages: MetadataRoute.Sitemap = [];
  try {
    const locations = await CMSAdapter.getAllLocations();
    locationPages = locations
      .filter((location) => location.slug) // Only include locations with slugs
      .map((location) => ({
        url: `${baseUrl}/locations/${location.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
  } catch (error) {
    console.error('Error fetching locations for sitemap:', error);
  }

  // Generic pages from Strapi (if page content type exists)
  let genericPages: MetadataRoute.Sitemap = [];
  try {
    const globalSettings = await CMSAdapter.getGlobalSettings();
    // Check if we should include generic pages
    // This would require a getAllPages method if you have a generic page content type
  } catch (error) {
    // Silently fail if pages don't exist
  }

  return [...staticPages, ...servicePages, ...locationPages, ...genericPages];
}


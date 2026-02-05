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

  // Dynamic service pages - use revalidate for static generation
  let servicePages: MetadataRoute.Sitemap = [];
  try {
    const services = await CMSAdapter.getAllServices({ revalidate: 3600 });
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

  // Dynamic location pages - use revalidate for static generation
  let locationPages: MetadataRoute.Sitemap = [];
  try {
    const locations = await CMSAdapter.getAllLocations({ revalidate: 3600 });
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

  return [...staticPages, ...servicePages, ...locationPages];
}



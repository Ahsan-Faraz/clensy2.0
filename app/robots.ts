import { MetadataRoute } from 'next';
import CMSAdapter from '@/lib/cms-adapter';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://clensy.com';
  
  try {
    const globalSettings = await CMSAdapter.getGlobalSettings();
    
    // If robots.txt content exists in Strapi, parse it
    if (globalSettings?.robotsTxt) {
      const robotsContent = globalSettings.robotsTxt;
      
      // Extract sitemap URL from content
      const sitemapMatch = robotsContent.match(/Sitemap:\s*(.+)/i);
      const sitemapUrl = sitemapMatch ? sitemapMatch[1].trim() : `${baseUrl}/sitemap.xml`;
      
      // Parse rules from content
      const rules: Array<{ userAgent: string; allow?: string | string[]; disallow?: string | string[] }> = [];
      const lines = robotsContent.split('\n');
      let currentUserAgent = '*';
      let currentAllow: string[] = [];
      let currentDisallow: string[] = [];
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        
        const lowerLine = trimmed.toLowerCase();
        
        if (lowerLine.startsWith('user-agent:')) {
          // Save previous rules if any
          if (currentUserAgent && (currentAllow.length > 0 || currentDisallow.length > 0)) {
            rules.push({
              userAgent: currentUserAgent,
              ...(currentAllow.length > 0 && { allow: currentAllow.length === 1 ? currentAllow[0] : currentAllow }),
              ...(currentDisallow.length > 0 && { disallow: currentDisallow.length === 1 ? currentDisallow[0] : currentDisallow }),
            });
          }
          
          // Start new rule
          currentUserAgent = trimmed.substring(11).trim() || '*';
          currentAllow = [];
          currentDisallow = [];
        } else if (lowerLine.startsWith('allow:')) {
          const path = trimmed.substring(6).trim();
          if (path) currentAllow.push(path);
        } else if (lowerLine.startsWith('disallow:')) {
          const path = trimmed.substring(9).trim();
          if (path) currentDisallow.push(path);
        }
      }
      
      // Add last rule
      if (currentUserAgent && (currentAllow.length > 0 || currentDisallow.length > 0)) {
        rules.push({
          userAgent: currentUserAgent,
          ...(currentAllow.length > 0 && { allow: currentAllow.length === 1 ? currentAllow[0] : currentAllow }),
          ...(currentDisallow.length > 0 && { disallow: currentDisallow.length === 1 ? currentDisallow[0] : currentDisallow }),
        });
      }
      
      // If no rules parsed, use defaults
      if (rules.length === 0) {
        rules.push({
          userAgent: '*',
          allow: '/',
        });
      }
      
      return {
        rules,
        sitemap: sitemapUrl,
      };
    }
  } catch (error) {
    console.error('Error fetching robots.txt from Strapi:', error);
  }
  
  // Default robots.txt
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/protected/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}


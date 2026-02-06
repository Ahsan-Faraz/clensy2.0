/**
 * CMS Adapter - Strapi-only interface for CMS content
 * 
 * All CMS content is fetched from Strapi.
 * MongoDB is only used for booking functionality (separate from this adapter).
 */

// Default to the deployed Strapi if NEXT_PUBLIC_STRAPI_URL is not provided
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://72.60.27.190';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

// Cache for page data
let landingPageCache: any = null;
let landingPageCacheTime: number = 0;
let aboutPageCache: any = null;
let aboutPageCacheTime: number = 0;
let contactPageCache: any = null;
let contactPageCacheTime: number = 0;
let checklistPageCache: any = null;
let checklistPageCacheTime: number = 0;
let faqPageCache: any = null;
let faqPageCacheTime: number = 0;
const CACHE_DURATION = process.env.NODE_ENV === 'development' ? 5000 : 60000; // 5 seconds in dev, 1 minute in prod

// Function to clear the landing page cache (called after sync)
export function clearLandingPageCache() {
  landingPageCache = null;
  landingPageCacheTime = 0;
}

// Function to clear about page cache
export function clearAboutPageCache() {
  aboutPageCache = null;
  aboutPageCacheTime = 0;
}

// Function to clear contact page cache
export function clearContactPageCache() {
  contactPageCache = null;
  contactPageCacheTime = 0;
}

// Function to clear checklist page cache
export function clearChecklistPageCache() {
  checklistPageCache = null;
  checklistPageCacheTime = 0;
}

// Function to clear FAQ page cache
export function clearFAQPageCache() {
  faqPageCache = null;
  faqPageCacheTime = 0;
}

// Clear all page caches
export function clearAllPageCaches() {
  clearLandingPageCache();
  clearAboutPageCache();
  clearContactPageCache();
  clearChecklistPageCache();
  clearFAQPageCache();
}

interface StrapiResponse<T> {
  data: T;
  meta?: any;
}

/**
 * Fetch from Strapi API
 */
async function fetchFromStrapi<T>(
  endpoint: string,
  options: {
    populate?: string | string[] | object;
    filters?: object;
    status?: 'draft' | 'published';
    revalidate?: number;
    cache?: RequestCache;
  } = {}
): Promise<T | null> {
  const { populate, filters, status, revalidate, cache: cacheOption } = options;
  
  const params = new URLSearchParams();
  
  // Strapi v5 REST prefers bracket syntax; to avoid 400, use simple populate=*
  if (populate) {
    if (populate === '*' || typeof populate === 'string') {
      params.append('populate', typeof populate === 'string' ? populate : '*');
    } else {
      // For arrays or objects, fall back to populate=*
      params.append('populate', '*');
    }
  }
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && typeof value === 'object') {
        Object.entries(value as Record<string, unknown>).forEach(([op, val]) => {
          params.append(`filters[${key}][${op}]`, String(val));
        });
      } else {
        params.append(`filters[${key}]`, String(value));
      }
    });
  }

  if (status) {
    params.append('status', status);
  }
  
  const queryString = params.toString();
  // Ensure no double slashes
  const base = STRAPI_URL.replace(/\/+$/, '');
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${base}/api${path}${queryString ? `?${queryString}` : ''}`;
  
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
    };

    // Add draft mode header if status is draft (for preview)
    // Note: For Live Preview, the calling function should pass status='draft'
    // and set the strapi-encode-source-maps header
    if (options.status === 'draft') {
      headers['strapi-encode-source-maps'] = 'true';
    }

    // Determine fetch options based on cache/revalidate settings
    const fetchOptions: RequestInit = { headers };
    if (revalidate !== undefined) {
      // Use Next.js revalidate for ISR
      (fetchOptions as any).next = { revalidate };
    } else if (cacheOption) {
      fetchOptions.cache = cacheOption;
    } else {
      fetchOptions.cache = 'no-store';
    }

    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      const bodyText = await response.text().catch(() => '');
      console.error(
        `Strapi fetch error: ${response.status} ${response.statusText} url=${url} ` +
        `${bodyText ? `body=${bodyText}` : ''}`
      );
      return null;
    }
    
    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error(`Strapi fetch failed for ${endpoint}:`, error);
    return null;
  }
}

/**
 * Transform Strapi image to URL string
 */
export function getImageUrl(image: any): string {
  if (!image) return '';
  
  if (typeof image === 'string') return image;
  
  if (image.url) {
    if (image.url.startsWith('/')) {
      return `${STRAPI_URL}${image.url}`;
    }
    return image.url;
  }
  
  if (image.data?.attributes?.url) {
    const url = image.data.attributes.url;
    if (url.startsWith('/')) {
      return `${STRAPI_URL}${url}`;
    }
    return url;
  }
  
  return '';
}

/**
 * Helper function to get scripts for a specific placement
 * Handles both dedicated script fields and per-page script with placement selector
 */
function getScriptsForPlacement(
  data: any,
  placement: 'head' | 'body-start' | 'body-end'
): string {
  const scripts = data.scripts || {};
  
  // Get dedicated script field for this placement
  let script = '';
  if (placement === 'head') {
    script = scripts.headScripts || data.headScripts || '';
  } else if (placement === 'body-start') {
    script = scripts.bodyStartScripts || data.bodyStartScripts || '';
  } else if (placement === 'body-end') {
    script = scripts.bodyEndScripts || data.bodyEndScripts || '';
  }
  
  // Add per-page script if placement matches
  const perPageScript = scripts.perPageScript || data.perPageScript || '';
  const perPagePlacement = scripts.perPageScriptPlacement || data.perPageScriptPlacement || 'body-end';
  
  if (perPageScript && perPagePlacement === placement) {
    // Combine scripts if both exist
    if (script) {
      return `${script}\n${perPageScript}`;
    }
    return perPageScript;
  }
  
  return script;
}

/**
 * CMS Adapter - Fetches all CMS content from Strapi
 */
export class CMSAdapter {
  /**
   * Get Landing Page SEO data
   */
  static async getLandingPageSEO() {
    const landingPage = await this.getLandingPage();
    if (!landingPage) return null;

    return {
      title: landingPage.seoTitle || 'Professional Cleaning Services | Clensy',
      description: landingPage.seoMetaDescription || 'Professional cleaning services for homes and offices.',
      keywords: landingPage.seoKeywords || '',
      canonicalUrl: landingPage.seoCanonicalUrl || 'https://clensy.com',
      robots: landingPage.seoRobots || 'index, follow',
      openGraph: {
        title: landingPage.ogTitle || landingPage.seoTitle || '',
        description: landingPage.ogDescription || landingPage.seoMetaDescription || '',
        image: getImageUrl(landingPage.ogImage) || landingPage.ogImageUrl || '',
        type: landingPage.ogType || 'website',
      },
      twitter: {
        card: landingPage.twitterCard || 'summary_large_image',
        title: landingPage.twitterTitle || landingPage.ogTitle || '',
        description: landingPage.twitterDescription || landingPage.ogDescription || '',
      },
      schemaJsonLd: landingPage.schemaJsonLd || null,
      additionalSchemas: landingPage.additionalSchemas || [],
      scripts: {
        head: landingPage.headScripts || '',
        bodyStart: landingPage.bodyStartScripts || '',
        bodyEnd: landingPage.bodyEndScripts || '',
      },
      customCss: landingPage.customCss || '',
    };
  }

  /**
   * Get Landing Page (all homepage sections in one call)
   */
  static async getLandingPage() {
    // Check cache first
    if (landingPageCache && Date.now() - landingPageCacheTime < CACHE_DURATION) {
      return landingPageCache;
    }

    const result = await fetchFromStrapi<StrapiResponse<any>>('/landing-page', {
      populate: '*',
    });
    
    if (result?.data) {
      landingPageCache = result.data;
      landingPageCacheTime = Date.now();
    }
    
    return result?.data || null;
  }

  /**
   * Get Hero Section
   */
  static async getHeroSection() {
    // Try landing page first
    const landingPage = await this.getLandingPage();
    if (landingPage) {
      return {
        topLabel: landingPage.heroTopLabel || '',
        heading: landingPage.heroHeading || '',
        subheading: landingPage.heroSubheading || '',
        buttonText: landingPage.heroButtonText || '',
        buttonLink: landingPage.heroButtonLink || '/booking',
        feature1: landingPage.heroFeature1 || '',
        feature2: landingPage.heroFeature2 || '',
        backgroundImage: getImageUrl(landingPage.heroBackgroundImage) || '',
      };
    }

    // Fallback to separate hero-section endpoint
    const result = await fetchFromStrapi<StrapiResponse<any>>('/hero-section', {
      populate: '*',
    });
    
    if (!result?.data) return null;
    
    const data = result.data;
    return {
      topLabel: data.topLabel || '',
      heading: data.heading || '',
      subheading: data.subheading || '',
      buttonText: data.buttonText || '',
      buttonLink: data.buttonLink || '/booking',
      feature1: data.feature1 || '',
      feature2: data.feature2 || '',
      backgroundImage: getImageUrl(data.backgroundImage) || data.backgroundImageUrl || '',
    };
  }
  
  /**
   * Get FAQ Page
   */
  static async getFAQPage() {
    const result = await fetchFromStrapi<StrapiResponse<any>>('/faq-page', {
      populate: '*',
    });
    
    if (!result?.data) return null;
    
    const data = result.data;
    return {
      heroSection: {
        topLabel: data.heroTopLabel || '',
        heading: data.heroHeading || '',
        description: data.heroDescription || '',
        backgroundImage: data.heroBackgroundImageUrl || '',
      },
      comprehensiveFAQs: data.comprehensiveFAQs || [],
      stillHaveQuestionsSection: {
        heading: data.stillHaveQuestionsHeading || '',
        description: data.stillHaveQuestionsDescription || '',
        cards: data.stillHaveQuestionsCards || [],
      },
      contactSection: {
        heading: data.contactSectionHeading || '',
        description: data.contactSectionDescription || '',
        emailSection: {
          email: data.contactEmail || '',
        },
        callSection: {
          phone: data.contactPhone || '',
        },
        contactButtonText: data.contactButtonText || '',
      },
      trustIndicatorsSection: {
        indicators: data.trustIndicators || [],
      },
    };
  }
  
  /**
   * Get CTA Section
   */
  static async getCTASection() {
    // Try landing page first
    const landingPage = await this.getLandingPage();
    if (landingPage) {
      return {
        heading: landingPage.ctaHeading || '',
        description: landingPage.ctaDescription || '',
        leftCard: {
          title: landingPage.ctaLeftCardTitle || '',
          description: landingPage.ctaLeftCardDescription || '',
          buttonText: landingPage.ctaLeftCardButtonText || '',
        },
        rightCard: {
          title: landingPage.ctaRightCardTitle || '',
          description: landingPage.ctaRightCardDescription || '',
          buttonText: landingPage.ctaRightCardButtonText || '',
        },
      };
    }

    const result = await fetchFromStrapi<StrapiResponse<any>>('/cta', {
      populate: '*',
    });
    
    if (!result?.data) return null;
    
    const data = result.data;
    return {
      heading: data.heading || '',
      description: data.description || '',
      leftCard: data.leftCard || null,
      rightCard: data.rightCard || null,
    };
  }
  
  /**
   * Get Reviews Section
   */
  static async getReviewsSection() {
    // Try landing page first
    const landingPage = await this.getLandingPage();
    if (landingPage) {
      return {
        heading: landingPage.reviewsHeading || '',
        buttonText: landingPage.reviewsButtonText || '',
        testimonials: landingPage.testimonials || [],
      };
    }

    const result = await fetchFromStrapi<StrapiResponse<any>>('/review', {
      populate: '*',
    });
    
    if (!result?.data) return null;
    
    const data = result.data;
    return {
      heading: data.heading || '',
      buttonText: data.buttonText || '',
      testimonials: data.testimonials || [],
    };
  }
  
  /**
   * Get About Page
   */
  static async getAboutPage() {
    const result = await fetchFromStrapi<StrapiResponse<any>>('/about', {
      populate: '*',
    });
    
    if (!result?.data) return null;
    
    const data = result.data;
    return {
      heroSection: {
        heading: data.heroHeading || '',
        tagline: data.heroTagline || '',
      },
      ourStorySection: {
        heading: data.ourStoryHeading || '',
        paragraph1: data.ourStoryParagraph1 || '',
        paragraph2: data.ourStoryParagraph2 || '',
        paragraph3: data.ourStoryParagraph3 || '',
        image: getImageUrl(data.ourStoryImage) || data.ourStoryImageUrl || '',
      },
      whyWeStartedSection: {
        heading: data.whyWeStartedHeading || '',
        subtitle: data.whyWeStartedSubtitle || '',
        quoteText: data.whyWeStartedQuoteText || '',
        paragraph1: data.whyWeStartedParagraph1 || '',
        paragraph2: data.whyWeStartedParagraph2 || '',
        paragraph3: data.whyWeStartedParagraph3 || '',
      },
      whatMakesUsDifferentSection: {
        heading: data.whatMakesUsDifferentHeading || '',
        residentialCommercial: {
          title: data.residentialCommercialTitle || '',
          paragraph1: data.residentialCommercialParagraph1 || '',
          paragraph2: data.residentialCommercialParagraph2 || '',
        },
        eliteTeam: {
          title: data.eliteTeamTitle || '',
          paragraph1: data.eliteTeamParagraph1 || '',
          paragraph2: data.eliteTeamParagraph2 || '',
          image: getImageUrl(data.eliteTeamImage) || data.eliteTeamImageUrl || '',
        },
      },
      clientFocusedTech: {
        heading: data.clientFocusedTechHeading || '',
        features: data.clientFocusedTechFeatures || [],
      },
      whoWeServeSection: {
        heading: data.whoWeServeHeading || '',
        subtitle: data.whoWeServeSubtitle || '',
        customerTypes: data.customerTypes || [],
      },
      ourMissionSection: {
        heading: data.ourMissionHeading || '',
        paragraph1: data.ourMissionParagraph1 || '',
        paragraph2: data.ourMissionParagraph2 || '',
        paragraph3: data.ourMissionParagraph3 || '',
        paragraph4: data.ourMissionParagraph4 || '',
        closingLine: data.ourMissionClosingLine || '',
      },
      ctaSection: {
        heading: data.ctaHeading || '',
        description: data.ctaDescription || '',
        bookButtonText: data.ctaBookButtonText || '',
        contactButtonText: data.ctaContactButtonText || '',
      },
    };
  }
  
  /**
   * Get How It Works Section
   */
  static async getHowItWorks() {
    // Try landing page first
    const landingPage = await this.getLandingPage();
    if (landingPage) {
      return {
        step1: {
          title: landingPage.step1Title || '',
          description: landingPage.step1Description || '',
          featureText: landingPage.step1FeatureText || '',
        },
        step2: {
          title: landingPage.step2Title || '',
          description: landingPage.step2Description || '',
          featureText: landingPage.step2FeatureText || '',
        },
        step3: {
          title: landingPage.step3Title || '',
          description: landingPage.step3Description || '',
          featureText: landingPage.step3FeatureText || '',
        },
        buttonText: landingPage.howItWorksButtonText || '',
      };
    }

    const result = await fetchFromStrapi<StrapiResponse<any>>('/how-it-work', {
      populate: '*',
    });
    
    if (!result?.data) return null;
    
    const data = result.data;
    return {
      step1: {
        title: data.step1Title || '',
        description: data.step1Description || '',
        featureText: data.step1FeatureText || '',
      },
      step2: {
        title: data.step2Title || '',
        description: data.step2Description || '',
        featureText: data.step2FeatureText || '',
      },
      step3: {
        title: data.step3Title || '',
        description: data.step3Description || '',
        featureText: data.step3FeatureText || '',
      },
      buttonText: data.buttonText || '',
    };
  }
  
  /**
   * Get Comparison Section
   */
  static async getComparisonSection() {
    // Try landing page first
    const landingPage = await this.getLandingPage();
    if (landingPage) {
      return {
        heading: landingPage.comparisonHeading || '',
        description: landingPage.comparisonDescription || '',
        features: landingPage.comparisonFeatures || [],
        buttonText: landingPage.comparisonButtonText || '',
      };
    }

    const result = await fetchFromStrapi<StrapiResponse<any>>('/comparison', {
      populate: '*',
    });
    
    if (!result?.data) return null;
    
    const data = result.data;
    return {
      heading: data.heading || '',
      description: data.description || '',
      features: data.features || [],
      buttonText: data.buttonText || '',
    };
  }
  
  /**
   * Get Checklist Section
   */
  static async getChecklistSection() {
    // Try landing page first
    const landingPage = await this.getLandingPage();
    if (landingPage) {
      return {
        heading: landingPage.checklistHeading || '',
        description: landingPage.checklistDescription || '',
        checklistItems: landingPage.checklistItems || {},
        buttonText: landingPage.checklistButtonText || '',
      };
    }

    const result = await fetchFromStrapi<StrapiResponse<any>>('/checklist', {
      populate: '*',
    });
    
    if (!result?.data) return null;
    
    const data = result.data;
    return {
      heading: data.heading || '',
      description: data.description || '',
      checklistItems: data.checklistItems || {},
      buttonText: data.buttonText || '',
    };
  }
  
  /**
   * Get Contact Page
   */
  static async getContactPage() {
    const result = await fetchFromStrapi<StrapiResponse<any>>('/contact', {
      populate: '*',
    });
    
    if (!result?.data) return null;
    
    const data = result.data;
    return {
      heroSection: {
        topLabel: data.heroTopLabel || '',
        heading: data.heroHeading || '',
        description: data.heroDescription || '',
        sendMessageButtonText: data.heroSendMessageButtonText || '',
        supportText: data.heroSupportText || '',
        responseText: data.heroResponseText || '',
        image: getImageUrl(data.heroImage) || data.heroImageUrl || '',
      },
      trustSection: {
        mainText: data.trustMainText || '',
        subtitle: data.trustSubtitle || '',
        serviceTags: data.serviceTags || [],
      },
      statsSection: {
        indicators: data.statsIndicators || [],
      },
      contactInformation: {
        sectionTitle: data.contactSectionTitle || '',
        phone: {
          title: data.phoneTitle || '',
          description: data.phoneDescription || '',
          phoneNumber: data.phoneNumber || '',
        },
        email: {
          title: data.emailTitle || '',
          description: data.emailDescription || '',
          emailAddress: data.emailAddress || '',
        },
        officeLocation: {
          title: data.officeTitle || '',
          description: data.officeDescription || '',
          addressLine1: data.addressLine1 || '',
          addressLine2: data.addressLine2 || '',
          cityStateZip: data.cityStateZip || '',
        },
        businessHours: {
          title: data.businessHoursTitle || '',
          description: data.businessHoursDescription || '',
          hours: data.businessHours || [],
        },
        immediateAssistance: {
          title: data.immediateAssistanceTitle || '',
          description: data.immediateAssistanceDescription || '',
          buttonText: data.immediateAssistanceButtonText || '',
        },
      },
      consultationSection: {
        heading: data.consultationHeading || '',
        description: data.consultationDescription || '',
        buttonText: data.consultationButtonText || '',
      },
    };
  }
  
  /**
   * Get Careers Page
   */
  static async getCareersPage() {
    const result = await fetchFromStrapi<StrapiResponse<any>>('/careers-page', {
      populate: '*',
    });
    
    if (!result?.data) return null;
    
    const data = result.data;
    return {
      heroSection: {
        topLabel: data.heroTopLabel || '',
        heading: data.heroHeading || '',
        description: data.heroDescription || '',
        primaryButtonText: data.heroPrimaryButtonText || '',
        secondaryButtonText: data.heroSecondaryButtonText || '',
        teamMembersCount: data.heroTeamMembersCount || '',
      },
      benefitsSection: {
        heading: data.benefitsHeading || '',
        description: data.benefitsDescription || '',
        benefits: data.benefits || [],
      },
      positionsSection: {
        heading: data.positionsHeading || '',
        description: data.positionsDescription || '',
        positions: data.positions || [],
      },
      testimonialsSection: {
        heading: data.testimonialsHeading || '',
        description: data.testimonialsDescription || '',
        testimonials: data.employeeTestimonials || [],
      },
      applicationSection: {
        heading: data.applicationHeading || '',
        description: data.applicationDescription || '',
        submitButtonText: data.applicationSubmitButtonText || '',
      },
      contactSection: {
        heading: data.contactHeading || '',
        description: data.contactDescription || '',
        phoneText: data.contactPhoneText || '',
        emailText: data.contactEmailText || '',
      },
    };
  }
  
  /**
   * Get Privacy Policy Page
   */
  static async getPrivacyPolicy() {
    const result = await fetchFromStrapi<StrapiResponse<any>>('/privacy-policy', {
      populate: '*',
    });
    
    if (!result?.data) return null;
    
    const data = result.data;
    return {
      heroSection: {
        heading: data.heroHeading || '',
        description: data.heroDescription || '',
      },
      companyInfo: {
        websiteUrl: data.websiteUrl || '',
        email: data.email || '',
        phone: data.phone || '',
      },
      sections: data.sections || [],
      smsConsent: {
        description: data.smsConsentDescription || '',
        optOutInstructions: data.smsOptOutInstructions || '',
      },
    };
  }
  
  /**
   * Get Terms of Service Page
   */
  static async getTermsOfService() {
    const result = await fetchFromStrapi<StrapiResponse<any>>('/terms-of-service', {
      populate: '*',
    });
    
    if (!result?.data) return null;
    
    const data = result.data;
    return {
      heroSection: {
        heading: data.heroHeading || '',
        description: data.heroDescription || '',
      },
      companyInfo: {
        websiteUrl: data.websiteUrl || '',
        email: data.email || '',
        phone: data.phone || '',
      },
      sections: data.sections || [],
      agreementSection: {
        description: data.agreementDescription || '',
        lastUpdated: data.lastUpdated || '',
      },
    };
  }
  
  /**
   * Get Location by Slug
   */
  static async getLocationBySlug(slug: string, status: 'draft' | 'published' = 'published') {
    if (!slug) return null;

    // try with specified status first
    let result = await fetchFromStrapi<StrapiResponse<any[]>>('/locations', {
      filters: { slug: { $eq: slug } },
      populate: '*',
      status: status,
    });
    // fallback to opposite status if not found
    if (!result?.data || result.data.length === 0) {
      const fallbackStatus = status === 'published' ? 'draft' : 'published';
      result = await fetchFromStrapi<StrapiResponse<any[]>>('/locations', {
        filters: { slug: { $eq: slug } },
        populate: '*',
        status: fallbackStatus,
      });
    }
    // Fallback: fetch all and filter client-side (avoids slug/filters issues)
    if (!result?.data || result.data.length === 0) {
      const all = await this.getAllLocations();
      const found = all.find((loc) => loc.slug === slug);
      if (!found) return null;
      // Minimal shape to avoid breaking pages
      return {
        name: found.name,
        slug: found.slug,
        county: found.county,
        state: found.state || 'NJ',
        heroSection: { title: '', subtitle: '', backgroundImage: '', ctaButton1: '', ctaButton2: '' },
        contactSection: { title: '', phone: '', email: '', address: '', hours: [] },
        serviceAreas: [],
        aboutSection: { title: '', description: '' },
        seo: {
          metaTitle: found.name || '',
          metaDescription: '',
          keywords: [],
          canonicalUrl: `https://clensy.com/locations/${found.slug}`,
          robots: 'index, follow',
          h1: found.name || '',
          h2: '',
          h3: '',
          openGraph: { title: found.name || '', description: '', image: found.heroBackgroundImage || '', type: 'website' },
          twitter: { card: 'summary_large_image', title: found.name || '', description: '' },
          schemaJsonLd: null,
          schemaType: 'LocalBusiness',
          headScripts: '',
          bodyStartScripts: '',
          bodyEndScripts: '',
          customCss: '',
        },
        localSeo: {
          city: '',
          county: found.county || '',
          state: found.state || 'NJ',
          zipCode: '',
          serviceType: 'residential, commercial',
        },
        imageAlt: { heroBackground: '' },
      };
    }
    
    const data = result.data[0];
    return {
      name: data.name || '',
      slug: data.slug || slug,
      county: data.county || '',
      state: data.state || 'NJ',
      heroSection: {
        title: data.heroTitle || '',
        subtitle: data.heroSubtitle || '',
        backgroundImage: getImageUrl(data.heroBackgroundImage) || data.heroBackgroundImageUrl || '',
        ctaButton1: data.ctaButton1Text || 'Get a Quote',
        ctaButton2: data.ctaButton2Text || 'Contact Us',
      },
      contactSection: {
        title: data.contactTitle || '',
        phone: data.contactPhone || '',
        email: data.contactEmail || '',
        address: data.contactAddress || '',
        hours: data.operatingHours?.map((h: any) => ({
          day: h.day || '',
          hours: h.hours || '',
        })) || [],
      },
      serviceAreas: data.serviceAreas?.map((a: any) => a.name || a) || [],
      aboutSection: {
        title: data.aboutTitle || '',
        description: data.aboutDescription || '',
      },
      seo: {
        metaTitle: data.seo?.metaTitle || data.seoMetaTitle || `Professional Cleaning Services in ${data.county || ''} County, NJ | Clensy`,
        metaDescription: data.seo?.metaDescription || data.seoMetaDescription || `Professional cleaning services for ${data.county || ''} County. Book online in 30 seconds.`,
        keywords: data.seo?.keywords ? (typeof data.seo.keywords === 'string' ? data.seo.keywords.split(',').map((k: string) => k.trim()) : data.seo.keywords) : (data.seoKeywords || []),
        canonicalUrl: data.seo?.canonicalURL || data.seoCanonicalUrl || `https://clensy.com/locations/${data.slug}`,
        robots: data.seo?.metaRobots || data.seoRobots || 'index, follow',
        h1: data.seo?.h1 || data.seoH1 || data.heroTitle || `Professional Cleaning Services in ${data.county || ''} County`,
        h2: data.seo?.h2 || data.seoH2 || data.aboutTitle || '',
        h3: data.seo?.h3 || data.seoH3 || 'Service Areas',
        openGraph: {
          title: data.openGraph?.ogTitle || data.ogTitle || `Professional Cleaning Services in ${data.county || ''} County | Clensy`,
          description: data.openGraph?.ogDescription || data.ogDescription || `Professional cleaning services for ${data.county || ''} County.`,
          image: getImageUrl(data.openGraph?.ogImage) || data.ogImageUrl || getImageUrl(data.heroBackgroundImage) || data.heroBackgroundImageUrl || '',
          type: data.openGraph?.ogType || data.ogType || 'website',
        },
        twitter: {
          card: data.openGraph?.twitterCard || data.twitterCard || 'summary_large_image',
          title: data.openGraph?.twitterTitle || data.twitterTitle || data.openGraph?.ogTitle || data.ogTitle || `Professional Cleaning Services in ${data.county || ''} County | Clensy`,
          description: data.openGraph?.twitterDescription || data.twitterDescription || data.openGraph?.ogDescription || data.ogDescription || `Professional cleaning services for ${data.county || ''} County.`,
        },
        schemaJsonLd: data.seo?.structuredData || data.schema?.customJsonLd || data.schemaJsonLd || null,
        schemaType: data.schema?.schemaType || data.schemaType || 'LocalBusiness',
        headScripts: getScriptsForPlacement(data, 'head'),
        bodyStartScripts: getScriptsForPlacement(data, 'body-start'),
        bodyEndScripts: getScriptsForPlacement(data, 'body-end'),
        customCss: data.customCss || '',
        localBusinessSchema: data.schema ? {
          name: data.schema.businessName || 'Clensy',
          url: `https://clensy.com/locations/${data.slug}`,
          telephone: data.schema.telephone || data.contactPhone || '',
          address: data.schema.address || data.contactAddress || '',
          priceRange: data.schema.priceRange || '$$',
        } : null,
        faqSchema: null, // Can be added if FAQs are added to locations
        reviewSchema: null, // Can be added if testimonials are added to locations
      },
      // Local SEO
      localSeo: {
        city: data.localSeo?.city || data.city || '',
        county: data.localSeo?.county || data.county || '',
        state: data.localSeo?.state || data.state || 'NJ',
        zipCode: data.localSeo?.zipCode || data.zipCode || '',
        serviceType: data.localSeo?.serviceType || data.serviceType || 'residential, commercial',
      },
      // Image Alt Text
      imageAlt: {
        heroBackground: data.heroBackgroundImageAlt || `Professional cleaning services in ${data.county || ''} County, New Jersey`,
      },
    };
  }
  
  /**
   * Get Service by Slug
   */
  static async getServiceBySlug(slug: string, status: 'draft' | 'published' = 'published') {
    if (!slug) return null;

    // try with specified status first
    let result = await fetchFromStrapi<StrapiResponse<any[]>>('/services', {
      filters: { slug: { $eq: slug } },
      populate: '*',
      status: status,
    });
    // fallback to opposite status if not found
    if (!result?.data || result.data.length === 0) {
      const fallbackStatus = status === 'published' ? 'draft' : 'published';
      result = await fetchFromStrapi<StrapiResponse<any[]>>('/services', {
        filters: { slug: { $eq: slug } },
        populate: '*',
        status: fallbackStatus,
      });
    }
    // Fallback: fetch all and filter client-side
    if (!result?.data || result.data.length === 0) {
      const all = await this.getAllServices();
      const found = all.find((svc) => svc.slug === slug);
      if (!found) return null;
      return {
        name: found.name,
        slug: found.slug,
        serviceType: found.serviceType,
        heroTopLabel: '',
        heroHeading: found.heroHeading || '',
        heroSubheading: found.heroSubheading || '',
        heroBackgroundImage: found.heroBackgroundImage || '',
        heroServiceDuration: '',
        heroServiceGuarantee: '',
        includedSectionHeading: '',
        includedSectionSubheading: '',
        cleaningAreas: [],
        featureSectionHeading: '',
        featureSectionSubheading: '',
        featureSectionImage: '',
        featureSectionPoints: [],
        howItWorksHeading: '',
        howItWorksSubheading: '',
        step1Title: '',
        step1Description: '',
        step1Image: '',
        step2Title: '',
        step2Description: '',
        step2Image: '',
        step3Title: '',
        step3Description: '',
        step3Image: '',
        benefitsHeading: '',
        benefitsSubheading: '',
        benefitsImage: '',
        benefit1Title: '',
        benefit1Description: '',
        benefit2Title: '',
        benefit2Description: '',
        benefit3Title: '',
        benefit3Description: '',
        clientTestimonialsHeading: '',
        clientTestimonialsSubheading: '',
        clientTestimonials: [],
        frequencyGuideHeading: '',
        frequencyGuideSubheading: '',
        frequencyOptions: [],
        faqs: [],
        seo: {
          metaTitle: found.name || '',
          metaDescription: '',
          keywords: [],
          canonicalUrl: `https://clensy.com/services/${found.slug}`,
          robots: 'index, follow',
          h1: found.heroHeading || found.name || '',
          h2: '',
          h3: '',
          openGraph: { title: found.name || '', description: '', image: found.heroBackgroundImage || '', type: 'website' },
          twitter: { card: 'summary_large_image', title: found.name || '', description: '' },
          schemaJsonLd: null,
          schemaType: 'Service',
          headScripts: '',
          bodyStartScripts: '',
          bodyEndScripts: '',
          customCss: '',
        },
      };
    }

    const data = result.data[0];

    return {
      name: data.name || '',
      slug: data.slug || slug,
      serviceType: data.serviceType || '',
      heroTopLabel: data.heroTopLabel || '',
      heroHeading: data.heroHeading || '',
      heroSubheading: data.heroSubheading || '',
      heroBackgroundImage: getImageUrl(data.heroBackgroundImage) || data.heroBackgroundImageUrl || '',
      heroServiceDuration: data.heroServiceDuration || '',
      heroServiceGuarantee: data.heroServiceGuarantee || '100% Satisfaction',
      includedSectionHeading: data.includedSectionHeading || '',
      includedSectionSubheading: data.includedSectionSubheading || '',
      cleaningAreas: data.cleaningAreas?.map((area: any) => ({
        title: area.title || '',
        description: area.description || '',
        image: getImageUrl(area.image) || '',
        imageAlt: area.imageAlt || area.title || '',
        features: area.features || [],
      })) || [],
      featureSectionHeading: data.featureSectionHeading || '',
      featureSectionSubheading: data.featureSectionSubheading || '',
      featureSectionImage: getImageUrl(data.featureSectionImage) || '',
      featureSectionPoints: data.featureSectionPoints || [],
      howItWorksHeading: data.howItWorksHeading || '',
      howItWorksSubheading: data.howItWorksSubheading || '',
      step1Title: data.step1Title || '',
      step1Description: data.step1Description || '',
      step1Image: getImageUrl(data.step1Image) || '',
      step2Title: data.step2Title || '',
      step2Description: data.step2Description || '',
      step2Image: getImageUrl(data.step2Image) || '',
      step3Title: data.step3Title || '',
      step3Description: data.step3Description || '',
      step3Image: getImageUrl(data.step3Image) || '',
      benefitsHeading: data.benefitsHeading || '',
      benefitsSubheading: data.benefitsSubheading || '',
      benefitsImage: getImageUrl(data.benefitsImage) || '',
      benefit1Title: data.benefit1Title || '',
      benefit1Description: data.benefit1Description || '',
      benefit2Title: data.benefit2Title || '',
      benefit2Description: data.benefit2Description || '',
      benefit3Title: data.benefit3Title || '',
      benefit3Description: data.benefit3Description || '',
      clientTestimonialsHeading: data.clientTestimonialsHeading || '',
      clientTestimonialsSubheading: data.clientTestimonialsSubheading || '',
      clientTestimonials: data.clientTestimonials?.map((t: any) => ({
        rating: t.rating || 5,
        review: t.review || '',
        clientName: t.clientName || '',
        clientLocation: t.clientLocation || '',
        avatarBgColor: t.avatarBgColor || 'blue',
      })) || [],
      frequencyGuideHeading: data.frequencyGuideHeading || '',
      frequencyGuideSubheading: data.frequencyGuideSubheading || '',
      frequencyOptions: data.frequencyOptions?.map((opt: any) => ({
        title: opt.title || '',
        color: opt.color || 'blue',
        perfectFor: opt.perfectFor || [],
        benefits: opt.benefits || '',
        label: opt.label || '',
      })) || [],
      faqs: data.faqs?.map((f: any) => ({
        question: f.question || '',
        answer: f.answer || '',
      })) || [],
      // SEO Fields (read from nested components or fallback to flat fields for backward compatibility)
      seo: {
        metaTitle: data.seo?.metaTitle || data.seoMetaTitle || `${data.name} in New Jersey | Clensy`,
        metaDescription: data.seo?.metaDescription || data.seoMetaDescription || `Professional ${data.name.toLowerCase()} services. Book online in 30 seconds.`,
        keywords: data.seo?.keywords ? (typeof data.seo.keywords === 'string' ? data.seo.keywords.split(',').map((k: string) => k.trim()) : data.seo.keywords) : (data.seoKeywords || []),
        canonicalUrl: data.seo?.canonicalURL || data.seoCanonicalUrl || `https://clensy.com/services/${data.slug}`,
        robots: data.seo?.metaRobots || data.seoRobots || 'index, follow',
        h1: data.seo?.h1 || data.seoH1 || data.heroHeading || `${data.name} Services`,
        h2: data.seo?.h2 || data.seoH2 || data.includedSectionHeading || '',
        h3: data.seo?.h3 || data.seoH3 || data.howItWorksHeading || '',
        openGraph: {
          title: data.openGraph?.ogTitle || data.ogTitle || `${data.name} | Clensy`,
          description: data.openGraph?.ogDescription || data.ogDescription || `Professional ${data.name.toLowerCase()} services.`,
          image: getImageUrl(data.openGraph?.ogImage) || data.ogImageUrl || getImageUrl(data.heroBackgroundImage) || data.heroBackgroundImageUrl || '',
          type: data.openGraph?.ogType || data.ogType || 'website',
        },
        twitter: {
          card: data.openGraph?.twitterCard || data.twitterCard || 'summary_large_image',
          title: data.openGraph?.twitterTitle || data.twitterTitle || data.openGraph?.ogTitle || data.ogTitle || `${data.name} | Clensy`,
          description: data.openGraph?.twitterDescription || data.twitterDescription || data.openGraph?.ogDescription || data.ogDescription || `Professional ${data.name.toLowerCase()} services.`,
        },
        schemaJsonLd: data.seo?.structuredData || data.schema?.customJsonLd || data.schemaJsonLd || null,
        schemaType: data.schema?.schemaType || data.schemaType || 'Service',
        headScripts: getScriptsForPlacement(data, 'head'),
        bodyStartScripts: getScriptsForPlacement(data, 'body-start'),
        bodyEndScripts: getScriptsForPlacement(data, 'body-end'),
        customCss: data.customCss || '',
      },
      // Image Alt Text
      imageAlt: {
        heroBackground: data.heroBackgroundImageAlt || `Professional ${data.name.toLowerCase()} service`,
        featureSection: data.featureSectionImageAlt || `Professional cleaning team providing ${data.name.toLowerCase()} service`,
        benefits: data.benefitsImageAlt || `Clean space after ${data.name.toLowerCase()} service`,
        step1: data.step1ImageAlt || `Book ${data.name.toLowerCase()} service online`,
        step2: data.step2ImageAlt || 'Professional cleaning team at work',
        step3: data.step3ImageAlt || `Clean and fresh space after ${data.name.toLowerCase()} service`,
      },
    };
  }
  
  /**
   * Get All Services (for listing)
   */
  static async getAllServices(options?: { revalidate?: number }) {
    const fetchOptions = options?.revalidate !== undefined ? { revalidate: options.revalidate } : {};
    // First, try published
    let result = await fetchFromStrapi<StrapiResponse<any[]>>('/services', {
      populate: {
        heroBackgroundImage: { populate: '*' },
      },
      status: 'published',
      ...fetchOptions,
    });
    // If none published, fallback to draft
    if (!result?.data || result.data.length === 0) {
      result = await fetchFromStrapi<StrapiResponse<any[]>>('/services', {
        populate: {
          heroBackgroundImage: { populate: '*' },
        },
        status: 'draft',
        ...fetchOptions,
      });
    }
    
    if (!result?.data) return [];
    
    return result.data.map((service: any) => ({
      name: service.name || '',
      slug: service.slug || '',
      serviceType: service.serviceType || '',
      heroHeading: service.heroHeading || '',
      heroSubheading: service.heroSubheading || '',
      heroBackgroundImage: getImageUrl(service.heroBackgroundImage) || service.heroBackgroundImageUrl || '',
    }));
  }
  
  /**
   * Get All Locations (for listing)
   */
  static async getAllLocations(options?: { revalidate?: number }) {
    const fetchOptions = options?.revalidate !== undefined ? { revalidate: options.revalidate } : {};
    // First, try published
    let result = await fetchFromStrapi<StrapiResponse<any[]>>('/locations', {
      populate: {
        heroBackgroundImage: { populate: '*' },
      },
      status: 'published',
      ...fetchOptions,
    });
    // If none published, fallback to draft
    if (!result?.data || result.data.length === 0) {
      result = await fetchFromStrapi<StrapiResponse<any[]>>('/locations', {
        populate: {
          heroBackgroundImage: { populate: '*' },
        },
        status: 'draft',
        ...fetchOptions,
      });
    }
    
    if (!result?.data) return [];
    
    return result.data.map((location: any) => ({
      name: location.name || '',
      slug: location.slug || '',
      county: location.county || '',
      state: location.state || 'NJ',
      heroTitle: location.heroTitle || '',
      heroSubtitle: location.heroSubtitle || '',
      heroBackgroundImage: getImageUrl(location.heroBackgroundImage) || location.heroBackgroundImageUrl || '',
    }));
  }

  /**
   * Get All Active Redirects
   */
  static async getAllRedirects() {
    try {
      const result = await fetchFromStrapi<StrapiResponse<any[]>>('/redirects', {
        filters: { isActive: { $eq: true } },
        populate: '*',
      });
      
      if (!result?.data) return [];
      
      return result.data.map((redirect: any) => ({
        fromPath: redirect.fromPath || '',
        toPath: redirect.toPath || '',
        statusCode: redirect.statusCode || 'permanent_301',
        isActive: redirect.isActive !== false,
        notes: redirect.notes || '',
      }));
    } catch (error) {
      console.error('Error fetching redirects:', error);
      return [];
    }
  }

  /**
   * Get Global Settings (for robots.txt and global SEO)
   */
  static async getGlobalSettings() {
    try {
      const result = await fetchFromStrapi<StrapiResponse<any>>('/global-setting', {
        populate: '*',
      });
      
      return result?.data || null;
    } catch (error) {
      console.error('Error fetching global settings:', error);
      return null;
    }
  }

  /**
   * Convert form-based schema template to JSON-LD
   */
  static convertSchemaTemplateToJsonLd(template: any): any {
    if (!template || !template.schemaType) return null;

    const { schemaType, localBusiness, service, faqPage, review, customJsonLd } = template;

    // If custom JSON-LD is provided, use it
    if (customJsonLd && Object.keys(customJsonLd).length > 0) {
      return {
        '@context': 'https://schema.org',
        ...customJsonLd,
      };
    }

    switch (schemaType) {
      case 'LocalBusiness':
        if (!localBusiness) return null;
        const logoUrl = getImageUrl(localBusiness.logo) || localBusiness.logoUrl;
        const imageUrl = getImageUrl(localBusiness.image) || localBusiness.imageUrl;
        
        return {
          '@context': 'https://schema.org',
          '@type': localBusiness.businessType || 'LocalBusiness',
          name: localBusiness.businessName,
          url: localBusiness.url,
          telephone: localBusiness.telephone,
          email: localBusiness.email,
          description: localBusiness.description,
          priceRange: localBusiness.priceRange,
          ...(logoUrl && { logo: logoUrl }),
          ...(imageUrl && { image: imageUrl }),
          address: localBusiness.address ? {
            '@type': 'PostalAddress',
            streetAddress: localBusiness.address.streetAddress,
            addressLocality: localBusiness.address.addressLocality,
            addressRegion: localBusiness.address.addressRegion,
            postalCode: localBusiness.address.postalCode,
            addressCountry: localBusiness.address.addressCountry || 'US',
          } : undefined,
          openingHours: localBusiness.openingHours ? localBusiness.openingHours.split(',').map((h: string) => h.trim()) : undefined,
          areaServed: localBusiness.areaServed,
          ...(localBusiness.paymentAccepted && { paymentAccepted: localBusiness.paymentAccepted }),
          ...(localBusiness.currenciesAccepted && { currenciesAccepted: localBusiness.currenciesAccepted }),
          ...(localBusiness.hasMap && { hasMap: localBusiness.hasMap }),
          geo: localBusiness.serviceArea ? {
            '@type': 'GeoCoordinates',
            latitude: localBusiness.serviceArea.latitude,
            longitude: localBusiness.serviceArea.longitude,
          } : undefined,
          aggregateRating: localBusiness.aggregateRating ? {
            '@type': 'AggregateRating',
            ratingValue: localBusiness.aggregateRating.ratingValue,
            bestRating: localBusiness.aggregateRating.bestRating || 5,
            worstRating: localBusiness.aggregateRating.worstRating || 1,
            ratingCount: localBusiness.aggregateRating.ratingCount,
          } : undefined,
        };

      case 'Service':
        if (!service) return null;
        const serviceImageUrl = getImageUrl(service.image) || service.imageUrl;
        
        return {
          '@context': 'https://schema.org',
          '@type': 'Service',
          ...(service.name && { name: service.name }),
          serviceType: service.serviceType,
          ...(service.description && { description: service.description }),
          ...(service.category && { category: service.category }),
          ...(serviceImageUrl && { image: serviceImageUrl }),
          provider: service.provider ? {
            '@type': 'Organization',
            name: service.provider.name,
            url: service.provider.url,
            logo: service.provider.logo,
            sameAs: service.provider.sameAs || [],
          } : undefined,
          areaServed: service.areaServed,
          serviceArea: service.serviceArea ? {
            '@type': 'GeoCoordinates',
            latitude: service.serviceArea.latitude,
            longitude: service.serviceArea.longitude,
          } : undefined,
          availableChannel: {
            '@type': 'ServiceChannel',
            serviceType: service.availableChannel || 'Online',
          },
          offers: service.offers?.map((offer: any) => ({
            '@type': 'Offer',
            name: offer.name,
            description: offer.description,
            price: offer.price,
            priceCurrency: offer.priceCurrency || 'USD',
            availability: `https://schema.org/${offer.availability || 'InStock'}`,
            url: offer.url,
          })) || [],
        };

      case 'FAQPage':
        if (!faqPage) return null;
        return {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqPage.mainEntity?.map((item: any) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })) || [],
        };

      case 'Review':
        if (!review) return null;
        return {
          '@context': 'https://schema.org',
          '@type': 'Review',
          itemReviewed: {
            '@type': 'Thing',
            name: review.itemReviewed,
          },
          reviewRating: review.reviewRating ? {
            '@type': 'Rating',
            ratingValue: review.reviewRating.ratingValue,
            bestRating: review.reviewRating.bestRating || 5,
            worstRating: review.reviewRating.worstRating || 1,
          } : undefined,
          author: review.author ? {
            '@type': 'Person',
            name: review.author.name,
            url: review.author.url,
          } : undefined,
          publisher: review.publisher ? {
            '@type': 'Organization',
            name: review.publisher.name,
            url: review.publisher.url,
            logo: review.publisher.logo,
            sameAs: review.publisher.sameAs || [],
          } : undefined,
          reviewBody: review.reviewBody,
          datePublished: review.datePublished,
        };

      default:
        return null;
    }
  }

  // ============================================
  // SEO METHODS FOR ALL PAGES
  // ============================================

  /**
   * Helper to extract SEO data from page data
   */
  private static extractSEOFromData(data: any, defaults: { title: string; description: string; canonicalUrl: string }) {
    return {
      title: data.seoTitle || defaults.title,
      description: data.seoMetaDescription || defaults.description,
      keywords: data.seoKeywords || '',
      canonicalUrl: data.seoCanonicalUrl || defaults.canonicalUrl,
      robots: data.seoRobots || 'index, follow',
      openGraph: {
        title: data.ogTitle || data.seoTitle || defaults.title,
        description: data.ogDescription || data.seoMetaDescription || defaults.description,
        image: getImageUrl(data.ogImage) || data.ogImageUrl || '',
        type: data.ogType || 'website',
      },
      twitter: {
        card: data.twitterCard || 'summary_large_image',
        title: data.twitterTitle || data.ogTitle || defaults.title,
        description: data.twitterDescription || data.ogDescription || defaults.description,
      },
      schemaJsonLd: data.schemaJsonLd || null,
      scripts: {
        head: data.headScripts || '',
        bodyStart: data.bodyStartScripts || '',
        bodyEnd: data.bodyEndScripts || '',
      },
      customCss: data.customCss || '',
    };
  }

  /**
   * Get About Page SEO
   */
  static async getAboutPageSEO() {
    const result = await fetchFromStrapi<StrapiResponse<any>>('/about', { populate: '*' });
    if (!result?.data) return null;
    
    return this.extractSEOFromData(result.data, {
      title: 'About Clensy | Professional Cleaning Services',
      description: 'Learn about Clensy - New Jersey\'s trusted professional cleaning company.',
      canonicalUrl: 'https://clensy.com/company/about',
    });
  }

  /**
   * Get FAQ Page SEO
   */
  static async getFAQPageSEO() {
    const result = await fetchFromStrapi<StrapiResponse<any>>('/faq-page', { populate: '*' });
    if (!result?.data) return null;
    
    return this.extractSEOFromData(result.data, {
      title: 'FAQ | Clensy Cleaning Services',
      description: 'Find answers to common questions about Clensy cleaning services.',
      canonicalUrl: 'https://clensy.com/faq',
    });
  }

  /**
   * Get Contact Page SEO
   */
  static async getContactPageSEO() {
    const result = await fetchFromStrapi<StrapiResponse<any>>('/contact', { populate: '*' });
    if (!result?.data) return null;
    
    return this.extractSEOFromData(result.data, {
      title: 'Contact Us | Clensy Professional Cleaning',
      description: 'Get in touch with Clensy for professional cleaning services.',
      canonicalUrl: 'https://clensy.com/contact',
    });
  }

  /**
   * Get Privacy Policy SEO
   */
  static async getPrivacyPolicySEO() {
    const result = await fetchFromStrapi<StrapiResponse<any>>('/privacy-policy', { populate: '*' });
    if (!result?.data) return null;
    
    return this.extractSEOFromData(result.data, {
      title: 'Privacy Policy | Clensy',
      description: 'Read Clensy\'s privacy policy.',
      canonicalUrl: 'https://clensy.com/privacy-policy',
    });
  }

  /**
   * Get Terms of Service SEO
   */
  static async getTermsOfServiceSEO() {
    const result = await fetchFromStrapi<StrapiResponse<any>>('/terms-of-service', { populate: '*' });
    if (!result?.data) return null;
    
    return this.extractSEOFromData(result.data, {
      title: 'Terms of Service | Clensy',
      description: 'Read Clensy\'s terms of service.',
      canonicalUrl: 'https://clensy.com/terms-of-service',
    });
  }

  /**
   * Get Checklist Page SEO
   */
  static async getChecklistPageSEO() {
    const result = await fetchFromStrapi<StrapiResponse<any>>('/checklist-page', { populate: '*' });
    if (!result?.data) return null;
    
    return this.extractSEOFromData(result.data, {
      title: 'Our Cleaning Checklist | Clensy',
      description: 'Explore Clensy\'s comprehensive cleaning checklist.',
      canonicalUrl: 'https://clensy.com/company/checklist',
    });
  }

  /**
   * Get Checklist Page (full content)
   */
  static async getChecklistPage() {
    const result = await fetchFromStrapi<StrapiResponse<any>>('/checklist-page', { populate: '*' });
    if (!result?.data) return null;
    
    const data = result.data;
    return {
      heroSection: {
        heading: data.heroHeading || '',
        description: data.heroDescription || '',
        subDescription: data.heroSubDescription || '',
        backgroundImage: getImageUrl(data.heroBackgroundImage) || data.heroBackgroundImageUrl || '',
        ctaButtonText: data.heroCtaButtonText || '',
        ratingText: data.heroRatingText || '',
        satisfactionText: data.heroSatisfactionText || '',
      },
      interactiveGuide: {
        heading: data.interactiveGuideHeading || '',
        description: data.interactiveGuideDescription || '',
        floorPlanDesktop: getImageUrl(data.floorPlanImageDesktop) || data.floorPlanImageDesktopUrl || '',
        floorPlanMobile: getImageUrl(data.floorPlanImageMobile) || data.floorPlanImageMobileUrl || '',
      },
      checklistSection: {
        heading: data.checklistSectionHeading || '',
        description: data.checklistSectionDescription || '',
        checklistData: data.checklistData || {},
      },
      ctaSection: {
        heading: data.ctaHeading || '',
        description: data.ctaDescription || '',
        buttonText: data.ctaButtonText || '',
        phoneNumber: data.ctaPhoneNumber || '',
      },
    };
  }
}

export default CMSAdapter;

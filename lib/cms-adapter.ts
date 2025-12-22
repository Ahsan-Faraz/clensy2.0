/**
 * CMS Adapter - Strapi-only interface for CMS content
 * 
 * All CMS content is fetched from Strapi.
 * MongoDB is only used for booking functionality (separate from this adapter).
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

// Cache for landing page data
let landingPageCache: any = null;
let landingPageCacheTime: number = 0;
const CACHE_DURATION = 60000; // 1 minute

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
    revalidate?: number;
  } = {}
): Promise<T | null> {
  const { populate, filters } = options;
  
  const params = new URLSearchParams();
  
  if (populate) {
    if (typeof populate === 'string') {
      params.append('populate', populate);
    } else if (Array.isArray(populate)) {
      populate.forEach((p, i) => params.append(`populate[${i}]`, p));
    } else {
      params.append('populate', JSON.stringify(populate));
    }
  }
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (typeof value === 'object') {
        Object.entries(value as object).forEach(([op, val]) => {
          params.append(`filters[${key}][${op}]`, String(val));
        });
      } else {
        params.append(`filters[${key}]`, String(value));
      }
    });
  }
  
  const queryString = params.toString();
  const url = `${STRAPI_URL}/api${endpoint}${queryString ? `?${queryString}` : ''}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.error(`Strapi fetch error: ${response.status} ${response.statusText}`);
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
 * CMS Adapter - Fetches all CMS content from Strapi
 */
export class CMSAdapter {
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
      },
      faqCategories: data.faqCategories || {},
      faqItems: data.faqItems || [],
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
  static async getLocationBySlug(slug: string) {
    const result = await fetchFromStrapi<StrapiResponse<any[]>>('/locations', {
      filters: { slug: { $eq: slug } },
      populate: {
        heroBackgroundImage: { populate: '*' },
        operatingHours: { populate: '*' },
        serviceAreas: { populate: '*' },
        seo: { populate: '*' },
      },
    });
    
    if (!result?.data || result.data.length === 0) return null;
    
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
        title: data.seo?.metaTitle || '',
        description: data.seo?.metaDescription || '',
        keywords: data.seo?.keywords || [],
      },
    };
  }
  
  /**
   * Get Service by Slug
   */
  static async getServiceBySlug(slug: string) {
    const result = await fetchFromStrapi<StrapiResponse<any[]>>('/services', {
      filters: { slug: { $eq: slug } },
      populate: '*',
    });

    if (!result?.data || result.data.length === 0) return null;

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
    };
  }
  
  /**
   * Get All Services (for listing)
   */
  static async getAllServices() {
    const result = await fetchFromStrapi<StrapiResponse<any[]>>('/services', {
      populate: {
        heroBackgroundImage: { populate: '*' },
      },
    });
    
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
  static async getAllLocations() {
    const result = await fetchFromStrapi<StrapiResponse<any[]>>('/locations', {
      populate: {
        heroBackgroundImage: { populate: '*' },
      },
    });
    
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
}

export default CMSAdapter;

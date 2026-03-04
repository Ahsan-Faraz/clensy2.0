/** Base ServiceData shape from CMS adapter — Unified 7-section structure */
export interface ServiceDataBase {
  name: string;
  slug: string;
  serviceType: string;
  // Hero
  heroTopLabel: string;
  heroHeading: string;
  heroSubheading: string;
  heroBackgroundImage: string;
  heroBackgroundImageUrl?: string;
  heroServiceDuration: string;
  heroServiceGuarantee: string;
  // Trust Indicators
  serviceTrustIndicators: Array<{ number: string; text: string }>;
  // What's Included (Zig-Zag)
  includedSectionHeading: string;
  includedSectionSubheading: string;
  cleaningAreas: Array<{
    title: string;
    description: string;
    image: string;
    imageUrl?: string;
    imageAlt?: string;
    features: string[];
  }>;
  // Why Choose
  whyChooseHeading: string;
  whyChooseSubheading: string;
  benefit1Title: string;
  benefit1Description: string;
  benefit1Icon: string;
  benefit2Title: string;
  benefit2Description: string;
  benefit2Icon: string;
  benefit3Title: string;
  benefit3Description: string;
  benefit3Icon: string;
  // Testimonials
  clientTestimonialsHeading: string;
  clientTestimonialsSubheading: string;
  clientTestimonials: Array<{
    rating: number;
    review: string;
    clientName: string;
    clientLocation: string;
    avatarBgColor?: string;
  }>;
  // FAQs
  faqs: Array<{ question: string; answer: string }>;
  // SEO
  seo?: any;
  // HTML Blocks
  htmlBlocks?: Array<{
    blockName: string;
    htmlContent: string;
    placement: string;
    customPosition?: string;
    cssClasses?: string;
    cssId?: string;
    order: number;
    isActive: boolean;
  }>;
}

/** Base ServiceData shape from CMS adapter */
export interface ServiceDataBase {
  name: string;
  slug: string;
  serviceType: string;
  heroTopLabel: string;
  heroHeading: string;
  heroSubheading: string;
  heroBackgroundImage: string;
  heroBackgroundImageUrl?: string;
  heroServiceDuration: string;
  heroServiceGuarantee: string;
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
  featureSectionHeading: string;
  featureSectionSubheading: string;
  featureSectionImage: string;
  featureSectionPoints: string[];
  howItWorksHeading: string;
  howItWorksSubheading: string;
  step1Title: string;
  step1Description: string;
  step1Image: string;
  step2Title: string;
  step2Description: string;
  step2Image: string;
  step3Title: string;
  step3Description: string;
  step3Image: string;
  benefitsHeading: string;
  benefitsSubheading: string;
  benefitsImage: string;
  benefit1Title: string;
  benefit1Description: string;
  benefit2Title: string;
  benefit2Description: string;
  benefit3Title: string;
  benefit3Description: string;
  clientTestimonialsHeading: string;
  clientTestimonialsSubheading: string;
  clientTestimonials: Array<{
    rating: number;
    review: string;
    clientName: string;
    clientLocation: string;
    avatarBgColor?: string;
  }>;
  frequencyGuideHeading: string;
  frequencyGuideSubheading: string;
  frequencyOptions: Array<{
    title: string;
    color: string;
    perfectFor: string[];
    benefits: string;
    label: string;
  }>;
  faqs: Array<{ question: string; answer: string }>;
  /** Top-level editable fields (also in Strapi admin) */
  whyChooseHeading?: string;
  whyChooseSubheading?: string;
  benefit1Icon?: string;
  benefit2Icon?: string;
  benefit3Icon?: string;
  pricingHeading?: string;
  pricingSubheading?: string;
  pricingPlans?: Array<{
    planName: string;
    planSubtitle?: string;
    planPrice: string;
    planPriceUnit?: string;
    planFeatures?: string[];
    planButtonText?: string;
    planButtonLink?: string;
    isPopular?: boolean;
    planColor?: string;
  }>;
  pricingCustomSectionHeading?: string;
  pricingCustomSectionDescription?: string;
  customData?: {
    trustIndicators?: Array<{ number: string; text: string }>;
    beforeAfter?: {
      heading: string;
      subheading: string;
      items?: Array<{
        heading: string;
        beforeImage: string;
        afterImage: string;
        caption: string;
      }>;
    };
    whenToChoose?: {
      heading: string;
      subheading: string;
      options?: Array<{
        title: string;
        description: string;
        icon?: string;
      }>;
    };
    comparison?: {
      heading: string;
      subheading?: string;
      regularCleaning?: {
        title: string;
        subtitle: string;
        features?: string[] | Array<{ title: string; description: string }>;
        frequency: string;
      };
      deepCleaning?: {
        title: string;
        subtitle: string;
        features?: string[] | Array<{ title: string; description: string }>;
        frequency: string;
      };
    };
    premiumExtraServices?: any[];
    extrasPricing?: any[];
    pricingPlans?: any[];
    pricingHeading?: string;
    pricingSubheading?: string;
    /** Moving */
    reduceStressSection?: {
      heading: string;
      subheading: string;
      description: string;
    };
    /** Moving, Airbnb */
    benefit1Icon?: string;
    benefit2Icon?: string;
    benefit3Icon?: string;
    clientTestimonials?: Array<{
      rating: number;
      review: string;
      clientName: string;
      clientLocation: string;
      avatarBgColor?: string;
    }>;
    /** Post-Construction */
    processHeading?: string;
    processSubheading?: string;
    step1Title?: string;
    step1Description?: string;
    step2Title?: string;
    step2Description?: string;
    step3Title?: string;
    step3Description?: string;
    step4Title?: string;
    step4Description?: string;
    safetyHeading?: string;
    safetySubheading?: string;
    ppeTitle?: string;
    ppeDescription?: string;
    ppeFeatures?: string[];
    hazmatTitle?: string;
    hazmatDescription?: string;
    hazmatFeatures?: string[];
    /** Office, Other Commercial */
    whyChooseHeading?: string;
    whyChooseSubheading?: string;
    feature1Title?: string;
    feature1Description?: string;
    feature1Icon?: string;
    feature2Title?: string;
    feature2Description?: string;
    feature2Icon?: string;
    feature3Title?: string;
    feature3Description?: string;
    feature3Icon?: string;
    pricingCustomSectionHeading?: string;
    pricingCustomSectionDescription?: string;
    /** Office */
    businessBenefits?: {
      heading: string;
      subheading: string;
      cards: Array<{
        title: string;
        description: string;
        icon?: string;
        iconColor?: string;
      }>;
    };
    /** Gym */
    specializedEquipment?: {
      heading: string;
      subheading: string;
      items: Array<{
        title: string;
        description: string;
        icon?: string;
      }>;
    };
    healthAndSafetyStandards?: {
      heading: string;
      subheading: string;
      image?: string;
      items: Array<{
        title: string;
        description: string;
      }>;
    };
    /** Airbnb */
    serviceFeatures?: any[];
    successStories?: {
      heading?: string;
      subheading?: string;
      items?: Array<{
        title: string;
        description: string;
        metric: string;
        hostName: string;
        hostTitle: string;
        avatarColor?: string;
      }>;
    };
  };
  seo?: any;
}

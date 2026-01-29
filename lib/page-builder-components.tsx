'use client';

import { Config } from "@wecre8websites/strapi-page-builder-react";
import React from 'react';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Helper to get image URL from Strapi media object
const getImageUrl = (imageData: any, baseUrl: string = 'http://localhost:1337'): string => {
  if (!imageData) return '';
  if (typeof imageData === 'string') {
    if (imageData.startsWith('http') || imageData.startsWith('/')) return imageData;
    return `${baseUrl}${imageData}`;
  }
  const url = imageData?.url || imageData?.data?.attributes?.url || imageData?.attributes?.url;
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${baseUrl}${url}`;
};

// Helper to get value - Simply return the prop value directly
// The Page Builder component handles all data flow:
// - Sidebar edits update props in real-time
// - The Render component merges content into props before rendering
// So we just render what we receive in props
const getValue = (propValue: any): any => {
  return propValue ?? '';
};

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface HeroProps {
  heroTopLabel: string;
  heroHeading: string;
  heroSubheading: string;
  heroButtonText: string;
  heroButtonLink: string;
  heroFeature1: string;
  heroFeature2: string;
  heroBackgroundImage?: any;
  heroBackgroundImageUrl?: string;
  heroBackgroundImageAlt?: string;
}

interface HowItWorksProps {
  howItWorksHeading: string;
  step1Title: string;
  step1Description: string;
  step1FeatureText: string;
  step2Title: string;
  step2Description: string;
  step2FeatureText: string;
  step3Title: string;
  step3Description: string;
  step3FeatureText: string;
  howItWorksButtonText: string;
}

interface ChecklistProps {
  checklistHeading: string;
  checklistDescription: string;
  checklistItems?: any;
  checklistButtonText: string;
}

interface ComparisonProps {
  comparisonHeading: string;
  comparisonDescription: string;
  comparisonFeatures?: any;
}

interface ReviewsProps {
  reviewsHeading: string;
  reviewsButtonText: string;
  testimonials?: any;
}

interface CTAProps {
  ctaHeading: string;
  ctaDescription: string;
  ctaLeftCardTitle: string;
  ctaLeftCardDescription: string;
  ctaLeftCardButtonText: string;
  ctaRightCardTitle: string;
  ctaRightCardDescription: string;
  ctaRightCardButtonText: string;
}

interface SEOProps {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
}

// ==========================================================================
// ABOUT PAGE COMPONENT TYPES
// ==========================================================================

interface AboutHeroProps {
  heroHeading: string;
  heroTagline: string;
}

interface AboutOurStoryProps {
  ourStoryHeading: string;
  ourStoryParagraph1: string;
  ourStoryParagraph2: string;
  ourStoryParagraph3: string;
  ourStoryImageUrl: string;
}

interface AboutWhyWeStartedProps {
  whyWeStartedHeading: string;
  whyWeStartedSubtitle: string;
  whyWeStartedQuoteText: string;
  whyWeStartedParagraph1: string;
  whyWeStartedParagraph2: string;
  whyWeStartedParagraph3: string;
}

interface AboutWhatMakesUsDifferentProps {
  whatMakesUsDifferentHeading: string;
  residentialCommercialTitle: string;
  residentialCommercialParagraph1: string;
  residentialCommercialParagraph2: string;
  eliteTeamTitle: string;
  eliteTeamParagraph1: string;
  eliteTeamParagraph2: string;
  eliteTeamImageUrl: string;
  clientFocusedTechHeading: string;
}

interface AboutMissionProps {
  ourMissionHeading: string;
  ourMissionParagraph1: string;
  ourMissionParagraph2: string;
  ourMissionParagraph3: string;
  ourMissionParagraph4: string;
  ourMissionClosingLine: string;
}

interface AboutCTAProps {
  ctaHeading: string;
  ctaDescription: string;
  ctaBookButtonText: string;
  ctaContactButtonText: string;
}

// ==========================================================================
// CONTACT PAGE COMPONENT TYPES
// ==========================================================================

interface ContactHeroProps {
  heroTopLabel: string;
  heroHeading: string;
  heroDescription: string;
  heroSendMessageButtonText: string;
  heroSupportText: string;
  heroResponseText: string;
  heroImageUrl: string;
  trustMainText: string;
  trustSubtitle: string;
}

interface ContactInfoProps {
  contactSectionTitle: string;
  phoneTitle: string;
  phoneDescription: string;
  phoneNumber: string;
  emailTitle: string;
  emailDescription: string;
  emailAddress: string;
  officeTitle: string;
  officeDescription: string;
  addressLine1: string;
  addressLine2: string;
  cityStateZip: string;
  businessHoursTitle: string;
  businessHoursDescription: string;
  immediateAssistanceTitle: string;
  immediateAssistanceDescription: string;
  immediateAssistanceButtonText: string;
}

interface ContactConsultationProps {
  consultationHeading: string;
  consultationDescription: string;
  consultationButtonText: string;
}

type PageBuilderBlocks = {
  Hero: HeroProps;
  HowItWorks: HowItWorksProps;
  Checklist: ChecklistProps;
  Comparison: ComparisonProps;
  Reviews: ReviewsProps;
  CTA: CTAProps;
  SEO: SEOProps;
  // About Page Components
  AboutHero: AboutHeroProps;
  AboutOurStory: AboutOurStoryProps;
  AboutWhyWeStarted: AboutWhyWeStartedProps;
  AboutWhatMakesUsDifferent: AboutWhatMakesUsDifferentProps;
  AboutMission: AboutMissionProps;
  AboutCTA: AboutCTAProps;
  // Contact Page Components
  ContactHero: ContactHeroProps;
  ContactInfo: ContactInfoProps;
  ContactConsultation: ContactConsultationProps;
};

type Categories = "hero" | "content" | "seo" | "about" | "contact";

// ============================================================================
// CHECK ICON SVG COMPONENT
// ============================================================================

const CheckIcon = ({ className = "h-5 w-5", color = "#28A745" }: { className?: string; color?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const ClockIcon = ({ className = "h-4 w-4", color = "#007BFF" }: { className?: string; color?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const CalendarIcon = ({ className = "h-4 w-4", color = "#007BFF" }: { className?: string; color?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const PhoneIcon = ({ className = "h-4 w-4", color = "white" }: { className?: string; color?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const StarIcon = ({ className = "h-4 w-4", color = "#FBBC05" }: { className?: string; color?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill={color} stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

// ============================================================================
// PAGE BUILDER CONFIGURATION
// ============================================================================

export const pageBuilderConfig: Config<PageBuilderBlocks, {}, Categories> = {
  components: {
    // ==========================================================================
    // HERO SECTION - Matches components/hero-section.tsx exactly
    // ==========================================================================
    Hero: {
      fields: {
        heroTopLabel: { type: "text" },
        heroHeading: { type: "text" },
        heroSubheading: { type: "textarea" },
        heroButtonText: { type: "text" },
        heroButtonLink: { type: "text" },
        heroFeature1: { type: "text" },
        heroFeature2: { type: "text" },
        heroBackgroundImage: { type: "media", mediaType: "image" as const },
        heroBackgroundImageUrl: { type: "text" },
        heroBackgroundImageAlt: { type: "text" },
      },
      defaultProps: {
        heroTopLabel: "Professional Cleaning Services",
        heroHeading: "Professional cleaning for your home",
        heroSubheading: "We make it easy to get your home cleaned. Professional cleaning services tailored to your needs.",
        heroButtonText: "See my price",
        heroButtonLink: "/booking",
        heroFeature1: "30-second pricing",
        heroFeature2: "100% Satisfaction guaranteed",
        heroBackgroundImage: undefined,
        heroBackgroundImageUrl: "https://res.cloudinary.com/dgjmm3usy/image/upload/v1751356490/shutterstock_2392393465__3_.jpg-0LMVCo8sUiQDVXDeUykdUtzKRTrvHa_qkbjiu.jpg",
        heroBackgroundImageAlt: "Clean modern kitchen",
      },
      render: (data: HeroProps, content?: any, strapi?: any) => {
        const baseUrl = strapi?.url || strapi?.imageUrl || 'http://localhost:1337';

        // Use prop values directly - Page Builder handles all data flow
        const topLabel = getValue(data.heroTopLabel);
        const heading = getValue(data.heroHeading);
        const subheading = getValue(data.heroSubheading);
        const buttonText = getValue(data.heroButtonText);
        const buttonLink = getValue(data.heroButtonLink);
        const feature1 = getValue(data.heroFeature1);
        const feature2 = getValue(data.heroFeature2);
        
        // Get background image
        const bgImage = getImageUrl(data.heroBackgroundImage, baseUrl) 
          || data.heroBackgroundImageUrl 
          || "https://res.cloudinary.com/dgjmm3usy/image/upload/v1751356490/shutterstock_2392393465__3_.jpg-0LMVCo8sUiQDVXDeUykdUtzKRTrvHa_qkbjiu.jpg";

        return (
          <section style={{ position: 'relative', minHeight: '100vh', paddingTop: '64px' }}>
            {/* Background image with overlay */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
              <img
                src={bgImage}
                alt={data.heroBackgroundImageAlt || "Clean modern kitchen"}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.7,
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, black, rgba(0,0,0,0.7), transparent)',
              }}></div>
            </div>

            <div style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '0 1rem',
              position: 'relative',
              zIndex: 10,
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '2rem',
                alignItems: 'center',
                minHeight: 'calc(100vh - 64px)',
              }}>
                {/* Left side - Text content */}
                <div>
                  {/* Top Label */}
                  <div style={{
                    display: 'inline-block',
                    marginBottom: '1.5rem',
                    padding: '0.25rem 1rem',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(4px)',
                    borderRadius: '9999px',
                  }}>
                    <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem', fontWeight: 500 }}>
                      {topLabel}
                    </span>
                  </div>

                  {/* Heading */}
                  <h1 style={{
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    color: 'white',
                    letterSpacing: '-0.025em',
                    marginBottom: '1.5rem',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}>
                    {heading}
                  </h1>

                  {/* Subheading */}
                  <p style={{
                    fontSize: '1.125rem',
                    color: 'rgba(255,255,255,0.8)',
                    marginBottom: '2rem',
                    maxWidth: '36rem',
                  }}>
                    {subheading}
                  </p>

                  {/* Button and Features */}
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
                    <a
                      href={buttonLink}
                      style={{
                        background: 'white',
                        color: 'black',
                        padding: '0.75rem 2rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s',
                        width: '12rem',
                      }}
                    >
                      <span style={{ textAlign: 'center', width: '100%' }}>{buttonText}</span>
                    </a>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.9)', marginRight: '1rem' }}>
                        <CheckIcon className="h-5 w-5" color="#28A745" />
                        <span style={{ fontSize: '0.875rem', whiteSpace: 'nowrap', marginLeft: '0.5rem' }}>{feature1}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.9)' }}>
                        <CheckIcon className="h-5 w-5" color="#28A745" />
                        <span style={{ fontSize: '0.875rem', whiteSpace: 'nowrap', marginLeft: '0.5rem' }}>{feature2}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Empty space */}
                <div></div>
              </div>
            </div>

            {/* Scroll indicator */}
            <div style={{
              position: 'absolute',
              bottom: '2.5rem',
              left: '50%',
              transform: 'translateX(-50%)',
            }}>
              <svg style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </section>
        );
      },
    },

    // ==========================================================================
    // HOW IT WORKS SECTION - Matches components/how-it-works.tsx exactly
    // ==========================================================================
    HowItWorks: {
      fields: {
        howItWorksHeading: { type: "text" },
        step1Title: { type: "text" },
        step1Description: { type: "textarea" },
        step1FeatureText: { type: "text" },
        step2Title: { type: "text" },
        step2Description: { type: "textarea" },
        step2FeatureText: { type: "text" },
        step3Title: { type: "text" },
        step3Description: { type: "textarea" },
        step3FeatureText: { type: "text" },
        howItWorksButtonText: { type: "text" },
      },
      defaultProps: {
        howItWorksHeading: "How it works",
        step1Title: "Order online",
        step1Description: "Our easy online pricing lets you set up a cleaning plan right now. See your price and get scheduled today.",
        step1FeatureText: "Takes less than 30 seconds",
        step2Title: "We clean your home",
        step2Description: "Our professional team arrives on time and cleans your home according to our 50-point checklist.",
        step2FeatureText: "Trained and background-checked professionals",
        step3Title: "Enjoy your clean home",
        step3Description: "Relax in your freshly cleaned space. We'll be back on your schedule - weekly, bi-weekly, or monthly.",
        step3FeatureText: "Flexible scheduling to fit your lifestyle",
        howItWorksButtonText: "Book Now",
      },
      render: (data: HowItWorksProps, content?: any, strapi?: any) => {
        // Use prop values directly - Page Builder handles all data flow
        const heading = getValue(data.howItWorksHeading);
        const step1Title = getValue(data.step1Title);
        const step1Description = getValue(data.step1Description);
        const step1FeatureText = getValue(data.step1FeatureText);
        const step2Title = getValue(data.step2Title);
        const step2Description = getValue(data.step2Description);
        const step2FeatureText = getValue(data.step2FeatureText);
        const step3Title = getValue(data.step3Title);
        const step3Description = getValue(data.step3Description);
        const step3FeatureText = getValue(data.step3FeatureText);
        const buttonText = getValue(data.howItWorksButtonText);

        const stepNumberStyle: React.CSSProperties = {
          width: '3rem',
          height: '3rem',
          borderRadius: '50%',
          background: '#007BFF',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '1.25rem',
          flexShrink: 0,
          marginRight: '1.5rem',
        };

        const featureBoxStyle: React.CSSProperties = {
          background: '#f9fafb',
          padding: '1rem',
          borderRadius: '0.5rem',
          border: '1px solid #f3f4f6',
        };

        return (
          <section style={{ padding: '5rem 0', background: 'white' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                  {heading}
                </h2>
                <div style={{ width: '4rem', height: '4px', background: 'black', margin: '0 auto' }}></div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
                {/* Left side - Steps */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {/* Step 1 */}
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <div style={stepNumberStyle}>1</div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '0.5rem' }}>{step1Title}</h3>
                      <p style={{ color: '#4b5563', marginBottom: '1rem' }}>{step1Description}</p>
                      <div style={featureBoxStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#4b5563' }}>
                          <ClockIcon className="h-4 w-4" />
                          <span style={{ marginLeft: '0.5rem' }}>{step1FeatureText}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <div style={stepNumberStyle}>2</div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '0.5rem' }}>{step2Title}</h3>
                      <p style={{ color: '#4b5563', marginBottom: '1rem' }}>{step2Description}</p>
                      <div style={featureBoxStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#4b5563' }}>
                          <CheckIcon className="h-4 w-4" color="#007BFF" />
                          <span style={{ marginLeft: '0.5rem' }}>{step2FeatureText}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <div style={stepNumberStyle}>3</div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '0.5rem' }}>{step3Title}</h3>
                      <p style={{ color: '#4b5563', marginBottom: '1rem' }}>{step3Description}</p>
                      <div style={featureBoxStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#4b5563' }}>
                          <CalendarIcon className="h-4 w-4" />
                          <span style={{ marginLeft: '0.5rem' }}>{step3FeatureText}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Button */}
                  <div style={{ paddingTop: '1rem' }}>
                    <a
                      href="/booking/"
                      style={{
                        background: '#007BFF',
                        color: 'white',
                        padding: '0.75rem 2rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {buttonText}
                    </a>
                  </div>
                </div>

                {/* Right side - Phone mockup placeholder */}
                <div style={{
                  background: '#f3f4f6',
                  borderRadius: '2rem',
                  padding: '2rem',
                  minHeight: '400px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <div style={{
                    background: 'white',
                    borderRadius: '1.5rem',
                    width: '240px',
                    height: '480px',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                    border: '8px solid #1f2937',
                    overflow: 'hidden',
                  }}>
                    <div style={{ background: '#1f2937', padding: '1rem', textAlign: 'center' }}>
                      <span style={{ color: 'white', fontWeight: 500 }}>Clensy</span>
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <h5 style={{ fontWeight: 500, marginBottom: '1rem', fontSize: '0.875rem' }}>Book Your Cleaning</h5>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ background: '#f3f4f6', padding: '0.75rem', borderRadius: '0.5rem' }}>
                          <div style={{ fontSize: '0.625rem', color: '#6b7280' }}>Service Type</div>
                          <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>Routine Cleaning</div>
                        </div>
                        <div style={{ background: '#f3f4f6', padding: '0.75rem', borderRadius: '0.5rem' }}>
                          <div style={{ fontSize: '0.625rem', color: '#6b7280' }}>Date</div>
                          <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>May 15, 2023</div>
                        </div>
                        <div style={{ background: '#f3f4f6', padding: '0.75rem', borderRadius: '0.5rem' }}>
                          <div style={{ fontSize: '0.625rem', color: '#6b7280' }}>Arrival Window</div>
                          <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>8:00 AM - 10:00 AM</div>
                        </div>
                        <button style={{
                          width: '100%',
                          background: '#1f2937',
                          color: 'white',
                          padding: '0.5rem',
                          borderRadius: '0.5rem',
                          border: 'none',
                          marginTop: '0.5rem',
                          fontSize: '0.875rem',
                        }}>
                          Confirm Booking
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      },
    },

    // ==========================================================================
    // CHECKLIST SECTION - Matches components/checklist-section.tsx exactly
    // ==========================================================================
    Checklist: {
      fields: {
        checklistHeading: { type: "text" },
        checklistDescription: { type: "textarea" },
        // checklistItems is managed via CMS content, not editable in sidebar
        checklistButtonText: { type: "text" },
      },
      defaultProps: {
        checklistHeading: "Our 50-Point Cleaning Checklist",
        checklistDescription: "We don't miss a spot. Here's our comprehensive cleaning checklist for every room in your home.",
        checklistItems: {
          routine: {
            living: ["Sweep, Vacuum, & Mop Floors", "Upholstered furniture vacuumed", "Dust all surfaces and decor", "Dust electronics and TV stands"],
            kitchen: ["Sweep, Vacuum, & Mop Floors", "Wipe down countertops", "Wipe down Stove Top", "Clean exterior of appliances"],
            bathroom: ["Sweep, Vacuum, & Mop Floors", "Scrub and sanitize showers and tubs", "Clean and disinfect toilets", "Scrub and disinfect sink"],
            bedroom: ["Sweep, Vacuum, & Mop Floors", "Beds made, linens changed", "Dust bedroom shelving", "Picture frames dusted"],
          },
        },
        checklistButtonText: "View Full 50-Point Checklist",
      },
      render: (data: ChecklistProps, content?: any, strapi?: any) => {
        // Use prop values directly - Page Builder handles all data flow
        const heading = getValue(data.checklistHeading);
        const description = getValue(data.checklistDescription);
        const buttonText = getValue(data.checklistButtonText);
        const checklistItems = data.checklistItems;

        // Default checklist items if not available
        const defaultItems = [
          "Sweep, Vacuum, & Mop Floors",
          "Upholstered furniture vacuumed",
          "Dust all surfaces and decor",
          "Dust electronics and TV stands",
          "Fluff and straighten couch cushions",
          "Clean mirrors and glass surfaces",
          "Light organization of room",
          "Trash emptied",
        ];

        // Get items for living room routine cleaning
        const items = checklistItems?.routine?.living || defaultItems;

        return (
          <section style={{ padding: '5rem 0', background: 'white' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                  {heading}
                </h2>
                <p style={{ fontSize: '1.125rem', color: '#4b5563', maxWidth: '48rem', margin: '0 auto' }}>
                  {description}
                </p>
              </div>

              {/* Cleaning Type Tabs */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                <div style={{
                  display: 'inline-flex',
                  background: '#f3f4f6',
                  borderRadius: '0.5rem',
                  padding: '0.25rem',
                }}>
                  {['Routine', 'Deep', 'Moving'].map((type, index) => (
                    <button
                      key={type}
                      style={{
                        padding: '0.75rem 1.5rem',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        borderRadius: '0.375rem',
                        border: 'none',
                        cursor: 'pointer',
                        background: index === 0 ? '#007BFF' : 'transparent',
                        color: index === 0 ? 'white' : '#4b5563',
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
                {/* Floor Plan Image Placeholder */}
                <div style={{
                  background: '#f9fafb',
                  borderRadius: '0.5rem',
                  padding: '2rem',
                  minHeight: '400px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}>
                  <div style={{ textAlign: 'center', color: '#6b7280' }}>
                    <svg style={{ width: '4rem', height: '4rem', margin: '0 auto 1rem', opacity: 0.5 }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    </svg>
                    <p style={{ fontSize: '0.875rem' }}>Interactive Floor Plan</p>
                    <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Click on rooms to see cleaning checklist</p>
                  </div>

                  {/* Room buttons */}
                  {['Living Room', 'Kitchen', 'Bedroom', 'Bathroom'].map((room, index) => (
                    <div
                      key={room}
                      style={{
                        position: 'absolute',
                        padding: '0.5rem 1rem',
                        background: index === 0 ? '#007BFF' : 'rgba(255,255,255,0.9)',
                        color: index === 0 ? 'white' : '#007BFF',
                        borderRadius: '0.375rem',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        ...(index === 0 ? { left: '40%', bottom: '30%' } :
                           index === 1 ? { right: '15%', bottom: '25%' } :
                           index === 2 ? { left: '15%', top: '25%' } :
                           { right: '20%', top: '20%' }),
                      }}
                    >
                      {room.toUpperCase()}
                    </div>
                  ))}
                </div>

                {/* Checklist */}
                <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                    <div style={{
                      width: '0.75rem',
                      height: '0.75rem',
                      borderRadius: '50%',
                      background: '#007BFF',
                      marginRight: '0.5rem',
                    }}></div>
                    Living Room
                  </h3>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {items.slice(0, 8).map((item: string, index: number) => (
                      <li key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                        <div style={{
                          flexShrink: 0,
                          marginTop: '2px',
                          width: '1.25rem',
                          height: '1.25rem',
                          borderRadius: '50%',
                          background: '#007BFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <CheckIcon className="h-3 w-3" color="white" />
                        </div>
                        <span style={{ color: '#111827' }}>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* View Full Checklist Button */}
                  <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <a
                      href="/company/checklist"
                      style={{
                        color: '#007BFF',
                        border: '1px solid #007BFF',
                        padding: '0.5rem 1.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                      }}
                    >
                      {buttonText}
                      <svg style={{ marginLeft: '0.5rem', width: '1rem', height: '1rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      },
    },

    // ==========================================================================
    // COMPARISON SECTION - Matches components/comparison-section.tsx exactly
    // ==========================================================================
    Comparison: {
      fields: {
        comparisonHeading: { type: "text" },
        comparisonDescription: { type: "textarea" },
        // comparisonFeatures is managed via CMS content, not editable in sidebar
      },
      defaultProps: {
        comparisonHeading: "The Clensy Difference",
        comparisonDescription: "We're leading the cleaning industry in customer satisfaction and service quality. Try Clensy and see why cleaning is a big deal to us.",
        comparisonFeatures: [
          { name: "Locally Owned and Operated", clensy: true, others: true },
          { name: "Customized Cleaning Packages", clensy: true, others: true },
          { name: "Easy Online Booking", clensy: true, others: false },
          { name: "Over The Phone Estimates", clensy: true, others: false },
          { name: "Bonded and Insured", clensy: true, others: false },
          { name: "Eco-Friendly Supplies Included", clensy: true, others: false },
          { name: "Background Checked Cleaners", clensy: true, others: false },
          { name: "PRO Clean Promise", clensy: true, others: false },
          { name: "Premium Cleaning Supplies", clensy: true, others: false },
        ],
      },
      render: (data: ComparisonProps, content?: any, strapi?: any) => {
        // Use prop values directly - Page Builder handles all data flow
        const heading = getValue(data.comparisonHeading);
        const description = getValue(data.comparisonDescription);
        const features = data.comparisonFeatures;

        return (
          <section style={{ padding: '4rem 0', background: '#f9fafb' }}>
            <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1rem' }}>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1f2937' }}>
                  The Clensy <span style={{ color: '#007BFF' }}>Difference</span>
                </h2>
                <p style={{ color: '#374151', maxWidth: '42rem', margin: '1rem auto 0', textAlign: 'center' }}>
                  {description}
                </p>
                <div style={{ width: '6rem', height: '4px', background: '#007BFF', margin: '1.5rem auto 0' }}></div>
              </div>

              {/* Comparison Table */}
              <div style={{
                background: 'white',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                border: '1px solid #e5e7eb',
              }}>
                {/* Header Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid #e5e7eb' }}>
                  <div style={{ padding: '1rem 2rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937' }}>Features</h3>
                  </div>
                  <div style={{ background: '#007BFF', color: 'white', padding: '1rem', textAlign: 'center', fontWeight: 600 }}>
                    Clensy
                  </div>
                  <div style={{ background: '#444b54', color: 'white', padding: '1rem', textAlign: 'center', fontWeight: 600 }}>
                    Independent Maids
                  </div>
                </div>

                {/* Feature Rows */}
                {features.map((feature: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      borderBottom: index !== features.length - 1 ? '1px solid #f3f4f6' : 'none',
                      background: index % 2 === 0 ? 'white' : '#f9fafb',
                    }}
                  >
                    <div style={{ padding: '1.25rem 2rem', display: 'flex', alignItems: 'center' }}>
                      <div style={{
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '50%',
                        background: index % 2 === 0 ? '#f3f4f6' : 'white',
                        border: '1px solid #e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '1rem',
                      }}>
                        <svg style={{ width: '1.25rem', height: '1.25rem', color: '#007BFF' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="8.5" cy="7" r="4"></circle>
                        </svg>
                      </div>
                      <span style={{ color: '#1f2937', fontWeight: 500 }}>{feature.name}</span>
                    </div>
                    <div style={{ padding: '1.25rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <div style={{
                        width: '2rem',
                        height: '2rem',
                        background: '#007BFF',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <CheckIcon className="h-5 w-5" color="white" />
                      </div>
                    </div>
                    <div style={{ padding: '1.25rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      {feature.others ? (
                        <div style={{
                          width: '2rem',
                          height: '2rem',
                          background: '#9ca3af',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <CheckIcon className="h-5 w-5" color="white" />
                        </div>
                      ) : (
                        <div style={{
                          width: '2rem',
                          height: '2rem',
                          background: '#e5e7eb',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>—</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      },
    },

    // ==========================================================================
    // REVIEWS SECTION - Matches components/reviews-section.tsx exactly
    // ==========================================================================
    Reviews: {
      fields: {
        reviewsHeading: { type: "text" },
        reviewsButtonText: { type: "text" },
        // testimonials is managed via CMS content, not editable in sidebar
      },
      defaultProps: {
        reviewsHeading: "What People Are Saying About Us",
        reviewsButtonText: "Load More",
        testimonials: [
          { name: "Sarah Johnson", title: "1 day ago", text: "Monica was excellent. Went beyond in helping me. My sheets and comforter were not just washed but perfectly folded.", rating: 5, initial: "S", initialColor: "#9C27B0" },
          { name: "Michael Chen", title: "3 days ago", text: "Clensy does the best job taking care of our house. Bailey recently cleaned our home and did an amazing job.", rating: 5, initial: "M", initialColor: "#4CAF50" },
          { name: "Emily Rodriguez", title: "1 week ago", text: "Arrived as planned! Great job! Everything polished. Baseboards done. Kitchen and bathroom spotless.", rating: 5, initial: "E", initialColor: "#E91E63" },
          { name: "David Thompson", title: "2 weeks ago", text: "My house was cleaned by Clensy today. Susan did a great job. I asked them to pay special attention to the kitchen.", rating: 5, initial: "D", initialColor: "#FF5722" },
        ],
      },
      render: (data: ReviewsProps, content?: any, strapi?: any) => {
        // Use prop values directly - Page Builder handles all data flow
        const heading = getValue(data.reviewsHeading);
        const buttonText = getValue(data.reviewsButtonText);
        const testimonials = data.testimonials;

        // Format heading with blue highlight
        const formattedHeading = heading.replace(/<blue>(.*?)<\/blue>/g, '<span style="color: #007BFF;">$1</span>');

        return (
          <section style={{ padding: '4rem 0', background: 'linear-gradient(to bottom, white, #eff6ff)' }}>
            <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1rem' }}>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2
                  style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}
                  dangerouslySetInnerHTML={{ __html: formattedHeading.includes('Saying About Us') ? 
                    'What People Are <span style="color: #007BFF;">Saying About Us</span>' : 
                    formattedHeading 
                  }}
                />
              </div>

              {/* Reviews Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '2rem',
              }}>
                {testimonials.slice(0, 8).map((review: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      background: 'white',
                      borderRadius: '0.75rem',
                      padding: '1.5rem',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Author */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                      <div
                        style={{
                          width: '3rem',
                          height: '3rem',
                          borderRadius: '50%',
                          background: review.initialColor || '#007BFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '1.125rem',
                          marginRight: '0.75rem',
                        }}
                      >
                        {review.initial || review.name?.charAt(0)}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, color: '#1f2937' }}>{review.name}</p>
                        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{review.title}</p>
                      </div>
                    </div>

                    {/* Stars */}
                    <div style={{ display: 'flex', marginBottom: '0.75rem' }}>
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className="h-4 w-4" />
                      ))}
                    </div>

                    {/* Text */}
                    <p style={{ color: '#374151', fontSize: '0.875rem', flex: 1, marginBottom: '1rem' }}>
                      {review.text}
                    </p>

                    {/* Google Review Badge */}
                    <div style={{ marginTop: 'auto' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <img
                          src="https://www.google.com/favicon.ico"
                          alt="Google"
                          style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }}
                        />
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Review</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <button
                  style={{
                    background: '#007BFF',
                    color: 'white',
                    padding: '0.75rem 2rem',
                    borderRadius: '9999px',
                    fontWeight: 500,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}
                >
                  {buttonText}
                </button>
              </div>
            </div>
          </section>
        );
      },
    },

    // ==========================================================================
    // CTA SECTION - Matches components/cta-section.tsx exactly
    // ==========================================================================
    CTA: {
      fields: {
        ctaHeading: { type: "text" },
        ctaDescription: { type: "textarea" },
        ctaLeftCardTitle: { type: "text" },
        ctaLeftCardDescription: { type: "textarea" },
        ctaLeftCardButtonText: { type: "text" },
        ctaRightCardTitle: { type: "text" },
        ctaRightCardDescription: { type: "textarea" },
        ctaRightCardButtonText: { type: "text" },
      },
      defaultProps: {
        ctaHeading: "Home cleaning you can trust",
        ctaDescription: "Book our professional cleaning services today and experience the difference.",
        ctaLeftCardTitle: "Order online",
        ctaLeftCardDescription: "Our easy online pricing lets you set up a cleaning plan right now.",
        ctaLeftCardButtonText: "See my price",
        ctaRightCardTitle: "Call us now",
        ctaRightCardDescription: "Need more information? Prefer a friendly voice over the phone?",
        ctaRightCardButtonText: "(551) 305-4081",
      },
      render: (data: CTAProps, content?: any, strapi?: any) => {
        // Use prop values directly - Page Builder handles all data flow
        const heading = getValue(data.ctaHeading);
        const description = getValue(data.ctaDescription);
        const leftTitle = getValue(data.ctaLeftCardTitle);
        const leftDescription = getValue(data.ctaLeftCardDescription);
        const leftButtonText = getValue(data.ctaLeftCardButtonText);
        const rightTitle = getValue(data.ctaRightCardTitle);
        const rightDescription = getValue(data.ctaRightCardDescription);
        const rightButtonText = getValue(data.ctaRightCardButtonText);

        const cardStyle: React.CSSProperties = {
          background: '#f9fafb',
          padding: '2rem',
          borderRadius: '0.75rem',
          border: '1px solid #f3f4f6',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        };

        const buttonStyle: React.CSSProperties = {
          background: '#007BFF',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '9999px',
          fontSize: '0.875rem',
          fontWeight: 500,
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          border: 'none',
          cursor: 'pointer',
        };

        return (
          <section style={{ padding: '5rem 0', background: 'white' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
              <div style={{ maxWidth: '56rem', margin: '0 auto', textAlign: 'center' }}>
                {/* Heading */}
                <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1f2937' }}>
                  {heading}
                </h2>
                <p style={{ fontSize: '1.25rem', color: '#4b5563', marginBottom: '2.5rem', maxWidth: '42rem', margin: '0 auto 2.5rem' }}>
                  {description}
                </p>

                {/* Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxWidth: '42rem', margin: '0 auto' }}>
                  {/* Left Card - Order Online */}
                  <div style={cardStyle}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
                      {leftTitle}
                    </h3>
                    <p style={{ color: '#4b5563', marginBottom: '1.5rem' }}>
                      {leftDescription}
                    </p>
                    <a href="/booking/" style={buttonStyle}>
                      <CalendarIcon className="h-4 w-4" color="white" />
                      <span style={{ marginLeft: '0.5rem' }}>{leftButtonText}</span>
                    </a>
                  </div>

                  {/* Right Card - Call Us */}
                  <div style={cardStyle}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
                      {rightTitle}
                    </h3>
                    <p style={{ color: '#4b5563', marginBottom: '1.5rem' }}>
                      {rightDescription}
                    </p>
                    <a href="tel:(551) 305-4081" style={buttonStyle}>
                      <PhoneIcon className="h-4 w-4" color="white" />
                      <span style={{ marginLeft: '0.5rem' }}>{rightButtonText}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      },
    },

    // ==========================================================================
    // SEO SECTION (Hidden visual component for SEO meta)
    // ==========================================================================
    SEO: {
      fields: {
        metaTitle: { type: "text" },
        metaDescription: { type: "textarea" },
        ogTitle: { type: "text" },
        ogDescription: { type: "textarea" },
      },
      defaultProps: {
        metaTitle: "Professional Cleaning Services | Clensy",
        metaDescription: "Professional home cleaning services you can trust. Book online in 30 seconds.",
        ogTitle: "Professional Cleaning Services | Clensy",
        ogDescription: "Professional home cleaning services you can trust. Book online in 30 seconds.",
      },
      render: (data: SEOProps, content?: any, strapi?: any) => {
        // Use prop values directly - Page Builder handles all data flow
        const metaTitle = getValue(data.metaTitle);
        const metaDescription = getValue(data.metaDescription);

        return (
          <div style={{
            background: '#f3f4f6',
            padding: '1rem',
            borderRadius: '0.5rem',
            border: '1px dashed #9ca3af',
            margin: '1rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <svg style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280', marginRight: '0.5rem' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <span style={{ fontWeight: 600, color: '#374151' }}>SEO Settings</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
              <strong>Title:</strong> {metaTitle}
            </p>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0' }}>
              <strong>Description:</strong> {metaDescription}
            </p>
          </div>
        );
      },
    },

    // ==========================================================================
    // ABOUT PAGE COMPONENTS
    // ==========================================================================
    
    AboutHero: {
      fields: {
        heroHeading: { type: "text" },
        heroTagline: { type: "text" },
      },
      defaultProps: {
        heroHeading: "About Clensy",
        heroTagline: "Raising the Standard, One Clean at a Time.",
      },
      render: (data: AboutHeroProps) => {
        const heading = getValue(data.heroHeading);
        const tagline = getValue(data.heroTagline);

        return (
          <section style={{
            position: 'relative',
            width: '100%',
            height: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(to right, #000, #0a0a0a)',
            color: 'white',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
            }}></div>
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: "url('https://res.cloudinary.com/dgjmm3usy/image/upload/v1750069427/website-images/guvnsgfqcmcx8k1gusum.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              mixBlendMode: 'overlay',
              opacity: 0.9,
            }}></div>
            <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 1rem', maxWidth: '56rem', margin: '0 auto' }}>
              <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', color: 'white' }}>{heading}</h1>
              <p style={{ maxWidth: '48rem', margin: '0 auto', fontSize: '1.125rem', color: 'rgba(255,255,255,0.9)' }}>{tagline}</p>
            </div>
          </section>
        );
      },
    },

    AboutOurStory: {
      fields: {
        ourStoryHeading: { type: "text" },
        ourStoryParagraph1: { type: "textarea" },
        ourStoryParagraph2: { type: "textarea" },
        ourStoryParagraph3: { type: "textarea" },
        ourStoryImageUrl: { type: "text" },
      },
      defaultProps: {
        ourStoryHeading: "Our Story",
        ourStoryParagraph1: "Clensy was built to solve a problem — the frustrating experience of unreliable cleaners who are late, don't communicate, and leave you wondering if the job will ever be done right.",
        ourStoryParagraph2: "We set out to create something better. A company that not only delivers amazing results — but makes the entire experience seamless from start to finish.",
        ourStoryParagraph3: "Whether you're managing a busy home, multiple Airbnb properties, or a commercial space that needs to stay spotless and presentable, Clensy is your go-to team.",
        ourStoryImageUrl: "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750847413/shutterstock_2138293517_1_nqcmei.jpg",
      },
      render: (data: AboutOurStoryProps) => {
        return (
          <section style={{ padding: '5rem 0', background: 'white' }}>
            <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '3rem', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1f2937' }}>{getValue(data.ourStoryHeading)}</h2>
                  <p style={{ fontSize: '1.125rem', color: '#4b5563', marginBottom: '1rem' }}>{getValue(data.ourStoryParagraph1)}</p>
                  <p style={{ fontSize: '1.125rem', color: '#4b5563', marginBottom: '1rem' }}>{getValue(data.ourStoryParagraph2)}</p>
                  <p style={{ fontSize: '1.125rem', color: '#4b5563' }}>{getValue(data.ourStoryParagraph3)}</p>
                </div>
                <div style={{ position: 'relative', height: '400px', width: '100%', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                  <img src={getValue(data.ourStoryImageUrl)} alt="Professional cleaning team" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }}></div>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem' }}>
                    <p style={{ color: 'white', fontSize: '1.125rem', fontWeight: 700 }}>Dedicated to excellence in every clean</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      },
    },

    AboutWhyWeStarted: {
      fields: {
        whyWeStartedHeading: { type: "text" },
        whyWeStartedSubtitle: { type: "text" },
        whyWeStartedQuoteText: { type: "textarea" },
        whyWeStartedParagraph1: { type: "textarea" },
        whyWeStartedParagraph2: { type: "textarea" },
        whyWeStartedParagraph3: { type: "textarea" },
      },
      defaultProps: {
        whyWeStartedHeading: "Why We Started",
        whyWeStartedSubtitle: "Let's be honest: the cleaning industry is broken.",
        whyWeStartedQuoteText: "My cleaner didn't show up. No one responded. The job was half-done.",
        whyWeStartedParagraph1: "We were tired of the low standards across the industry – Whether it's flaky independent cleaners or cookie-cutter franchises with zero customer service — it's hard to find a company that actually cares and does the job right.",
        whyWeStartedParagraph2: "We listened. And then we built Clensy — a cleaning company that actually shows up, delivers exceptional results, and treats every client like a priority.",
        whyWeStartedParagraph3: "We know that when you book a cleaning, you want peace of mind — not more headaches.",
      },
      render: (data: AboutWhyWeStartedProps) => {
        return (
          <section style={{ padding: '5rem 0', background: '#f9fafb' }}>
            <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1rem' }}>
              <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '1rem', color: '#1f2937' }}>{getValue(data.whyWeStartedHeading)}</h2>
                <p style={{ fontSize: '1.125rem', color: '#4b5563', maxWidth: '48rem', margin: '0 auto' }}>{getValue(data.whyWeStartedSubtitle)}</p>
              </div>
              <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
                <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
                  <p style={{ fontSize: '1.25rem', color: '#374151', fontStyle: 'italic', marginBottom: '1.5rem', textAlign: 'center' }}>"{getValue(data.whyWeStartedQuoteText)}"</p>
                  <p style={{ fontSize: '1.125rem', color: '#4b5563', marginBottom: '1rem' }}>{getValue(data.whyWeStartedParagraph1)}</p>
                  <p style={{ fontSize: '1.125rem', color: '#4b5563', marginBottom: '1rem' }}>{getValue(data.whyWeStartedParagraph2)}</p>
                  <p style={{ fontSize: '1.125rem', color: '#4b5563' }}>{getValue(data.whyWeStartedParagraph3)}</p>
                </div>
              </div>
            </div>
          </section>
        );
      },
    },

    AboutWhatMakesUsDifferent: {
      fields: {
        whatMakesUsDifferentHeading: { type: "text" },
        residentialCommercialTitle: { type: "text" },
        residentialCommercialParagraph1: { type: "textarea" },
        residentialCommercialParagraph2: { type: "textarea" },
        eliteTeamTitle: { type: "text" },
        eliteTeamParagraph1: { type: "textarea" },
        eliteTeamParagraph2: { type: "textarea" },
        eliteTeamImageUrl: { type: "text" },
        clientFocusedTechHeading: { type: "text" },
      },
      defaultProps: {
        whatMakesUsDifferentHeading: "What Makes Us Different?",
        residentialCommercialTitle: "Residential & Commercial Cleaning",
        residentialCommercialParagraph1: "From homes and apartments to offices, retail spaces, gyms, medical facilities, and even construction sites — if it's indoors and needs to be cleaned, we've got it covered.",
        residentialCommercialParagraph2: "Not sure if we handle your specific needs? Chances are, we do. If you're looking for something custom, head over to our Contact Us page or give us a call.",
        eliteTeamTitle: "Elite Team",
        eliteTeamParagraph1: "Out of every 100 applicants, we only hire 1 cleaner. Seriously. Our hiring process is extensive, and only the best make it through.",
        eliteTeamParagraph2: "We're fully licensed, bonded, and insured, so you can feel confident knowing your home, business, or property is in trusted, professional hands.",
        eliteTeamImageUrl: "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750847481/shutterstock_2200915291_vewsyn.jpg",
        clientFocusedTechHeading: "Client-Focused Tech",
      },
      render: (data: AboutWhatMakesUsDifferentProps) => {
        return (
          <section style={{ padding: '5rem 0', background: 'white' }}>
            <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1rem' }}>
              <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '1rem', color: '#1f2937' }}>{getValue(data.whatMakesUsDifferentHeading)}</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '3rem' }}>
                {/* Residential & Commercial */}
                <div style={{ background: 'white', padding: '2rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #f3f4f6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ width: '2rem', height: '2rem', background: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem' }}>
                      <CheckIcon color="white" className="h-4 w-4" />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937' }}>{getValue(data.residentialCommercialTitle)}</h3>
                  </div>
                  <p style={{ fontSize: '1.125rem', color: '#4b5563', marginBottom: '1rem' }}>{getValue(data.residentialCommercialParagraph1)}</p>
                  <p style={{ fontSize: '1.125rem', color: '#4b5563' }}>{getValue(data.residentialCommercialParagraph2)}</p>
                </div>
                {/* Elite Team */}
                <div style={{ background: 'white', padding: '2rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #f3f4f6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ width: '2rem', height: '2rem', background: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem' }}>
                      <CheckIcon color="white" className="h-4 w-4" />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937' }}>{getValue(data.eliteTeamTitle)}</h3>
                  </div>
                  <p style={{ fontSize: '1.125rem', color: '#4b5563', marginBottom: '1rem' }}>{getValue(data.eliteTeamParagraph1)}</p>
                  <p style={{ fontSize: '1.125rem', color: '#4b5563' }}>{getValue(data.eliteTeamParagraph2)}</p>
                  <div style={{ position: 'relative', height: '12rem', marginTop: '2rem', borderRadius: '0.5rem', overflow: 'hidden' }}>
                    <img src={getValue(data.eliteTeamImageUrl)} alt="Professional cleaning team" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      },
    },

    AboutMission: {
      fields: {
        ourMissionHeading: { type: "text" },
        ourMissionParagraph1: { type: "textarea" },
        ourMissionParagraph2: { type: "textarea" },
        ourMissionParagraph3: { type: "textarea" },
        ourMissionParagraph4: { type: "textarea" },
        ourMissionClosingLine: { type: "text" },
      },
      defaultProps: {
        ourMissionHeading: "Our Mission",
        ourMissionParagraph1: "We're obsessed with making the cleaning process feel effortless for our clients. You book. We show up. We do the job right — the first time.",
        ourMissionParagraph2: "No rescheduling nightmares. No communication breakdowns. No wondering if your space was actually cleaned.",
        ourMissionParagraph3: "With Clensy, you get a team that's committed to your satisfaction — from the first message to the final wipe-down.",
        ourMissionParagraph4: "If you're looking for a company that understands the value of your time, respects your space, and consistently delivers results — welcome to Clensy.",
        ourMissionClosingLine: "We're here to raise the standard.",
      },
      render: (data: AboutMissionProps) => {
        return (
          <section style={{ padding: '5rem 0', background: '#2563eb', color: 'white' }}>
            <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>{getValue(data.ourMissionHeading)}</h2>
              <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', marginBottom: '1.5rem', lineHeight: 1.7 }}>{getValue(data.ourMissionParagraph1)}</p>
              <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', marginBottom: '1.5rem', lineHeight: 1.7 }}>{getValue(data.ourMissionParagraph2)}</p>
              <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', marginBottom: '1.5rem', lineHeight: 1.7 }}>{getValue(data.ourMissionParagraph3)}</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 500, marginBottom: '2rem' }}>{getValue(data.ourMissionParagraph4)}</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{getValue(data.ourMissionClosingLine)}</p>
            </div>
          </section>
        );
      },
    },

    AboutCTA: {
      fields: {
        ctaHeading: { type: "text" },
        ctaDescription: { type: "textarea" },
        ctaBookButtonText: { type: "text" },
        ctaContactButtonText: { type: "text" },
      },
      defaultProps: {
        ctaHeading: "Ready to Experience the Clensy Difference?",
        ctaDescription: "Join thousands of satisfied customers who've discovered what a truly exceptional cleaning service feels like.",
        ctaBookButtonText: "Book Your Cleaning",
        ctaContactButtonText: "Contact Us",
      },
      render: (data: AboutCTAProps) => {
        return (
          <section style={{ padding: '5rem 0', background: 'white' }}>
            <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1f2937' }}>{getValue(data.ctaHeading)}</h2>
              <p style={{ fontSize: '1.125rem', color: '#4b5563', marginBottom: '2rem' }}>{getValue(data.ctaDescription)}</p>
              <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', justifyContent: 'center' }}>
                <a href="/booking" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#2563eb', color: 'white', padding: '0.75rem 2rem', borderRadius: '9999px', fontWeight: 500, textDecoration: 'none' }}>
                  {getValue(data.ctaBookButtonText)}
                </a>
                <a href="/contact" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', color: '#2563eb', border: '1px solid #2563eb', padding: '0.75rem 2rem', borderRadius: '9999px', fontWeight: 500, textDecoration: 'none' }}>
                  {getValue(data.ctaContactButtonText)}
                </a>
              </div>
            </div>
          </section>
        );
      },
    },

    // ==========================================================================
    // CONTACT PAGE COMPONENTS
    // ==========================================================================

    ContactHero: {
      fields: {
        heroTopLabel: { type: "text" },
        heroHeading: { type: "text" },
        heroDescription: { type: "textarea" },
        heroSendMessageButtonText: { type: "text" },
        heroSupportText: { type: "text" },
        heroResponseText: { type: "text" },
        heroImageUrl: { type: "text" },
        trustMainText: { type: "text" },
        trustSubtitle: { type: "text" },
      },
      defaultProps: {
        heroTopLabel: "We'd Love To Hear From You",
        heroHeading: "Let's Start A Conversation",
        heroDescription: "Have questions or need a personalized cleaning solution? Our team is ready to provide the support you need for all your requirements.",
        heroSendMessageButtonText: "Send a Message",
        heroSupportText: "24/7 Support",
        heroResponseText: "Quick Response",
        heroImageUrl: "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750847694/shutterstock_2478230727_bt7fos.jpg",
        trustMainText: "Trusted by 5,000+ Customers",
        trustSubtitle: "Professional cleaning for every need",
      },
      render: (data: ContactHeroProps) => {
        return (
          <section style={{ position: 'relative', minHeight: '100vh', background: '#000', paddingTop: '4rem', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom right, #030712, #000, #111827)' }}></div>
            <div style={{ position: 'absolute', right: 0, top: '25%', height: '500px', width: '500px', borderRadius: '50%', background: 'rgba(37,99,235,0.1)', filter: 'blur(120px)' }}></div>
            <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1rem', position: 'relative', zIndex: 10 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '3rem', alignItems: 'center', minHeight: 'calc(100vh - 64px)' }}>
                <div>
                  <div style={{ display: 'inline-block', marginBottom: '1.5rem', padding: '0.25rem 1rem', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '9999px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem', fontWeight: 500 }}>{getValue(data.heroTopLabel)}</span>
                  </div>
                  <h1 style={{ fontSize: '3rem', fontWeight: 700, color: 'white', marginBottom: '1.5rem' }}>{getValue(data.heroHeading)}</h1>
                  <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.8)', marginBottom: '2rem', maxWidth: '36rem' }}>{getValue(data.heroDescription)}</p>
                  <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                    <button style={{ background: 'linear-gradient(to right, #3b82f6, #2563eb)', color: 'white', padding: '0.75rem 2rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 500, border: 'none', cursor: 'pointer', boxShadow: '0 0 20px rgba(59,130,246,0.3)' }}>
                      {getValue(data.heroSendMessageButtonText)}
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.9)', marginRight: '2rem' }}>
                        <PhoneIcon className="h-5 w-5" color="#60a5fa" />
                        <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>{getValue(data.heroSupportText)}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.9)' }}>
                        <ClockIcon className="h-5 w-5" color="#60a5fa" />
                        <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>{getValue(data.heroResponseText)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ position: 'relative', height: '550px', width: '100%', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 0 50px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <img src={getValue(data.heroImageUrl)} alt="Professional cleaning staff" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent, transparent)' }}></div>
                  <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem', zIndex: 20 }}>
                    <div style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ height: '2.5rem', width: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: '#2563eb', marginRight: '0.75rem' }}>
                          <CheckIcon color="white" className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 style={{ color: 'white', fontWeight: 600, fontSize: '1.125rem' }}>{getValue(data.trustMainText)}</h3>
                          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>{getValue(data.trustSubtitle)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      },
    },

    ContactInfo: {
      fields: {
        contactSectionTitle: { type: "text" },
        phoneTitle: { type: "text" },
        phoneDescription: { type: "text" },
        phoneNumber: { type: "text" },
        emailTitle: { type: "text" },
        emailDescription: { type: "text" },
        emailAddress: { type: "text" },
        officeTitle: { type: "text" },
        officeDescription: { type: "text" },
        addressLine1: { type: "text" },
        addressLine2: { type: "text" },
        cityStateZip: { type: "text" },
        businessHoursTitle: { type: "text" },
        businessHoursDescription: { type: "text" },
        immediateAssistanceTitle: { type: "text" },
        immediateAssistanceDescription: { type: "textarea" },
        immediateAssistanceButtonText: { type: "text" },
      },
      defaultProps: {
        contactSectionTitle: "Contact Information",
        phoneTitle: "Phone",
        phoneDescription: "Speak directly with our customer service team",
        phoneNumber: "(551) 305-4081",
        emailTitle: "Email",
        emailDescription: "Get a response within 24 hours",
        emailAddress: "info@clensy.com",
        officeTitle: "Office Location",
        officeDescription: "Our headquarters",
        addressLine1: "123 Cleaning Street",
        addressLine2: "Suite 456",
        cityStateZip: "Jersey City, NJ 07302",
        businessHoursTitle: "Business Hours",
        businessHoursDescription: "When you can reach us",
        immediateAssistanceTitle: "Need Immediate Assistance?",
        immediateAssistanceDescription: "Our customer support team is available during business hours to help you with any questions.",
        immediateAssistanceButtonText: "Call Us Now",
      },
      render: (data: ContactInfoProps) => {
        const cardStyle: React.CSSProperties = {
          background: 'white',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'flex-start',
          marginBottom: '1.5rem',
        };
        const iconWrapperStyle: React.CSSProperties = {
          background: '#dbeafe',
          padding: '0.75rem',
          borderRadius: '0.5rem',
          marginRight: '1rem',
        };

        return (
          <section style={{ padding: '6rem 0', background: '#f9fafb' }}>
            <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem', color: '#111827' }}>{getValue(data.contactSectionTitle)}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                {/* Phone */}
                <div style={cardStyle}>
                  <div style={iconWrapperStyle}>
                    <PhoneIcon color="#2563eb" className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>{getValue(data.phoneTitle)}</h3>
                    <p style={{ color: '#4b5563', marginBottom: '0.5rem' }}>{getValue(data.phoneDescription)}</p>
                    <a href={`tel:${getValue(data.phoneNumber)}`} style={{ color: '#2563eb', fontWeight: 500, textDecoration: 'none' }}>{getValue(data.phoneNumber)}</a>
                  </div>
                </div>
                {/* Email */}
                <div style={cardStyle}>
                  <div style={iconWrapperStyle}>
                    <svg style={{ width: '1.5rem', height: '1.5rem' }} viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>{getValue(data.emailTitle)}</h3>
                    <p style={{ color: '#4b5563', marginBottom: '0.5rem' }}>{getValue(data.emailDescription)}</p>
                    <a href={`mailto:${getValue(data.emailAddress)}`} style={{ color: '#2563eb', fontWeight: 500, textDecoration: 'none' }}>{getValue(data.emailAddress)}</a>
                  </div>
                </div>
                {/* Office Location */}
                <div style={cardStyle}>
                  <div style={iconWrapperStyle}>
                    <svg style={{ width: '1.5rem', height: '1.5rem' }} viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>{getValue(data.officeTitle)}</h3>
                    <p style={{ color: '#4b5563', marginBottom: '0.5rem' }}>{getValue(data.officeDescription)}</p>
                    <address style={{ fontStyle: 'normal', color: '#374151' }}>
                      {getValue(data.addressLine1)}<br />
                      {getValue(data.addressLine2)}<br />
                      {getValue(data.cityStateZip)}
                    </address>
                  </div>
                </div>
                {/* Business Hours */}
                <div style={cardStyle}>
                  <div style={iconWrapperStyle}>
                    <ClockIcon color="#2563eb" className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>{getValue(data.businessHoursTitle)}</h3>
                    <p style={{ color: '#4b5563', marginBottom: '0.5rem' }}>{getValue(data.businessHoursDescription)}</p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#374151' }}>
                      <li>Monday - Friday: 8:00 AM - 6:00 PM</li>
                      <li>Saturday: 9:00 AM - 3:00 PM</li>
                      <li>Sunday: Closed</li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* Immediate Assistance */}
              <div style={{ marginTop: '2.5rem', background: 'linear-gradient(to right, #3b82f6, #1d4ed8)', borderRadius: '0.75rem', padding: '1.5rem', color: 'white', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.75rem' }}>{getValue(data.immediateAssistanceTitle)}</h3>
                <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '1rem' }}>{getValue(data.immediateAssistanceDescription)}</p>
                <a href={`tel:${getValue(data.phoneNumber)}`} style={{ display: 'inline-flex', alignItems: 'center', background: 'white', color: '#2563eb', padding: '0.5rem 1.25rem', borderRadius: '0.5rem', fontWeight: 500, textDecoration: 'none' }}>
                  <PhoneIcon color="#2563eb" className="h-4 w-4" />
                  <span style={{ marginLeft: '0.5rem' }}>{getValue(data.immediateAssistanceButtonText)}</span>
                </a>
              </div>
            </div>
          </section>
        );
      },
    },

    ContactConsultation: {
      fields: {
        consultationHeading: { type: "text" },
        consultationDescription: { type: "textarea" },
        consultationButtonText: { type: "text" },
      },
      defaultProps: {
        consultationHeading: "Need a Personalized Cleaning Solution?",
        consultationDescription: "Schedule a consultation with our cleaning experts to discuss your unique requirements and get a customized cleaning plan tailored to your specific needs.",
        consultationButtonText: "Schedule a Consultation",
      },
      render: (data: ContactConsultationProps) => {
        return (
          <section style={{ padding: '5rem 0', background: 'white' }}>
            <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: '#1f2937' }}>{getValue(data.consultationHeading)}</h2>
              <p style={{ fontSize: '1.125rem', color: '#4b5563', marginBottom: '2rem' }}>{getValue(data.consultationDescription)}</p>
              <a href="/booking" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#2563eb', color: 'white', padding: '0.75rem 2rem', borderRadius: '9999px', fontWeight: 500, textDecoration: 'none' }}>
                {getValue(data.consultationButtonText)}
              </a>
            </div>
          </section>
        );
      },
    },
  },

  categories: {
    hero: { title: "Landing Page - Hero", components: ["Hero"] },
    content: { title: "Landing Page - Content", components: ["HowItWorks", "Checklist", "Comparison", "Reviews", "CTA"] },
    about: { title: "About Page", components: ["AboutHero", "AboutOurStory", "AboutWhyWeStarted", "AboutWhatMakesUsDifferent", "AboutMission", "AboutCTA"] },
    contact: { title: "Contact Page", components: ["ContactHero", "ContactInfo", "ContactConsultation"] },
    seo: { title: "SEO", components: ["SEO"] },
  },

  root: {},
};

export default pageBuilderConfig;

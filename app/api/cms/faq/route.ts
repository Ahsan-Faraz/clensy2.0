import { NextResponse } from "next/server";
import { CMSAdapter } from "@/lib/cms-adapter";

export async function GET() {
  try {
    const faqPage = await CMSAdapter.getFAQPage();
    
    if (!faqPage) {
      // Return default data if Strapi doesn't have the page yet
      return NextResponse.json({
        success: true,
        data: getDefaultFAQData(),
      });
    }

    return NextResponse.json({ success: true, data: faqPage });
  } catch (error) {
    console.error("Error fetching FAQ page:", error);
    return NextResponse.json({ success: true, data: getDefaultFAQData() });
  }
}

function getDefaultFAQData() {
  return {
    heroSection: {
      topLabel: "Answers to your questions",
      heading: "Frequently Asked <blue>Questions</blue>",
      description: "Find answers to common questions about our cleaning services, booking process, and pricing.",
      backgroundImage: "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750847616/shutterstock_2209715823_1_x80cn8.jpg",
    },
    comprehensiveFAQs: getDefaultFAQs(),
    stillHaveQuestionsSection: {
      heading: "Still Have Questions?",
      description: "Here are some other topics our customers frequently ask about.",
      cards: [
        { title: "First-Time Customers", description: "Learn what to expect during your first cleaning appointment.", buttonText: "Get More Information", buttonLink: "/contact", icon: "clock" },
        { title: "Pricing & Estimates", description: "Learn more about our transparent pricing structure.", buttonText: "View Pricing", buttonLink: "/booking", icon: "credit-card" },
        { title: "Service Areas", description: "Find out if we service your area.", buttonText: "Check Service Areas", buttonLink: "/locations", icon: "calendar" },
      ],
    },
    contactSection: {
      heading: "Can't Find Your Answer?",
      description: "Our customer service team is ready to help with any questions.",
      emailSection: { email: "info@clensy.com" },
      callSection: { phone: "(551) 305-4081" },
      contactButtonText: "Contact Us",
    },
    trustIndicatorsSection: {
      indicators: [
        { number: "110+", description: "Questions Answered" },
        { number: "24/7", description: "Online Support" },
        { number: "5.0", description: "Customer Satisfaction" },
        { number: "15+", description: "Years of Experience" },
      ],
    },
  };
}

function getDefaultFAQs() {
  return [
    // General (15)
    { id: 1, question: "What areas do you serve?", answer: "We provide cleaning services throughout Northern New Jersey, including Bergen, Essex, Hudson, Passaic, and Union counties.", category: "general", order: 1 },
    { id: 2, question: "Are your cleaners background checked?", answer: "Yes, all of our cleaning professionals undergo thorough background checks before joining our team.", category: "general", order: 2 },
    { id: 3, question: "Are you insured and bonded?", answer: "Yes, we are fully insured and bonded. This provides protection for both our clients and our team.", category: "general", order: 3 },
    { id: 4, question: "What cleaning products do you use?", answer: "We use a combination of industry-grade professional cleaning products and eco-friendly options.", category: "general", order: 4 },
    { id: 5, question: "Do I need to be home during the cleaning?", answer: "No, you don't need to be home. Many clients provide a key or access instructions.", category: "general", order: 5 },
    { id: 6, question: "How do I prepare for my cleaning appointment?", answer: "Pick up personal items, secure valuables, and ensure clear access to all areas. You don't need to pre-clean!", category: "general", order: 6 },
    { id: 7, question: "What if I need to reschedule my appointment?", answer: "You can reschedule up to 24 hours before without fees via phone, email, or customer portal.", category: "general", order: 7 },
    { id: 8, question: "Do you bring your own cleaning supplies?", answer: "Yes, we bring all necessary supplies. If you prefer specific products, let us know.", category: "general", order: 8 },
    { id: 9, question: "How long does a typical cleaning take?", answer: "A 2-bedroom home takes 2-3 hours for standard cleaning, 4-6 hours for deep cleaning.", category: "general", order: 9 },
    { id: 10, question: "Can I request the same cleaner each time?", answer: "Yes! You can request the same professional for recurring appointments, subject to availability.", category: "general", order: 10 },
    { id: 11, question: "What is your satisfaction guarantee?", answer: "100% satisfaction guarantee. Contact us within 24 hours and we'll re-clean at no charge.", category: "general", order: 11 },
    { id: 12, question: "Do you offer gift certificates?", answer: "Yes, gift certificates are available for any service - great for new homeowners or busy parents.", category: "general", order: 12 },
    { id: 13, question: "Are your services available on weekends?", answer: "Yes, Monday through Saturday. Book early for popular weekend slots.", category: "general", order: 13 },
    { id: 14, question: "What happens if something is damaged?", answer: "Report within 24 hours. We're fully insured and will resolve issues promptly.", category: "general", order: 14 },
    { id: 15, question: "How do I contact customer support?", answer: "Call (551) 305-4081, email info@clensy.com, or use our contact form. We respond within 1 hour.", category: "general", order: 15 },
    
    // Booking (15)
    { id: 16, question: "How do I book a cleaning service?", answer: "Book online 24/7, call (551) 305-4081, or email info@clensy.com.", category: "booking", order: 1 },
    { id: 17, question: "How far in advance should I book?", answer: "48-72 hours for regular cleaning, 1 week for deep or move-in/out services.", category: "booking", order: 2 },
    { id: 18, question: "Can I book a same-day cleaning?", answer: "Yes, based on availability. Call directly for same-day requests. Rush fee may apply.", category: "booking", order: 3 },
    { id: 19, question: "What is your cancellation policy?", answer: "Free cancellation 24+ hours ahead. Within 24 hours: up to 50% fee. No-shows: full charge.", category: "booking", order: 4 },
    { id: 20, question: "Can I schedule recurring cleanings?", answer: "Yes! Weekly, bi-weekly, or monthly with priority scheduling and discounts.", category: "booking", order: 5 },
    { id: 21, question: "How do I modify my booking?", answer: "Via customer portal, phone, or email. Make changes 24+ hours before appointment.", category: "booking", order: 6 },
    { id: 22, question: "What time slots are available?", answer: "8 AM to 6 PM, Monday through Saturday. Morning and afternoon slots most popular.", category: "booking", order: 7 },
    { id: 23, question: "Do you offer emergency cleaning?", answer: "Yes, contact us directly for emergency situations and we'll accommodate.", category: "booking", order: 8 },
    { id: 24, question: "Can I book multiple services at once?", answer: "Yes! Combine regular cleaning with add-ons like oven or window cleaning.", category: "booking", order: 9 },
    { id: 25, question: "How do I set up recurring bookings?", answer: "Select frequency during checkout or in your customer portal.", category: "booking", order: 10 },
    { id: 26, question: "What if I need to skip a recurring cleaning?", answer: "Notify us 24+ hours ahead. Your schedule resumes with the next appointment.", category: "booking", order: 11 },
    { id: 27, question: "Do you send appointment reminders?", answer: "Yes, email and text reminders 24 hours and 1 hour before arrival.", category: "booking", order: 12 },
    { id: 28, question: "Can I book for a specific cleaner?", answer: "Yes, request your preferred cleaner based on their availability.", category: "booking", order: 13 },
    { id: 29, question: "What information do I need to provide?", answer: "Address, contact info, home size, service type, and any special instructions.", category: "booking", order: 14 },
    { id: 30, question: "Is there a minimum booking requirement?", answer: "Minimum 2 hours for standard cleaning to ensure quality service.", category: "booking", order: 15 },
    
    // Pricing (15)
    { id: 31, question: "How much does cleaning cost?", answer: "Standard cleaning starts $120-$180 for 2-bedroom. Get instant quote online.", category: "pricing", order: 1 },
    { id: 32, question: "Do you offer free estimates?", answer: "Yes! Get instant quotes online or contact us for personalized estimates.", category: "pricing", order: 2 },
    { id: 33, question: "What payment methods do you accept?", answer: "All major credit/debit cards and electronic payments. Processed after service.", category: "pricing", order: 3 },
    { id: 34, question: "Do you require a deposit?", answer: "Sometimes for first-time large jobs. Recurring customers typically don't.", category: "pricing", order: 4 },
    { id: 35, question: "Are there any hidden fees?", answer: "No hidden fees! All services and add-ons are clearly priced upfront.", category: "pricing", order: 5 },
    { id: 36, question: "Do you offer recurring discounts?", answer: "Yes! 10-20% off for recurring customers. Weekly gets highest discount.", category: "pricing", order: 6 },
    { id: 37, question: "When is payment due?", answer: "Upon completion. Recurring customers can set up automatic billing.", category: "pricing", order: 7 },
    { id: 38, question: "Do you charge extra for pets?", answer: "No extra charge. Just let us know about pets for safety.", category: "pricing", order: 8 },
    { id: 39, question: "Is there a charge for heavily soiled homes?", answer: "May require additional time. We'll provide fair quote before starting.", category: "pricing", order: 9 },
    { id: 40, question: "Do you offer senior or military discounts?", answer: "Yes, 10% off for seniors (65+) and military. Mention when booking.", category: "pricing", order: 10 },
    { id: 41, question: "What's included in the base price?", answer: "Dusting, vacuuming, mopping, bathroom, kitchen cleaning, and tidying.", category: "pricing", order: 11 },
    { id: 42, question: "How do add-ons affect pricing?", answer: "Add-ons priced separately and added to base cost.", category: "pricing", order: 12 },
    { id: 43, question: "Do prices change for larger homes?", answer: "Yes, based on square footage and bedrooms/bathrooms.", category: "pricing", order: 13 },
    { id: 44, question: "Is tipping expected?", answer: "Not required but appreciated. Tips go directly to your cleaner.", category: "pricing", order: 14 },
    { id: 45, question: "Can I get a refund if not satisfied?", answer: "Contact within 24 hours. We'll re-clean free or discuss refund options.", category: "pricing", order: 15 },
    
    // Services (20)
    { id: 46, question: "What types of cleaning do you offer?", answer: "Standard, deep, move-in/out, post-construction, Airbnb, and commercial cleaning.", category: "services", order: 1 },
    { id: 47, question: "What's the difference between standard and deep cleaning?", answer: "Deep cleaning is more thorough: baseboards, inside appliances, detailed scrubbing.", category: "services", order: 2 },
    { id: 48, question: "Do you offer move-in/move-out cleaning?", answer: "Yes! Comprehensive cleaning including inside cabinets and appliances.", category: "services", order: 3 },
    { id: 49, question: "Do you clean inside refrigerators and ovens?", answer: "Available as add-ons. Included in deep and move-in/out packages.", category: "services", order: 4 },
    { id: 50, question: "Do you offer window cleaning?", answer: "Yes, interior windows as add-on. Includes glass, sills, and tracks.", category: "services", order: 5 },
    { id: 51, question: "Can you clean after a party?", answer: "Yes! Post-event cleaning to help you recover from gatherings.", category: "services", order: 6 },
    { id: 52, question: "Do you provide post-construction cleaning?", answer: "Yes, removing dust, debris, and residue from renovations.", category: "services", order: 7 },
    { id: 53, question: "Do you offer Airbnb cleaning?", answer: "Yes! Quick-turnaround cleaning for vacation rentals.", category: "services", order: 8 },
    { id: 54, question: "Do you clean commercial spaces?", answer: "Yes, offices, retail, medical facilities, and more.", category: "services", order: 9 },
    { id: 55, question: "Can you clean garages or basements?", answer: "Yes, as add-on services with additional time.", category: "services", order: 10 },
    { id: 56, question: "Do you offer laundry services?", answer: "Basic laundry and linen changes available as add-ons.", category: "services", order: 11 },
    { id: 57, question: "Do you clean outdoor areas?", answer: "Interior focus. Can clean enclosed patios and sunrooms.", category: "services", order: 12 },
    { id: 58, question: "Can you organize while cleaning?", answer: "Light organization included. Extensive organizing available separately.", category: "services", order: 13 },
    { id: 59, question: "Do you clean ceiling fans?", answer: "Yes, included in standard. Deep cleaning adds more attention.", category: "services", order: 14 },
    { id: 60, question: "Do you clean blinds and curtains?", answer: "Blind dusting standard. Detailed cleaning as add-on.", category: "services", order: 15 },
    { id: 61, question: "Can you clean pet areas?", answer: "Yes, litter boxes, pet beds, feeding stations upon request.", category: "services", order: 16 },
    { id: 62, question: "Do you offer eco-friendly cleaning?", answer: "Yes! Request eco-friendly products when booking.", category: "services", order: 17 },
    { id: 63, question: "Can you clean for allergies?", answer: "Yes, hypoallergenic products and HEPA vacuums available.", category: "services", order: 18 },
    { id: 64, question: "Do you clean high-touch surfaces?", answer: "Yes, special attention to doorknobs, switches, handles.", category: "services", order: 19 },
    { id: 65, question: "What's included in bathroom cleaning?", answer: "Toilet, shower/tub, sink, mirrors, counters, floors, fixtures.", category: "services", order: 20 },
    
    // Kitchen (10)
    { id: 66, question: "What's included in kitchen cleaning?", answer: "Countertops, stovetop, sink, appliance exteriors, cabinet fronts, floors.", category: "kitchen", order: 1 },
    { id: 67, question: "Do you clean inside the microwave?", answer: "Included in deep cleaning. Add-on for standard.", category: "kitchen", order: 2 },
    { id: 68, question: "Will you clean the dishwasher?", answer: "Exterior standard. Interior as add-on.", category: "kitchen", order: 3 },
    { id: 69, question: "Do you clean backsplashes?", answer: "Yes, included. Deep cleaning adds grout cleaning.", category: "kitchen", order: 4 },
    { id: 70, question: "Can you degrease the stovetop?", answer: "Standard wiping included. Deep degreasing in deep cleaning.", category: "kitchen", order: 5 },
    { id: 71, question: "Do you clean under appliances?", answer: "Included in deep cleaning. Standard cleans accessible areas.", category: "kitchen", order: 6 },
    { id: 72, question: "Will you do the dishes?", answer: "Available upon request. Let us know in advance.", category: "kitchen", order: 7 },
    { id: 73, question: "Do you clean pantry shelves?", answer: "Available as add-on with shelf wiping and organizing.", category: "kitchen", order: 8 },
    { id: 74, question: "Can you clean the range hood?", answer: "Exterior standard. Filter and interior in deep cleaning.", category: "kitchen", order: 9 },
    { id: 75, question: "Do you sanitize kitchen surfaces?", answer: "Yes, countertops and high-touch areas with food-safe disinfectants.", category: "kitchen", order: 10 },
    
    // Bedroom (10)
    { id: 76, question: "What's included in bedroom cleaning?", answer: "Dusting, vacuuming/mopping, bed making, tidying, mirrors.", category: "bedroom", order: 1 },
    { id: 77, question: "Do you clean under beds?", answer: "When accessible. Deep cleaning moves furniture.", category: "bedroom", order: 2 },
    { id: 78, question: "Will you change bed sheets?", answer: "Yes, if fresh linens are left out.", category: "bedroom", order: 3 },
    { id: 79, question: "Do you clean closets?", answer: "Included in deep and move-in/out. Add-on for standard.", category: "bedroom", order: 4 },
    { id: 80, question: "Can you vacuum upholstered furniture?", answer: "Yes, sofas and chairs included in standard.", category: "bedroom", order: 5 },
    { id: 81, question: "Do you dust electronics?", answer: "Yes, carefully with appropriate methods.", category: "bedroom", order: 6 },
    { id: 82, question: "Will you clean picture frames?", answer: "Yes, dusting frames and decor is standard.", category: "bedroom", order: 7 },
    { id: 83, question: "Do you clean ceiling corners?", answer: "Yes, cobweb removal included.", category: "bedroom", order: 8 },
    { id: 84, question: "Can you clean home offices?", answer: "Yes, desks, shelves, equipment with care for paperwork.", category: "bedroom", order: 9 },
    { id: 85, question: "Do you clean baseboards?", answer: "Dusting standard. Scrubbing in deep cleaning.", category: "bedroom", order: 10 },
    
    // Safety (10)
    { id: 86, question: "How do you screen employees?", answer: "Background checks, references, interviews. Only 1 in 100 hired.", category: "safety", order: 1 },
    { id: 87, question: "Are your cleaners trained?", answer: "Yes, comprehensive training on techniques, safety, service.", category: "safety", order: 2 },
    { id: 88, question: "How do you handle keys?", answer: "Strict security protocols. Stored securely, shared only with assigned cleaners.", category: "safety", order: 3 },
    { id: 89, question: "What COVID precautions do you take?", answer: "Symptom monitoring, hand hygiene, equipment sanitization.", category: "safety", order: 4 },
    { id: 90, question: "Do cleaners wear uniforms?", answer: "Yes, branded uniforms and company ID.", category: "safety", order: 5 },
    { id: 91, question: "What if I have concerns about a cleaner?", answer: "Contact us immediately. We address issues promptly.", category: "safety", order: 6 },
    { id: 92, question: "How do you protect my privacy?", answer: "Team focuses on cleaning, not personal items. No info sharing.", category: "safety", order: 7 },
    { id: 93, question: "Are cleaners supervised?", answer: "Quality checks and systems ensure consistent service.", category: "safety", order: 8 },
    { id: 94, question: "What if a cleaner calls in sick?", answer: "Backup cleaners available or we'll reschedule.", category: "safety", order: 9 },
    { id: 95, question: "Do you have a code of conduct?", answer: "Yes, covering professionalism, respect, confidentiality.", category: "safety", order: 10 },
    
    // Special (15)
    { id: 96, question: "Can you clean homes with pets?", answer: "Yes! Let us know about pets for their safety and comfort.", category: "special", order: 1 },
    { id: 97, question: "Do you clean homes with children?", answer: "Yes, child-safe products and careful around toys.", category: "special", order: 2 },
    { id: 98, question: "Can you clean during renovations?", answer: "Yes, during and after. Post-construction is our specialty.", category: "special", order: 3 },
    { id: 99, question: "Do you clean hoarder homes?", answer: "Case-by-case. Contact us for customized plan.", category: "special", order: 4 },
    { id: 100, question: "Can you clean homes with elderly residents?", answer: "Yes, experienced and respectful with special needs.", category: "special", order: 5 },
    { id: 101, question: "Do you clean homes with disabilities accommodations?", answer: "Yes, trained to work respectfully with accessibility equipment.", category: "special", order: 6 },
    { id: 102, question: "Can you clean vacation homes between guests?", answer: "Yes! Quick turnaround for guest-ready properties.", category: "special", order: 7 },
    { id: 103, question: "Do you clean model homes?", answer: "Yes, for real estate staging and showings.", category: "special", order: 8 },
    { id: 104, question: "Can you clean after water damage?", answer: "After restoration is complete. Contact specialist for active damage.", category: "special", order: 9 },
    { id: 105, question: "Do you clean homes being sold?", answer: "Yes, pre-listing cleaning for great buyer impressions.", category: "special", order: 10 },
    { id: 106, question: "Can you clean foreclosed properties?", answer: "Yes, often requires deep cleaning with custom quote.", category: "special", order: 11 },
    { id: 107, question: "Do you offer estate cleanout cleaning?", answer: "Yes, during or after estate cleanouts.", category: "special", order: 12 },
    { id: 108, question: "Can you clean homes with smokers?", answer: "Yes, heavy smoke may need specialized treatment.", category: "special", order: 13 },
    { id: 109, question: "Do you clean homes with mold?", answer: "Surface mold yes. Serious mold needs specialist first.", category: "special", order: 14 },
    { id: 110, question: "Can you accommodate religious/cultural requirements?", answer: "Yes, we respect all requirements. Let us know when booking.", category: "special", order: 15 },
  ];
}

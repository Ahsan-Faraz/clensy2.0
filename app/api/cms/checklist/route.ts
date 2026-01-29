import { NextResponse } from "next/server";
import { CMSAdapter } from "@/lib/cms-adapter";

export async function GET() {
  try {
    const checklistPage = await CMSAdapter.getChecklistPage();
    
    if (!checklistPage) {
      // Return default data if Strapi doesn't have the page yet
      return NextResponse.json({
        success: true,
        data: getDefaultChecklistData(),
      });
    }

    return NextResponse.json({ success: true, data: checklistPage });
  } catch (error) {
    console.error("Error fetching Checklist page:", error);
    return NextResponse.json({ success: true, data: getDefaultChecklistData() });
  }
}

function getDefaultChecklistData() {
  return {
    heroSection: {
      heading: "Our Clensy Cleaning <blue>Checklist</blue>",
      description: "We've developed a comprehensive cleaning system that ensures nothing is overlooked. Every detail matters, and our meticulous approach guarantees exceptional results.",
      subDescription: "From high-touch surfaces to hidden corners, our trained professionals follow a systematic process that transforms your space into a spotless sanctuary you can trust.",
      backgroundImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop",
      ctaButtonText: "Book Your Cleaning",
      ratingText: "4.9/5 Rating",
      satisfactionText: "100% Satisfaction",
    },
    interactiveGuide: {
      heading: "Our Clensy Cleaning Guide",
      description: "Click on any room to explore our detailed cleaning protocols and see exactly what's included in each service level.",
      floorPlanDesktop: "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750069438/website-images/j5wxvoguffksq4fwffuc.svg",
      floorPlanMobile: "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750069449/website-images/rzv9r7sgs6wgchwgh7kq.svg",
    },
    checklistSection: {
      heading: "Clensy Cleaning Checklist",
      description: "Choose your cleaning level to see exactly what's included in each comprehensive service package",
      checklistData: getDefaultChecklistItems(),
    },
    ctaSection: {
      heading: "Ready for a Spotless Home?",
      description: "Book your cleaning today and experience the Clensy difference. Our comprehensive checklist ensures nothing is missed.",
      buttonText: "Book Now",
      phoneNumber: "(551) 305-4081",
    },
  };
}

function getDefaultChecklistItems() {
  return {
    kitchen: {
      title: "Kitchen",
      routine: ["Sweep, Vacuum, & Mop Floors", "Wipe down countertops", "Wipe down Stove Top", "Clean exterior of appliances", "Sinks scrubbed and disinfected", "Wipe exterior of cabinets and handles", "Clean Stove Top", "Trash emptied"],
      deep: ["Everything in routine +", "Clean inside microwave", "Kitchen Backsplash", "Degrease Stovetop", "Wipe baseboards and molding", "Doors, door frames, & light switches", "Tables, chairs, & behind/under furniture", "Window Sills"],
      moving: ["Sweep, Vacuum and mop floors thoroughly", "Clean and disinfect inside and outside of all cabinets and drawers", "Clean inside and outside of refrigerator", "Clean inside and outside of oven", "Scrub and disinfect sink and faucet", "Wipe all countertops and backsplash", "Clean exterior and interior of microwave and other appliances", "Wipe down baseboards, door frames, and light switches"],
      image: "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750069417/website-images/y1jwhpsvkcdznrehbatk.jpg"
    },
    bathroom: {
      title: "Bathrooms",
      routine: ["Sweep, Vacuum, & Mop Floors", "Scrub and sanitize showers and tubs", "Clean and disinfect toilets", "Scrub and disinfect sink and countertops", "Chrome fixtures cleaned and shined", "Clean mirrors", "Towels neatly hung and folded", "Trash Emptied"],
      deep: ["Everything in routine +", "Remove hard water stains (where possible)", "Scrub grout lines (moderate scrubbing)", "Ceiling fans and light fixtures dusted", "Dust vent covers and ceiling corners", "Wipe baseboards and molding", "Doors, door frames, & light switches", "Window Sills"],
      moving: ["Sweep, Vacuum and mop floors thoroughly", "Scrub and disinfect toilet (inside, outside, and behind)", "Deep clean shower/tub (remove soap scum, mildew, grout scrubbing)", "Clean inside and outside of all drawers, cabinets, and vanities", "Scrub and polish sink, faucet, and countertops", "Clean mirrors and any glass shower doors", "Wipe baseboards and door trim", "Dust and clean vents, fan covers, and corners"],
      image: "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750069426/website-images/hbni4r1jfgawyay3od41.jpg"
    },
    bedroom: {
      title: "Bedrooms",
      routine: ["Sweep, Vacuum, & Mop Floors", "Beds made, linens changed (if linens are left on bed)", "Dust bedroom shelving, night stand, & bed frame", "Picture frames dusted", "Mirrors Cleaned", "Light (5 minutes) Organization of room", "Ensure overall room looks neat, tidy, and hotel-fresh", "Trash Emptied"],
      deep: ["Everything in routine +", "Ceiling fans and light fixtures dusted", "Remove cobwebs from corners and ceilings", "Wipe baseboards and molding", "Doors, door frames, & light switches", "Behind/under furniture", "Window Sills", "Wipe down decor items (vases, candle holders, etc.)"],
      moving: ["Sweep, Vacuum and mop floors thoroughly", "Clean inside closets, including shelving and floor", "Wipe baseboards and door trim", "Clean interior window glass and wipe window sills", "Dust and wipe ceiling fans and light fixtures", "Clean light switches, doors, and outlet covers", "Remove cobwebs and dust from ceiling corners", "Trash Emptied"],
      image: "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750069425/website-images/of8tqpfw4nky9boexhhg.jpg"
    },
    living: {
      title: "Living Areas",
      routine: ["Sweep, Vacuum, & Mop Floors", "Upholstered furniture vacuumed", "Dust all surfaces and decor", "Dust electronics and TV stands", "Fluff and straighten couch cushions & pillows", "Clean mirrors and glass surfaces", "Light (5 minutes) Organization of room", "Trash emptied"],
      deep: ["Everything in routine +", "Vacuum inside couch cushions (if removable)", "Ceiling fans and light fixtures dusted", "Remove cobwebs from corners and ceilings", "Wipe baseboards and molding", "Doors, door frames, & light switches", "Behind/under furniture", "Window Sills"],
      moving: ["Sweep, Vacuum and mop floors thoroughly", "Dust and wipe all baseboards and molding", "Clean interior window glass and wipe window sills", "Remove cobwebs from ceilings and corners", "Clean doors, handles, and light switches", "Dust and wipe ceiling fans and light fixtures", "Clean inside closets and shelving (if any)", "Trash Emptied"],
      image: "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750069416/website-images/ybxxaliusujslwciplyb.jpg"
    }
  };
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Check, X, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SEOHead from "@/components/seo-head";
import { formatText } from "@/lib/utils/formatText";

type CleaningType = "routine" | "deep" | "moving";
type RoomType = "kitchen" | "bathroom" | "bedroom" | "living" | "entryway";

interface RoomData {
  title: string;
  routine: string[];
  deep: string[];
  moving: string[];
  image: string;
}

interface ChecklistData {
  [key: string]: RoomData;
}

interface ModalData {
  title: string;
  routine: string[];
  deep: string[];
  moving: string[];
  image: string;
}

interface CMSChecklistData {
  heroSection: {
    heading: string;
    description: string;
    subDescription: string;
    backgroundImage: string;
    ctaButtonText: string;
    ratingText: string;
    satisfactionText: string;
  };
  interactiveGuide: {
    heading: string;
    description: string;
    floorPlanDesktop: string;
    floorPlanMobile: string;
  };
  checklistSection: {
    heading: string;
    description: string;
    checklistData: ChecklistData;
  };
  ctaSection: {
    heading: string;
    description: string;
    buttonText: string;
    phoneNumber: string;
  };
}

interface ChecklistPageClientProps {
  schemaJsonLd?: object | null;
  headScripts?: string;
  bodyEndScripts?: string;
  customCss?: string;
}

// Default fallback data
const defaultChecklistData: ChecklistData = {
  kitchen: {
    title: "Kitchen",
    routine: ["Sweep, Vacuum, & Mop Floors", "Wipe down countertops", "Wipe down Stove Top", "Clean exterior of appliances", "Sinks scrubbed and disinfected (dishes upon request)", "Wipe exterior of cabinets and handles", "Clean Stove Top", "Trash emptied"],
    deep: ["Everything in routine +", "Clean inside microwave", "Kitchen Backsplash", "Degrease Stovetop", "Wipe baseboards and molding", "Doors, door frames, & light switches", "Tables, chairs, & behind/under furniture", "Window Sills"],
    moving: ["Sweep, Vacuum and mop floors thoroughly", "Clean and disinfect inside and outside of all cabinets and drawers", "Clean inside and outside of refrigerator", "Clean inside and outside of oven", "Scrub and disinfect sink and faucet", "Wipe all countertops and backsplash", "Clean exterior and interior of microwave and other appliances", "Wipe down baseboards, door frames, and light switches"],
    image: "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750069417/website-images/y1jwhpsvkcdznrehbatk.jpg",
  },
  bathroom: {
    title: "Bathrooms",
    routine: ["Sweep, Vacuum, & Mop Floors", "Scrub and sanitize showers and tubs", "Clean and disinfect toilets", "Scrub and disinfect sink and countertops", "Chrome fixtures cleaned and shined", "Clean mirrors", "Towels neatly hung and folded", "Trash Emptied"],
    deep: ["Everything in routine +", "Remove hard water stains (where possible)", "Scrub grout lines (moderate scrubbing)", "Ceiling fans and light fixtures dusted", "Dust vent covers and ceiling corners", "Wipe baseboards and molding", "Doors, door frames, & light switches", "Window Sills"],
    moving: ["Sweep, Vacuum and mop floors thoroughly", "Scrub and disinfect toilet (inside, outside, and behind)", "Deep clean shower/tub (remove soap scum, mildew, grout scrubbing)", "Clean inside and outside of all drawers, cabinets, and vanities", "Scrub and polish sink, faucet, and countertops", "Clean mirrors and any glass shower doors", "Wipe baseboards and door trim", "Dust and clean vents, fan covers, and corners"],
    image: "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750069426/website-images/hbni4r1jfgawyay3od41.jpg",
  },
  bedroom: {
    title: "Bedrooms",
    routine: ["Sweep, Vacuum, & Mop Floors", "Beds made, linens changed (if linens are left on bed)", "Dust bedroom shelving, night stand, & bed frame", "Picture frames dusted", "Mirrors Cleaned", "Light (5 minutes) Organization of room", "Ensure overall room looks neat, tidy, and \"hotel-fresh\"", "Trash Emptied"],
    deep: ["Everything in routine +", "Ceiling fans and light fixtures dusted", "Remove cobwebs from corners and ceilings", "Wipe baseboards and molding", "Doors, door frames, & light switches", "Behind/under furniture", "Window Sills", "Wipe down decor items (vases, candle holders, etc.)"],
    moving: ["Sweep, Vacuum and mop floors thoroughly", "Clean inside closets, including shelving and floor", "Wipe baseboards and door trim", "Clean interior window glass and wipe window sills", "Dust and wipe ceiling fans and light fixtures", "Clean light switches, doors, and outlet covers", "Remove cobwebs and dust from ceiling corners", "Trash Emptied"],
    image: "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750069425/website-images/of8tqpfw4nky9boexhhg.jpg",
  },
  living: {
    title: "Living Areas",
    routine: ["Sweep, Vacuum, & Mop Floors", "Upholstered furniture vacuumed", "Dust all surfaces and decor", "Dust electronics and TV stands", "Fluff and straighten couch cushions & pillows", "Clean mirrors and glass surfaces", "Light (5 minutes) Organization of room", "Trash emptied"],
    deep: ["Everything in routine +", "Vacuum inside couch cushions (if removable)", "Ceiling fans and light fixtures dusted", "Remove cobwebs from corners and ceilings", "Wipe baseboards and molding", "Doors, door frames, & light switches", "Behind/under furniture", "Window Sills"],
    moving: ["Sweep, Vacuum and mop floors thoroughly", "Dust and wipe all baseboards and molding", "Clean interior window glass and wipe window sills", "Remove cobwebs from ceilings and corners", "Clean doors, handles, and light switches", "Dust and wipe ceiling fans and light fixtures", "Clean inside closets and shelving (if any)", "Trash Emptied"],
    image: "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750069416/website-images/ybxxaliusujslwciplyb.jpg",
  },
};

export default function ChecklistPageClient({ schemaJsonLd, headScripts, bodyEndScripts, customCss }: ChecklistPageClientProps) {
  const [activeRoom, setActiveRoom] = useState<RoomType | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<ModalData>({
    title: "",
    routine: [],
    deep: [],
    moving: [],
    image: "",
  });
  const [activeCleaningType, setActiveCleaningType] = useState<CleaningType>("routine");
  const [cmsData, setCmsData] = useState<CMSChecklistData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch CMS data on mount
  useEffect(() => {
    const fetchChecklistData = async () => {
      try {
        const response = await fetch("/api/cms/checklist");
        const result = await response.json();
        if (result.success && result.data) {
          setCmsData(result.data);
        }
      } catch (error) {
        console.error("Error fetching Checklist data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChecklistData();
  }, []);

  // Effect to handle body scroll locking when modal is open
  useEffect(() => {
    if (showModal) {
      const scrollY = window.scrollY;
      sessionStorage.setItem('modal-scroll-position', scrollY.toString());
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.documentElement.style.overflow = "hidden";
    } else {
      const scrollY = sessionStorage.getItem('modal-scroll-position');
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.documentElement.style.overflow = "";
      if (scrollY) {
        const scrollPosition = parseInt(scrollY);
        requestAnimationFrame(() => {
          window.scrollTo({ top: scrollPosition, left: 0, behavior: 'instant' });
          setTimeout(() => window.scrollTo({ top: scrollPosition, left: 0, behavior: 'instant' }), 50);
        });
        sessionStorage.removeItem('modal-scroll-position');
      }
    }
    return () => {
      const scrollY = sessionStorage.getItem('modal-scroll-position');
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.documentElement.style.overflow = "";
      if (scrollY) {
        window.scrollTo({ top: parseInt(scrollY), left: 0, behavior: 'instant' });
        sessionStorage.removeItem('modal-scroll-position');
      }
    };
  }, [showModal]);

  // Get checklist data from CMS or use defaults
  const fullChecklist: ChecklistData = cmsData?.checklistSection?.checklistData && Object.keys(cmsData.checklistSection.checklistData).length > 0
    ? cmsData.checklistSection.checklistData
    : defaultChecklistData;

  // Get hero data from CMS or use defaults
  const heroData = {
    heading: cmsData?.heroSection?.heading || "Our Clensy Cleaning <blue>Checklist</blue>",
    description: cmsData?.heroSection?.description || "We've developed a comprehensive cleaning system that ensures nothing is overlooked. Every detail matters, and our meticulous approach guarantees exceptional results.",
    subDescription: cmsData?.heroSection?.subDescription || "From high-touch surfaces to hidden corners, our trained professionals follow a systematic process that transforms your space into a spotless sanctuary you can trust.",
    backgroundImage: cmsData?.heroSection?.backgroundImage || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop",
    ctaButtonText: cmsData?.heroSection?.ctaButtonText || "Book Your Cleaning",
    ratingText: cmsData?.heroSection?.ratingText || "4.9/5 Rating",
    satisfactionText: cmsData?.heroSection?.satisfactionText || "100% Satisfaction",
  };

  // Get interactive guide data from CMS or use defaults
  const guideData = {
    heading: cmsData?.interactiveGuide?.heading || "Our Clensy Cleaning Guide",
    description: cmsData?.interactiveGuide?.description || "Click on any room to explore our detailed cleaning protocols and see exactly what's included in each service level.",
    floorPlanDesktop: cmsData?.interactiveGuide?.floorPlanDesktop || "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750069438/website-images/j5wxvoguffksq4fwffuc.svg",
    floorPlanMobile: cmsData?.interactiveGuide?.floorPlanMobile || "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750069449/website-images/rzv9r7sgs6wgchwgh7kq.svg",
  };

  // Get checklist section data from CMS or use defaults
  const checklistSectionData = {
    heading: cmsData?.checklistSection?.heading || "Clensy Cleaning Checklist",
    description: cmsData?.checklistSection?.description || "Choose your cleaning level to see exactly what's included in each comprehensive service package",
  };

  // Get CTA section data from CMS or use defaults
  const ctaData = {
    heading: cmsData?.ctaSection?.heading || "Ready for a Spotless Home?",
    description: cmsData?.ctaSection?.description || "Book your cleaning today and experience the Clensy difference. Our comprehensive checklist ensures nothing is missed.",
    buttonText: cmsData?.ctaSection?.buttonText || "Book Now",
    phoneNumber: cmsData?.ctaSection?.phoneNumber || "(551) 305-4081",
  };

  // Parse heading with <blue> tags
  const parseHeading = (heading: string) => {
    if (heading.includes('<blue>')) {
      const parts = heading.split('<blue>');
      const beforeBlue = parts[0];
      const afterParts = parts[1]?.split('</blue>') || ['', ''];
      return { beforeBlue, blueText: afterParts[0], afterBlue: afterParts[1] || '' };
    }
    return { beforeBlue: heading, blueText: '', afterBlue: '' };
  };

  const parsedHeroHeading = parseHeading(heroData.heading);

  const handleRoomClick = (room: RoomType) => {
    const roomTitles = { living: "Living Room", kitchen: "Kitchen", bathroom: "Bathroom", bedroom: "Bedroom", entryway: "Entryway" };
    setModalData({ title: roomTitles[room], routine: fullChecklist[room].routine, deep: fullChecklist[room].deep, moving: fullChecklist[room].moving, image: fullChecklist[room].image });
    setActiveCleaningType("routine");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setModalData({ title: "", routine: [], deep: [], moving: [], image: "" }), 300);
  };

  const renderHouseFloorPlan = () => (
    <div className="relative w-full rounded-lg overflow-hidden">
      <div className="image-map-wrapper">
        <div className="image-container">
          <div className="image-wrapper">
            <picture>
              <source media="(max-width:450px)" srcSet={guideData.floorPlanMobile} />
              <source media="(max-width:800px)" srcSet={guideData.floorPlanMobile} />
              <source media="(max-width:1200px)" srcSet={guideData.floorPlanMobile} />
              <Image src={guideData.floorPlanDesktop} alt="The 50-Point Checklist" width={2000} height={1200} className="image-wrapper-item w-full h-auto" priority />
            </picture>
          </div>
          <div className="points-wrapper absolute inset-0" data-animation="inview-fade-up" data-inview="true">
            {/* Living Room Point */}
            <button className={`point absolute ${activeRoom === "living" ? "active" : ""}`} style={{ left: "45%", bottom: "30%" }} onClick={() => handleRoomClick("living")}>
              <span className="point-label icon-house">
                <div className={`point-icon ${activeRoom === "living" ? "bg-[#007BFF]" : "bg-white/80"} p-2 rounded-md shadow-lg mb-1`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke={activeRoom === "living" ? "white" : "#007BFF"} strokeWidth="2" /></svg>
                </div>
                <div className="text-center text-white font-bold text-sm bg-[#007BFF] py-1 px-3 rounded-md">LIVING ROOM</div>
              </span>
            </button>
            {/* Kitchen Point */}
            <button className={`point absolute ${activeRoom === "kitchen" ? "active" : ""}`} style={{ right: "15%", bottom: "30%" }} onClick={() => handleRoomClick("kitchen")}>
              <span className="point-label icon-plate-set">
                <div className={`point-icon ${activeRoom === "kitchen" ? "bg-[#007BFF]" : "bg-white/80"} p-2 rounded-md shadow-lg mb-1`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" stroke={activeRoom === "kitchen" ? "white" : "#007BFF"} strokeWidth="2" /><path d="M4 8H20" stroke={activeRoom === "kitchen" ? "white" : "#007BFF"} strokeWidth="2" /></svg>
                </div>
                <div className="text-center text-white font-bold text-sm bg-[#007BFF] py-1 px-3 rounded-md">KITCHEN</div>
              </span>
            </button>
            {/* Bedroom Point */}
            <button className={`point absolute ${activeRoom === "bedroom" ? "active" : ""}`} style={{ left: "18%", top: "30%" }} onClick={() => handleRoomClick("bedroom")}>
              <span className="point-label icon-bed">
                <div className={`point-icon ${activeRoom === "bedroom" ? "bg-[#007BFF]" : "bg-white/80"} p-2 rounded-md shadow-lg mb-1`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 18V12C4 11.4477 4.44772 11 5 11H19C19.5523 11 20 11.4477 20 12V18" stroke={activeRoom === "bedroom" ? "white" : "#007BFF"} strokeWidth="2" /><path d="M2 18H22" stroke={activeRoom === "bedroom" ? "white" : "#007BFF"} strokeWidth="2" /><path d="M6 11V8C6 7.44772 6.44772 7 7 7H17C17.5523 7 18 7.44772 18 8V11" stroke={activeRoom === "bedroom" ? "white" : "#007BFF"} strokeWidth="2" /></svg>
                </div>
                <div className="text-center text-white font-bold text-sm bg-[#007BFF] py-1 px-3 rounded-md">BEDROOMS</div>
              </span>
            </button>
            {/* Bathroom Point */}
            <button className={`point absolute ${activeRoom === "bathroom" ? "active" : ""}`} style={{ right: "15%", top: "20%" }} onClick={() => handleRoomClick("bathroom")}>
              <span className="point-label icon-vanity">
                <div className={`point-icon ${activeRoom === "bathroom" ? "bg-[#007BFF]" : "bg-white/80"} p-2 rounded-md shadow-lg mb-1`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 8H20" stroke={activeRoom === "bathroom" ? "white" : "#007BFF"} strokeWidth="2" /><path d="M8 8V20" stroke={activeRoom === "bathroom" ? "white" : "#007BFF"} strokeWidth="2" /><path d="M16 8V20" stroke={activeRoom === "bathroom" ? "white" : "#007BFF"} strokeWidth="2" /><path d="M4 12H20" stroke={activeRoom === "bathroom" ? "white" : "#007BFF"} strokeWidth="2" /></svg>
                </div>
                <div className="text-center text-white font-bold text-sm bg-[#007BFF] py-1 px-3 rounded-md">BATHROOMS</div>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <SEOHead schemaJsonLd={schemaJsonLd} headScripts={headScripts} bodyEndScripts={bodyEndScripts} customCss={customCss} />
      <main className="overflow-x-hidden">
        <div className="relative z-50"><Navbar /></div>

        {/* Hero Section */}
        <section className="checklist-page relative h-screen pt-16 bg-black overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image src={heroData.backgroundImage} alt="Professional cleaning service background" fill className="object-cover opacity-5" priority />
            <div className="absolute inset-0 bg-black/80"></div>
          </div>
          <div className="absolute inset-0 overflow-hidden z-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-10"></div>
          </div>
          <div className="absolute inset-0 opacity-5 z-0">
            <div className="w-full h-full" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: "60px 60px" }}></div>
          </div>
          <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10 max-w-7xl">
            <div className="flex items-center justify-center h-full py-8">
              <div className="text-center">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7 }} className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 relative">
                  <div className="absolute inset-0 rounded-full bg-blue-500 opacity-30 blur-xl animate-pulse"></div>
                  <div className="absolute inset-2 rounded-full bg-blue-400 opacity-40 blur-lg animate-pulse" style={{ animationDelay: "0.5s" }}></div>
                  <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-full shadow-2xl"><Check className="h-10 w-10 text-white" /></div>
                </motion.div>
                <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
                  {parsedHeroHeading.beforeBlue}{parsedHeroHeading.blueText && <span className="text-blue-400">{parsedHeroHeading.blueText}</span>}{parsedHeroHeading.afterBlue}
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-lg md:text-xl max-w-4xl mx-auto mb-4 text-gray-300 leading-relaxed font-medium">
                  {heroData.description}
                </motion.p>
                <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="text-base md:text-lg max-w-3xl mx-auto text-gray-400 mb-8 leading-relaxed">
                  {heroData.subDescription}
                </motion.p>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                  <Link href="/booking/" className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1">
                    {heroData.ctaButtonText}<ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <div className="flex items-center gap-6 text-gray-300">
                    <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg"><span className="font-semibold text-sm">{heroData.ratingText}</span></div>
                    <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg"><Check className="h-4 w-4 text-green-400 mr-2" /><span className="font-semibold text-sm">{heroData.satisfactionText}</span></div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
          <motion.div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20" animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
            <div className="w-5 h-8 border-2 border-gray-400 rounded-full flex justify-center"><div className="w-1 h-2 bg-gray-400 rounded-full mt-1 animate-pulse"></div></div>
          </motion.div>
        </section>

        {/* Interactive Room Guide Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
            <div className="text-center mb-16">
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">{guideData.heading}</motion.h2>
              <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="text-xl text-gray-600 max-w-3xl mx-auto">{guideData.description}</motion.p>
            </div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }} className="w-full mb-16">{renderHouseFloorPlan()}</motion.div>
          </div>
        </section>

        {/* Main Checklist Section */}
        <section className="py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-300 rounded-full blur-3xl"></div>
          </div>
          <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10 max-w-7xl">
            <div className="mb-16 text-center">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 relative">
                <div className="absolute inset-0 rounded-full bg-blue-300 opacity-80 blur-md"></div>
                <div className="relative bg-blue-400 p-5 rounded-full"><Check className="h-10 w-10 text-white" /></div>
              </motion.div>
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-3xl md:text-5xl font-bold mb-4">{checklistSectionData.heading}</motion.h2>
              <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="text-xl max-w-3xl mx-auto mb-10 text-white/90 leading-relaxed">{checklistSectionData.description}</motion.p>
              <div className="flex justify-center gap-4 mb-12 flex-wrap">
                <button onClick={() => setActiveCleaningType("routine")} className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 ${activeCleaningType === "routine" ? "bg-white text-blue-600 shadow-lg transform scale-105" : "bg-blue-700/50 text-white hover:bg-blue-700/80 hover:scale-105"}`}>Routine Cleaning</button>
                <button onClick={() => setActiveCleaningType("deep")} className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 ${activeCleaningType === "deep" ? "bg-white text-blue-600 shadow-lg transform scale-105" : "bg-blue-700/50 text-white hover:bg-blue-700/80 hover:scale-105"}`}>Deep Cleaning</button>
                <button onClick={() => setActiveCleaningType("moving")} className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 ${activeCleaningType === "moving" ? "bg-white text-blue-600 shadow-lg transform scale-105" : "bg-blue-700/50 text-white hover:bg-blue-700/80 hover:scale-105"}`}>Move In/Out Cleaning</button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-x-16 gap-y-16">
              {/* Kitchen */}
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <div className="flex items-center mb-8">
                  <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mr-6">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white"><path d="M3 12H21M3 6H21M9 1V4M15 1V4M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="7" cy="16" r="1" fill="currentColor" /><circle cx="12" cy="16" r="1" fill="currentColor" /><circle cx="17" cy="16" r="1" fill="currentColor" /></svg>
                  </div>
                  <h3 className="text-3xl font-bold">Kitchen</h3>
                </div>
                <ul className="space-y-4">
                  {fullChecklist.kitchen[activeCleaningType].map((item, index) => (
                    <motion.li key={`kitchen-${index}`} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: index * 0.05 }} className="flex items-start gap-3">
                      <motion.div initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.2, delay: 0.1 + index * 0.05, type: "spring" }} className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-white flex items-center justify-center"><Check className="h-3 w-3 text-blue-600" /></motion.div>
                      <span className="text-white/90">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Bathroom */}
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
                <div className="flex items-center mb-8">
                  <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mr-6">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white"><path d="M9 22H15C18.866 22 22 18.866 22 15V9C22 8.44772 21.5523 8 21 8H19V6C19 3.79086 17.2091 2 15 2H9C6.79086 2 5 3.79086 5 6V8H3C2.44772 8 2 8.44772 2 9V15C2 18.866 5.13401 22 9 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 8V15C5 16.1046 5.89543 17 7 17H17C18.1046 17 19 16.1046 19 15V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="7" cy="12" r="1" fill="currentColor" /><circle cx="17" cy="12" r="1" fill="currentColor" /></svg>
                  </div>
                  <h3 className="text-3xl font-bold">Bathrooms</h3>
                </div>
                <ul className="space-y-4">
                  {fullChecklist.bathroom[activeCleaningType].map((item, index) => (
                    <motion.li key={`bathroom-${index}`} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: index * 0.05 }} className="flex items-start gap-3">
                      <motion.div initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.2, delay: 0.1 + index * 0.05, type: "spring" }} className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-white flex items-center justify-center"><Check className="h-3 w-3 text-blue-600" /></motion.div>
                      <span className="text-white/90">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Bedrooms */}
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
                <div className="flex items-center mb-8">
                  <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mr-6">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white"><path d="M3 18V12C3 11.4477 3.44772 11 4 11H20C20.5523 11 21 11.4477 21 12V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M2 18H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M6 11V8C6 7.44772 6.44772 7 7 7H17C17.5523 7 18 7.44772 18 8V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M8 7V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <h3 className="text-3xl font-bold">Bedrooms</h3>
                </div>
                <ul className="space-y-4">
                  {fullChecklist.bedroom[activeCleaningType].map((item, index) => (
                    <motion.li key={`bedroom-${index}`} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: index * 0.05 }} className="flex items-start gap-3">
                      <motion.div initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.2, delay: 0.1 + index * 0.05, type: "spring" }} className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-white flex items-center justify-center"><Check className="h-3 w-3 text-blue-600" /></motion.div>
                      <span className="text-white/90">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Living Areas */}
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}>
                <div className="flex items-center mb-8">
                  <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mr-6">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white"><path d="M3 9L12 2L21 9V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M9 21V12H15V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M6 15H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 15H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <h3 className="text-3xl font-bold">Living Areas</h3>
                </div>
                <ul className="space-y-4">
                  {fullChecklist.living[activeCleaningType].map((item, index) => (
                    <motion.li key={`living-${index}`} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: index * 0.05 }} className="flex items-start gap-3">
                      <motion.div initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.2, delay: 0.1 + index * 0.05, type: "spring" }} className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-white flex items-center justify-center"><Check className="h-3 w-3 text-blue-600" /></motion.div>
                      <span className="text-white/90">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }} className="text-center mt-16">
              <Link href="/booking/" className="inline-flex items-center justify-center bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                Get Your Custom Quote<ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Modal for Room Details */}
        <AnimatePresence>
          {showModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm bg-black/60">
              <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.95 }} className="relative w-full max-w-4xl bg-white shadow-2xl rounded-xl overflow-hidden">
                <button onClick={closeModal} className="absolute top-4 right-4 z-10 text-gray-600 hover:text-gray-900 p-2 bg-white/70 backdrop-blur-sm rounded-full shadow-md transition-all duration-200 hover:scale-110"><X className="w-5 h-5" /></button>
                <div className="grid md:grid-cols-2">
                  <div className="relative h-64 md:h-auto">
                    <Image src={modalData.image || "https://res.cloudinary.com/dgjmm3usy/image/upload/v1750069406/website-images/gko1svk46tpiiewa5ln1.jpg"} alt={modalData.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full p-6"><h3 className="text-3xl font-bold text-white">{modalData.title}</h3></div>
                  </div>
                  <div className="p-8 bg-white text-gray-800">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3"><Check className="h-4 w-4 text-white" /></div>
                      Cleaning Checklist
                    </h3>
                    <div className="flex mb-6 border-b border-gray-200">
                      <button onClick={() => setActiveCleaningType("routine")} className={`py-3 px-4 font-medium text-sm transition-all duration-200 ${activeCleaningType === "routine" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500 hover:text-blue-500"}`}>Routine</button>
                      <button onClick={() => setActiveCleaningType("deep")} className={`py-3 px-4 font-medium text-sm transition-all duration-200 ${activeCleaningType === "deep" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500 hover:text-blue-500"}`}>Deep Cleaning</button>
                      <button onClick={() => setActiveCleaningType("moving")} className={`py-3 px-4 font-medium text-sm transition-all duration-200 ${activeCleaningType === "moving" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500 hover:text-blue-500"}`}>Move In/Out</button>
                    </div>
                    <ul className="space-y-3 h-[300px] overflow-y-auto pr-2 modal-scroll-container">
                      {modalData[activeCleaningType] && modalData[activeCleaningType].map((item: string, index: number) => (
                        <motion.li key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center"><Check className="h-3 w-3 text-blue-600" /></div>
                          <span className="text-gray-700">{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                    <div className="mt-8">
                      <Link href="/booking/" className="inline-flex items-center text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                        Book a cleaning<ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <Footer />
      </main>
    </>
  );
}

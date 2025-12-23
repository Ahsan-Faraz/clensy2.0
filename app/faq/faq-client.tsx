"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Search, Clock } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { formatText } from "@/lib/utils/formatText";
import SEOHead from "@/components/seo-head";

interface FAQItem { question: string; answer: string; }
interface FAQCategory { name: string; questions: FAQItem[]; }
interface StillHaveQuestionsCard { title: string; description: string; buttonText: string; buttonLink: string; icon: string; }
interface TrustIndicator { number: string; description: string; }

interface FAQData {
  heroSection: { topLabel: string; heading: string; description: string; };
  faqCategories: { general: FAQCategory; };
  stillHaveQuestionsSection: { heading: string; description: string; cards: StillHaveQuestionsCard[]; };
  contactSection: { heading: string; description: string; emailSection: { heading: string; description: string; email: string; }; callSection: { heading: string; description: string; phone: string; }; contactButtonText: string; };
  trustIndicatorsSection: { indicators: TrustIndicator[]; };
}

const defaultFAQData: FAQData = {
  heroSection: { topLabel: "Answers to your questions", heading: "Frequently Asked <blue>Questions</blue>", description: "Find answers to common questions about our cleaning services, booking process, and pricing. Can't find what you're looking for? Contact us directly for personalized assistance." },
  faqCategories: {
    general: {
      name: "General Questions",
      questions: [
        { question: "What areas do you serve?", answer: "We provide cleaning services throughout Northern New Jersey, including Bergen, Essex, Hudson, Passaic, and Union counties." },
        { question: "Are your cleaners background checked?", answer: "Yes, all of our cleaning professionals undergo thorough background checks before joining our team." },
        { question: "Are you insured and bonded?", answer: "Yes, we are fully insured and bonded. This provides protection for both our clients and our team." },
        { question: "What cleaning products do you use?", answer: "We use a combination of industry-grade professional cleaning products and eco-friendly options." },
        { question: "Do I need to be home during the cleaning?", answer: "No, you don't need to be home during the cleaning service. Many of our clients provide a key or access instructions." },
      ],
    },
  },
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
    emailSection: { heading: "Email Us", description: "Send us a message and we'll respond within 24 hours.", email: "info@clensy.com" },
    callSection: { heading: "Call Us", description: "Speak with our customer service team directly.", phone: "(551) 305-4081" },
    contactButtonText: "Contact Us",
  },
  trustIndicatorsSection: { indicators: [{ number: "1000+", description: "Questions Answered" }, { number: "24/7", description: "Online Support" }, { number: "5.0", description: "Customer Satisfaction" }, { number: "15+", description: "Years of Experience" }] },
};

interface FAQPageClientProps {
  schemaJsonLd?: object | null;
  headScripts?: string;
  bodyEndScripts?: string;
  customCss?: string;
}


export default function FAQPageClient({ schemaJsonLd, headScripts, bodyEndScripts, customCss }: FAQPageClientProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openFAQs, setOpenFAQs] = useState<Record<string, boolean>>({});
  const [faqData, setFAQData] = useState<FAQData>(defaultFAQData);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [comprehensiveFAQs, setComprehensiveFAQs] = useState<any[]>([]);
  const [isLoadingFAQs, setIsLoadingFAQs] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const faqSectionRef = useRef<HTMLDivElement>(null);
  const COMPREHENSIVE_FAQ_LIMIT = 12;

  const fetchComprehensiveFAQs = async (page = 1, search = '', category = 'all', reset = false) => {
    try {
      setIsLoadingFAQs(true);
      const params = new URLSearchParams({ page: page.toString(), limit: COMPREHENSIVE_FAQ_LIMIT.toString(), search, category });
      const response = await fetch(`/api/cms/faq-questions?${params}`);
      const result = await response.json();
      if (result.success && result.data) {
        if (reset || page === 1) {
          setComprehensiveFAQs(result.data.questions);
        } else {
          setComprehensiveFAQs(prev => {
            const existingIds = new Set(prev.map(q => q._id));
            const newQuestions = result.data.questions.filter((q: any) => !existingIds.has(q._id));
            return [...prev, ...newQuestions];
          });
        }
        setHasMore(result.data.pagination.hasMore);
        setCurrentPage(result.data.pagination.currentPage);
        setTotalQuestions(result.data.pagination.totalQuestions);
        setCategories(result.data.categories);
      }
    } catch (error) {
      console.error("Error fetching comprehensive FAQs:", error);
    } finally {
      setIsLoadingFAQs(false);
    }
  };

  const initializeFAQs = async () => {
    try {
      const response = await fetch('/api/cms/faq-questions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ initialize: true }) });
      const result = await response.json();
      if (result.message?.includes('Cleaned')) setTimeout(() => fetchComprehensiveFAQs(1, '', 'all', true), 1000);
    } catch (error) {
      console.error("Error initializing FAQs:", error);
    }
  };

  useEffect(() => {
    const fetchFAQData = async () => {
      try {
        const response = await fetch("/api/cms/faq");
        const result = await response.json();
        if (result.success && result.data) setFAQData(result.data);
      } catch (error) {
        console.error("Error fetching FAQ data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchFAQData();
    initializeFAQs().then(() => fetchComprehensiveFAQs(1, '', 'all', true));
  }, []);

  useEffect(() => { setIsLoaded(true); }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery !== undefined) {
        fetchComprehensiveFAQs(1, searchQuery, selectedCategory, true);
        setCurrentPage(1);
      }
    }, 500);
    return () => clearTimeout(delayedSearch);
  }, [searchQuery, selectedCategory]);

  const toggleFAQ = (id: string) => setOpenFAQs(prev => ({ ...prev, [id]: !prev[id] }));
  const handleLoadMore = () => { if (hasMore && !isLoadingFAQs) fetchComprehensiveFAQs(currentPage + 1, searchQuery, selectedCategory, false); };
  const handleCategoryChange = (category: string) => { setSelectedCategory(category); setCurrentPage(1); };
  const formatCategoryName = (category: string) => category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  if (isLoadingData) {
    return (
      <main className="overflow-x-hidden">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#007bff]"></div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <>
      <SEOHead schemaJsonLd={schemaJsonLd} headScripts={headScripts} bodyEndScripts={bodyEndScripts} customCss={customCss} />
      <main className="overflow-x-hidden">
        <Navbar />

        {/* Hero Section */}
        <section className="relative min-h-[60vh] bg-black pt-16">
          <div className="absolute inset-0 z-0">
            <Image src="https://res.cloudinary.com/dgjmm3usy/image/upload/v1750847616/shutterstock_2209715823_1_x80cn8.jpg" alt="Cleaning FAQ hero image" fill className="object-cover opacity-70" priority />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col items-center justify-center min-h-[calc(60vh-64px)]">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={isLoaded ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center max-w-3xl">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={isLoaded ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.5, delay: 0.2 }} className="inline-block mb-6 px-6 py-2 bg-blue-600 rounded-lg">
                  <span className="text-white font-semibold text-sm uppercase tracking-wider">{formatText(faqData.heroSection.topLabel)}</span>
                </motion.div>
                <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6 hero-text-shadow">{formatText(faqData.heroSection.heading)}</h1>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={isLoaded ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }} className="text-lg text-white/80 mb-8">{formatText(faqData.heroSection.description)}</motion.p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section ref={faqSectionRef} className="py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              {/* Search Bar */}
              <div className="mb-12">
                <div className="relative max-w-2xl mx-auto">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400" /></div>
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search from 110+ questions about cleaning, pricing, booking, and more..."
                    className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" />
                  {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-0 pr-3 flex items-center"><span className="text-gray-400 hover:text-gray-600">Clear</span></button>}
                </div>
                {/* Category Filter */}
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <button onClick={() => handleCategoryChange('all')} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    All Categories {totalQuestions > 0 && `(${totalQuestions})`}
                  </button>
                  {categories.map((category) => (
                    <button key={category} onClick={() => handleCategoryChange(category)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                      {formatCategoryName(category)}
                    </button>
                  ))}
                </div>
              </div>

              {/* FAQ Items */}
              <div className="mb-8 mt-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">{searchQuery ? 'Search Results' : selectedCategory === 'all' ? 'All Questions' : formatCategoryName(selectedCategory)}</h2>
                <div className="space-y-6">
                  {comprehensiveFAQs.map((faq, index) => (
                    <motion.div key={faq._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <button onClick={() => toggleFAQ(faq._id)} className="w-full px-8 py-6 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-xl">
                        <div className="flex-1 pr-4">
                          <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                          <div className="flex items-center mt-2 space-x-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{formatCategoryName(faq.category)}</span>
                          </div>
                        </div>
                        {openFAQs[faq._id] ? <ChevronUp className="h-5 w-5 text-blue-600 flex-shrink-0" /> : <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />}
                      </button>
                      {openFAQs[faq._id] && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="px-8 pb-6">
                          <div className="pt-4 border-t border-gray-100"><p className="text-gray-700 leading-relaxed">{formatText(faq.answer)}</p></div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
                {/* Load More */}
                {hasMore && (
                  <div className="text-center mt-12">
                    <button onClick={handleLoadMore} disabled={isLoadingFAQs} className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50">
                      {isLoadingFAQs ? (<><div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>Loading...</>) : (<>Load More Questions<ChevronDown className="ml-2 h-5 w-5" /></>)}
                    </button>
                  </div>
                )}
                {comprehensiveFAQs.length === 0 && !isLoadingFAQs && (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{searchQuery ? 'No results found' : 'No questions available'}</h3>
                    <p className="text-gray-500">{searchQuery ? 'Try adjusting your search terms.' : 'Questions will appear here once they are added.'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Still Have Questions Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{formatText(faqData.stillHaveQuestionsSection.heading)}</h2>
              <p className="text-lg text-gray-600">{formatText(faqData.stillHaveQuestionsSection.description)}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {faqData.stillHaveQuestionsSection.cards.map((card, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-sm text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{formatText(card.title)}</h3>
                  <p className="text-gray-600 mb-4">{formatText(card.description)}</p>
                  <Link href={card.buttonLink} className="text-blue-600 font-medium hover:text-blue-700 transition-colors">{card.buttonText} →</Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">{formatText(faqData.contactSection.heading)}</h2>
              <p className="text-lg text-gray-600 mb-8">{formatText(faqData.contactSection.description)}</p>
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-bold mb-2">{faqData.contactSection.emailSection.heading}</h3>
                  <p className="text-gray-600 mb-2">{faqData.contactSection.emailSection.description}</p>
                  <a href={`mailto:${faqData.contactSection.emailSection.email}`} className="text-blue-600 font-medium">{faqData.contactSection.emailSection.email}</a>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-bold mb-2">{faqData.contactSection.callSection.heading}</h3>
                  <p className="text-gray-600 mb-2">{faqData.contactSection.callSection.description}</p>
                  <a href={`tel:${faqData.contactSection.callSection.phone}`} className="text-blue-600 font-medium">{faqData.contactSection.callSection.phone}</a>
                </div>
              </div>
              <Link href="/contact" className="inline-flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-full font-medium transition-all duration-300">
                {faqData.contactSection.contactButtonText}
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

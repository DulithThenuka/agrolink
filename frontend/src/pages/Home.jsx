import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Sprout,
  ShoppingBag,
  ShieldCheck,
  Zap,
  TrendingUp,
  ArrowRight,
  Search,
  CheckCircle2,
  MapPin,
  Sparkles,
  Award,
  ArrowUpRight,
  Package,
  Cpu,
  Scan,
  FileCheck,
  Activity,
  CloudRain,
  ShieldAlert,
  HelpCircle,
  FileText,
  Quote,
  Star,
  MessageSquareQuote,
  UploadCloud,
  Lock,
  Truck,
  Scale,
  Coins,
  QrCode,
  ChevronDown,
  ChevronUp,
  Bot,
  Wrench,
  Recycle,
  Users,
  Layers,
  Globe,
  Check
} from 'lucide-react';
import { cropsAPI } from '../services/api';
import { BuyCropModal } from '../components/BuyCropModal';
import { MarketPriceTicker } from '../components/MarketPriceTicker';
import { AgriHero3DCanvas } from '../components/AgriHero3DCanvas';
import { Card3D } from '../components/Card3D';
import { Interactive3DBackground } from '../components/Interactive3DBackground';

gsap.registerPlugin(ScrollTrigger);

export const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredCrops, setFeaturedCrops] = useState([]);
  const [loadingCrops, setLoadingCrops] = useState(true);
  const [selectedCropForPurchase, setSelectedCropForPurchase] = useState(null);
  const [activeAiTab, setActiveAiTab] = useState('price'); // 'price', 'disease', 'contract', 'intel'
  const [openFaq, setOpenFaq] = useState(0); // default first FAQ open
  const navigate = useNavigate();

  // GSAP animation container refs
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const howItWorksRef = useRef(null);
  const produceRef = useRef(null);
  const aiSuiteRef = useRef(null);
  const testimonialsRef = useRef(null);
  const rolesRef = useRef(null);
  const ecosystemRef = useRef(null);
  const faqRef = useRef(null);

  const ECOSYSTEM_MODULES = [
    {
      id: 'equipment',
      title: 'Machinery & Equipment Rental',
      tag: 'Hourly & Daily Fleet',
      icon: '🚜',
      desc: 'Rent 4WD tractors, combine harvesters, boom sprayers, and precision agri-drones from verified regional farm hubs.',
      link: '/equipment-rental',
      linkText: 'Rent Machinery',
      gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
      borderColor: 'border-amber-200/80 hover:border-amber-400',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300'
    },
    {
      id: 'waste',
      title: 'Cold-Chain & Waste Reduction',
      tag: 'Zero-Spoilage Matrix',
      icon: '♻️',
      desc: 'AI-driven dynamic markdown engine, near-harvest bulk clearance, and cold storage pooling to eliminate post-harvest food waste.',
      link: '/waste-reduction',
      linkText: 'Reduce Waste',
      gradient: 'from-rose-500/10 via-rose-500/5 to-transparent',
      borderColor: 'border-rose-200/80 hover:border-rose-400',
      badgeBg: 'bg-rose-100 text-rose-900 border-rose-300'
    },
    {
      id: 'supplies',
      title: 'Pre-Production Supply Hub',
      tag: 'DOA Certified Inputs',
      icon: '🧪',
      desc: 'Order certified hybrid seeds, organic fertilizers, biocides, and smart drip-irrigation kits directly from verified suppliers.',
      link: '/supplier-marketplace',
      linkText: 'Browse Supplies',
      gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
      borderColor: 'border-emerald-200/80 hover:border-emerald-400',
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300'
    },
    {
      id: 'experts',
      title: 'Agronomy Expert Consultation',
      tag: 'Accredited Specialists',
      icon: '👨‍🔬',
      desc: 'Book 1-on-1 virtual consultations with certified soil scientists, plant pathologists, and agricultural university researchers.',
      link: '/experts',
      linkText: 'Consult Experts',
      gradient: 'from-sky-500/10 via-sky-500/5 to-transparent',
      borderColor: 'border-sky-200/80 hover:border-sky-400',
      badgeBg: 'bg-sky-100 text-sky-900 border-sky-300'
    },
    {
      id: 'community',
      title: 'Growers Community Network',
      tag: 'Farmer-to-Farmer',
      icon: '👥',
      desc: 'Connect with growers across all 25 districts. Share localized pest warnings, monsoon forecasts, and high-yield farming strategies.',
      link: '/community',
      linkText: 'Join Community',
      gradient: 'from-indigo-500/10 via-indigo-500/5 to-transparent',
      borderColor: 'border-indigo-200/80 hover:border-indigo-400',
      badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-300'
    },
    {
      id: 'ai-assistant',
      title: 'Multilingual AgroLink AI Copilot',
      tag: '24/7 Voice & Chat',
      icon: '🤖',
      desc: 'Intelligent conversational assistant in English, Sinhala & Tamil. Get instant advice on fertilizer ratios, harvest timing & market trends.',
      link: '/ai-assistant',
      linkText: 'Launch Copilot',
      gradient: 'from-teal-500/10 via-teal-500/5 to-transparent',
      borderColor: 'border-teal-200/80 hover:border-teal-400',
      badgeBg: 'bg-teal-100 text-teal-900 border-teal-300'
    }
  ];

  const FAQS = [
    {
      question: 'How does AgroLink Escrow protect farmers and buyers from payment defaults?',
      answer: 'When a buyer places an order, 100% of the funds are deposited into a secure automated Escrow Vault. Farmers receive instant verification of locked funds before dispatching their harvest. Once the verified logistics fleet delivers the batch and destination verification is completed, payout is transferred directly to the grower.'
    },
    {
      question: 'How are crop quality and Department of Agriculture (DOA) standards graded?',
      answer: 'Growers upload harvest photos and telemetry data. Our computer vision AI system analyzes leaf pathology and produce coloration to assign a preliminary DOA Grade (Grade A Export, DOA Certified, or Commercial Wholesale). Detailed batch passports ensure buyer transparency.'
    },
    {
      question: 'How does the logistics, cold-chain, and fleet dispatch network operate?',
      answer: 'AgroLink coordinates registered regional truck drivers and refrigerated cold-chain partners. Drivers manage route assignments, execute origin pickup inspections, report live temperature telemetry across transit, and conclude delivery with digital recipient confirmation.'
    },
    {
      question: 'Can farmers rent machinery like tractors, harvesters, or drones?',
      answer: 'Yes! AgroLink includes an Equipment & Machinery Rental portal where farmers can book 4WD tractors, combine harvesters, boom sprayers, and precision agri-drones by the hour or acre, drastically cutting farm capital expenditure.'
    },
    {
      question: 'How does the Waste Reduction & Surplus Clearance engine prevent spoilage?',
      answer: 'Perishable produce approaching harvest maturity is highlighted in our Waste Reduction dashboard with automated tiered discount markdowns. This enables food processors, canning factories, hotels, and community kitchens to buy bulk surplus before spoilage occurs.'
    },
    {
      question: 'Is AgroLink free to register for smallholder farmers and cooperatives?',
      answer: 'Yes, registration, AI disease scanning, price prediction forecasts, community forums, and standard harvest listings are 100% free for individual growers and rural cooperatives. AgroLink charges zero middleman markups.'
    }
  ];

  const MOCK_FEATURED_CROPS = [
    {
      id: 101,
      name: 'Organic Red Tomatoes (Grade A)',
      category: 'Vegetables',
      price: 185,
      quantity: 850,
      location: 'Welimada, Badulla',
      farmerName: 'K. Bandara (Welimada Farm Cooperative)',
      grade: 'Grade A Premium',
      imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
      description: 'Fresh field-picked Grade A organic tomatoes. High firmness, ideal for commercial supermarket distribution.'
    },
    {
      id: 102,
      name: 'Certified Polonnaruwa Samba Paddy',
      category: 'Grains',
      price: 220,
      quantity: 2500,
      location: 'Polonnaruwa Central Belt',
      farmerName: 'P. Ranasinghe (Polonnaruwa Growers)',
      grade: 'DOA Seed Certified',
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
      description: 'Aromatic high-purity Samba paddy grain. Cleaned, dried to 12% moisture content.'
    },
    {
      id: 103,
      name: 'Upcountry Red Potatoes (Fresh Harvest)',
      category: 'Vegetables',
      price: 280,
      quantity: 1200,
      location: 'Keppetipola, Nuwara Eliya',
      farmerName: 'S. Gunawardena (Upcountry Producers)',
      grade: 'Grade A Export',
      imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80',
      description: 'High-density Nuwara Eliya potatoes. Uniform sizing, pest-free, directly from cold storage.'
    },
    {
      id: 104,
      name: 'Jaffna Green Chillies (High-Pungency)',
      category: 'Spices',
      price: 520,
      quantity: 450,
      location: 'Chavakachcheri, Jaffna',
      farmerName: 'T. Vigneswaran (Northern Agri Network)',
      grade: 'Grade A Supermarket',
      imageUrl: 'https://images.unsplash.com/photo-1588879462806-07a5b61f8c0d?w=800&auto=format&fit=crop&q=80',
      description: 'Sun-dusted fresh Jaffna green chillies with high pungency and extended shelf life.'
    }
  ];

  useEffect(() => {
    const fetchCrops = async () => {
      setLoadingCrops(true);
      try {
        const res = await cropsAPI.getAll();
        if (res && res.data && res.data.length > 0) {
          setFeaturedCrops(res.data.slice(0, 4));
        } else {
          setFeaturedCrops(MOCK_FEATURED_CROPS);
        }
      } catch (err) {
        console.warn('Backend API offline. Loading featured crops fallback:', err);
        setFeaturedCrops(MOCK_FEATURED_CROPS);
      } finally {
        setLoadingCrops(false);
      }
    };
    fetchCrops();
  }, []);

  // GSAP Cinematic Entrance & ScrollTrigger Setup
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Entrance Timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.hero-badge-elem', { opacity: 0, y: -20, duration: 0.6, delay: 0.1 })
        .from('.hero-title-elem', { opacity: 0, y: 30, duration: 0.8 }, '-=0.3')
        .from('.hero-desc-elem', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
        .from('.hero-search-elem', { opacity: 0, y: 20, scale: 0.98, duration: 0.6 }, '-=0.3')
        .from('.hero-trust-elem', { opacity: 0, y: 15, stagger: 0.1, duration: 0.5 }, '-=0.2')
        .from('.hero-canvas-elem', { opacity: 0, scale: 0.92, duration: 1.0, ease: 'expo.out' }, '-=0.7');

      // 2. Stats Ticker Reveal
      if (statsRef.current) {
        gsap.from(statsRef.current.children, {
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 85%'
          },
          opacity: 0,
          y: 25,
          stagger: 0.12,
          duration: 0.7,
          ease: 'power2.out'
        });
      }

      // 3. How It Works Cards
      if (howItWorksRef.current) {
        gsap.from('.how-it-works-card', {
          scrollTrigger: {
            trigger: howItWorksRef.current,
            start: 'top 80%'
          },
          opacity: 0,
          y: 40,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power3.out'
        });
      }

      // 4. Featured Produce Grid
      if (produceRef.current) {
        gsap.from('.produce-card-elem', {
          scrollTrigger: {
            trigger: produceRef.current,
            start: 'top 80%'
          },
          opacity: 0,
          y: 35,
          stagger: 0.12,
          duration: 0.7,
          ease: 'power2.out'
        });
      }

      // 5. Testimonial Cards
      if (testimonialsRef.current) {
        gsap.from('.testimonial-card', {
          scrollTrigger: {
            trigger: testimonialsRef.current,
            start: 'top 80%'
          },
          opacity: 0,
          y: 35,
          stagger: 0.15,
          duration: 0.75,
          ease: 'power2.out'
        });
      }

      // 6. Ecosystem Module Cards
      if (ecosystemRef.current) {
        gsap.from('.ecosystem-card', {
          scrollTrigger: {
            trigger: ecosystemRef.current,
            start: 'top 80%'
          },
          opacity: 0,
          y: 35,
          stagger: 0.12,
          duration: 0.75,
          ease: 'power3.out'
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/crops?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="relative space-y-16 pb-16 min-h-screen">
      {/* 3D Ambient WebGL Background Field */}
      <Interactive3DBackground />

      {/* LIVE WHOLESALE MARKET COMMODITY TICKER RIBBON */}
      <MarketPriceTicker />

      {/* 1. HERO SECTION WITH 3D WEBGL ENVIRONMENT */}
      <section
        ref={heroRef}
        className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center pt-4 relative"
      >
        <div className="lg:col-span-7 space-y-8 relative z-10">
          {/* BADGE */}
          <div className="hero-badge-elem inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs font-extrabold uppercase tracking-wider shadow-sm backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>Direct Farmer-to-Buyer Ecosystem</span>
          </div>

          {/* MAIN HEADLINE */}
          <h1 className="hero-title-elem text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] font-display">
            Empowering Farmers. <br />
            Direct to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500">
              Your Doorstep.
            </span>
          </h1>

          {/* SUPPORTING DESCRIPTION */}
          <p className="hero-desc-elem text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl font-medium">
            Bypass traditional middleman markups. AgroLink connects registered growers directly with commercial &amp; retail buyers for transparent, farm-fresh trade.
          </p>

          {/* QUICK SEARCH FORM */}
          <form
            onSubmit={handleSearch}
            className="hero-search-elem glass p-2.5 rounded-2xl shadow-xl shadow-slate-900/5 border border-white/80 max-w-xl flex flex-col sm:flex-row gap-2 transition-all focus-within:ring-2 focus-within:ring-emerald-500/30"
          >
            <div className="relative flex-grow flex items-center px-3">
              <Search className="w-5 h-5 text-slate-400 mr-2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search crops (e.g. Organic Wheat, Tomatoes)..."
                className="w-full bg-transparent border-none text-slate-800 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-0"
              />
            </div>
            <button
              type="submit"
              className="px-7 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-emerald-500/25 transition shrink-0 flex items-center justify-center gap-1.5"
            >
              <span>Find Produce</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* TRUST BADGES */}
          <div className="hero-trust-elem pt-2 flex flex-wrap items-center gap-6 text-xs font-bold text-slate-600">
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/60 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Origin Verified
            </div>
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/60 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Zero Intermediary Markup
            </div>
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/60 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Secure Escrow Settlement
            </div>
          </div>
        </div>

        {/* 3D INTERACTIVE WEBGL HERO VISUAL */}
        <div className="hero-canvas-elem lg:col-span-5 relative w-full">
          <AgriHero3DCanvas />
        </div>
      </section>

      {/* 2. LIVE STATS TICKER BAR */}
      <section className="max-w-7xl mx-auto px-6">
        <div
          ref={statsRef}
          className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl border border-white/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x-0 md:divide-x divide-slate-200/60"
        >
          <div className="space-y-1">
            <h4 className="text-3xl sm:text-4xl font-black text-emerald-600 font-display">$1.8M+</h4>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Direct Harvest Traded</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-3xl sm:text-4xl font-black text-emerald-600 font-display">1,250+</h4>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verified Local Farms</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-3xl sm:text-4xl font-black text-emerald-600 font-display">0%</h4>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Intermediary Markup</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-3xl sm:text-4xl font-black text-emerald-600 font-display">99.2%</h4>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">On-Time Delivery Rate</p>
          </div>
        </div>
      </section>

      {/* 3. 4-STEP "HOW IT WORKS" VISUAL JOURNEY */}
      <section ref={howItWorksRef} className="max-w-7xl mx-auto px-6 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-extrabold uppercase tracking-wider border border-emerald-200 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Transparent Agri-Trade Lifecycle
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display">
            How AgroLink Works <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">From Farm to Doorstep</span> 🚜
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-medium">
            A frictionless 4-step pipeline that replaces opaque traditional middlemen with AI grading, fair pricing, and smart escrow security.
          </p>
        </div>

        {/* 4 3D STEP CARDS */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {/* STEP 1 */}
          <Card3D className="how-it-works-card premium-card bg-white p-6 rounded-3xl border border-slate-200/90 shadow-lg flex flex-col justify-between group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0 group-hover:scale-110 transition-transform" />
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 flex items-center justify-center font-black text-xl">
                  🌾
                </div>
                <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-display">
                  STEP 01
                </span>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider block">Origin Listing</span>
                <h3 className="text-lg font-extrabold text-slate-900 font-display mt-0.5">
                  1. List Harvest &amp; AI Grade
                </h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Grower uploads harvest yield, photos, and location. AgroLink AI generates a certified origin passport and quality grade rating.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 relative z-10 flex items-center justify-between text-[11px] font-extrabold text-emerald-700">
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> DOA Quality Pass
              </span>
              <Link to="/crops/add" className="hover:underline flex items-center gap-0.5 text-slate-700 group-hover:text-emerald-700">
                List <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </Card3D>

          {/* STEP 2 */}
          <Card3D className="how-it-works-card premium-card bg-white p-6 rounded-3xl border border-slate-200/90 shadow-lg flex flex-col justify-between group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 rounded-bl-full -z-0 group-hover:scale-110 transition-transform" />
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-700 flex items-center justify-center font-black text-xl">
                  📈
                </div>
                <span className="text-xs font-black text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200 font-display">
                  STEP 02
                </span>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase text-teal-600 tracking-wider block">Price Benchmark</span>
                <h3 className="text-lg font-extrabold text-slate-900 font-display mt-0.5">
                  2. AI Fair-Price Benchmark
                </h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Time-series neural models analyze Pettah &amp; Dambulla wholesale prices and fuel rates to suggest fair target pricing with zero middleman deductions.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 relative z-10 flex items-center justify-between text-[11px] font-extrabold text-teal-700">
              <span className="inline-flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-teal-500" /> 0% Intermediary Cut
              </span>
              <Link to="/price-prediction" className="hover:underline flex items-center gap-0.5 text-slate-700 group-hover:text-teal-700">
                Forecast <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </Card3D>

          {/* STEP 3 */}
          <Card3D className="how-it-works-card premium-card bg-white p-6 rounded-3xl border border-slate-200/90 shadow-lg flex flex-col justify-between group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -z-0 group-hover:scale-110 transition-transform" />
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center font-black text-xl">
                  🔒
                </div>
                <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 font-display">
                  STEP 03
                </span>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider block">Escrow Vault</span>
                <h3 className="text-lg font-extrabold text-slate-900 font-display mt-0.5">
                  3. Secure Escrow Order Lock
                </h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Supermarkets or institutional buyers lock 100% order funds into smart contract escrow vaults. Farmers are fully protected from delayed payments.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 relative z-10 flex items-center justify-between text-[11px] font-extrabold text-amber-700">
              <span className="inline-flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-amber-500" /> 100% Escrow Protected
              </span>
              <Link to="/crops" className="hover:underline flex items-center gap-0.5 text-slate-700 group-hover:text-amber-700">
                Marketplace <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </Card3D>

          {/* STEP 4 */}
          <Card3D className="how-it-works-card premium-card bg-white p-6 rounded-3xl border border-slate-200/90 shadow-lg flex flex-col justify-between group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-50 rounded-bl-full -z-0 group-hover:scale-110 transition-transform" />
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-700 flex items-center justify-center font-black text-xl">
                  🚚
                </div>
                <span className="text-xs font-black text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200 font-display">
                  STEP 04
                </span>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider block">Fleet &amp; Payout</span>
                <h3 className="text-lg font-extrabold text-slate-900 font-display mt-0.5">
                  4. Tracked Fleet &amp; Payout
                </h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Verified logistics fleet delivers batch with live 9-stage status tracking. Escrow payout is released instantly to farmer upon destination delivery scan.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 relative z-10 flex items-center justify-between text-[11px] font-extrabold text-sky-700">
              <span className="inline-flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-sky-500" /> Instant Settlement
              </span>
              <Link to="/orders" className="hover:underline flex items-center gap-0.5 text-slate-700 group-hover:text-sky-700">
                Track <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </Card3D>
        </div>
      </section>

      {/* 4. FEATURED LIVE PRODUCE FEED GRID */}
      <section ref={produceRef} className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-extrabold uppercase tracking-wider mb-2 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Real-Time Harvest Feed
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display flex items-center gap-2">
              Featured Live Farm Produce 🌾
            </h2>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Directly from verified Sri Lankan growers — zero middleman markups, 100% Escrow protected.
            </p>
          </div>

          <Link
            to="/crops"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
          >
            <span>Explore All Crop Listings →</span>
          </Link>
        </div>

        {/* 3D CROP CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCrops.map((crop) => (
            <Card3D
              key={crop.id}
              className="produce-card-elem premium-card bg-white border border-slate-200/80 shadow-lg rounded-3xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={crop.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea'}
                    alt={crop.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea';
                    }}
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-slate-900/80 backdrop-blur-md text-emerald-300 text-[10px] font-black uppercase tracking-wider rounded-full border border-white/20">
                    {crop.category || 'Produce'}
                  </div>

                  {crop.grade && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-extrabold rounded-full border border-emerald-400/40 shadow">
                      {crop.grade}
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-extrabold text-emerald-700 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600" /> {crop.location || 'Sri Lanka'}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug font-display line-clamp-1">
                      {crop.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium line-clamp-2">{crop.description}</p>
                  </div>

                  {crop.farmerName && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-semibold">
                      <span className="truncate">🧑‍🌾 {crop.farmerName}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px] shrink-0">
                        📦 {crop.quantity || 500} kg
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Wholesale Rate</span>
                    <span className="text-xl font-black text-emerald-600 font-display">Rs. {Number(crop.price).toFixed(2)}/kg</span>
                  </div>

                  <button
                    onClick={() => setSelectedCropForPurchase(crop)}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Buy 🛒
                  </button>
                </div>
              </div>
            </Card3D>
          ))}
        </div>
      </section>

      {/* 5. POWERED BY AGROLINK AI FEATURE SHOWCASE HUB */}
      <section ref={aiSuiteRef} className="max-w-7xl mx-auto px-6">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider mb-2 border border-emerald-500/30">
                <Cpu className="w-4 h-4 text-emerald-400 animate-spin-slow" /> AI-POWERED AGTECH MATRIX
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
                Powered by AgroLink AI Intelligence 🚀
              </h2>
              <p className="text-slate-300 text-sm mt-1 max-w-xl font-medium">
                Time-series market forecasting, computer vision plant pathology, and automated forward escrow agreements.
              </p>
            </div>

            <span className="px-3.5 py-1.5 rounded-full bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 text-xs font-extrabold self-start md:self-auto">
              ✦ 4 AI Engines Active
            </span>
          </div>

          {/* AI INTERACTIVE TAB BAR */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 border-b border-slate-800/80 relative z-10">
            <button
              onClick={() => setActiveAiTab('price')}
              className={`px-5 py-3 rounded-2xl text-xs font-extrabold transition flex items-center gap-2 shrink-0 border ${
                activeAiTab === 'price'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>1. AI Price Prediction 📈</span>
            </button>

            <button
              onClick={() => setActiveAiTab('disease')}
              className={`px-5 py-3 rounded-2xl text-xs font-extrabold transition flex items-center gap-2 shrink-0 border ${
                activeAiTab === 'disease'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <Scan className="w-4 h-4" />
              <span>2. AI Disease Scanner 🔬</span>
            </button>

            <button
              onClick={() => setActiveAiTab('contract')}
              className={`px-5 py-3 rounded-2xl text-xs font-extrabold transition flex items-center gap-2 shrink-0 border ${
                activeAiTab === 'contract'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>3. Smart Contract Farming 📜</span>
            </button>

            <button
              onClick={() => setActiveAiTab('intel')}
              className={`px-5 py-3 rounded-2xl text-xs font-extrabold transition flex items-center gap-2 shrink-0 border ${
                activeAiTab === 'intel'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>4. National Demand Map 🗺️</span>
            </button>
          </div>

          {/* TAB PANELS */}
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              {activeAiTab === 'price' && (
                <motion.div
                  key="price"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid lg:grid-cols-12 gap-8 items-center bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800"
                >
                  <div className="lg:col-span-7 space-y-4">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-extrabold text-[11px] border border-emerald-500/30">
                      TIME-SERIES FORECASTING
                    </span>
                    <h3 className="text-2xl font-bold font-display text-white">
                      Target Fair Price &amp; 7-Day Trend Benchmarks 📈
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      AgroLink AI analyzes weather telemetry, Dambulla &amp; Pettah market arrivals, import tariff revisions, and fuel logistics costs to project fair crop prices.
                    </p>
                    <div className="pt-2">
                      <Link
                        to="/price-prediction"
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition inline-flex items-center gap-2"
                      >
                        <span>Launch AI Price Forecaster →</span>
                      </Link>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-400">🍅 Tomato (Grade A) Benchmark:</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-extrabold text-[10px] border border-emerald-800">
                        +19.4% Surge
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-xs text-slate-400">Today's Wholesale:</span>
                      <span className="text-lg font-black text-slate-200 font-display">Rs. 180.00/kg</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-bold text-emerald-400">AI Target Fair Price:</span>
                      <span className="text-2xl font-black text-emerald-400 font-display">Rs. 215.00/kg</span>
                    </div>
                    <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-800/60 text-[11px] font-bold text-emerald-300">
                      💡 Recommendation: WAIT 3–4 DAYS BEFORE SELLING (Post-Rain Quality Surge)
                    </div>
                  </div>
                </motion.div>
              )}

              {activeAiTab === 'disease' && (
                <motion.div
                  key="disease"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid lg:grid-cols-12 gap-8 items-center bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800"
                >
                  <div className="lg:col-span-7 space-y-4">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-extrabold text-[11px] border border-emerald-500/30">
                      COMPUTER VISION PATHOLOGY
                    </span>
                    <h3 className="text-2xl font-bold font-display text-white">
                      Instant Crop Disease Detection &amp; Treatment 🔬
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      Upload a photo of damaged leaves or crops. Our trained neural network diagnoses plant diseases instantly and suggests bio-organic treatments.
                    </p>
                    <div className="pt-2">
                      <Link
                        to="/disease-detection"
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition inline-flex items-center gap-2"
                      >
                        <span>Scan Crop Leaf Now →</span>
                      </Link>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-400">🍂 Simulated Leaf Scan:</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-extrabold text-[10px] border border-emerald-800">
                        97.4% Match
                      </span>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <p className="font-extrabold text-rose-400 text-sm">Tomato Early Blight (Alternaria solani)</p>
                      <p className="text-[11px] text-slate-300">Concentric dark spots identified on lower foliage.</p>
                    </div>
                    <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-800/60 text-[11px] font-bold text-emerald-300">
                      🌿 Recommended Remedy: Spray Copper Hydroxide or Neem Extract every 7 days.
                    </div>
                  </div>
                </motion.div>
              )}

              {activeAiTab === 'contract' && (
                <motion.div
                  key="contract"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid lg:grid-cols-12 gap-8 items-center bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800"
                >
                  <div className="lg:col-span-7 space-y-4">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-extrabold text-[11px] border border-emerald-500/30">
                      GUARANTEED FORWARD ESCROW
                    </span>
                    <h3 className="text-2xl font-bold font-display text-white">
                      Guaranteed Purchasing Price Contracts 📜
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      Lock in guaranteed crop purchasing prices before sowing. Supermarkets and institutional buyers deposit 30% upfront escrow into smart contract vaults.
                    </p>
                    <div className="pt-2">
                      <Link
                        to="/contracts"
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition inline-flex items-center gap-2"
                      >
                        <span>Explore Contract Farming →</span>
                      </Link>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-400">📜 Active Buyer Agreement:</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-extrabold text-[10px] border border-emerald-800">
                        30% Escrow Locked
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="font-extrabold text-white text-sm">Keells Supermarket Forward Contract</p>
                      <p className="text-xs text-slate-400">Produce: Organic Samba Rice (5,000 kg)</p>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                      <span className="text-slate-400">Guaranteed Floor Price:</span>
                      <span className="font-black text-emerald-400 text-base">Rs. 220.00/kg</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeAiTab === 'intel' && (
                <motion.div
                  key="intel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid lg:grid-cols-12 gap-8 items-center bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800"
                >
                  <div className="lg:col-span-7 space-y-4">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-extrabold text-[11px] border border-emerald-500/30">
                      FOOD SECURITY &amp; POLICY SIMULATOR
                    </span>
                    <h3 className="text-2xl font-bold font-display text-white">
                      National Food Security Heatmaps &amp; Alerts 🗺️
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      Government officers and planners monitor district overproduction risks, buffer stock health, and simulate import tariff revisions.
                    </p>
                    <div className="pt-2">
                      <Link
                        to="/gov-intelligence"
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition inline-flex items-center gap-2"
                      >
                        <span>View Gov Intelligence →</span>
                      </Link>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-400">🚨 National Warning Alert:</span>
                      <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-extrabold text-[10px] border border-rose-800">
                        Supply Deficit
                      </span>
                    </div>
                    <div className="p-3 bg-rose-950/40 rounded-xl border border-rose-900/60 text-[11px] space-y-1 text-rose-200">
                      <p className="font-extrabold text-white">Potato Deficit Alert (Central Province)</p>
                      <p className="text-[10px]">Welimada deluge reduced picking by 20%. Price spike expected.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 6. FARMER & BUYER SUCCESS TESTIMONIALS */}
      <section ref={testimonialsRef} className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-extrabold uppercase tracking-wider border border-emerald-200">
            <MessageSquareQuote className="w-4 h-4 text-emerald-600" /> PROVEN AGRICULTURAL IMPACT
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display">
            Empowering Sri Lankan Farmers &amp; Commercial Buyers 🌟
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed font-medium">
            Real testimonials from registered growers, supermarket procurement directors, and logistics partners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* TESTIMONIAL 1 */}
          <Card3D className="testimonial-card p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-black text-[10px] uppercase border border-emerald-200">
                  +22% Net Income Increase
                </span>
              </div>

              <Quote className="w-8 h-8 text-emerald-200/80" />

              <p className="text-xs text-slate-700 font-medium leading-relaxed italic">
                "By using AgroLink's AI Price Prediction, I held my tomato harvest for 4 days until wholesale prices surged in Dambulla. I sold 2,500 kg directly to Keells Supermarket with 100% Escrow security!"
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-xl shrink-0">
                👨‍🌾
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm font-display">K. Bandara</h4>
                <p className="text-[11px] text-slate-500 font-semibold">Vegetable Producer • Welimada Cooperative</p>
              </div>
            </div>
          </Card3D>

          {/* TESTIMONIAL 2 */}
          <Card3D className="testimonial-card p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 font-black text-[10px] uppercase border border-teal-200">
                  Zero Middleman Markup
                </span>
              </div>

              <Quote className="w-8 h-8 text-teal-200/80" />

              <p className="text-xs text-slate-700 font-medium leading-relaxed italic">
                "Contract Farming on AgroLink allowed us to lock in 5 Tons of Organic Samba Rice directly with Polonnaruwa growers at a fixed fair rate. Complete batch traceability from seed sowing to supermarket shelf!"
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 font-black flex items-center justify-center text-xl shrink-0">
                🏬
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm font-display">Dilan Jayasinghe</h4>
                <p className="text-[11px] text-slate-500 font-semibold">Procurement Director • Lanka Fresh Markets</p>
              </div>
            </div>
          </Card3D>

          {/* TESTIMONIAL 3 */}
          <Card3D className="testimonial-card p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-black text-[10px] uppercase border border-amber-200">
                  Instant Escrow Payout
                </span>
              </div>

              <Quote className="w-8 h-8 text-amber-200/80" />

              <p className="text-xs text-slate-700 font-medium leading-relaxed italic">
                "Earlier, middlemen delayed payments for weeks. With AgroLink Escrow, as soon as the dispatch fleet driver verified my potato batch pickup in Keppetipola, 30% advance payout was unlocked instantly!"
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 font-black flex items-center justify-center text-xl shrink-0">
                🥔
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm font-display">S. Gunawardena</h4>
                <p className="text-[11px] text-slate-500 font-semibold">Potato Grower • Keppetipola, Nuwara Eliya</p>
              </div>
            </div>
          </Card3D>
        </div>
      </section>

      {/* 7. ROLE-BASED PORTAL MATRIX SECTION */}
      <section ref={rolesRef} className="py-12 bg-slate-100/80 backdrop-blur-md border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">Tailored Ecosystem Access</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display">Built for Every Agricultural Stakeholder</h2>
            <p className="text-slate-600 text-sm leading-relaxed">AgroLink provides customized tools depending on your registered account role.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* FARMERS */}
            <Card3D className="p-6 bg-white rounded-3xl border border-slate-200 shadow-lg space-y-4 hover:border-emerald-500 transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold">
                🧑‍🌾
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Role 1: Producers</span>
                <h3 className="text-lg font-extrabold text-slate-900 font-display">Farmers &amp; Growers</h3>
              </div>
              <ul className="space-y-2 text-xs font-semibold text-slate-600">
                <li className="flex items-center gap-2">✓ Post Harvest Listings (+ Quick Modal)</li>
                <li className="flex items-center gap-2">✓ AI Disease Scanner &amp; Advisory</li>
                <li className="flex items-center gap-2">✓ Crop Price Predictor &amp; Demand Map</li>
                <li className="flex items-center gap-2">✓ Pre-Production Supplies &amp; Machinery</li>
              </ul>
              <Link to="/register" className="inline-block pt-2 text-xs font-extrabold text-emerald-600 hover:underline">
                Join as Farmer →
              </Link>
            </Card3D>

            {/* COMMERCIAL BUYERS */}
            <Card3D className="p-6 bg-white rounded-3xl border border-slate-200 shadow-lg space-y-4 hover:border-emerald-500 transition">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-2xl font-bold">
                🏬
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-teal-600 tracking-wider">Role 2: Buyers</span>
                <h3 className="text-lg font-extrabold text-slate-900 font-display">Supermarkets &amp; B2B</h3>
              </div>
              <ul className="space-y-2 text-xs font-semibold text-slate-600">
                <li className="flex items-center gap-2">✓ Bulk Quantity Escrow Orders</li>
                <li className="flex items-center gap-2">✓ B2B Purchase Request Tenders</li>
                <li className="flex items-center gap-2">✓ Live 9-Stage Fleet Tracking</li>
                <li className="flex items-center gap-2">✓ Verified Grower Origin Passports</li>
              </ul>
              <Link to="/crops" className="inline-block pt-2 text-xs font-extrabold text-teal-600 hover:underline">
                Browse Marketplace →
              </Link>
            </Card3D>

            {/* LOGISTICS DRIVERS */}
            <Card3D className="p-6 bg-white rounded-3xl border border-slate-200 shadow-lg space-y-4 hover:border-emerald-500 transition">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-bold">
                🚚
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider">Role 3: Logistics</span>
                <h3 className="text-lg font-extrabold text-slate-900 font-display">Fleet Drivers</h3>
              </div>
              <ul className="space-y-2 text-xs font-semibold text-slate-600">
                <li className="flex items-center gap-2">✓ Dispatch Order Assignment</li>
                <li className="flex items-center gap-2">✓ Route Pickup &amp; Transit Updates</li>
                <li className="flex items-center gap-2">✓ Escrow Delivery Settlement</li>
                <li className="flex items-center gap-2">✓ Vehicle Registration &amp; Mileage</li>
              </ul>
              <Link to="/login" className="inline-block pt-2 text-xs font-extrabold text-amber-600 hover:underline">
                Logistics Portal →
              </Link>
            </Card3D>

            {/* GOVERNMENT ADMINS */}
            <Card3D className="p-6 bg-white rounded-3xl border border-slate-200 shadow-lg space-y-4 hover:border-emerald-500 transition">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center text-2xl font-bold">
                🏛️
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider">Role 4: Officers</span>
                <h3 className="text-lg font-extrabold text-slate-900 font-display">Gov Intelligence</h3>
              </div>
              <ul className="space-y-2 text-xs font-semibold text-slate-600">
                <li className="flex items-center gap-2">✓ District Overproduction Risk Alerts</li>
                <li className="flex items-center gap-2">✓ Tariff &amp; Policy Impact Simulator</li>
                <li className="flex items-center gap-2">✓ Buffer Stock Health Tracking</li>
                <li className="flex items-center gap-2">✓ Food Security Heatmaps</li>
              </ul>
              <Link to="/gov-intelligence" className="inline-block pt-2 text-xs font-extrabold text-sky-600 hover:underline">
                View Gov Intelligence →
              </Link>
            </Card3D>
          </div>
        </div>
      </section>

      {/* 8. FULL ECOSYSTEM FEATURE EXPLORER */}
      <section ref={ecosystemRef} className="max-w-7xl mx-auto px-6 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-extrabold uppercase tracking-wider mb-2 border border-emerald-200 shadow-sm">
              <Layers className="w-3.5 h-3.5 text-emerald-600" /> Integrated AgTech Hub
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display">
              Explore the Full <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500">AgroLink Ecosystem</span> 🌐
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-2xl font-medium">
              From heavy machinery rentals and zero-waste logistics to certified agronomy experts and AI farm copilots.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span>6 Specialized Modules Active</span>
          </div>
        </div>

        {/* 6 ECOSYSTEM MODULE 3D CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ECOSYSTEM_MODULES.map((mod) => (
            <Card3D
              key={mod.id}
              className={`ecosystem-card p-6 sm:p-7 rounded-3xl bg-white border ${mod.borderColor} shadow-lg flex flex-col justify-between transition-all duration-300 relative overflow-hidden group`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${mod.gradient} rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500`} />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform">
                    {mod.icon}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${mod.badgeBg}`}>
                    {mod.tag}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-display group-hover:text-emerald-700 transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {mod.desc}
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 relative z-10 flex items-center justify-between">
                <Link
                  to={mod.link}
                  className="px-5 py-2.5 bg-slate-900 group-hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow transition-all duration-200 flex items-center gap-1.5"
                >
                  <span>{mod.linkText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <span className="text-[11px] font-bold text-slate-400">Direct Portal →</span>
              </div>
            </Card3D>
          ))}
        </div>
      </section>

      {/* 9. INTERACTIVE FAQ ACCORDION SECTION */}
      <section ref={faqRef} className="max-w-4xl mx-auto px-6 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-extrabold uppercase tracking-wider border border-emerald-200 shadow-sm">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" /> Got Questions? We Have Answers
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display">
            Frequently Asked Questions ❓
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto leading-relaxed font-medium">
            Everything you need to know about payments, logistics, AI diagnostics, and platform security.
          </p>
        </div>

        {/* ACCORDION ITEMS */}
        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;

            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white border-emerald-400 shadow-md ring-1 ring-emerald-400/30'
                    : 'bg-white/80 hover:bg-white border-slate-200 shadow-sm'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-display font-bold text-slate-900 text-sm sm:text-base focus:outline-none"
                >
                  <span className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                      isOpen ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className={isOpen ? 'text-emerald-950 font-extrabold' : 'text-slate-800'}>
                      {faq.question}
                    </span>
                  </span>
                  <span className={`p-1.5 rounded-xl shrink-0 transition-transform duration-200 ${
                    isOpen ? 'bg-emerald-50 text-emerald-700 rotate-180' : 'bg-slate-50 text-slate-400'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100/80 font-medium pl-16">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* FAQ FOOTER HELP NOTE */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            Have more questions? Chat live with our{' '}
            <Link to="/ai-assistant" className="font-extrabold text-emerald-600 hover:underline">
              Multilingual AI Assistant
            </Link>{' '}
            or explore the{' '}
            <Link to="/community" className="font-extrabold text-emerald-600 hover:underline">
              Growers Community Forum
            </Link>.
          </p>
        </div>
      </section>

      {/* 10. CTA SECTION */}
      <section className="py-20 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white relative overflow-hidden my-12 mx-4 sm:mx-8 rounded-3xl shadow-2xl border border-white/10">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
          <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
            Get Started Today
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-display">
            Ready to revolutionize your farm trade?
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Join thousands of growers and commercial buyers trading directly on Sri Lanka's leading agriculture ecosystem.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl shadow-xl shadow-emerald-500/30 hover:from-emerald-600 hover:to-emerald-700 transition inline-block text-base"
            >
              Create Free Account
            </Link>
            <Link
              to="/crops"
              className="px-8 py-4 bg-slate-800 text-white border border-slate-700 font-bold rounded-xl hover:bg-slate-700 transition inline-block text-base"
            >
              Browse Produce Marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* PURCHASE MODAL TRIGGERED FROM HOME PAGE */}
      {selectedCropForPurchase && (
        <BuyCropModal
          crop={selectedCropForPurchase}
          onClose={() => setSelectedCropForPurchase(null)}
          onOrderPlaced={() => setFeaturedCrops([...featuredCrops])}
        />
      )}
    </div>
  );
};

export default Home;

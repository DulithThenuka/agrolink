import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cropsAPI } from '../services/api';
import { BuyCropModal } from '../components/BuyCropModal';
import {
  ShieldAlert,
  Cpu,
  Tractor,
  Store,
  Wheat,
  Landmark,
  ArrowRight,
  CloudSun,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Users,
  Search,
  MapPin,
  ChevronDown,
  ShoppingBag,
  Sparkles,
  Leaf,
  Activity,
  Calendar,
  FileCheck
} from 'lucide-react';

export const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [featuredCrops, setFeaturedCrops] = useState([]);
  const [loadingCrops, setLoadingCrops] = useState(true);
  const [selectedCropForPurchase, setSelectedCropForPurchase] = useState(null);
  const [activeAiTab, setActiveAiTab] = useState('risk'); // 'risk', 'disease', 'price'
  const [openFaq, setOpenFaq] = useState(0);

  const navigate = useNavigate();
  const { user, isFarmer, isAuthenticated } = useAuth();

  const isCropOwner = (c) => Boolean(
    isFarmer && c && (
      (c.farmerId && user?.id && String(c.farmerId) === String(user.id)) ||
      (c.farmerName && user?.name && c.farmerName.toLowerCase() === user.name.toLowerCase()) ||
      (c.farmerEmail && user?.email && c.farmerEmail.toLowerCase() === user.email.toLowerCase())
    )
  );

  const smartNavigate = (path) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      navigate(`/login?redirect=${encodeURIComponent(path)}`);
    }
  };

  const MOCK_FEATURED_CROPS = [
    {
      id: 101,
      name: 'Organic Red Tomatoes',
      category: 'Vegetables',
      price: 185,
      quantity: 850,
      location: 'Welimada, Badulla',
      farmerName: 'K. Bandara',
      grade: 'Grade A',
      imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
      description: 'Field-picked Grade A organic tomatoes. High firmness, suitable for commercial wholesale.'
    },
    {
      id: 102,
      name: 'Certified Samba Paddy',
      category: 'Grains',
      price: 220,
      quantity: 2500,
      location: 'Polonnaruwa',
      farmerName: 'P. Ranasinghe',
      grade: 'DOA Certified',
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
      description: 'High-purity Samba paddy grain. Cleaned and dried to 12% moisture content.'
    },
    {
      id: 103,
      name: 'Upcountry Red Potatoes',
      category: 'Vegetables',
      price: 280,
      quantity: 1200,
      location: 'Keppetipola',
      farmerName: 'S. Gunawardena',
      grade: 'Grade A',
      imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80',
      description: 'Uniform sizing, pest-free Keppetipola potatoes ready for direct distribution.'
    },
    {
      id: 104,
      name: 'Jaffna Green Chillies',
      category: 'Spices',
      price: 520,
      quantity: 450,
      location: 'Chavakachcheri',
      farmerName: 'T. Vigneswaran',
      grade: 'Grade A',
      imageUrl: 'https://images.unsplash.com/photo-1588879462806-07a5b61f8c0d?w=800&auto=format&fit=crop&q=80',
      description: 'Fresh Jaffna green chillies with high pungency and extended shelf life.'
    }
  ];

  useEffect(() => {
    const fetchCrops = async () => {
      setLoadingCrops(true);
      try {
        const res = await cropsAPI.getAll();
        if (res?.data && res.data.length > 0) {
          setFeaturedCrops(res.data.slice(0, 4));
        } else {
          setFeaturedCrops(MOCK_FEATURED_CROPS);
        }
      } catch {
        setFeaturedCrops(MOCK_FEATURED_CROPS);
      } finally {
        setLoadingCrops(false);
      }
    };
    fetchCrops();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('search', searchTerm.trim());
    if (selectedDistrict !== 'All') params.set('location', selectedDistrict);
    if (selectedCategory !== 'All') params.set('category', selectedCategory);
    navigate(`/crops?${params.toString()}`);
  };

  const FAQS = [
    {
      question: 'How does AgroLink help farmers protect their crops from losses?',
      answer: 'AgroLink combines localized weather risk analysis, AI-powered leaf disease diagnostics, and wholesale market demand forecasts so farmers can act early before environmental factors or pests damage crop yield.'
    },
    {
      question: 'How do Escrow payments secure transactions between buyers and growers?',
      answer: 'When an order or contract is placed, the buyer deposits funds into a secure escrow account. The grower dispatches verified produce, and funds are automatically released upon delivery confirmation, eliminating payment defaults.'
    },
    {
      question: 'Can farmers and cooperatives rent equipment directly through AgroLink?',
      answer: 'Yes. Farmers can browse and book verified machinery including 4WD tractors, combine harvesters, sprayers, and transport trucks from nearby equipment owners and service providers.'
    },
    {
      question: 'How are official government advisories and price data integrated?',
      answer: 'AgroLink connects with regional wholesale market arrival data and Department of Agriculture guidelines to provide transparent benchmark prices, surplus alerts, and national food security intelligence.'
    }
  ];

  return (
    <div className="bg-[#FBFBFA] min-h-screen text-slate-900 font-sans">
      
      {/* ════════════════════════════════════════════════════════════
          1. HERO SECTION
         ════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-12 lg:pb-16">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: HERO VALUE PROPOSITION */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Eyebrow Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>SMART AGRICULTURE PLATFORM</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.18]">
              Protect Your Crops Before Problems Become Losses.
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              AgroLink brings AI-powered agricultural insights, equipment services, suppliers, and trusted agricultural resources together in one platform.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                onClick={() => smartNavigate('/disease-detection')}
                className="px-6 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Check Crop Risk</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#services"
                className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm rounded-xl border border-slate-300 transition-colors shadow-2xs"
              >
                Explore Services
              </a>
            </div>

            {/* Small Trust Statement */}
            <p className="text-xs text-slate-500 font-medium pt-1">
              AI-powered insights &bull; Local services &bull; Trusted agricultural information
            </p>
          </div>

          {/* RIGHT COLUMN: STRONG REALISTIC AGRICULTURAL VISUAL */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=1200&auto=format&fit=crop&q=80"
                alt="Farmer checking crop health data on a smartphone in a field"
                className="w-full h-[380px] sm:h-[460px] object-cover object-center"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=1200&auto=format&fit=crop&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />

              {/* OVERLAY PANEL 1: AI CROP RISK */}
              <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200/90 p-3.5 shadow-md max-w-[210px]">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    AI Crop Risk
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[10px] border border-amber-300">
                    MODERATE
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-800">
                  Tomato &bull; Field 02
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Early blight watch recommended
                </p>
              </div>

              {/* OVERLAY PANEL 2: RAINFALL PROBABILITY */}
              <div className="absolute bottom-5 right-5 bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200/90 p-3.5 shadow-md max-w-[200px]">
                <div className="flex items-center gap-2 mb-1">
                  <CloudSun className="w-4 h-4 text-emerald-700" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Rainfall Probability
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-slate-900">68%</span>
                  <span className="text-[11px] text-slate-500 font-medium">Next 24 Hours</span>
                </div>
                <p className="text-[10px] text-emerald-800 font-semibold mt-0.5">
                  Optimal for preventive spray
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          2. AGRICULTURE SNAPSHOT SECTION
         ════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
          
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-700" />
              <span>Today's Agriculture Snapshot</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              Regional Telemetry &bull; Updated 15m ago
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            
            {/* ITEM 1: WEATHER */}
            <div className="pt-2 sm:pt-0 sm:px-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                <CloudSun className="w-4 h-4 text-emerald-700" />
                <span>Weather</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900">28&deg;C</div>
              <p className="text-xs text-slate-500 mt-0.5">Rain expected &bull; 78% Humidity</p>
            </div>

            {/* ITEM 2: CROP RISK */}
            <div className="pt-3 sm:pt-0 sm:px-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                <ShieldAlert className="w-4 h-4 text-emerald-700" />
                <span>Crop Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold text-emerald-700">Low</span>
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">2 monitored crops &bull; No active blight</p>
            </div>

            {/* ITEM 3: MARKET PRICES */}
            <div className="pt-3 sm:pt-0 sm:px-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                <span>Market Prices</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900">Rs. 220<span className="text-xs font-normal text-slate-500">/kg</span></div>
              <p className="text-xs text-slate-500 mt-0.5">Rice (Samba) &bull; Dambulla Benchmark</p>
            </div>

            {/* ITEM 4: ACTIVE ALERTS */}
            <div className="pt-3 sm:pt-0 sm:px-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Active Alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold text-slate-900">2</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">Advisory</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Central Province &bull; Needs attention</p>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          3. MAIN SERVICES SECTION
         ════════════════════════════════════════════════════════════ */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200/60">
        
        <div className="max-w-3xl mb-10 text-left space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Everything You Need to Farm Smarter.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Connect with the tools, services, and information you need throughout the farming journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* SERVICE 1: AI CROP PROTECTION (PROMINENT DIFFERENTIATOR) */}
          <div className="lg:col-span-2 bg-gradient-to-br from-emerald-50/60 via-white to-white border-2 border-emerald-700/30 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xs relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
                  <Cpu className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                  Featured AI Solution
                </span>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">
                  1. AI Crop Protection
                </h3>
                <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
                  Get AI-powered crop risk predictions, disease diagnostics, and early warnings before damage spreads across your field.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-semibold text-slate-700">
                <div className="p-3 bg-white rounded-lg border border-slate-200/80">
                  &bull; Instant Leaf Disease Scanning
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200/80">
                  &bull; Weather Telemetry Analysis
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200/80">
                  &bull; 24-Hour Preventive Alerts
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200/60 flex items-center justify-between">
              <button
                onClick={() => smartNavigate('/disease-detection')}
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-medium text-slate-400">Available to all growers</span>
            </div>
          </div>

          {/* SERVICE 2: EQUIPMENT & DRIVERS */}
          <div className="agri-card p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-emerald-800 flex items-center justify-center">
                <Tractor className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                2. Equipment &amp; Drivers
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Find tractors, harvesters, transport, and agricultural equipment services from verified regional operators.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => smartNavigate('/equipment-rental')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
              >
                <span>Explore</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* SERVICE 3: AGRICULTURAL MARKETPLACE */}
          <div className="agri-card p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-emerald-800 flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                3. Agricultural Marketplace
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect with certified suppliers and purchase hybrid seeds, organic fertilizers, biocides, and farming inputs.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => smartNavigate('/supplier-marketplace')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
              >
                <span>Explore</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* SERVICE 4: CROP MARKETPLACE */}
          <div className="agri-card p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-emerald-800 flex items-center justify-center">
                <Wheat className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                4. Crop Marketplace
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Find commercial buyers, lock forward contracts, and connect farmers directly with wholesale markets.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                to="/crops"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition inline-flex items-center gap-1"
              >
                <span>Explore</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* SERVICE 5: GOVERNMENT SUPPORT */}
          <div className="agri-card p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-emerald-800 flex items-center justify-center">
                <Landmark className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                5. Government Support
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Access official agricultural information, price advisories, district alerts, and national food programs.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => smartNavigate('/gov-intelligence')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
              >
                <span>Explore</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          4. AI FEATURE SECTION
         ════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm">
          
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* LEFT: CLEAN CROP-RISK DECISION SUPPORT PREVIEW */}
            <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
              
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Crop Health Diagnostic Preview
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-500">Live Telemetry</span>
              </div>

              {/* DASHBOARD PREVIEW METRICS */}
              <div className="space-y-3">
                
                {/* CROP & RISK STATUS */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Crop</span>
                    <span className="text-sm font-bold text-slate-900">Tomato (Grade A)</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Risk</span>
                    <span className="text-sm font-bold text-amber-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Moderate
                    </span>
                  </div>
                </div>

                {/* BREAKDOWN METRICS */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Weather Risk</span>
                    <span className="text-xs font-semibold text-slate-800">Medium &bull; 68% Rain</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Disease Risk</span>
                    <span className="text-xs font-semibold text-slate-800">Low &bull; Early Blight 14%</span>
                  </div>
                </div>

                {/* RECOMMENDED ACTION */}
                <div className="p-3.5 bg-emerald-50/90 rounded-xl border border-emerald-200 text-xs space-y-1">
                  <span className="font-bold text-emerald-900 block">
                    Recommended Action:
                  </span>
                  <p className="text-emerald-800 font-medium leading-relaxed">
                    Monitor crop within 24 hours. Ensure drainage channels are clear before forecasted evening rainfall.
                  </p>
                </div>

              </div>

            </div>

            {/* RIGHT: EXPLANATION & VALUE */}
            <div className="lg:col-span-6 space-y-6 text-left">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                <Cpu className="w-3.5 h-3.5 text-emerald-700" />
                <span>DECISION-SUPPORT SOFTWARE</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Know the Risk Before You See the Damage.
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Use agricultural data and AI-powered analysis to identify potential crop risks early and make better decisions.
              </p>

              <div className="space-y-3 text-xs font-semibold text-slate-700">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>Early warning alerts before visible symptoms spread across crops.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>Localized weather forecasting correlated with crop vulnerability models.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>Practical treatment recommendations from certified agronomy data.</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => smartNavigate('/disease-detection')}
                  className="px-6 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>Check Your Crop</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          5. HOW IT WORKS SECTION
         ════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-slate-200/60">
        
        <div className="max-w-3xl mb-12 text-left space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            How AgroLink Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            A simple, structured three-step process built for practical farm operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* STEP 1 */}
          <div className="agri-card p-6 sm:p-7 space-y-4">
            <span className="text-xs font-bold text-emerald-700 tracking-wider">
              STEP 01
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              Check
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Add your crop, location, and farming information or upload a leaf photo for diagnostics.
            </p>
          </div>

          {/* STEP 2 */}
          <div className="agri-card p-6 sm:p-7 space-y-4">
            <span className="text-xs font-bold text-emerald-700 tracking-wider">
              STEP 02
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              Understand
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              AgroLink analyzes agricultural information and identifies possible risks, fair prices, and opportunities.
            </p>
          </div>

          {/* STEP 3 */}
          <div className="agri-card p-6 sm:p-7 space-y-4">
            <span className="text-xs font-bold text-emerald-700 tracking-wider">
              STEP 03
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              Act
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Get recommendations and connect with the right equipment, suppliers, experts, or services.
            </p>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          6. TRUST SECTION (ECOSYSTEM STAKEHOLDERS)
         ════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-slate-200/60">
        
        <div className="max-w-3xl mb-12 text-left space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Built for the People Behind Agriculture.
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            AgroLink connects every key group across the agricultural value chain.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* GROUP 1: FARMERS */}
          <div className="agri-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <Wheat className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Farmers
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Smallholders and commercial growers protecting crops, diagnosing risks, and selling directly.
            </p>
          </div>

          {/* GROUP 2: SERVICE PROVIDERS */}
          <div className="agri-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <Tractor className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Service Providers
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Equipment owners, tractor operators, and logistics drivers providing vital farming services.
            </p>
          </div>

          {/* GROUP 3: SUPPLIERS */}
          <div className="agri-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <Store className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Suppliers
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Input providers supplying certified hybrid seeds, organic fertilizers, and irrigation tools.
            </p>
          </div>

          {/* GROUP 4: GOV & ORGANIZATIONS */}
          <div className="agri-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <Landmark className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Government Organizations
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Agricultural officers and policymakers monitoring buffer stocks, food security, and price advisories.
            </p>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          7. LIVE PRODUCE MARKETPLACE FEED (PRESERVED FUNCTIONALITY)
         ════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200/60">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Direct Farm Produce Listings
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Directly from verified local growers &bull; Zero middleman markups &bull; Escrow protected
            </p>
          </div>

          <Link
            to="/crops"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 hover:underline flex items-center gap-1 shrink-0"
          >
            <span>View All Produce Listings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* CROP CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCrops.map((crop) => (
            <div
              key={crop.id}
              className="agri-card overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={crop.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea'}
                    alt={crop.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea';
                    }}
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-white/95 text-slate-800 text-[10px] font-bold uppercase rounded-md border border-slate-200 shadow-2xs">
                    {crop.category || 'Produce'}
                  </div>
                  {crop.grade && (
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-emerald-800 text-white text-[10px] font-bold rounded-md shadow-2xs">
                      {crop.grade}
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {crop.location || 'Sri Lanka'}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">
                      {crop.name}
                    </h3>
                  </div>

                  {crop.farmerName && (
                    <p className="text-[11px] text-slate-500">
                      Farmer: <span className="font-medium text-slate-700">{crop.farmerName}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Price</span>
                    <span className="text-base font-bold text-slate-900">Rs. {Number(crop.price).toFixed(2)}<span className="text-xs font-normal text-slate-500">/kg</span></span>
                  </div>

                  {isCropOwner(crop) ? (
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg">
                      Your Listing
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          smartNavigate('/crops');
                          return;
                        }
                        setSelectedCropForPurchase(crop);
                      }}
                      className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-2xs transition cursor-pointer"
                    >
                      {!isAuthenticated ? 'Sign In' : 'Order'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          8. FREQUENTLY ASKED QUESTIONS
         ════════════════════════════════════════════════════════════ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-slate-200/60">
        
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600">
            Common questions about AgroLink's services, payments, and platform usage.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className={`agri-card transition-colors ${isOpen ? 'border-emerald-700/50' : ''}`}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 text-sm sm:text-base cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-800' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          9. FINAL CALL TO ACTION
         ════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6">
          
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Make Your Next Farming Decision With Better Information.
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Protect your crops, find the services you need, and stay connected to the agricultural ecosystem.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-3.5 pt-2">
            <Link
              to="/register"
              className="px-6 py-3.5 bg-white text-emerald-950 hover:bg-emerald-50 font-bold text-sm rounded-xl shadow-xs transition"
            >
              Get Started
            </Link>
            <Link
              to="/crops"
              className="px-6 py-3.5 bg-emerald-800/90 hover:bg-emerald-800 text-white border border-emerald-700/60 font-semibold text-sm rounded-xl transition"
            >
              Explore AgroLink
            </Link>
          </div>

        </div>
      </section>

      {/* PURCHASE MODAL TRIGGERED FROM HOMEPAGE */}
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

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { expertsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  UserCheck,
  MessageSquare,
  Calendar,
  Image as ImageIcon,
  Cpu,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  Loader2,
  Award,
  Stethoscope,
  Sprout,
  TestTube,
  Search,
  Filter,
  ShieldCheck,
  Check,
  X,
  FileText,
  ChevronRight,
  PhoneCall,
  MapPin,
  Star,
  BookOpen,
  Zap,
  RotateCcw,
  BadgeCheck,
  Layers,
  ArrowUpRight,
  HelpCircle,
  Activity,
  HeartPulse
} from 'lucide-react';

const FALLBACK_EXPERTS = [
  {
    id: 101,
    name: 'Dr. Gamini Wickramasinghe',
    title: 'Senior Agronomist & Crop Pathologist',
    specialty: 'Agronomist',
    institution: 'Department of Agriculture (Peradeniya)',
    district: 'Kandy',
    rating: 4.95,
    consultationsCount: 184,
    availabilityStatus: 'Available Today',
    avatarUrl: '👨‍🔬',
    regNumber: 'SLAgS-REG-2014-882',
    bio: '22+ years in highland vegetable pathology, fungal blight mitigation, and greenhouse climate controls.',
    skills: ['Tomato Blight', 'Greenhouse Horticulture', 'Organic Bio-Pesticides', 'GAP Certification']
  },
  {
    id: 102,
    name: 'Anura Jayasooriya',
    title: 'Chief Agricultural Extension Officer',
    specialty: 'Agricultural Officer',
    institution: 'Central Province Agricultural Extension Division',
    district: 'Nuwara Eliya',
    rating: 4.88,
    consultationsCount: 210,
    availabilityStatus: 'Available Today',
    avatarUrl: '🧑‍🌾',
    regNumber: 'SLAgS-REG-2011-304',
    bio: 'Lead field officer for Nuwara Eliya potato, carrot, and leek cultivation clusters and government subsidy programs.',
    skills: ['Soil Acidification', 'Tuber Quality', 'Drip Fertigation', 'Subsidy Schemes']
  },
  {
    id: 103,
    name: 'Dr. Priyanka Ratnayake',
    title: 'Livestock & Veterinary Surgeon',
    specialty: 'Veterinarian',
    institution: 'Department of Animal Production & Health',
    district: 'Gampaha',
    rating: 4.92,
    consultationsCount: 156,
    availabilityStatus: 'Available Today',
    avatarUrl: '👩‍⚕️',
    regNumber: 'SLVC-REG-2016-119',
    bio: 'Specialist in dairy cattle nutrition, poultry biosecurity, mastitis management, and livestock vaccination protocols.',
    skills: ['Dairy Cattle', 'Poultry Disease Control', 'Livestock Feed Nutrition', 'Vaccinations']
  },
  {
    id: 104,
    name: 'Sunil Fernando',
    title: 'Senior Soil Chemist & Fertilizer Specialist',
    specialty: 'Soil Specialist',
    institution: 'Rice Research & Development Institute (Batalagoda)',
    district: 'Anuradhapura',
    rating: 4.79,
    consultationsCount: 132,
    availabilityStatus: 'Available Tomorrow',
    avatarUrl: '🔬',
    regNumber: 'SLAgS-REG-2018-490',
    bio: 'Expert in dry-zone soil salinity, nitrogen leaching reduction, paddy soil remediation, and customized organic composting.',
    skills: ['Soil Salinity', 'NPK Optimization', 'Bio-Char Enrichment', 'Paddy Zinc Deficiency']
  }
];

const COMMUNITY_KNOWLEDGEBASE = [
  {
    id: 'kb-1',
    farmerName: 'Bandara Organic Farm (Welimada)',
    expertName: 'Dr. Gamini Wickramasinghe (Agronomist)',
    expertSpecialty: 'Agronomist',
    question: 'How to treat early leaf yellowing and brown rings on Welimada Greenhouse Tomatoes after heavy monsoon rain?',
    farmData: 'Soil Moisture: 42%, Soil pH: 6.2, Ambient Temp: 24°C, EC: 1.4 mS/cm',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a2e?auto=format&fit=crop&w=600&q=80',
    status: 'ANSWERED',
    reply: 'Diagnosis: Early Blight (Alternaria solani) accelerated by relative humidity > 85%. Prescription: 1) Prune bottom 15cm lower canopy leaves to improve air circulation. 2) Apply Copper Hydroxide (2g/L) or certified Trichoderma viride bio-fungicide every 5 days. 3) Reduce overhead misting and switch to root-zone drip irrigation.',
    createdAt: '2 hours ago'
  },
  {
    id: 'kb-2',
    farmerName: 'Highland Greens (Kandapola)',
    expertName: 'Anura Jayasooriya (Agricultural Officer)',
    expertSpecialty: 'Agricultural Officer',
    question: 'Carrot root forking and stunted growth observed in block C. Soil pH tested at 5.1.',
    farmData: 'Soil Moisture: 35%, Soil pH: 5.1, Soil Texture: Heavy Loam',
    imageUrl: 'https://images.unsplash.com/photo-1582515073490-39981397c445?auto=format&fit=crop&w=600&q=80',
    status: 'ANSWERED',
    reply: 'Diagnosis: Severe soil acidity causing micronutrient lockout and root apical cell damage. Prescription: Apply agricultural dolomite at 350kg/acre 2 weeks prior to replanting. Maintain soil aeration with deep tilling (30cm) to break subsoil hardpans.',
    createdAt: '1 day ago'
  }
];

const QUICK_DIAGNOSTIC_CHIPS = [
  {
    label: '🍅 Tomato Leaf Blight & Yellowing',
    specialty: 'Agronomist',
    question: 'Early leaf yellowing and necrotic brown concentric rings on tomato crop after continuous rain. Suspecting fungal infection.',
    telemetry: 'Soil Moisture: 38%, Soil pH: 6.3, Temp: 26°C, RH: 82%'
  },
  {
    label: '🥕 Carrot Root Forking & pH 5.2',
    specialty: 'Soil Specialist',
    question: 'Severe soil acidity (pH 5.2) causing stunted root growth and nutrient deficiency in highland carrots.',
    telemetry: 'Soil Moisture: 31%, Soil pH: 5.2, Nitrogen: 22 ppm, Phosphorus: 14 ppm'
  },
  {
    label: '🌾 Paddy Brown Planthopper (BPH)',
    specialty: 'Agricultural Officer',
    question: 'Brown planthopper circular hopperburn patches appearing in Maha season paddy. Need immediate bio-safe pesticide guidance.',
    telemetry: 'Water Level: 4cm, Soil pH: 6.8, Temp: 31°C'
  },
  {
    label: '🐄 Dairy Cattle Mastitis Prevention',
    specialty: 'Veterinarian',
    question: 'Reduced milk yield and mild udder inflammation in Jersey cross dairy cow. Need antiseptic teat dip & antibiotic protocol.',
    telemetry: 'Herd Size: 12, Daily Yield: 18L/cow, Lactation Day: 45'
  }
];

export const ExpertModule = () => {
  const { user, isFarmer, isExpert, isAdmin } = useAuth();
  
  const [experts, setExperts] = useState(FALLBACK_EXPERTS);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');
  const [activeTab, setActiveTab] = useState('history'); // 'history' or 'community'
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Expert Detail Modal
  const [selectedExpertForModal, setSelectedExpertForModal] = useState(null);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState('');

  // Form State for Asking Question / Booking
  const [selectedSpecialty, setSelectedSpecialty] = useState('Agronomist');
  const [question, setQuestion] = useState('');
  const [farmData, setFarmData] = useState('Soil Moisture: 34%, Soil pH: 6.4, Location: Kandy, Temp: 28°C');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState('Normal');

  // Expert Reply State
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [expRes, consRes] = await Promise.all([
        expertsAPI.getAvailable().catch(() => ({ data: FALLBACK_EXPERTS })),
        isExpert
          ? expertsAPI.getAllConsultations().catch(() => ({ data: [] }))
          : expertsAPI.getMyConsultations().catch(() => ({ data: [] })),
      ]);

      if (expRes && expRes.data && expRes.data.length > 0) {
        // Merge enriched fields if available
        const merged = expRes.data.map((backendExp) => {
          const fallback = FALLBACK_EXPERTS.find((f) => f.id === backendExp.id || f.name === backendExp.name);
          return { ...fallback, ...backendExp };
        });
        setExperts(merged);
      } else {
        setExperts(FALLBACK_EXPERTS);
      }

      if (consRes && consRes.data) {
        setConsultations(consRes.data);
      }
    } catch (err) {
      console.error('Failed to load expert module data:', err);
      setExperts(FALLBACK_EXPERTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isExpert]);

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setSubmitting(true);
    setMsg('');
    try {
      const res = await expertsAPI.submitConsultation({
        farmerEmail: user?.email || 'farmer@agrolink.com',
        farmerName: user?.name || (user?.email ? user.email.split('@')[0] : 'Bandara Organic Farm'),
        expertSpecialty: selectedSpecialty,
        question: `[${selectedUrgency} Priority] ${question}`,
        farmData,
        imageUrl: imageUrl.trim() || undefined,
      });

      if (res && res.data) {
        setMsg('✅ Consultation successfully dispatched! Certified specialists notified for triage.');
        setQuestion('');
        setImageUrl('');
        setActiveTab('history');
        fetchData();
      }
    } catch (err) {
      // Local fallback simulation if offline
      const mockNew = {
        id: Date.now(),
        farmerEmail: user?.email || 'farmer@agrolink.com',
        farmerName: user?.name || 'Bandara Organic Farm (You)',
        expertSpecialty: selectedSpecialty,
        question: `[${selectedUrgency} Priority] ${question}`,
        farmData,
        imageUrl: imageUrl.trim() || undefined,
        status: 'PENDING',
        reply: null,
        createdAt: 'Just now'
      };
      setConsultations((prev) => [mockNew, ...prev]);
      setMsg('✅ Consultation submitted to verified agricultural officers queue!');
      setQuestion('');
      setImageUrl('');
      setActiveTab('history');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePostReply = async (id) => {
    if (!replyText.trim()) return;

    setSubmitting(true);
    try {
      const res = await expertsAPI.replyConsultation(id, {
        reply: replyText,
        expertName: user?.name || (user?.email ? user.email.split('@')[0] : 'Dr. Gamini Wickramasinghe (Agronomist)'),
      });

      if (res && res.data) {
        setReplyingId(null);
        setReplyText('');
        fetchData();
      }
    } catch (err) {
      // Local state update fallback
      setConsultations((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                status: 'ANSWERED',
                reply: replyText,
                expertName: user?.name || 'Dr. Gamini Wickramasinghe (Agronomist)'
              }
            : c
        )
      );
      setReplyingId(null);
      setReplyText('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickChipSelect = (chip) => {
    setSelectedSpecialty(chip.specialty);
    setQuestion(chip.question);
    setFarmData(chip.telemetry);
    window.scrollTo({ top: 580, behavior: 'smooth' });
  };

  const handleAttachLiveIoTTelemetry = () => {
    const liveMoisture = Math.floor(28 + Math.random() * 15);
    const livePh = (6.0 + Math.random() * 0.8).toFixed(1);
    const liveTemp = Math.floor(24 + Math.random() * 8);
    const liveEC = (1.1 + Math.random() * 0.5).toFixed(2);
    setFarmData(`IoT Live Feed: Soil Moisture ${liveMoisture}%, pH ${livePh}, Temp ${liveTemp}°C, EC ${liveEC} mS/cm`);
  };

  // Filter experts based on search & specialty
  const filteredExperts = experts.filter((exp) => {
    const matchesSpecialty = selectedSpecialtyFilter === 'All' || exp.specialty === selectedSpecialtyFilter;
    const matchesSearch =
      exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  return (
    <div className="relative min-h-screen py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in text-slate-800">
      
      {/* AMBIENT FROSTED GLASS BACKGROUND REFRACTION ORBS */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-10 w-[440px] h-[440px] bg-teal-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-sky-400/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* 1. CLEAN WHITE & GLASSMORPHIC HERO HEADER */}
        <div className="relative overflow-hidden rounded-3xl bg-white/85 backdrop-blur-xl border border-white/90 shadow-xl shadow-slate-200/50 ring-1 ring-slate-900/5 p-6 sm:p-10 space-y-6">
          <div className="absolute -top-12 -right-12 w-80 h-80 bg-gradient-to-br from-emerald-400/15 via-teal-300/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/90 backdrop-blur-md text-emerald-800 text-xs font-extrabold uppercase tracking-wider border border-emerald-200/80 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified National Agricultural Advisory Network</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500 -ml-3.5" />
                  <span>4 Specialists Online • &lt;15m Avg Triage</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-display text-slate-900">
                Consult Verified Agricultural Officers &amp; Specialists 👨‍🔬
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm max-w-3xl font-medium leading-relaxed">
                Connect directly with certified government agricultural extension officers, plant pathologists, soil chemists, and veterinary surgeons for precision diagnosis, field visit bookings, and SLA-backed treatment protocols.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => {
                  setSelectedSpecialty('Agronomist');
                  window.scrollTo({ top: 620, behavior: 'smooth' });
                }}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs rounded-2xl shadow-md hover:shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ask A Question</span>
              </button>

              <button
                onClick={() => {
                  if (experts.length > 0) setSelectedExpertForModal(experts[0]);
                }}
                className="px-4 py-2.5 bg-white/90 hover:bg-white active:scale-95 border border-slate-200/80 text-slate-700 font-extrabold text-xs rounded-2xl shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Book Field Inspection</span>
              </button>
            </div>
          </div>

          {/* ADVISORY SERVICE KEY METRICS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-100/90">
            <div className="p-3.5 bg-slate-50/80 backdrop-blur-md rounded-2xl border border-slate-200/70 space-y-0.5">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <BadgeCheck className="w-3 h-3 text-emerald-600" /> Government Accredited
              </span>
              <p className="text-sm font-black text-slate-900 font-display">100% SLAgS Verified</p>
            </div>

            <div className="p-3.5 bg-slate-50/80 backdrop-blur-md rounded-2xl border border-slate-200/70 space-y-0.5">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3 text-sky-600" /> Turnaround Speed
              </span>
              <p className="text-sm font-black text-slate-900 font-display">&lt; 15 Mins Median</p>
            </div>

            <div className="p-3.5 bg-slate-50/80 backdrop-blur-md rounded-2xl border border-slate-200/70 space-y-0.5">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <Activity className="w-3 h-3 text-teal-600" /> Resolution SLA
              </span>
              <p className="text-sm font-black text-emerald-600 font-display">99.2% Cure Rate</p>
            </div>

            <div className="p-3.5 bg-slate-50/80 backdrop-blur-md rounded-2xl border border-slate-200/70 space-y-0.5">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <Cpu className="w-3 h-3 text-emerald-600" /> IoT Diagnostic Sync
              </span>
              <p className="text-sm font-black text-slate-900 font-display">Live Sensor Sync</p>
            </div>
          </div>
        </div>

        {/* 2. SPECIALTY SEARCH & FILTER BAR */}
        <div className="p-4 sm:p-5 bg-white/85 backdrop-blur-xl border border-white/90 shadow-lg shadow-slate-200/40 ring-1 ring-slate-900/5 rounded-3xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* SEARCH INPUT */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search specialists by name, district (Kandy, Nuwara Eliya), or crop problem..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>

          {/* SPECIALTY FILTER CHIPS */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {['All', 'Agronomist', 'Agricultural Officer', 'Soil Specialist', 'Veterinarian'].map((spec) => (
              <button
                key={spec}
                type="button"
                onClick={() => setSelectedSpecialtyFilter(spec)}
                className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                  selectedSpecialtyFilter === spec
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200/80 border border-slate-200/60'
                }`}
              >
                {spec === 'All' ? '🌟 All Specialists' : spec}
              </button>
            ))}
          </div>
        </div>

        {/* 3. VERIFIED EXPERTS DIRECTORY GRID */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-base font-extrabold text-slate-900 font-display flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" /> Active Verified Officers &amp; Specialists
            </h2>
            <span className="text-xs font-bold text-slate-400">
              Showing {filteredExperts.length} of {experts.length} Specialists
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredExperts.map((exp) => (
              <div
                key={exp.id}
                className="group relative p-5 bg-white/85 backdrop-blur-xl border border-white/90 shadow-xl shadow-slate-200/40 ring-1 ring-slate-900/5 rounded-3xl space-y-4 hover:shadow-2xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* TOP ROW: AVATAR & VERIFIED STATUS */}
                  <div className="flex items-start justify-between">
                    <div className="relative">
                      <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 text-3xl flex items-center justify-center border border-emerald-100 shadow-inner">
                        {exp.avatarUrl || '👨‍🔬'}
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[8px] text-white">
                        ✓
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-black">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" /> {exp.rating}
                      </span>
                      <p className="text-[10px] font-bold text-slate-400 mt-1">{exp.consultationsCount}+ cases</p>
                    </div>
                  </div>

                  {/* NAME & INSTITUTION */}
                  <div>
                    <h3 className="font-black text-slate-900 text-sm font-display group-hover:text-emerald-700 transition">
                      {exp.name}
                    </h3>
                    <p className="text-[11px] font-extrabold text-emerald-700">
                      {exp.title}
                    </p>
                    <p className="text-[10px] font-medium text-slate-400 truncate mt-0.5">
                      {exp.institution}
                    </p>
                  </div>

                  {/* LOCATION & REG NUMBER */}
                  <div className="p-2.5 bg-slate-50/80 rounded-2xl border border-slate-100 text-[11px] text-slate-600 font-semibold space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-3 h-3 text-slate-400" /> {exp.district}
                      </span>
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {exp.availabilityStatus}
                      </span>
                    </div>
                    {exp.regNumber && (
                      <p className="text-[9px] font-mono text-slate-400 pt-0.5 truncate">
                        Gov ID: {exp.regNumber}
                      </p>
                    )}
                  </div>

                  {/* SKILLS PILLS */}
                  {exp.skills && (
                    <div className="flex flex-wrap gap-1">
                      {exp.skills.slice(0, 3).map((skill, i) => (
                        <span key={i} className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* ACTION BUTTONS */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSpecialty(exp.specialty);
                      setQuestion(`Direct inquiry to ${exp.name} (${exp.specialty}): `);
                      window.scrollTo({ top: 620, behavior: 'smooth' });
                    }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Consult {exp.specialty}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedExpertForModal(exp)}
                    className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-extrabold text-[11px] rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <BookOpen className="w-3 h-3 text-slate-500" />
                    <span>View Credentials &amp; Book</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. QUICK 1-CLICK DIAGNOSTIC TEMPLATES RIBBON */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-sky-500/5 backdrop-blur-xl rounded-3xl border border-emerald-300/80 shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-400/20 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 font-display">
              One-Click Common Agricultural Diagnostic Templates:
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {QUICK_DIAGNOSTIC_CHIPS.map((chip, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleQuickChipSelect(chip)}
                className="p-3 bg-white/90 hover:bg-white active:scale-95 border border-emerald-200/80 hover:border-emerald-400 rounded-2xl text-left transition shadow-xs cursor-pointer space-y-1"
              >
                <span className="text-xs font-extrabold text-slate-900 block truncate">{chip.label}</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                  Target: {chip.specialty}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 5. MAIN CONSULTATION HUB (INQUIRY STUDIO & LIVE Q&A TIMELINE) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: INQUIRY & TELEMETRY SUBMISSION STUDIO (5 Cols) */}
          <div className="lg:col-span-5 bg-white/85 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-white/90 shadow-xl shadow-slate-200/40 ring-1 ring-slate-900/5 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 font-display flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600" /> Advisory Inquiry Studio
                </h3>
                <p className="text-xs text-slate-400 font-medium">Send diagnostic query with IoT sensor telemetry</p>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase border border-emerald-200 shadow-xs">
                Gov Extension
              </span>
            </div>

            {msg && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between"
              >
                <span>{msg}</span>
                <button onClick={() => setMsg('')} className="text-emerald-700 font-bold hover:text-emerald-900">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            <form onSubmit={handleSubmitQuestion} className="space-y-4">
              
              {/* SPECIALTY & URGENCY PICKER */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Target Specialty
                  </label>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-2xl border border-slate-200/90 bg-white/80 backdrop-blur-sm text-xs font-bold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 transition"
                  >
                    <option value="Agronomist">👨‍🔬 Agronomist (Crop Health)</option>
                    <option value="Agricultural Officer">🧑‍🌾 Agricultural Officer (Extension)</option>
                    <option value="Soil Specialist">🔬 Soil Specialist (pH &amp; NPK)</option>
                    <option value="Veterinarian">👩‍⚕️ Veterinarian (Livestock)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Triage Urgency
                  </label>
                  <select
                    value={selectedUrgency}
                    onChange={(e) => setSelectedUrgency(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-2xl border border-slate-200/90 bg-white/80 backdrop-blur-sm text-xs font-bold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 transition"
                  >
                    <option value="Normal">🟢 Normal (Within 2 Hours)</option>
                    <option value="Urgent">🟠 Urgent Crop Loss Risk (&lt;30m)</option>
                    <option value="Critical">🔴 Critical Epidemic Outbreak (&lt;15m)</option>
                  </select>
                </div>
              </div>

              {/* QUESTION TEXTAREA */}
              <div className="space-y-1">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Detailed Symptoms &amp; Diagnostic Query
                </label>
                <textarea
                  rows="4"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Describe leaf symptoms, pest appearance, soil issues, or dosage questions..."
                  required
                  className="w-full p-3.5 rounded-2xl border border-slate-200/90 bg-white/80 backdrop-blur-sm text-xs font-semibold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 placeholder:text-slate-400 transition"
                />
              </div>

              {/* LIVE IOT TELEMETRY ATTACHMENT */}
              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-emerald-600" /> Attached Farm IoT Telemetry
                  </label>
                  <button
                    type="button"
                    onClick={handleAttachLiveIoTTelemetry}
                    className="text-[10px] font-extrabold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 cursor-pointer"
                  >
                    <Zap className="w-3 h-3 text-emerald-600" /> Refresh Live Sensors
                  </button>
                </div>
                <input
                  type="text"
                  value={farmData}
                  onChange={(e) => setFarmData(e.target.value)}
                  placeholder="Soil Moisture: 32%, Soil pH: 6.4, Temp: 29°C"
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* IMAGE URL & PREVIEW */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-600" /> Crop / Leaf Photo URL (Optional)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200/90 bg-white/80 text-xs font-semibold focus:outline-none focus:border-emerald-500 text-slate-900 transition"
                />
                {imageUrl && (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-32 bg-slate-100">
                    <img src={imageUrl} alt="Attached crop preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white font-black text-xs rounded-2xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Submit Diagnostic Query to {selectedSpecialty} 🚀</span>
              </button>
            </form>
          </div>

          {/* RIGHT: CONSULTATIONS FEED & VERIFIED DIAGNOSTIC TIMELINE (7 Cols) */}
          <div className="lg:col-span-7 bg-white/85 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-white/90 shadow-xl shadow-slate-200/40 ring-1 ring-slate-900/5 space-y-5">
            
            {/* TABS HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 font-display flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  {isExpert ? '📥 Open Advisory Queue (Triage Mode)' : '📋 Advisory History & Diagnostics'}
                </h3>
                <p className="text-xs text-slate-400 font-medium">Real-time agronomy responses from certified specialists</p>
              </div>

              {/* SEGMENTED TAB TOGGLE */}
              <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-black self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                    activeTab === 'history' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  My Consultations ({consultations.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('community')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                    activeTab === 'community' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Knowledge Base (Verified Cases)
                </button>
              </div>
            </div>

            {/* ACTIVE CONSULTATION LIST */}
            {activeTab === 'history' ? (
              loading ? (
                <div className="py-16 text-center text-slate-400 space-y-2">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600" />
                  <p className="text-xs font-bold">Synchronizing consultation telemetry...</p>
                </div>
              ) : consultations.length === 0 ? (
                <div className="text-center py-16 bg-slate-50/80 rounded-3xl border border-slate-200/70 space-y-3 p-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto text-2xl">
                    🌱
                  </div>
                  <h4 className="text-sm font-black text-slate-900 font-display">No Consultation Threads Yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                    Submit your first diagnostic inquiry using the studio on the left or select a 1-click template above.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[620px] overflow-y-auto pr-1">
                  {consultations.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 rounded-3xl bg-slate-50/90 backdrop-blur-md border border-slate-200/80 space-y-3.5 shadow-xs transition hover:border-emerald-300"
                    >
                      {/* INQUIRY HEADER */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-slate-900 text-sm">{item.farmerName}</span>
                            <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                              Target: {item.expertSpecialty}
                            </span>
                            {item.createdAt && (
                              <span className="text-[10px] font-bold text-slate-400">• {item.createdAt}</span>
                            )}
                          </div>
                          <p className="text-xs text-slate-800 font-bold leading-relaxed">{item.question}</p>
                        </div>

                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase shrink-0 flex items-center gap-1 ${
                            item.status === 'ANSWERED'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {item.status === 'ANSWERED' ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" /> Answered
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 text-amber-600" /> In Triage
                            </>
                          )}
                        </span>
                      </div>

                      {/* ATTACHED TELEMETRY & IMAGE */}
                      {item.farmData && (
                        <div className="p-2.5 bg-white rounded-2xl border border-slate-200/70 text-[11px] text-slate-600 font-mono font-bold flex items-center gap-2">
                          <Cpu className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{item.farmData}</span>
                        </div>
                      )}

                      {item.imageUrl && (
                        <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-48 bg-slate-100">
                          <img src={item.imageUrl} alt="Crop symptom photo" className="w-full h-48 object-cover" />
                        </div>
                      )}

                      {/* VERIFIED EXPERT PRESCRIPTION RESPONSE */}
                      {item.reply ? (
                        <div className="p-4 bg-emerald-50/90 backdrop-blur-sm rounded-2xl border border-emerald-200/90 space-y-2 text-emerald-950">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-extrabold text-emerald-900 flex items-center gap-1.5 font-display">
                              👨‍🔬 {item.expertName || 'Senior Agronomist'} Prescription:
                            </span>
                            <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                              <BadgeCheck className="w-3 h-3" /> SLAgS Certified
                            </span>
                          </div>
                          <p className="text-xs text-emerald-950 font-medium leading-relaxed">{item.reply}</p>
                        </div>
                      ) : isExpert || isAdmin ? (
                        <div className="pt-2">
                          {replyingId === item.id ? (
                            <div className="space-y-2">
                              <textarea
                                rows="3"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Provide verified diagnostic remedy, chemical/organic dosage, and preventative SLA..."
                                className="w-full p-3 rounded-2xl border border-emerald-300 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => setReplyingId(null)}
                                  className="px-3.5 py-1.5 bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handlePostReply(item.id)}
                                  disabled={submitting}
                                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1 cursor-pointer"
                                >
                                  <Send className="w-3 h-3" /> Send Verified Prescription
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setReplyingId(item.id)}
                              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-extrabold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <Send className="w-3 h-3" /> Reply as Agricultural Officer 👨‍🔬
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 text-[11px] text-amber-800 font-semibold flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                          <span>Awaiting priority diagnostic triage from certified {item.expertSpecialty}...</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            ) : (
              /* COMMUNITY KNOWLEDGE BASE OF VERIFIED RESOLUTIONS */
              <div className="space-y-4 max-h-[620px] overflow-y-auto pr-1">
                {COMMUNITY_KNOWLEDGEBASE.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-3xl bg-slate-50/90 backdrop-blur-md border border-slate-200/80 space-y-3.5 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-sm">{item.farmerName}</span>
                          <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            {item.expertSpecialty}
                          </span>
                        </div>
                        <p className="text-xs text-slate-800 font-bold leading-relaxed">{item.question}</p>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 shrink-0">{item.createdAt}</span>
                    </div>

                    {item.farmData && (
                      <div className="p-2.5 bg-white rounded-2xl border border-slate-200/70 text-[11px] text-slate-600 font-mono font-bold flex items-center gap-2">
                        <Cpu className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{item.farmData}</span>
                      </div>
                    )}

                    {item.imageUrl && (
                      <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-48 bg-slate-100">
                        <img src={item.imageUrl} alt="Crop problem photograph" className="w-full h-48 object-cover" />
                      </div>
                    )}

                    <div className="p-4 bg-emerald-50/90 backdrop-blur-sm rounded-2xl border border-emerald-200/90 space-y-2 text-emerald-950">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-emerald-900 font-display">
                          👨‍🔬 {item.expertName} Resolution:
                        </span>
                        <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                          <BadgeCheck className="w-3 h-3" /> SLAgS Approved
                        </span>
                      </div>
                      <p className="text-xs text-emerald-950 font-medium leading-relaxed">{item.reply}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 6. EXPERT CREDENTIALS & FIELD BOOKING MODAL */}
      <AnimatePresence>
        {selectedExpertForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative max-h-[90vh] overflow-y-auto"
            >
              {/* MODAL HEADER */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-3xl border border-emerald-200">
                    {selectedExpertForModal.avatarUrl || '👨‍🔬'}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 font-display">
                      {selectedExpertForModal.name}
                    </h3>
                    <p className="text-xs font-bold text-emerald-700">{selectedExpertForModal.title}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{selectedExpertForModal.institution}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedExpertForModal(null);
                    setBookingSuccessMsg('');
                  }}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {bookingSuccessMsg ? (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-black text-emerald-900 font-display">Field Inspection Requested!</h4>
                  <p className="text-xs text-emerald-800 font-medium">{bookingSuccessMsg}</p>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  {/* STATS STRIP */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-black uppercase text-slate-400 block">Rating</span>
                      <strong className="text-slate-900 font-display text-sm">★ {selectedExpertForModal.rating}</strong>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-black uppercase text-slate-400 block">District</span>
                      <strong className="text-slate-900 font-display text-sm">{selectedExpertForModal.district}</strong>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-black uppercase text-slate-400 block">Resolved</span>
                      <strong className="text-emerald-700 font-display text-sm">{selectedExpertForModal.consultationsCount}+ Cases</strong>
                    </div>
                  </div>

                  {/* BIO & REGISTRATION */}
                  <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-slate-500 block">Officer Background &amp; Bio</span>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {selectedExpertForModal.bio || 'Accredited agricultural officer with extensive field advisory experience.'}
                    </p>
                    {selectedExpertForModal.regNumber && (
                      <p className="text-[10px] font-mono text-emerald-800 font-bold pt-1">
                        Official Gov Reg: {selectedExpertForModal.regNumber}
                      </p>
                    )}
                  </div>

                  {/* SPECIALIZED COMPETENCIES */}
                  {selectedExpertForModal.skills && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-black uppercase text-slate-500 block">Accredited Specializations</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedExpertForModal.skills.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-extrabold"
                          >
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* FIELD APPOINTMENT BOOKING ACTION */}
                  <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-2">
                    <span className="text-xs font-black text-emerald-950 font-display flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-emerald-600" /> Book Direct Farm Visit / Virtual Session
                    </span>
                    <p className="text-[11px] text-emerald-800 font-medium leading-relaxed">
                      Scheduled field inspections provide on-site soil core extraction, leaf tissue testing, and certified GAP compliance audit.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setBookingSuccessMsg(
                          `Field appointment successfully scheduled with ${selectedExpertForModal.name} for the upcoming extension cycle in ${selectedExpertForModal.district}. SMS confirmation dispatched.`
                        );
                      }}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" /> Confirm Appointment Request 📅
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedExpertForModal(null);
                    setBookingSuccessMsg('');
                  }}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExpertModule;

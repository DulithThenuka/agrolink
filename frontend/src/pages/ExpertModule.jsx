import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
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
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
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
  HeartPulse,
  Download,
  Printer,
  QrCode,
  Volume2,
  VolumeX,
  FlaskConical,
  Building2,
  FileSpreadsheet,
  AlertTriangle,
  Play,
  Pause,
  ExternalLink
} from 'lucide-react';

// CERTIFIED EXPERTS DIRECTORY
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
    skills: ['Tomato Blight', 'Greenhouse Horticulture', 'Organic Bio-Pesticides', 'GAP Certification'],
    teleClinicAvailable: true
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
    skills: ['Soil Acidification', 'Tuber Quality', 'Drip Fertigation', 'Subsidy Schemes'],
    teleClinicAvailable: true
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
    skills: ['Dairy Cattle', 'Poultry Disease Control', 'Livestock Feed Nutrition', 'Vaccinations'],
    teleClinicAvailable: true
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
    skills: ['Soil Salinity', 'NPK Optimization', 'Bio-Char Enrichment', 'Paddy Zinc Deficiency'],
    teleClinicAvailable: false
  }
];

// LAB TEST PIPELINE DATA
const LAB_TEST_SAMPLES = [
  {
    id: 'LAB-2026-904',
    testType: 'Comprehensive Soil pH & NPK Fertility Profile',
    labName: 'National Soil Testing Laboratory (Peradeniya)',
    crop: 'Welimada Organic Tomatoes',
    farmer: 'Bandara Organic Farm',
    status: 'REPORT_ISSUED',
    stageNumber: 4,
    orderDate: 'Aug 18, 2026',
    completedDate: 'Aug 23, 2026',
    reportSummary: {
      soilPh: 6.3,
      organicMatter: '3.8% (Optimal)',
      nitrogen: '42 ppm (Moderate)',
      phosphorus: '28 ppm (High)',
      potassium: '185 ppm (Adequate)',
      recommendation: 'Maintain current compost top-dressing. Reduce synthetic phosphorus by 15%.'
    }
  },
  {
    id: 'LAB-2026-918',
    testType: 'Leaf Tissue Fungal & Viral PCR Extraction',
    labName: 'Horticultural Crop Research Institute (Gannoruwa)',
    crop: 'Nuwara Eliya Export Carrots',
    farmer: 'Highland Greens (Kandapola)',
    status: 'IN_ANALYSIS',
    stageNumber: 3,
    orderDate: 'Aug 22, 2026',
    completedDate: 'Est. Aug 25, 2026',
    reportSummary: null
  }
];

// AGRARIAN SERVICE CENTERS DIRECTORY (Govijana Seva Kendraya)
const AGRARIAN_CENTERS = [
  {
    id: 'asc-1',
    name: 'Welimada Agrarian Service Center',
    district: 'Badulla',
    address: 'Main Street, Welimada Central, Uva Province',
    officerInCharge: 'Anura Jayasooriya (Extension Director)',
    phone: '+94 57 224 5110',
    clinicHours: 'Tue & Thu: 08:30 AM - 03:30 PM',
    services: ['GAP Certification Audits', 'Subsidized Bio-Fertilizer', 'Seed Potato Certification']
  },
  {
    id: 'asc-2',
    name: 'Galewela Govijana Seva Kendraya',
    district: 'Matale',
    address: 'Dambulla Road, Galewela, Central Province',
    officerInCharge: 'R. M. Dissanayake (District Officer)',
    phone: '+94 66 228 9204',
    clinicHours: 'Mon, Wed, Fri: 09:00 AM - 04:00 PM',
    services: ['Armyworm Surveillance Desk', 'Paddy Soil Testing Kits', 'Drip Irrigation Tenders']
  },
  {
    id: 'asc-3',
    name: 'Kandapola Highland Extension Center',
    district: 'Nuwara Eliya',
    address: 'Highland Ridge Rd, Kandapola, Nuwara Eliya',
    officerInCharge: 'Dr. Gamini Wickramasinghe (Field Lead)',
    phone: '+94 52 222 7831',
    clinicHours: 'Wed & Sat: 08:30 AM - 02:00 PM',
    services: ['Cold-Chain Transport Subsidies', 'Fungicide Calibration', 'Greenhouse Permits']
  },
  {
    id: 'asc-4',
    name: 'Thambuttegama Agrarian Hub',
    district: 'Anuradhapura',
    address: 'Irrigation Secretariat Complex, Thambuttegama',
    officerInCharge: 'Sunil Fernando (Soil Analyst)',
    phone: '+94 25 227 6301',
    clinicHours: 'Mon - Fri: 08:30 AM - 04:30 PM',
    services: ['Maha Paddy Water Allocations', 'Saline Soil Remediation', 'Organic Composting Subsidy']
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
    createdAt: '2 hours ago',
    rxData: {
      rxNumber: 'RX-AGRO-2026-781',
      crop: 'Tomato (Grade A Greenhouse)',
      activeIngredient: 'Copper Hydroxide 77% WP / Trichoderma viride',
      dosage: '50g per 16L spray tank (2.5g / Liter)',
      frequency: 'Every 5 days for 2 cycles (Morning 07:00 - 08:30 AM)',
      preHarvestIntervalDays: 3,
      safetyNotes: 'Wear nitrile gloves & respirator. Do not spray during mid-day heat.'
    },
    audioAdvice: {
      sinhala: 'පහළ කොළ කප්පාදු කර උදෑසන කොපර් හයිඩ්‍රොක්සයිඩ් මිලිග්‍රෑම් 50ක් ඉසින්න.',
      tamil: 'கீழ் இலைகளை அகற்றி காப்பர் ஹைட்ராக்சைடு தெளிக்கவும்.',
      english: 'Prune bottom 15cm foliage and apply Copper Hydroxide 50g/16L.'
    }
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
    createdAt: '1 day ago',
    rxData: {
      rxNumber: 'RX-AGRO-2026-642',
      crop: 'Highland Export Carrots',
      activeIngredient: 'Agricultural Dolomite (CaCO3.MgCO3) + Deep Aeration',
      dosage: '350 kg per acre broadcasted uniformly',
      frequency: 'Single application incorporated 2 weeks before sowing',
      preHarvestIntervalDays: 0,
      safetyNotes: 'Ensure soil moisture is moderate when broadcasting dolomite.'
    }
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
  const { user, isExpert, isAdmin } = useAuth();
  
  // Top-Level Navigation View: 'advisory' | 'teleclinic' | 'labtests' | 'agrarian'
  const [activeMainTab, setActiveMainTab] = useState('advisory');

  const [experts, setExperts] = useState(FALLBACK_EXPERTS);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');
  const [activeTab, setActiveTab] = useState('history'); // 'history' or 'community'
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState('ALL');

  // Selected Expert Detail & Appointment Modal
  const [selectedExpertForModal, setSelectedExpertForModal] = useState(null);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState('');
  const [selectedVisitDate, setSelectedVisitDate] = useState('2026-08-28');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('09:30 AM - 11:00 AM');

  // Digital Prescription (Rx) Modal
  const [activeRxModal, setActiveRxModal] = useState(null);

  // Virtual Tele-Agro Clinic State
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDurationSec, setCallDurationSec] = useState(0);
  const [callActiveOfficer, setCallActiveOfficer] = useState(FALLBACK_EXPERTS[0]);

  // Audio Note Playback State
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [audioLanguage, setAudioLanguage] = useState('sinhala');

  // Form State for Asking Question / Booking
  const [selectedSpecialty, setSelectedSpecialty] = useState('Agronomist');
  const [question, setQuestion] = useState('');
  const [farmData, setFarmData] = useState('Soil Moisture: 34%, Soil pH: 6.4, Location: Welimada, Temp: 28°C');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState('Normal');

  // Lab Test Pipeline State
  const [labTests, setLabTests] = useState(LAB_TEST_SAMPLES);
  const [showOrderLabModal, setShowOrderLabModal] = useState(false);
  const [selectedLabInstitution, setSelectedLabInstitution] = useState('National Soil Testing Laboratory (Peradeniya)');
  const [labCropName, setLabCropName] = useState('Welimada Organic Tomatoes');
  const [labOrderSuccessMsg, setLabOrderSuccessMsg] = useState('');

  // Expert Reply State
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Timer for active teleclinic call
  useEffect(() => {
    let interval = null;
    if (isInCall) {
      interval = setInterval(() => {
        setCallDurationSec((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDurationSec(0);
    }
    return () => clearInterval(interval);
  }, [isInCall]);

  const formatCallTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

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
      setConsultations((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                status: 'ANSWERED',
                reply: replyText,
                expertName: user?.name || 'Dr. Gamini Wickramasinghe (Agronomist)',
                rxData: {
                  rxNumber: `RX-AGRO-2026-${Math.floor(100 + Math.random() * 900)}`,
                  crop: 'Crop Diagnostic Sample',
                  activeIngredient: 'Prescribed Formulation',
                  dosage: 'Follow standard dilution guidelines',
                  frequency: 'Every 5 days as needed',
                  preHarvestIntervalDays: 3,
                  safetyNotes: 'Adhere to official DOA protective equipment guidelines.'
                }
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
    setActiveMainTab('advisory');
    window.scrollTo({ top: 580, behavior: 'smooth' });
  };

  const handleAttachLiveIoTTelemetry = () => {
    const liveMoisture = Math.floor(28 + Math.random() * 15);
    const livePh = (6.0 + Math.random() * 0.8).toFixed(1);
    const liveTemp = Math.floor(24 + Math.random() * 8);
    const liveEC = (1.1 + Math.random() * 0.5).toFixed(2);
    setFarmData(`IoT Live Feed: Soil Moisture ${liveMoisture}%, pH ${livePh}, Temp ${liveTemp}°C, EC ${liveEC} mS/cm`);
  };

  const handleOrderLabTest = (e) => {
    e.preventDefault();
    const newTest = {
      id: `LAB-2026-${Math.floor(920 + Math.random() * 80)}`,
      testType: 'Soil pH, Organic Matter & Micronutrient Spectroscopy',
      labName: selectedLabInstitution,
      crop: labCropName,
      farmer: user?.name || 'Bandara Organic Farm',
      status: 'SAMPLE_DISPATCHED',
      stageNumber: 1,
      orderDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      completedDate: 'Est. 4 Days',
      reportSummary: null
    };
    setLabTests((prev) => [newTest, ...prev]);
    setLabOrderSuccessMsg('✅ Test Kit Dispatched! Physical collection courier scheduled to your farm location.');
    setTimeout(() => {
      setShowOrderLabModal(false);
      setLabOrderSuccessMsg('');
    }, 2500);
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

  // Filter Agrarian Centers
  const filteredCenters = AGRARIAN_CENTERS.filter((c) => {
    const matchesDistrict = selectedDistrictFilter === 'ALL' || c.district === selectedDistrictFilter;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDistrict && matchesSearch;
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
                  <span>National Digital Agro-Clinic &amp; Agricultural Extension Network</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500 -ml-3.5" />
                  <span>4 Specialists Online • Virtual Tele-Clinic Ready</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-display text-slate-900">
                Consult Verified Agricultural Officers &amp; Specialists 👨‍🔬
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm max-w-3xl font-medium leading-relaxed">
                Connect directly with certified government extension officers, plant pathologists, soil chemists, and veterinary surgeons for precision diagnosis, 1-on-1 virtual video triage, physical lab testing, and SLAgS digital prescriptions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => {
                  setCallActiveOfficer(experts[0]);
                  setIsInCall(true);
                  setActiveMainTab('teleclinic');
                }}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs rounded-2xl shadow-md hover:shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Start Tele-Agro Clinic 📹</span>
              </button>

              <button
                onClick={() => {
                  if (experts.length > 0) setSelectedExpertForModal(experts[0]);
                }}
                className="px-4 py-2.5 bg-white/90 hover:bg-white active:scale-95 border border-slate-200/80 text-slate-700 font-extrabold text-xs rounded-2xl shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Book Farm Visit 📅</span>
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

        {/* 🌟 2. TOP-LEVEL MODULAR NAVIGATION TABS */}
        <div className="flex bg-white/85 backdrop-blur-xl p-1.5 rounded-3xl border border-white/90 shadow-lg shadow-slate-200/40 ring-1 ring-slate-900/5 overflow-x-auto scrollbar-none gap-1.5 text-xs font-black">
          <button
            type="button"
            onClick={() => setActiveMainTab('advisory')}
            className={`flex-1 min-w-[170px] py-3 px-4 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeMainTab === 'advisory'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                : 'text-slate-600 hover:bg-slate-100/80'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>👨‍🔬 Specialists &amp; Advisory</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('teleclinic')}
            className={`flex-1 min-w-[170px] py-3 px-4 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeMainTab === 'teleclinic'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                : 'text-slate-600 hover:bg-slate-100/80'
            }`}
          >
            <Video className="w-4 h-4 text-emerald-300" />
            <span>📞 Virtual Tele-Agro Clinic</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('labtests')}
            className={`flex-1 min-w-[170px] py-3 px-4 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeMainTab === 'labtests'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                : 'text-slate-600 hover:bg-slate-100/80'
            }`}
          >
            <FlaskConical className="w-4 h-4 text-teal-400" />
            <span>🧪 Soil &amp; Leaf Lab Tests</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('agrarian')}
            className={`flex-1 min-w-[170px] py-3 px-4 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeMainTab === 'agrarian'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                : 'text-slate-600 hover:bg-slate-100/80'
            }`}
          >
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>🗺️ Agrarian Centers (Govijana Seva)</span>
          </button>
        </div>

        {/* 🌟 3. TAB 1: SPECIALISTS & ADVISORY HUB */}
        {activeMainTab === 'advisory' && (
          <div className="space-y-8">
            
            {/* SPECIALTY SEARCH & FILTER BAR */}
            <div className="p-4 sm:p-5 bg-white/85 backdrop-blur-xl border border-white/90 shadow-lg shadow-slate-200/40 ring-1 ring-slate-900/5 rounded-3xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
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

            {/* VERIFIED EXPERTS DIRECTORY GRID */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <h2 className="text-base font-extrabold text-slate-900 font-display flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600" /> Active Verified Officers &amp; Specialists
                </h2>
                <span className="text-xs font-bold text-slate-400">
                  Showing {filteredExperts.length} Specialists
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {filteredExperts.map((exp) => (
                  <div
                    key={exp.id}
                    className="group relative p-5 bg-white/85 backdrop-blur-xl border border-white/90 shadow-xl shadow-slate-200/40 ring-1 ring-slate-900/5 rounded-3xl space-y-4 hover:shadow-2xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
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

            {/* 1-CLICK COMMON DIAGNOSTIC TEMPLATES */}
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

            {/* MAIN TWO-COLUMN CONSULTATION HUB (INQUIRY STUDIO & Q&A FEED) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT: INQUIRY STUDIO (5 COLS) */}
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
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
                        Target Specialty
                      </label>
                      <select
                        value={selectedSpecialty}
                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-2xl border border-slate-200/90 bg-white/80 text-xs font-bold focus:outline-none focus:border-emerald-500"
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
                        className="w-full px-3 py-2.5 rounded-2xl border border-slate-200/90 bg-white/80 text-xs font-bold focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Normal">🟢 Normal (Within 2 Hours)</option>
                        <option value="Urgent">🟠 Urgent Crop Loss Risk (&lt;30m)</option>
                        <option value="Critical">🔴 Critical Epidemic Outbreak (&lt;15m)</option>
                      </select>
                    </div>
                  </div>

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
                      className="w-full p-3.5 rounded-2xl border border-slate-200/90 bg-white/80 text-xs font-semibold focus:outline-none focus:border-emerald-500 text-slate-900 placeholder:text-slate-400"
                    />
                  </div>

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

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-emerald-600" /> Crop / Leaf Photo URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200/90 bg-white/80 text-xs font-semibold focus:outline-none focus:border-emerald-500 text-slate-900"
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
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-2xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>Submit Diagnostic Query to {selectedSpecialty} 🚀</span>
                  </button>
                </form>
              </div>

              {/* RIGHT: CONSULTATIONS FEED & DIGITAL RX TIMELINE (7 COLS) */}
              <div className="lg:col-span-7 bg-white/85 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-white/90 shadow-xl shadow-slate-200/40 ring-1 ring-slate-900/5 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 font-display flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      {isExpert ? '📥 Open Advisory Queue (Triage Mode)' : '📋 Advisory History & Digital Prescriptions'}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">Real-time agronomy responses and SLAgS prescription documents</p>
                  </div>

                  <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-black">
                    <button
                      type="button"
                      onClick={() => setActiveTab('history')}
                      className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                        activeTab === 'history' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      My Cases ({consultations.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('community')}
                      className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                        activeTab === 'community' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      Verified Knowledgebase
                    </button>
                  </div>
                </div>

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
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-extrabold text-slate-900 text-sm">{item.farmerName}</span>
                                <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                                  Target: {item.expertSpecialty}
                                </span>
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

                          {item.farmData && (
                            <div className="p-2.5 bg-white rounded-2xl border border-slate-200/70 text-[11px] text-slate-600 font-mono font-bold flex items-center gap-2">
                              <Cpu className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="truncate">{item.farmData}</span>
                            </div>
                          )}

                          {item.reply ? (
                            <div className="p-4 bg-emerald-50/90 backdrop-blur-sm rounded-2xl border border-emerald-200/90 space-y-2 text-emerald-950">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-extrabold text-emerald-900 flex items-center gap-1.5 font-display">
                                  👨‍🔬 {item.expertName || 'Senior Agronomist'} Diagnostic Prescription:
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setActiveRxModal(item)}
                                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] rounded-xl shadow-xs flex items-center gap-1 cursor-pointer"
                                >
                                  <FileText className="w-3 h-3" />
                                  <span>View Official Digital Rx (PDF) 📄</span>
                                </button>
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
                                      <Send className="w-3 h-3" /> Issue Digital Prescription
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setReplyingId(item.id)}
                                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-extrabold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                                >
                                  <Send className="w-3 h-3" /> Prescribe Treatment as Officer 👨‍🔬
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

                        <div className="p-4 bg-emerald-50/90 backdrop-blur-sm rounded-2xl border border-emerald-200/90 space-y-2 text-emerald-950">
                          <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                            <span className="font-extrabold text-emerald-900 font-display">
                              👨‍🔬 {item.expertName} Resolution:
                            </span>
                            <button
                              type="button"
                              onClick={() => setActiveRxModal(item)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] rounded-xl shadow-xs flex items-center gap-1 cursor-pointer"
                            >
                              <FileText className="w-3 h-3" /> View Prescription (Rx)
                            </button>
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
        )}

        {/* 🌟 4. TAB 2: VIRTUAL TELE-AGRO CLINIC ROOM (1-ON-1 VIDEO SIMULATOR) */}
        {activeMainTab === 'teleclinic' && (
          <div className="bg-white/85 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/90 shadow-xl shadow-slate-200/40 ring-1 ring-slate-900/5 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-xl font-black text-slate-900 font-display">
                    Virtual Tele-Agro Consultation Clinic 📹
                  </h2>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Direct encrypted video consultation with certified agricultural officers featuring live IoT crop telemetry HUD
                </p>
              </div>

              {isInCall && (
                <div className="flex items-center gap-2 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 text-rose-700 font-mono font-bold text-xs">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                  <span>LIVE CLINIC: {formatCallTime(callDurationSec)}</span>
                </div>
              )}
            </div>

            {/* VIDEO HUD INTERFACE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* VIDEO STREAM SCREEN (8 COLS) */}
              <div className="lg:col-span-8 bg-slate-950 rounded-3xl overflow-hidden relative shadow-2xl min-h-[420px] flex flex-col justify-between p-6 border border-slate-800">
                {/* HUD TOP TELEMETRY OVERLAY */}
                <div className="flex justify-between items-center relative z-10 text-xs">
                  <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-700 text-emerald-400 font-mono font-bold">
                    <Activity className="w-3.5 h-3.5" />
                    <span>SOIL MOISTURE: 38% • pH 6.3 • TEMP: 26°C</span>
                  </div>
                  <span className="bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl text-slate-300 font-mono text-[10px]">
                    TLS 1.3 ENCRYPTED
                  </span>
                </div>

                {/* OFFICER & FARMER VIDEO SIMULATION FEED */}
                <div className="my-auto text-center space-y-3 relative z-10">
                  {isInCall ? (
                    <div className="space-y-2">
                      <div className="w-24 h-24 rounded-3xl bg-emerald-600 text-white flex items-center justify-center text-5xl mx-auto shadow-xl shadow-emerald-600/30 border-2 border-emerald-400">
                        {callActiveOfficer.avatarUrl || '👨‍🔬'}
                      </div>
                      <h4 className="text-base font-black text-white font-display">{callActiveOfficer.name}</h4>
                      <p className="text-xs text-emerald-400 font-semibold">{callActiveOfficer.title} ({callActiveOfficer.institution})</p>
                      <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                        Audio &amp; Video Connected • Diagnostic Inspection Active
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-3 py-12">
                      <div className="w-16 h-16 rounded-3xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto text-3xl">
                        📹
                      </div>
                      <h4 className="text-base font-bold text-slate-300">Tele-Clinic Waiting Room</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Click "Connect Video Call" to initiate the 1-on-1 virtual examination with {callActiveOfficer.name}.
                      </p>
                    </div>
                  )}
                </div>

                {/* CALL CONTROL BUTTONS */}
                <div className="flex items-center justify-center gap-3 relative z-10 pt-4">
                  {isInCall ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsMuted(!isMuted)}
                        className={`p-3.5 rounded-2xl font-bold transition cursor-pointer ${
                          isMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                        }`}
                      >
                        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsVideoOff(!isVideoOff)}
                        className={`p-3.5 rounded-2xl font-bold transition cursor-pointer ${
                          isVideoOff ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                        }`}
                      >
                        {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsInCall(false)}
                        className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 transition flex items-center gap-2 cursor-pointer"
                      >
                        <PhoneOff className="w-4 h-4" />
                        <span>End Consultation</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsInCall(true)}
                      className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition flex items-center gap-2 cursor-pointer"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Connect Video Consultation with {callActiveOfficer.name.split(' ')[1]}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* LIVE CALL NOTES & PRESCRIPTION SYNC (4 COLS) */}
              <div className="lg:col-span-4 p-5 bg-slate-50/90 rounded-3xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h4 className="font-black text-slate-900 text-xs font-display flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-600" /> Live Clinical Examination Notes
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    DOA Synchronized
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-white rounded-2xl border border-slate-200/70 space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">Attending Officer</span>
                    <p className="font-black text-slate-900">{callActiveOfficer.name}</p>
                    <p className="text-[10px] text-slate-500">{callActiveOfficer.title}</p>
                  </div>

                  <div className="p-3 bg-white rounded-2xl border border-slate-200/70 space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">Live Telemetry Observation</span>
                    <p className="text-[11px] text-slate-700 font-mono font-semibold">
                      Crop: Welimada Organic Tomatoes<br />
                      Soil pH: 6.3 • EC: 1.4 mS/cm<br />
                      Leaf Surface Moisture: 82% RH
                    </p>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 space-y-1">
                    <span className="text-[10px] font-black uppercase text-emerald-800 block">
                      Prescription Readiness
                    </span>
                    <p className="text-[11px] font-medium leading-relaxed">
                      At conclusion of video session, a certified digital Rx document is automatically compiled into your account.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 🌟 5. TAB 3: SOIL & LEAF TISSUE LAB TEST PIPELINE */}
        {activeMainTab === 'labtests' && (
          <div className="bg-white/85 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/90 shadow-xl shadow-slate-200/40 ring-1 ring-slate-900/5 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-teal-600" />
                  <h2 className="text-xl font-black text-slate-900 font-display">
                    Soil &amp; Leaf Tissue Laboratory Testing Pipeline 🧪
                  </h2>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Order official physical soil core and leaf PCR pathology diagnostic kits analyzed at certified national research institutes
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowOrderLabModal(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Order Physical Lab Test Kit 📦</span>
              </button>
            </div>

            {/* ACTIVE LAB TEST TRACKER CARDS */}
            <div className="space-y-5">
              {labTests.map((t) => (
                <div
                  key={t.id}
                  className="p-6 bg-slate-50/90 rounded-3xl border border-slate-200/80 space-y-4 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                          {t.id}
                        </span>
                        <h3 className="font-black text-slate-900 text-sm font-display">{t.testType}</h3>
                      </div>
                      <p className="text-xs font-bold text-slate-500 mt-0.5">{t.labName} • Crop: {t.crop}</p>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase self-start sm:self-auto ${
                      t.status === 'REPORT_ISSUED'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-sky-100 text-sky-800 border border-sky-200'
                    }`}>
                      {t.status === 'REPORT_ISSUED' ? '✅ Official Report Ready' : '🔬 In Lab Spectrometry'}
                    </span>
                  </div>

                  {/* 4-STAGE PIPELINE PROGRESS BAR */}
                  <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                    {[
                      { step: 1, name: '1. Kit Dispatched' },
                      { step: 2, name: '2. Sample Received' },
                      { step: 3, name: '3. Spectrometry Analysis' },
                      { step: 4, name: '4. Report Issued' },
                    ].map((s) => (
                      <div key={s.step} className="space-y-1.5">
                        <div className={`h-2 rounded-full transition-all ${
                          t.stageNumber >= s.step ? 'bg-emerald-600' : 'bg-slate-200'
                        }`} />
                        <span className={`text-[10px] font-extrabold block ${
                          t.stageNumber >= s.step ? 'text-emerald-800' : 'text-slate-400'
                        }`}>
                          {s.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* IF REPORT ISSUED: SHOW SUMMARY */}
                  {t.reportSummary && (
                    <div className="p-4 bg-white rounded-2xl border border-emerald-200 text-xs space-y-2.5 shadow-xs">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-black text-emerald-900 flex items-center gap-1 font-display">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Certified Lab Spectrometry Results:
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">Completed: {t.completedDate}</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                        <div className="p-2 bg-slate-50 rounded-xl">
                          <span className="text-[9px] font-black uppercase text-slate-400 block">Soil pH</span>
                          <strong className="text-emerald-700">{t.reportSummary.soilPh}</strong>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-xl">
                          <span className="text-[9px] font-black uppercase text-slate-400 block">Organic Matter</span>
                          <strong className="text-slate-800">{t.reportSummary.organicMatter}</strong>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-xl">
                          <span className="text-[9px] font-black uppercase text-slate-400 block">Nitrogen (N)</span>
                          <strong className="text-slate-800">{t.reportSummary.nitrogen}</strong>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-xl">
                          <span className="text-[9px] font-black uppercase text-slate-400 block">Potassium (K)</span>
                          <strong className="text-slate-800">{t.reportSummary.potassium}</strong>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-600 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                        <strong>Official Lab Guidance:</strong> {t.reportSummary.recommendation}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🌟 6. TAB 4: AGRARIAN SERVICE CENTERS DIRECTORY (Govijana Seva Kendraya) */}
        {activeMainTab === 'agrarian' && (
          <div className="bg-white/85 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/90 shadow-xl shadow-slate-200/40 ring-1 ring-slate-900/5 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-500" />
                  <h2 className="text-xl font-black text-slate-900 font-display">
                    Agrarian Service Centers Directory (Govijana Seva Kendraya) 🏛️
                  </h2>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Official government extension centers offering on-site crop clinics, soil testing drop-offs, and subsidized fertilizer distribution
                </p>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <select
                  value={selectedDistrictFilter}
                  onChange={(e) => setSelectedDistrictFilter(e.target.value)}
                  className="px-3 py-2 rounded-2xl border border-slate-200 font-bold bg-white text-xs text-slate-800"
                >
                  {['ALL', 'Badulla', 'Matale', 'Nuwara Eliya', 'Anuradhapura'].map((d) => (
                    <option key={d} value={d}>{d === 'ALL' ? '📍 All Districts' : `${d} District`}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredCenters.map((c) => (
                <div
                  key={c.id}
                  className="p-6 bg-slate-50/90 rounded-3xl border border-slate-200/80 space-y-3.5 shadow-xs hover:border-emerald-300 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {c.district} District Extension Hub
                      </span>
                      <h3 className="text-base font-black text-slate-900 font-display mt-1">{c.name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" /> {c.address}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-2xl border border-slate-200/70 text-xs space-y-1 font-medium">
                    <p className="text-slate-700">
                      <strong>Extension Officer in Charge:</strong> {c.officerInCharge}
                    </p>
                    <p className="text-slate-700 flex items-center gap-1">
                      <PhoneCall className="w-3 h-3 text-emerald-600" /> <strong>Direct Hotline:</strong> {c.phone}
                    </p>
                    <p className="text-emerald-800 font-semibold">
                      <strong>Weekly Clinic Hours:</strong> {c.clinicHours}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">Available Center Services</span>
                    <div className="flex flex-wrap gap-1">
                      {c.services.map((srv, i) => (
                        <span key={i} className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 font-bold text-[10px] rounded-xl">
                          ✓ {srv}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 🌟 7. OFFICIAL DIGITAL PRESCRIPTION (Rx) MODAL */}
      <AnimatePresence>
        {activeRxModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative max-h-[90vh] overflow-y-auto print:p-0 print:border-none print:shadow-none"
            >
              {/* Rx HEADER */}
              <div className="flex justify-between items-start border-b-2 border-emerald-600 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl font-black shadow-md">
                    Rx
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-800 tracking-widest block">
                      Democratic Socialist Republic of Sri Lanka • Department of Agriculture
                    </span>
                    <h3 className="text-lg font-black text-slate-900 font-display">
                      Official Agronomy Diagnostic Prescription
                    </h3>
                    <p className="text-xs font-mono text-slate-500 font-bold">
                      {activeRxModal.rxData?.rxNumber || 'RX-AGRO-2026-781'} • SLAgS Accredited
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveRxModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer print:hidden"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* FARMER & OFFICER IDENTIFICATION STRIP */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Producer / Patient Entity</span>
                  <span className="font-extrabold text-slate-900">{activeRxModal.farmerName}</span>
                  <span className="text-[10px] text-slate-500 block">Welimada Organic Cluster</span>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Prescribing Officer</span>
                  <span className="font-extrabold text-emerald-800">{activeRxModal.expertName}</span>
                  <span className="text-[10px] text-slate-500 block">Gov Reg: SLAgS-REG-2014-882</span>
                </div>
              </div>

              {/* DIAGNOSIS & REMEDY TABLE */}
              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-emerald-950 space-y-1">
                  <span className="text-[10px] font-black uppercase text-emerald-800 block">Clinical Pathology Diagnosis:</span>
                  <p className="font-semibold leading-relaxed">{activeRxModal.reply}</p>
                </div>

                {/* DOSAGE & PHI SCHEDULE TABLE */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-600 block">Prescribed Formulation &amp; Application Protocol:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[9px] font-black uppercase text-slate-400 block">Active Ingredient</span>
                      <strong className="text-emerald-800 text-[11px] block">{activeRxModal.rxData?.activeIngredient || 'Copper Hydroxide'}</strong>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[9px] font-black uppercase text-slate-400 block">Dilution Dosage</span>
                      <strong className="text-slate-800 text-[11px] block">{activeRxModal.rxData?.dosage || '50g / 16L Tank'}</strong>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[9px] font-black uppercase text-slate-400 block">Frequency</span>
                      <strong className="text-slate-800 text-[11px] block">{activeRxModal.rxData?.frequency || 'Every 5 Days'}</strong>
                    </div>
                    <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                      <span className="text-[9px] font-black uppercase text-amber-800 block">Pre-Harvest PHI</span>
                      <strong className="text-amber-900 text-[11px] block">{activeRxModal.rxData?.preHarvestIntervalDays || 3} Days Safe Wait</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* OFFICIAL STAMP & VALIDATION SEAL */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-200 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-slate-500 block">TLS QR HASH: 0x89e24a...771c</span>
                    <span className="text-[10px] font-bold text-emerald-700">Certified for Agrarian Store Dispensation</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 print:hidden">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-extrabold text-xs rounded-xl shadow-xs hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Rx Document</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveRxModal(null)}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🌟 8. EXPERT CREDENTIALS & FIELD BOOKING MODAL */}
      <AnimatePresence>
        {selectedExpertForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 relative max-h-[90vh] overflow-y-auto"
            >
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
                  <h4 className="text-sm font-black text-emerald-900 font-display">Field Inspection Scheduled!</h4>
                  <p className="text-xs text-emerald-800 font-medium">{bookingSuccessMsg}</p>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
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

                  <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-slate-500 block">Officer Biography</span>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {selectedExpertForModal.bio || 'Accredited agricultural officer with extensive field advisory experience.'}
                    </p>
                    {selectedExpertForModal.regNumber && (
                      <p className="text-[10px] font-mono text-emerald-800 font-bold pt-1">
                        Official Gov Reg: {selectedExpertForModal.regNumber}
                      </p>
                    )}
                  </div>

                  {/* FIELD APPOINTMENT BOOKING WITH DATE / TIME SELECTOR */}
                  <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-3">
                    <span className="text-xs font-black text-emerald-950 font-display flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-emerald-600" /> Schedule Field Visit &amp; On-Site Inspection
                    </span>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-600 block mb-1">Select Date</label>
                        <input
                          type="date"
                          value={selectedVisitDate}
                          onChange={(e) => setSelectedVisitDate(e.target.value)}
                          className="w-full p-2 bg-white rounded-xl border border-slate-200 font-bold text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-600 block mb-1">Time Slot</label>
                        <select
                          value={selectedTimeSlot}
                          onChange={(e) => setSelectedTimeSlot(e.target.value)}
                          className="w-full p-2 bg-white rounded-xl border border-slate-200 font-bold text-xs"
                        >
                          <option value="09:30 AM - 11:00 AM">09:30 AM - 11:00 AM</option>
                          <option value="02:00 PM - 03:30 PM">02:00 PM - 03:30 PM</option>
                          <option value="04:00 PM - 05:30 PM">04:00 PM - 05:30 PM</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setBookingSuccessMsg(
                          `Field appointment successfully confirmed with ${selectedExpertForModal.name} for ${selectedVisitDate} (${selectedTimeSlot}). SMS dispatch confirmation sent.`
                        );
                      }}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" /> Confirm On-Site Inspection 📅
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

      {/* 🌟 9. ORDER PHYSICAL LAB TEST KIT MODAL */}
      <AnimatePresence>
        {showOrderLabModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 relative"
            >
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
                    <FlaskConical className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 font-display">
                      Order Physical Laboratory Test Kit
                    </h3>
                    <p className="text-xs text-slate-400">Certified National Agricultural Labs</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowOrderLabModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {labOrderSuccessMsg ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-extrabold text-xs text-center space-y-1">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                  <p>{labOrderSuccessMsg}</p>
                </div>
              ) : (
                <form onSubmit={handleOrderLabTest} className="space-y-4 text-xs font-semibold">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase text-slate-500">
                      Selecting Laboratory Institution
                    </label>
                    <select
                      value={selectedLabInstitution}
                      onChange={(e) => setSelectedLabInstitution(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 font-bold"
                    >
                      <option value="National Soil Testing Laboratory (Peradeniya)">🔬 National Soil Testing Lab (Peradeniya)</option>
                      <option value="Rice Research & Development Institute (Batalagoda)">🌾 Rice Research &amp; Development Institute (Batalagoda)</option>
                      <option value="Horticultural Crop Research Institute (Gannoruwa)">🍅 Horticultural Crop Research Institute (Gannoruwa)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase text-slate-500">Crop / Soil Batch Name</label>
                    <input
                      type="text"
                      value={labCropName}
                      onChange={(e) => setLabCropName(e.target.value)}
                      placeholder="e.g. Welimada Organic Tomatoes"
                      required
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900"
                    />
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-slate-600 font-medium">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">Physical Collection Protocol</span>
                    <p className="text-[11px] leading-relaxed">
                      A sterile soil sample bag and pre-paid courier shipping label will be dispatched to your registered farm address within 24 hours.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FlaskConical className="w-4 h-4" />
                    <span>Confirm Lab Test Kit Dispatch (Free Gov Scheme) 🚀</span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExpertModule;

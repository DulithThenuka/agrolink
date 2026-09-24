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
  BadgeCheck,
  ArrowUpRight,
  HelpCircle,
  Activity,
  Download,
  Printer,
  FlaskConical,
  Building2,
  AlertTriangle,
  Play,
  Pause,
  ExternalLink,
  FileSpreadsheet,
  Layers,
  Info,
  Tag,
  ChevronDown,
  RefreshCw,
  User,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// ==========================================
// AUTHENTIC AGRICULTURAL EXPERTS DIRECTORY
// ==========================================
const VERIFIED_EXPERTS = [
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
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    regNumber: 'SLAgS-REG-2014-882',
    bio: '22+ years in highland vegetable pathology, fungal blight mitigation, greenhouse climate controls, and Good Agricultural Practices (GAP) certification across the Central Province.',
    skills: ['Tomato Blight', 'Greenhouse Horticulture', 'Organic Bio-Pesticides', 'GAP Certification', 'Export Quarantine Compliance'],
    contactDays: 'Mon, Wed, Fri (09:00 AM - 04:00 PM)',
    education: 'Ph.D. in Plant Pathology (University of Peradeniya), B.Sc. Agriculture (Hons)',
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
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    regNumber: 'SLAgS-REG-2011-304',
    bio: 'Lead field extension officer for Nuwara Eliya potato, carrot, and leek cultivation clusters. Specialist in crop subsidy facilitation, micro-irrigation schemes, and field soil acidification.',
    skills: ['Soil Acidification', 'Tuber Quality', 'Drip Fertigation', 'Subsidy Schemes', 'Post-Harvest Losses'],
    contactDays: 'Tue, Thu, Sat (08:30 AM - 03:30 PM)',
    education: 'M.Sc. Crop Science, B.Sc. Agriculture (Wayamba University)',
    teleClinicAvailable: true
  },
  {
    id: 103,
    name: 'Dr. Priyanka Ratnayake',
    title: 'Livestock & Veterinary Extension Specialist',
    specialty: 'Veterinarian',
    institution: 'Department of Animal Production & Health',
    district: 'Gampaha',
    rating: 4.92,
    consultationsCount: 156,
    availabilityStatus: 'Available Today',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    regNumber: 'SLVC-REG-2016-119',
    bio: 'Specialist in dairy cattle herd health, mastitis management, poultry biosecurity, livestock feed nutrition, and regional vaccination protocols.',
    skills: ['Dairy Cattle', 'Poultry Disease Control', 'Livestock Feed Nutrition', 'Vaccination Calendars', 'Milk Quality Standards'],
    contactDays: 'Mon - Fri (08:30 AM - 04:30 PM)',
    education: 'B.V.Sc. (Faculty of Veterinary Medicine, Peradeniya), M.Sc. Dairy Science',
    teleClinicAvailable: true
  },
  {
    id: 104,
    name: 'Sunil Fernando',
    title: 'Senior Soil Chemist & Plant Nutrition Analyst',
    specialty: 'Soil Specialist',
    institution: 'Rice Research & Development Institute (Batalagoda)',
    district: 'Anuradhapura',
    rating: 4.79,
    consultationsCount: 132,
    availabilityStatus: 'Available Tomorrow',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    regNumber: 'SLAgS-REG-2018-490',
    bio: 'Specialist in dry-zone soil salinity, nitrogen leaching mitigation, paddy soil remediation, bio-char soil conditioning, and customized organic composting formulations.',
    skills: ['Soil Salinity', 'NPK Optimization', 'Bio-Char Conditioning', 'Paddy Zinc Deficiency', 'Organic Soil Amendments'],
    contactDays: 'Mon, Wed, Thu (09:00 AM - 03:00 PM)',
    education: 'M.Phil. Soil Chemistry (University of Ruhuna), B.Sc. Agriculture',
    teleClinicAvailable: false
  },
  {
    id: 105,
    name: 'Kavindi Senaratne',
    title: 'Post-Harvest Technologist & Cold Chain Specialist',
    specialty: 'Post-Harvest Specialist',
    institution: 'National Institute of Post Harvest Management (NIPHM)',
    district: 'Anuradhapura',
    rating: 4.85,
    consultationsCount: 98,
    availabilityStatus: 'Available Today',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    regNumber: 'NIPHM-REG-2020-045',
    bio: 'Advising commercial buyers and farmers on temperature-controlled transport, ethylene scrubbing, export packaging, reducing transit bruising, and bulk storage pest management.',
    skills: ['Cold-Chain Protocols', 'Transit Bruising Control', 'Bulk Grain Storage', 'Modified Atmosphere Packaging', 'Shelf-Life Extension'],
    contactDays: 'Mon - Fri (09:00 AM - 05:00 PM)',
    education: 'M.Sc. Post-Harvest Technology (University of Peradeniya)',
    teleClinicAvailable: true
  }
];

// ==========================================
// DIAGNOSTIC LABS & TESTING SERVICES
// ==========================================
const LAB_SERVICES_DIRECTORY = [
  {
    id: 'lab-srv-1',
    name: 'Comprehensive Soil Fertility & NPK Profile',
    lab: 'National Soil Testing Laboratory (DOA Peradeniya)',
    turnaround: '3 - 5 Business Days',
    parameters: 'Soil pH, Electrical Conductivity (EC), Organic Matter %, Available N, Available P (Olsen), Exchangeable K, Ca, Mg',
    sampleReq: '500g composite topsoil (0-15cm depth), shade-dried, clean polythene bag',
    fee: 'LKR 1,500 (Subsidized DOA rate)',
    contact: '+94 81 238 8044',
    location: 'Peradeniya, Kandy'
  },
  {
    id: 'lab-srv-2',
    name: 'Plant Tissue Fungal & Bacterial Culture',
    lab: 'Horticultural Crop Research Institute - Pathology Lab',
    turnaround: '4 - 7 Business Days',
    parameters: 'Microscopic identification, agar culture isolation, bacterial streak test, blight/wilt strain classification',
    sampleReq: 'Fresh infected leaves/stem showing active margin; do not wrap in wet paper',
    fee: 'LKR 1,800',
    contact: '+94 81 238 8011',
    location: 'Gannoruwa, Peradeniya'
  },
  {
    id: 'lab-srv-3',
    name: 'Pesticide Residue & Heavy Metal Screening (MRL)',
    lab: 'Industrial Technology Institute (ITI) Agro-Chemical Testing Unit',
    turnaround: '5 - 7 Business Days',
    parameters: 'Organophosphates, Synthetic Pyrethroids, Glyphosate residues, Cadmium, Lead, Arsenic levels against export MRL standards',
    sampleReq: '1.0 kg random harvest sample from field lot, sealed airtight container',
    fee: 'LKR 6,500',
    contact: '+94 11 237 9800',
    location: 'Bauddhaloka Mawatha, Colombo 07'
  },
  {
    id: 'lab-srv-4',
    name: 'Livestock Milk & Somatic Cell Count (Mastitis)',
    lab: 'Veterinary Research Institute (VRI) Diagnostic Division',
    turnaround: '24 - 48 Hours',
    parameters: 'California Mastitis Test (CMT), Somatic Cell Count (SCC), bacterial culture & antibiotic sensitivity test',
    sampleReq: '50ml mid-stream sterile milk sample on ice pack',
    fee: 'LKR 1,200',
    contact: '+94 81 238 8311',
    location: 'Gannoruwa, Kandy'
  }
];

const LAB_SAMPLE_TRACKER = [
  {
    id: 'LAB-2026-904',
    testType: 'Comprehensive Soil pH & NPK Fertility Profile',
    labName: 'National Soil Testing Laboratory (Peradeniya)',
    crop: 'Welimada Greenhouse Tomatoes',
    farmer: 'Bandara Organic Farm',
    status: 'REPORT_ISSUED',
    stageNumber: 4,
    orderDate: 'Aug 18, 2026',
    completedDate: 'Aug 23, 2026',
    reportSummary: {
      soilPh: '6.3 (Slightly Acidic - Ideal for Solanaceae)',
      organicMatter: '3.8% (Optimal)',
      nitrogen: '42 ppm (Moderate)',
      phosphorus: '28 ppm (High)',
      potassium: '185 ppm (Adequate)',
      recommendation: 'Maintain compost top-dressing. Reduce synthetic phosphorus additions by 15% for the upcoming fruiting cycle.'
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
    completedDate: 'Est. Aug 27, 2026',
    reportSummary: null
  }
];

// ==========================================
// AGRARIAN SERVICE CENTERS DIRECTORY (Govijana Seva Kendraya)
// ==========================================
const AGRARIAN_CENTERS = [
  {
    id: 'asc-1',
    name: 'Welimada Agrarian Service Center',
    district: 'Badulla',
    address: 'Main Street, Welimada Central, Uva Province',
    officerInCharge: 'Anura Jayasooriya (Extension Director)',
    phone: '+94 57 224 5110',
    clinicHours: 'Tue & Thu: 08:30 AM - 03:30 PM',
    services: ['GAP Certification Audits', 'Subsidized Bio-Fertilizer Distribution', 'Soil Test Sample Drop-off', 'Seed Potato Certification']
  },
  {
    id: 'asc-2',
    name: 'Galewela Govijana Seva Kendraya',
    district: 'Matale',
    address: 'Dambulla Road, Galewela, Central Province',
    officerInCharge: 'R. M. Dissanayake (District Agricultural Officer)',
    phone: '+94 66 228 9204',
    clinicHours: 'Mon, Wed, Fri: 09:00 AM - 04:00 PM',
    services: ['Armyworm Pest Surveillance Desk', 'Paddy Soil Testing Kits', 'Drip Irrigation Subsidy Verification', 'Onion Storage Guidance']
  },
  {
    id: 'asc-3',
    name: 'Kandapola Highland Extension Center',
    district: 'Nuwara Eliya',
    address: 'Highland Ridge Rd, Kandapola, Nuwara Eliya',
    officerInCharge: 'Dr. Gamini Wickramasinghe (Advisory Field Lead)',
    phone: '+94 52 222 7831',
    clinicHours: 'Wed & Sat: 08:30 AM - 02:00 PM',
    services: ['Cold-Chain Transport Advisory', 'Fungicide Calibration Assistance', 'Greenhouse Construction Permits', 'Frost Protection Measures']
  },
  {
    id: 'asc-4',
    name: 'Thambuttegama Agrarian Hub',
    district: 'Anuradhapura',
    address: 'Irrigation Secretariat Complex, Thambuttegama',
    officerInCharge: 'Sunil Fernando (Soil & Fertilizer Analyst)',
    phone: '+94 25 227 6301',
    clinicHours: 'Mon - Fri: 08:30 AM - 04:30 PM',
    services: ['Maha Paddy Water Allocations', 'Saline Soil Remediation Planning', 'Organic Composting Certification', 'Chili Leaf Curl Clinic']
  },
  {
    id: 'asc-5',
    name: 'Gampaha District Veterinary & Extension Center',
    district: 'Gampaha',
    address: 'Kandy Road, Miriswatta, Gampaha',
    officerInCharge: 'Dr. Priyanka Ratnayake (Veterinary Surgeon)',
    phone: '+94 33 222 4118',
    clinicHours: 'Mon - Fri: 08:30 AM - 04:00 PM',
    services: ['Livestock Vaccination Drive', 'Dairy Quality Milk Testing', 'Silage Preparation Workshops', 'Poultry Flock Health Certification']
  }
];

// ==========================================
// PRE-POPULATED DIAGNOSTIC PRESETS
// ==========================================
const QUICK_DIAGNOSTIC_CHIPS = [
  {
    label: '🍅 Tomato Leaf Blight & Yellowing',
    specialty: 'Agronomist',
    question: 'Early leaf yellowing and brown necrotic concentric rings on tomato crop after continuous rain. Suspecting fungal early blight.',
    cropContext: 'Greenhouse Tomatoes (Welimada)',
    farmNotes: 'Growing Condition: Poly-tunnel; Soil pH: 6.2; High relative humidity > 85%'
  },
  {
    label: '🥕 Carrot Root Forking & Acidity',
    specialty: 'Soil Specialist',
    question: 'Severe soil acidity (tested pH 5.1) causing stunted root development, apical forking, and micronutrient lockout in highland carrots.',
    cropContext: 'Export Carrots (Nuwara Eliya)',
    farmNotes: 'Soil Type: Heavy red loam; Soil pH: 5.1; Previous crop: Cabbage'
  },
  {
    label: '🌾 Paddy Brown Planthopper (BPH)',
    specialty: 'Agricultural Officer',
    question: 'Circular hopperburn patches appearing in Maha season paddy tillering stage. Need bio-safe pesticide guidance and threshold monitoring.',
    cropContext: 'Paddy Rice - Bg 360 (Thambuttegama)',
    farmNotes: 'Water Level: 4cm; Growth Stage: Maximum Tillering; Weather: Overcast & warm'
  },
  {
    label: '🐄 Dairy Cattle Mastitis Management',
    specialty: 'Veterinarian',
    question: 'Reduced milk yield and mild udder heat in Jersey-Friesian cross dairy cow. Need antiseptic teat dip recommendations and isolation protocol.',
    cropContext: 'Dairy Cattle Herd (Gampaha)',
    farmNotes: 'Herd Size: 14 cows; Lactation Day: 42; Milking Method: Machine milking twice daily'
  },
  {
    label: '📦 Post-Harvest Transit & Quality Breakdown',
    specialty: 'Post-Harvest Specialist',
    question: 'Significant condensation and transit bruising observed upon arrival at wholesale market. Seeking optimal crating and ventilation steps.',
    cropContext: 'Bell Peppers & English Cucumbers',
    farmNotes: 'Transit Route: Nuwara Eliya to Dambulla Hub; Duration: 6 hours; Vehicle: Open ventilated truck'
  }
];

export const ExpertModule = () => {
  const { user, isExpert, isAgriculturalExpert, isAdmin } = useAuth();
  const isExpertUser = isExpert || isAgriculturalExpert || user?.role === 'AGRICULTURAL_EXPERT' || user?.role === 'EXPERT';

  // Navigation Tabs: 'directory' | 'ask' | 'consultations' | 'expert-queue' | 'labs' | 'centers' | 'tele-consult'
  const [activeTab, setActiveTab] = useState('directory');

  // Core Data States
  const [experts, setExperts] = useState(VERIFIED_EXPERTS);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);

  // Search & Filters for Experts Directory
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState('All');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState('ALL');

  // Centers District Filter
  const [centerDistrictFilter, setCenterDistrictFilter] = useState('ALL');
  const [centerSearchQuery, setCenterSearchQuery] = useState('');

  // Selected Expert Detail Modal
  const [selectedExpertModal, setSelectedExpertModal] = useState(null);

  // Selected Consultation Detail Modal
  const [selectedConsultationModal, setSelectedConsultationModal] = useState(null);

  // Lab Testing State
  const [labTests, setLabTests] = useState(LAB_SAMPLE_TRACKER);
  const [selectedLabReportModal, setSelectedLabReportModal] = useState(null);

  // Tele-Clinic Video Simulator State
  const [isSimCallActive, setIsSimCallActive] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [callDurationSec, setCallDurationSec] = useState(0);
  const [simOfficer, setSimOfficer] = useState(VERIFIED_EXPERTS[0]);

  // "Ask an Expert" Form State
  const [consultationRoleContext, setConsultationRoleContext] = useState(
    user?.role === 'BUYER' || user?.role === 'BUSINESS_BUYER' ? 'Buyer / Quality Inspector' : 'Farmer / Producer'
  );
  const [selectedSpecialty, setSelectedSpecialty] = useState('Agronomist');
  const [urgencyLevel, setUrgencyLevel] = useState('Normal');
  const [cropVariety, setCropVariety] = useState('');
  const [farmLocation, setFarmLocation] = useState(user?.location || 'Central Province');
  const [questionText, setQuestionText] = useState('');
  const [fieldNotes, setFieldNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreviewError, setImagePreviewError] = useState(false);

  // Expert Reply State (for Triage Queue)
  const [replyingToId, setReplyingToId] = useState(null);
  const [expertReplyText, setExpertReplyText] = useState('');
  const [expertDiagnosis, setExpertDiagnosis] = useState('');
  const [queueFilter, setQueueFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'ANSWERED'

  // Fetch Data from Backend API
  const fetchData = async () => {
    setLoading(true);
    try {
      const [expRes, consRes] = await Promise.all([
        expertsAPI.getAvailable().catch(() => ({ data: VERIFIED_EXPERTS })),
        isExpertUser
          ? expertsAPI.getAllConsultations().catch(() => ({ data: [] }))
          : expertsAPI.getMyConsultations().catch(() => ({ data: [] }))
      ]);

      if (expRes?.data?.length > 0) {
        // Merge backend data with rich frontend directory metadata
        const merged = expRes.data.map((bExp) => {
          const matched = VERIFIED_EXPERTS.find((f) => f.id === bExp.id || f.name.toLowerCase() === bExp.name?.toLowerCase());
          return { ...matched, ...bExp };
        });
        setExperts(merged);
      } else {
        setExperts(VERIFIED_EXPERTS);
      }

      if (consRes?.data) {
        setConsultations(consRes.data);
      }
    } catch (err) {
      console.error('Failed to load expert data:', err);
      setExperts(VERIFIED_EXPERTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isExpertUser]);

  // Tele-Clinic Call Timer
  useEffect(() => {
    let interval = null;
    if (isSimCallActive) {
      interval = setInterval(() => {
        setCallDurationSec((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDurationSec(0);
    }
    return () => clearInterval(interval);
  }, [isSimCallActive]);

  const formatCallTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Submit Inquiry Handler
  const handleSubmitInquiry = async (e) => {
    e.preventDefault();
    if (!questionText.trim()) {
      setActionNotice({ type: 'error', message: 'Please describe your crop issue or consultation inquiry.' });
      return;
    }

    setSubmitting(true);
    setActionNotice(null);

    const structuredFarmData = `Context: ${consultationRoleContext} | Location: ${farmLocation} | Crop/Commodity: ${cropVariety || 'Unspecified'} | Field Observation: ${fieldNotes || 'Standard field observation'}`;
    const formattedQuestion = `[${urgencyLevel} Priority] ${questionText.trim()}`;

    try {
      const res = await expertsAPI.submitConsultation({
        farmerEmail: user?.email || 'user@agrolink.com',
        farmerName: user?.name || (user?.email ? user.email.split('@')[0] : 'AgroLink Producer'),
        expertSpecialty: selectedSpecialty,
        question: formattedQuestion,
        farmData: structuredFarmData,
        imageUrl: imageUrl.trim() || undefined
      });

      if (res?.data) {
        setActionNotice({
          type: 'success',
          message: 'Inquiry submitted successfully! A verified agricultural officer has been notified.'
        });
        resetInquiryForm();
        fetchData();
        setActiveTab('consultations');
      }
    } catch (err) {
      // Graceful fallback for offline or development mock mode
      const mockConsultation = {
        id: Date.now(),
        farmerEmail: user?.email || 'user@agrolink.com',
        farmerName: user?.name || (user?.email ? user.email.split('@')[0] : 'You'),
        expertSpecialty: selectedSpecialty,
        question: formattedQuestion,
        farmData: structuredFarmData,
        imageUrl: imageUrl.trim() || undefined,
        status: 'PENDING',
        reply: null,
        createdAt: 'Just now'
      };
      setConsultations((prev) => [mockConsultation, ...prev]);
      setActionNotice({
        type: 'success',
        message: 'Inquiry submitted to the advisory triage queue!'
      });
      resetInquiryForm();
      setActiveTab('consultations');
    } finally {
      setSubmitting(false);
    }
  };

  const resetInquiryForm = () => {
    setQuestionText('');
    setFieldNotes('');
    setCropVariety('');
    setImageUrl('');
    setImagePreviewError(false);
  };

  // Preset diagnostic chip select
  const handleSelectPreset = (chip) => {
    setSelectedSpecialty(chip.specialty);
    setQuestionText(chip.question);
    setCropVariety(chip.cropContext);
    setFieldNotes(chip.farmNotes);
    setActiveTab('ask');
  };

  // Direct consult button from expert card
  const handleInitiateConsultWithExpert = (expert) => {
    setSelectedSpecialty(expert.specialty || 'Agronomist');
    setSelectedExpertModal(null);
    setActiveTab('ask');
  };

  // Expert Reply Handler (for Triage Queue)
  const handlePostReply = async (consultationId) => {
    if (!expertReplyText.trim()) return;

    setSubmitting(true);
    const completeReply = expertDiagnosis.trim()
      ? `Diagnosis & Assessment: ${expertDiagnosis.trim()}\n\nRecommended Action Plan: ${expertReplyText.trim()}`
      : expertReplyText.trim();

    try {
      const expertName = user?.name || (user?.email ? user.email.split('@')[0] : 'Agricultural Extension Specialist');
      const res = await expertsAPI.replyConsultation(consultationId, {
        reply: completeReply,
        expertName
      });

      if (res?.data) {
        setReplyingToId(null);
        setExpertReplyText('');
        setExpertDiagnosis('');
        setActionNotice({ type: 'success', message: 'Advisory recommendation dispatched to inquirer.' });
        fetchData();
      }
    } catch (err) {
      // Local state fallback for mock testing
      setConsultations((prev) =>
        prev.map((c) =>
          c.id === consultationId
            ? {
                ...c,
                status: 'ANSWERED',
                reply: completeReply,
                expertName: user?.name || 'Agricultural Extension Specialist',
                updatedAt: 'Just now'
              }
            : c
        )
      );
      setReplyingToId(null);
      setExpertReplyText('');
      setExpertDiagnosis('');
      setActionNotice({ type: 'success', message: 'Advisory recommendation recorded successfully.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered Experts
  const filteredExperts = experts.filter((exp) => {
    const matchesSearch =
      exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.skills?.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSpecialty =
      selectedSpecialtyFilter === 'All' ||
      exp.specialty?.toLowerCase() === selectedSpecialtyFilter.toLowerCase();

    const matchesDistrict =
      selectedDistrictFilter === 'ALL' ||
      exp.district?.toLowerCase() === selectedDistrictFilter.toLowerCase();

    return matchesSearch && matchesSpecialty && matchesDistrict;
  });

  // Filtered Agrarian Centers
  const filteredCenters = AGRARIAN_CENTERS.filter((c) => {
    const matchesDistrict = centerDistrictFilter === 'ALL' || c.district.toLowerCase() === centerDistrictFilter.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(centerSearchQuery.toLowerCase()) ||
      c.address.toLowerCase().includes(centerSearchQuery.toLowerCase()) ||
      c.officerInCharge.toLowerCase().includes(centerSearchQuery.toLowerCase());
    return matchesDistrict && matchesSearch;
  });

  // Filtered Triage Queue Consultations
  const filteredQueue = consultations.filter((c) => {
    if (queueFilter === 'PENDING') return c.status === 'PENDING';
    if (queueFilter === 'ANSWERED') return c.status === 'ANSWERED';
    return true;
  });

  const pendingCount = consultations.filter((c) => c.status === 'PENDING').length;
  const answeredCount = consultations.filter((c) => c.status === 'ANSWERED').length;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ======================================================== */}
        {/* HEADER & HUB OVERVIEW */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  National Extension & Advisory Network
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  Department of Agriculture Verified
                </span>
                {isExpertUser && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    <Award className="w-3.5 h-3.5 text-blue-600" />
                    Specialist Officer Mode
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Agricultural Experts & Advisory Hub
              </h1>
              <p className="text-slate-600 text-sm sm:text-base max-w-3xl leading-relaxed">
                Connect directly with certified agronomists, plant pathologists, soil chemists, and veterinary extension
                officers for diagnostic support, field recommendations, and Agrarian Service Center programs.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <button
                onClick={() => {
                  setActiveTab('ask');
                  setActionNotice(null);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                Ask an Expert
              </button>

              <button
                onClick={() => setActiveTab('consultations')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm border border-slate-300 transition-colors shadow-sm"
              >
                <Clock className="w-4 h-4 text-slate-500" />
                My Inquiries
                {consultations.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-800">
                    {consultations.length}
                  </span>
                )}
              </button>

              <button
                onClick={fetchData}
                disabled={loading}
                title="Refresh advisory data"
                className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Action Notice Banner */}
          {actionNotice && (
            <div
              className={`mt-4 p-4 rounded-xl text-sm flex items-center justify-between border ${
                actionNotice.type === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {actionNotice.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                <span>{actionNotice.message}</span>
              </div>
              <button
                onClick={() => setActionNotice(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Overview Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-100">
            <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/60">
              <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                Certified Specialists
              </div>
              <div className="mt-1 text-xl font-bold text-slate-900">{experts.length}</div>
              <div className="text-xs text-slate-500">Government & Research leads</div>
            </div>

            <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/60">
              <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                Service Centers
              </div>
              <div className="mt-1 text-xl font-bold text-slate-900">{AGRARIAN_CENTERS.length}</div>
              <div className="text-xs text-slate-500">Govijana Seva Kendraya</div>
            </div>

            <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/60">
              <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-amber-600" />
                Diagnostic Labs
              </div>
              <div className="mt-1 text-xl font-bold text-slate-900">{LAB_SERVICES_DIRECTORY.length}</div>
              <div className="text-xs text-slate-500">Soil, tissue & residue testing</div>
            </div>

            <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/60">
              <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                My Inquiries
              </div>
              <div className="mt-1 text-xl font-bold text-slate-900">{consultations.length}</div>
              <div className="text-xs text-slate-500">
                {pendingCount} pending, {answeredCount} answered
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* NAVIGATION TABS */}
        {/* ======================================================== */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-sm font-medium">
          <button
            onClick={() => setActiveTab('directory')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'directory'
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Specialist Directory
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'directory' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {filteredExperts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ask')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'ask'
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Ask an Expert
          </button>

          <button
            onClick={() => setActiveTab('consultations')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'consultations'
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            My Inquiries
            {consultations.length > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === 'consultations' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {consultations.length}
              </span>
            )}
          </button>

          {/* Expert Triage Queue Tab */}
          {isExpertUser && (
            <button
              onClick={() => setActiveTab('expert-queue')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                activeTab === 'expert-queue'
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-blue-700 bg-blue-50/60 hover:bg-blue-100/70 border border-blue-200'
              }`}
            >
              <Award className="w-4 h-4 text-blue-600" />
              Advisory Triage Queue
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-amber-500 text-white font-bold animate-pulse">
                  {pendingCount} Pending
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => setActiveTab('labs')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'labs'
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            Diagnostic & Lab Testing
          </button>

          <button
            onClick={() => setActiveTab('centers')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'centers'
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Agrarian Service Centers
          </button>

          <button
            onClick={() => setActiveTab('tele-consult')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'tele-consult'
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Video className="w-4 h-4" />
            Virtual Advisory Preview
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: SPECIALIST DIRECTORY */}
        {/* ======================================================== */}
        {activeTab === 'directory' && (
          <div className="space-y-6">
            {/* Search and Filter Toolbar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                {/* Search Bar */}
                <div className="md:col-span-6 relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by specialist name, title, crop disease, or keywords..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* District Filter */}
                <div className="md:col-span-3">
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select
                      value={selectedDistrictFilter}
                      onChange={(e) => setSelectedDistrictFilter(e.target.value)}
                      className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 appearance-none"
                    >
                      <option value="ALL">All Districts</option>
                      <option value="Kandy">Kandy</option>
                      <option value="Nuwara Eliya">Nuwara Eliya</option>
                      <option value="Gampaha">Gampaha</option>
                      <option value="Anuradhapura">Anuradhapura</option>
                      <option value="Badulla">Badulla</option>
                      <option value="Matale">Matale</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Clear Filters Reset */}
                <div className="md:col-span-3 flex justify-end">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedSpecialtyFilter('All');
                      setSelectedDistrictFilter('ALL');
                    }}
                    className="text-xs text-slate-500 hover:text-emerald-700 font-medium py-2 px-3 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>

              {/* Specialty Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
                  Specialty:
                </span>
                {['All', 'Agronomist', 'Agricultural Officer', 'Soil Specialist', 'Veterinarian', 'Post-Harvest Specialist'].map(
                  (spec) => (
                    <button
                      key={spec}
                      onClick={() => setSelectedSpecialtyFilter(spec)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                        selectedSpecialtyFilter === spec
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {spec}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Results Grid */}
            {loading ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
                <p className="text-slate-600 text-sm font-medium">Loading verified agricultural specialists...</p>
              </div>
            ) : filteredExperts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <Search className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-semibold text-slate-800">No specialists found</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto">
                  No registered agricultural experts match your active search and district filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSpecialtyFilter('All');
                    setSelectedDistrictFilter('ALL');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                >
                  Clear search filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredExperts.map((exp) => (
                  <div
                    key={exp.id}
                    className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 transition-all shadow-sm hover:shadow-md flex flex-col justify-between overflow-hidden"
                  >
                    <div className="p-5 space-y-4">
                      {/* Top Row: Avatar & Status */}
                      <div className="flex items-start gap-3.5">
                        <img
                          src={exp.avatarUrl}
                          alt={exp.name}
                          className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-base font-bold text-slate-900 truncate">{exp.name}</h3>
                            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" title="Verified Officer" />
                          </div>
                          <p className="text-xs font-medium text-emerald-700 truncate">{exp.title}</p>
                          <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                            <Building2 className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{exp.institution}</span>
                          </div>
                        </div>
                      </div>

                      {/* District & Reg Number */}
                      <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="flex items-center gap-1 text-slate-600 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {exp.district} District
                        </span>
                        <span className="text-slate-500 font-mono text-[11px]">{exp.regNumber}</span>
                      </div>

                      {/* Bio snippet */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {exp.bio}
                      </p>

                      {/* Competencies / Skills Tags */}
                      {exp.skills && exp.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {exp.skills.slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                          {exp.skills.length > 3 && (
                            <span className="px-1.5 py-0.5 text-[11px] text-slate-400">
                              +{exp.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Metrics: Rating & Consultations */}
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-500">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-semibold text-slate-800">{exp.rating}</span>
                          <span>({exp.consultationsCount} reviews)</span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-medium text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {exp.availabilityStatus}
                        </span>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedExpertModal(exp)}
                        className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => handleInitiateConsultWithExpert(exp)}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Ask Question
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: ASK AN EXPERT (INQUIRY FORM) */}
        {/* ======================================================== */}
        {activeTab === 'ask' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form Column */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  New Advisory Inquiry
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                  Submit an Inquiry to Extension Specialists
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  Describe your crop symptoms, pest damage, soil behavior, or harvest quality queries. Official
                  extension officers triage and answer cases according to regional agricultural protocols.
                </p>
              </div>

              {/* Quick Preset Diagnostic Chips */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Common Diagnostic Templates (Click to prefill)
                </div>
                <div className="flex flex-wrap gap-2">
                  {QUICK_DIAGNOSTIC_CHIPS.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(chip)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 text-xs font-medium text-slate-700 hover:text-emerald-700 transition-colors shadow-2xs text-left"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmitInquiry} className="space-y-5">
                {/* Role / Context Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Submitting As
                    </label>
                    <select
                      value={consultationRoleContext}
                      onChange={(e) => setConsultationRoleContext(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    >
                      <option value="Farmer / Producer">Farmer / Field Cultivator</option>
                      <option value="Buyer / Quality Inspector">Commercial Buyer / Quality Inspector</option>
                      <option value="Agrarian Extension Officer">Agrarian Field Officer</option>
                      <option value="Home Gardener">Home / Urban Agriculturalist</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Advisory Domain / Specialty
                    </label>
                    <select
                      value={selectedSpecialty}
                      onChange={(e) => setSelectedSpecialty(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    >
                      <option value="Agronomist">Agronomy & Crop Pathology (Pest/Fungal)</option>
                      <option value="Agricultural Officer">Extension Officer (Cultivation & Schemes)</option>
                      <option value="Soil Specialist">Soil Chemistry & Fertilizer Management</option>
                      <option value="Veterinarian">Veterinary & Livestock Extension</option>
                      <option value="Post-Harvest Specialist">Post-Harvest, Storage & Packaging</option>
                    </select>
                  </div>
                </div>

                {/* Priority & Crop Variety */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Urgency Level
                    </label>
                    <select
                      value={urgencyLevel}
                      onChange={(e) => setUrgencyLevel(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    >
                      <option value="Normal">Normal (Standard 24-48h)</option>
                      <option value="High">High (Active pest/infection spread)</option>
                      <option value="Critical">Critical (Immediate harvest threat)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Crop / Produce Type
                    </label>
                    <input
                      type="text"
                      value={cropVariety}
                      onChange={(e) => setCropVariety(e.target.value)}
                      placeholder="e.g. Greenhouse Tomato, Bg 360 Paddy, Carrots"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Location / District
                    </label>
                    <input
                      type="text"
                      value={farmLocation}
                      onChange={(e) => setFarmLocation(e.target.value)}
                      placeholder="e.g. Welimada, Badulla"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                  </div>
                </div>

                {/* Question / Symptoms */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Problem Description & Questions <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Describe visible leaf spots, wilting patterns, pest presence, soil condition, or post-harvest quality issues in detail..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 leading-relaxed"
                  />
                </div>

                {/* Field Observation & Cultivation Data */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Field Environment & Cultivation Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={fieldNotes}
                    onChange={(e) => setFieldNotes(e.target.value)}
                    placeholder="e.g. Poly-tunnel; Drip fertigated; Soil pH 6.3; Rainfall during past 3 days"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Providing specific growing context helps officers determine accurate diagnoses and chemical dilution rates.
                  </p>
                </div>

                {/* Diagnostic Image Attachment URL */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Sample Photo URL (High resolution image of leaves, roots, or produce)
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <ImageIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => {
                          setImageUrl(e.target.value);
                          setImagePreviewError(false);
                        }}
                        placeholder="https://example.com/images/crop-sample.jpg"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                      />
                    </div>
                    {imageUrl && (
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-700 border border-slate-200"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Image Preview Box */}
                  {imageUrl && !imagePreviewError && (
                    <div className="mt-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3">
                      <img
                        src={imageUrl}
                        alt="Sample Preview"
                        onError={() => setImagePreviewError(true)}
                        className="w-16 h-16 rounded-lg object-cover border border-slate-200 bg-white"
                      />
                      <div className="text-xs text-slate-600">
                        <p className="font-semibold text-slate-800">Diagnostic image attached</p>
                        <p className="text-[11px] text-slate-500 truncate max-w-sm">{imageUrl}</p>
                      </div>
                    </div>
                  )}
                  {imagePreviewError && (
                    <p className="text-xs text-rose-500 mt-1">
                      Unable to load image from this URL. Please verify the link.
                    </p>
                  )}
                </div>

                {/* Submit Row */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={resetInquiryForm}
                    className="text-xs text-slate-500 hover:text-slate-800 font-medium py-2 px-3"
                  >
                    Clear Form
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors shadow-sm disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting to Extension Queue...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Advisory Inquiry
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Sidebar Guidelines */}
            <div className="lg:col-span-4 space-y-5">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Official Advisory Protocol
                </div>
                <ul className="text-xs text-slate-600 space-y-3 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Certified Diagnosticians:</strong> All inquiries are reviewed by verified agronomists and
                      extension officers registered with the Department of Agriculture.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Safe Chemical Guidance:</strong> Prescriptions adhere strictly to national Maximum Residue
                      Limits (MRL) and safety pre-harvest intervals (PHI).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Field Drop-Off:</strong> If laboratory tissue culture is required, you can submit physical
                      samples at your nearest Agrarian Service Center.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Commercial Buyers Notice */}
              <div className="bg-amber-50/70 rounded-2xl border border-amber-200/80 p-5 space-y-2 text-xs text-amber-900">
                <div className="font-semibold flex items-center gap-1.5 text-amber-800 text-sm">
                  <Building2 className="w-4 h-4 text-amber-600" />
                  For Commercial Buyers & Processors
                </div>
                <p className="leading-relaxed">
                  Food processors and export buyers can request post-harvest quality audits, quarantine defect
                  reviews, and pesticide residue verification protocols prior to lot dispatch.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: MY INQUIRIES & CONSULTATIONS */}
        {/* ======================================================== */}
        {activeTab === 'consultations' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">My Consultation History & Advisory Cases</h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Track pending diagnostic inquiries and review official advisory recommendations from agricultural officers.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('ask')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shrink-0 shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Ask New Question
              </button>
            </div>

            {loading ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
                <p className="text-slate-600 text-sm font-medium">Loading your consultation records...</p>
              </div>
            ) : consultations.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800">No consultation inquiries yet</h3>
                  <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto mt-1">
                    You have not submitted any advisory questions. Connect with our certified agronomists for help with
                    crop protection and soil health.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('ask')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                >
                  Submit Your First Question
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {consultations.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:border-slate-300 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              item.status === 'ANSWERED'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {item.status === 'ANSWERED' ? (
                              <>
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                Answered by Specialist
                              </>
                            ) : (
                              <>
                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                Pending Advisory Review
                              </>
                            )}
                          </span>

                          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                            Domain: {item.expertSpecialty || 'General Agronomy'}
                          </span>

                          <span className="text-xs text-slate-400">
                            {item.createdAt || 'Recent'}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 pt-1">
                          {item.question}
                        </h3>
                      </div>

                      <button
                        onClick={() => setSelectedConsultationModal(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold shrink-0 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        View Full Details
                      </button>
                    </div>

                    {/* Farm Context pill */}
                    {item.farmData && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 font-mono">
                        {item.farmData}
                      </div>
                    )}

                    {/* Attached Image Snippet if any */}
                    {item.imageUrl && (
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-200/60 w-fit">
                        <img
                          src={item.imageUrl}
                          alt="Diagnostic sample"
                          className="w-12 h-12 rounded object-cover border border-slate-200"
                        />
                        <span className="text-xs text-slate-600 font-medium">Diagnostic photo attached</span>
                      </div>
                    )}

                    {/* Official Reply Box if answered */}
                    {item.status === 'ANSWERED' && item.reply && (
                      <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                        <div className="flex items-center justify-between text-xs font-semibold text-emerald-900">
                          <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-700" />
                            Official Extension Recommendation
                            {item.expertName && ` — ${item.expertName}`}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                          {item.reply}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: EXPERT ADVISORY TRIAGE QUEUE (OFFICER MODE) */}
        {/* ======================================================== */}
        {activeTab === 'expert-queue' && isExpertUser && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                    Extension Officer Workbench
                  </span>
                  <span className="text-xs text-slate-500">
                    Logged in as: {user?.name || user?.email || 'Agricultural Specialist'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Advisory Triage & Inquirer Inquiries
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Review submitted field cases from farmers and commercial buyers, assess symptoms, and provide
                  certified agronomic and pest management recommendations.
                </p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold">
                <button
                  onClick={() => setQueueFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    queueFilter === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Cases ({consultations.length})
                </button>
                <button
                  onClick={() => setQueueFilter('PENDING')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    queueFilter === 'PENDING'
                      ? 'bg-amber-500 text-white shadow-2xs'
                      : 'text-amber-800 hover:text-amber-900'
                  }`}
                >
                  Pending ({pendingCount})
                </button>
                <button
                  onClick={() => setQueueFilter('ANSWERED')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    queueFilter === 'ANSWERED'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-emerald-800 hover:text-emerald-900'
                  }`}
                >
                  Answered ({answeredCount})
                </button>
              </div>
            </div>

            {/* Queue List */}
            {filteredQueue.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h3 className="text-base font-semibold text-slate-800">No cases in this queue</h3>
                <p className="text-xs text-slate-500">
                  There are currently no cases matching filter "{queueFilter}".
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQueue.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              item.status === 'ANSWERED'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {item.status}
                          </span>
                          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                            Specialty: {item.expertSpecialty || 'General'}
                          </span>
                          <span className="text-xs text-slate-400">
                            Inquirer: <strong>{item.farmerName || item.farmerEmail || 'Producer'}</strong>
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 mt-2">
                          {item.question}
                        </h3>
                      </div>

                      <span className="text-xs text-slate-400 shrink-0">
                        {item.createdAt || 'Recent'}
                      </span>
                    </div>

                    {/* Field Data */}
                    {item.farmData && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-mono text-slate-700">
                        {item.farmData}
                      </div>
                    )}

                    {/* Attached Photo */}
                    {item.imageUrl && (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 w-fit">
                        <img
                          src={item.imageUrl}
                          alt="Diagnostic sample"
                          className="w-20 h-20 rounded-lg object-cover border border-slate-200"
                        />
                        <div className="text-xs">
                          <p className="font-semibold text-slate-800">Submitted Field Sample</p>
                          <a
                            href={item.imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-700 hover:underline inline-flex items-center gap-1 mt-1"
                          >
                            View Full Resolution <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Answered State */}
                    {item.status === 'ANSWERED' ? (
                      <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1">
                        <div className="font-semibold text-emerald-900">
                          Official Reply recorded by {item.expertName || 'Extension Specialist'}:
                        </div>
                        <p className="text-slate-700 whitespace-pre-line leading-relaxed">{item.reply}</p>
                      </div>
                    ) : (
                      /* Replying Box */
                      <div className="pt-3 border-t border-slate-100 space-y-3">
                        {replyingToId === item.id ? (
                          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                            <div className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                              <span>Compose Expert Advisory Response</span>
                              <button
                                onClick={() => setReplyingToId(null)}
                                className="text-slate-400 hover:text-slate-600"
                              >
                                Cancel
                              </button>
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                                Clinical Assessment / Pathogen Diagnosis
                              </label>
                              <input
                                type="text"
                                value={expertDiagnosis}
                                onChange={(e) => setExpertDiagnosis(e.target.value)}
                                placeholder="e.g. Early Blight (Alternaria solani) accelerated by high canopy humidity"
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                                Action Plan, Dilution & Safety Guidelines
                              </label>
                              <textarea
                                rows={3}
                                value={expertReplyText}
                                onChange={(e) => setExpertReplyText(e.target.value)}
                                placeholder="Specify exact cultural practices (e.g. pruning, irrigation adjustment), recommended active ingredient, dosage per 16L knapsack sprayer, and pre-harvest interval (PHI)..."
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                              />
                            </div>

                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setReplyingToId(null)}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-100"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handlePostReply(item.id)}
                                disabled={submitting || !expertReplyText.trim()}
                                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold disabled:opacity-50 transition-colors shadow-2xs"
                              >
                                {submitting ? 'Submitting...' : 'Dispatch Recommendation'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-end">
                            <button
                              onClick={() => {
                                setReplyingToId(item.id);
                                setExpertReplyText('');
                                setExpertDiagnosis('');
                              }}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-2xs"
                            >
                              <Send className="w-3.5 h-3.5" />
                              Write Official Advisory Reply
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: DIAGNOSTIC & LAB TESTING DIRECTORY */}
        {/* ======================================================== */}
        {activeTab === 'labs' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  National Laboratories & Testing Services
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                  Agricultural Laboratory Testing Directory
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-3xl">
                  Accredited diagnostic testing for soil nutrient status, leaf fungal pathogens, pesticide residue
                  (MRL), and livestock milk quality. Physical samples can be dropped at any Agrarian Service Center.
                </p>
              </div>
            </div>

            {/* Available Lab Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {LAB_SERVICES_DIRECTORY.map((srv) => (
                <div
                  key={srv.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-bold text-slate-900">{srv.name}</h3>
                      <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-semibold shrink-0 border border-emerald-200">
                        {srv.fee}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 flex items-center gap-1 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {srv.lab}
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-2">
                      <div>
                        <span className="font-semibold text-slate-700">Testing Scope: </span>
                        <span className="text-slate-600">{srv.parameters}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">Sample Collection Requirement: </span>
                        <span className="text-slate-600">{srv.sampleReq}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Turnaround: <strong>{srv.turnaround}</strong>
                    </span>
                    <span className="text-slate-600 font-medium">
                      Inquiries: {srv.contact}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Active Sample Tracking Section */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Regional Laboratory Sample Pipeline</h3>
                  <p className="text-xs text-slate-500">Track diagnostic samples processed through Agrarian drop-off points</p>
                </div>
              </div>

              <div className="space-y-3">
                {labTests.map((sample) => (
                  <div
                    key={sample.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-slate-700">{sample.id}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            sample.status === 'REPORT_ISSUED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {sample.status === 'REPORT_ISSUED' ? 'Report Issued' : 'Analysis In Progress'}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-800">{sample.testType}</p>
                      <p className="text-xs text-slate-500">
                        {sample.crop} • {sample.farmer} • Submitted: {sample.orderDate}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {sample.reportSummary ? (
                        <button
                          onClick={() => setSelectedLabReportModal(sample)}
                          className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                          View Lab Report
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500 italic">
                          Results expected {sample.completedDate}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: AGRARIAN SERVICE CENTERS DIRECTORY */}
        {/* ======================================================== */}
        {activeTab === 'centers' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  Govijana Seva Kendraya Directory
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                  Agrarian Service Centers & Field Offices
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-3xl">
                  Local agrarian service centers provide physical soil test drop-offs, subsidized compost allocations,
                  GAP auditing, and on-site consultations with regional agricultural extension directors.
                </p>
              </div>
            </div>

            {/* Filter Toolbar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={centerSearchQuery}
                  onChange={(e) => setCenterSearchQuery(e.target.value)}
                  placeholder="Search by center name, officer, or address..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div className="w-full sm:w-64">
                <select
                  value={centerDistrictFilter}
                  onChange={(e) => setCenterDistrictFilter(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                >
                  <option value="ALL">All Districts</option>
                  <option value="Badulla">Badulla</option>
                  <option value="Matale">Matale</option>
                  <option value="Nuwara Eliya">Nuwara Eliya</option>
                  <option value="Anuradhapura">Anuradhapura</option>
                  <option value="Gampaha">Gampaha</option>
                </select>
              </div>
            </div>

            {/* Centers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredCenters.map((center) => (
                <div
                  key={center.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {center.district} District
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-2">{center.name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {center.address}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Officer-in-Charge:</span>
                      <span className="font-semibold text-slate-800">{center.officerInCharge}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Direct Telephone:</span>
                      <span className="font-mono text-emerald-700 font-semibold">{center.phone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Clinic Hours:</span>
                      <span className="text-slate-700">{center.clinicHours}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      Available Center Services:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {center.services.map((svc, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-100"
                        >
                          {svc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 7: VIRTUAL ADVISORY PREVIEW & SIMULATOR */}
        {/* ======================================================== */}
        {activeTab === 'tele-consult' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                Interactive Video Consultation Simulator
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                Tele-Advisory Audio/Video Inspection Room
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-3xl">
                Test your camera, microphone, and connection quality ahead of scheduled virtual clinic hours with
                Department of Agriculture officers. This ensures seamless visual inspection of plant disease symptoms.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Simulator Screen */}
              <div className="lg:col-span-8 bg-slate-900 rounded-2xl p-6 text-white flex flex-col justify-between min-h-[420px] shadow-md relative overflow-hidden">
                {/* Top Overlay */}
                <div className="flex items-center justify-between z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      {isSimCallActive ? `Live Session • ${formatCallTime(callDurationSec)}` : 'Ready to Connect (Demo)'}
                    </span>
                  </div>

                  <span className="text-xs text-slate-400 font-mono">
                    Encryption: TLS 1.3 / Audio 48kHz
                  </span>
                </div>

                {/* Center Video Area */}
                <div className="my-auto text-center space-y-4 py-8 z-10">
                  {isCamOff ? (
                    <div className="w-20 h-20 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-slate-500">
                      <VideoOff className="w-8 h-8" />
                    </div>
                  ) : (
                    <div className="relative inline-block">
                      <img
                        src={simOfficer.avatarUrl}
                        alt={simOfficer.name}
                        className="w-28 h-28 rounded-2xl object-cover border-2 border-emerald-500/40 mx-auto shadow-lg"
                      />
                      {isSimCallActive && (
                        <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-emerald-600 text-[10px] font-bold text-white uppercase">
                          Officer
                        </span>
                      )}
                    </div>
                  )}

                  <div>
                    <h3 className="text-base font-bold text-white">{simOfficer.name}</h3>
                    <p className="text-xs text-emerald-400">{simOfficer.title}</p>
                    <p className="text-xs text-slate-400 mt-1">{simOfficer.institution}</p>
                  </div>

                  {isSimCallActive && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />
                      Audio Quality: Optimal (Ping 24ms)
                    </div>
                  )}
                </div>

                {/* Bottom Call Controls */}
                <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-800 z-10">
                  <button
                    onClick={() => setIsMicMuted(!isMicMuted)}
                    className={`p-3 rounded-xl transition-colors ${
                      isMicMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                    title={isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}
                  >
                    {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={() => setIsCamOff(!isCamOff)}
                    className={`p-3 rounded-xl transition-colors ${
                      isCamOff ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                    title={isCamOff ? 'Turn Camera On' : 'Turn Camera Off'}
                  >
                    {isCamOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={() => setIsSimCallActive(!isSimCallActive)}
                    className={`px-5 py-3 rounded-xl font-semibold text-xs transition-colors flex items-center gap-2 ${
                      isSimCallActive
                        ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                    }`}
                  >
                    {isSimCallActive ? (
                      <>
                        <PhoneOff className="w-4 h-4" /> End Call Demo
                      </>
                    ) : (
                      <>
                        <PhoneCall className="w-4 h-4" /> Start Simulator Session
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Sidebar Guide */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                  <h4 className="text-sm font-bold text-slate-900">Virtual Clinic Checklist</h4>
                  <ul className="text-xs text-slate-600 space-y-2.5 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Natural Lighting:</strong> Hold leaf samples in clear, non-glare daylight so officers can distinguish necrotic ring spots.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Field History Ready:</strong> Have dates of planting, recent fungicide spray dates, and soil test results on hand.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Clinic Hours:</strong> Virtual advisory rooms open automatically 10 minutes prior to your confirmed booking slot.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200 text-xs text-slate-600 space-y-2">
                  <div className="font-semibold text-slate-800">Select Specialist for Preview:</div>
                  <div className="space-y-1.5">
                    {VERIFIED_EXPERTS.slice(0, 3).map((exp) => (
                      <button
                        key={exp.id}
                        onClick={() => setSimOfficer(exp)}
                        className={`w-full p-2 rounded-xl text-left flex items-center gap-2.5 transition-colors ${
                          simOfficer.id === exp.id
                            ? 'bg-white font-semibold text-emerald-800 border border-emerald-300 shadow-2xs'
                            : 'hover:bg-slate-200/70 text-slate-700'
                        }`}
                      >
                        <img src={exp.avatarUrl} alt={exp.name} className="w-7 h-7 rounded-lg object-cover" />
                        <div className="truncate">
                          <p className="text-xs truncate">{exp.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{exp.specialty}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL 1: EXPERT PROFILE & CREDENTIALS */}
        {/* ======================================================== */}
        <AnimatePresence>
          {selectedExpertModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6"
              >
                {/* Modal Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={selectedExpertModal.avatarUrl}
                      alt={selectedExpertModal.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 bg-slate-100 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-slate-900">{selectedExpertModal.name}</h3>
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      </div>
                      <p className="text-sm font-semibold text-emerald-700">{selectedExpertModal.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{selectedExpertModal.institution}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedExpertModal(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Key Credentials Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-500 block">Registration:</span>
                    <span className="font-mono font-semibold text-slate-800">{selectedExpertModal.regNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">District Focus:</span>
                    <span className="font-semibold text-slate-800">{selectedExpertModal.district} District</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Advisory Rating:</span>
                    <span className="font-semibold text-slate-800">
                      ★ {selectedExpertModal.rating} ({selectedExpertModal.consultationsCount} cases)
                    </span>
                  </div>
                </div>

                {/* Biography */}
                <div className="space-y-1.5 text-xs text-slate-600 leading-relaxed">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Background & Qualifications
                  </h4>
                  <p>{selectedExpertModal.bio}</p>
                  {selectedExpertModal.education && (
                    <p className="text-slate-500 pt-1">
                      <strong>Academic Credentials:</strong> {selectedExpertModal.education}
                    </p>
                  )}
                </div>

                {/* Core Advisory Specializations */}
                {selectedExpertModal.skills && (
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                      Core Advisory Competencies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedExpertModal.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Availability info */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                  <span>
                    <strong>Official Hours:</strong> {selectedExpertModal.contactDays}
                  </span>
                  <span className="text-emerald-700 font-semibold">{selectedExpertModal.availabilityStatus}</span>
                </div>

                {/* Modal Footer Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setSelectedExpertModal(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleInitiateConsultWithExpert(selectedExpertModal)}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Submit Inquiry to {selectedExpertModal.name.split(' ')[0]}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ======================================================== */}
        {/* MODAL 2: CONSULTATION DETAIL & OFFICIAL ADVISORY REPORT */}
        {/* ======================================================== */}
        <AnimatePresence>
          {selectedConsultationModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          selectedConsultationModal.status === 'ANSWERED'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {selectedConsultationModal.status === 'ANSWERED'
                          ? 'Official Advisory Completed'
                          : 'Pending Extension Triage'}
                      </span>
                      <span className="text-xs text-slate-400">
                        Case ID: #{selectedConsultationModal.id}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      {selectedConsultationModal.question}
                    </h3>
                  </div>

                  <button
                    onClick={() => setSelectedConsultationModal(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Submitter & Field Context */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between text-slate-600">
                    <span>
                      Inquirer: <strong>{selectedConsultationModal.farmerName || 'Producer'}</strong>
                    </span>
                    <span>Date: {selectedConsultationModal.createdAt || 'Recent'}</span>
                  </div>
                  {selectedConsultationModal.farmData && (
                    <div className="font-mono text-slate-700 pt-1 border-t border-slate-200">
                      {selectedConsultationModal.farmData}
                    </div>
                  )}
                </div>

                {/* Attached Image */}
                {selectedConsultationModal.imageUrl && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Attached Diagnostic Sample
                    </p>
                    <img
                      src={selectedConsultationModal.imageUrl}
                      alt="Sample"
                      className="w-full h-56 rounded-xl object-cover border border-slate-200"
                    />
                  </div>
                )}

                {/* Official Expert Recommendation */}
                {selectedConsultationModal.status === 'ANSWERED' && selectedConsultationModal.reply ? (
                  <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Expert Advisory Recommendation
                      </span>
                      <span>{selectedConsultationModal.expertName || 'Extension Specialist'}</span>
                    </div>

                    <p className="text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                      {selectedConsultationModal.reply}
                    </p>

                    <div className="pt-2 border-t border-emerald-200/60 text-[11px] text-emerald-800">
                      Adhere strictly to personal protective equipment (PPE) guidelines and recommended pre-harvest intervals.
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      This inquiry is currently assigned to a verified agricultural officer for triage and diagnostic assessment.
                    </span>
                  </div>
                )}

                {/* Modal Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    Print Summary
                  </button>

                  <button
                    onClick={() => setSelectedConsultationModal(null)}
                    className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ======================================================== */}
        {/* MODAL 3: LAB TEST REPORT DETAIL */}
        {/* ======================================================== */}
        <AnimatePresence>
          {selectedLabReportModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {selectedLabReportModal.id}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-2">
                      {selectedLabReportModal.testType}
                    </h3>
                    <p className="text-xs text-slate-500">{selectedLabReportModal.labName}</p>
                  </div>
                  <button
                    onClick={() => setSelectedLabReportModal(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {selectedLabReportModal.reportSummary && (
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Soil pH Reaction:</span>
                        <span className="font-semibold text-slate-800">{selectedLabReportModal.reportSummary.soilPh}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Organic Matter:</span>
                        <span className="font-semibold text-slate-800">{selectedLabReportModal.reportSummary.organicMatter}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Available Nitrogen (N):</span>
                        <span className="font-semibold text-slate-800">{selectedLabReportModal.reportSummary.nitrogen}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Available Phosphorus (P):</span>
                        <span className="font-semibold text-slate-800">{selectedLabReportModal.reportSummary.phosphorus}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Exchangeable Potassium (K):</span>
                        <span className="font-semibold text-slate-800">{selectedLabReportModal.reportSummary.potassium}</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                      <span className="font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Official Agronomic Recommendation:
                      </span>
                      <p className="text-slate-700 leading-relaxed">
                        {selectedLabReportModal.reportSummary.recommendation}
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setSelectedLabReportModal(null)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default ExpertModule;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Building2,
  CheckCircle2,
  Calendar,
  Package,
  DollarSign,
  Truck,
  PlusCircle,
  Search,
  Filter,
  ShieldCheck,
  Award,
  X,
  Send,
  Sparkles,
  Users,
  Check,
  TrendingUp,
  FileCheck,
  Eye,
  Printer,
  ChevronRight,
  Clock,
  Briefcase,
  Calculator,
  PenTool,
  CheckSquare,
  BadgeCheck,
  ArrowUpRight,
  Lock,
  QrCode,
  Download,
  AlertCircle,
  RefreshCw,
  Thermometer,
  Radio,
  FileSpreadsheet,
  AlertTriangle,
  RotateCcw,
  Zap,
  Globe,
  Bot,
  Scan,
  Shield,
  CheckCircle,
  Percent,
  CloudRain,
  Layers,
  Landmark,
  ShieldAlert,
  Scale
} from 'lucide-react';
import { contractFarmingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const DEFAULT_CONTRACTS = [
  {
    id: 'TENDER-801',
    buyerName: 'Keells Supermarket',
    buyerCategory: 'Supermarket Chain',
    cropName: 'Organic Tomato',
    category: 'Vegetables',
    icon: '🍅',
    monthlyQuantityKg: 2000,
    durationMonths: 6,
    minPriceLkr: 180,
    maxPriceLkr: 220,
    aiPriceBenchmark: 205,
    qualityGrade: 'Grade A Organic',
    deliveryFrequency: 'Weekly',
    applicantCount: 14,
    district: 'Nuwara Eliya',
    escrowGuaranteed: true,
    certifications: ['🌱 GAP Certified', '🇪🇺 EU Export Standard'],
    description: 'Weekly scheduled supply of Grade A vine-ripened organic tomatoes for 50+ retail supermarket branches.',
    qualityStandards: 'Grade A size min 55mm, zero synthetic chemical residues, firm texture, max 2% blemishes.',
    logisticsProtocol: 'Refrigerated transport at 12°C. Central Distribution Hub pickup in Dambulla every Monday 06:00 AM.',
    milestonePayment: '20% Advance Escrow Deposit locked on contract signing. 80% released upon QR delivery scan.'
  },
  {
    id: 'TENDER-802',
    buyerName: 'Cargills Food City',
    buyerCategory: 'Supermarket Chain',
    cropName: 'Green Chillies',
    category: 'Vegetables',
    icon: '🌶️',
    monthlyQuantityKg: 1500,
    durationMonths: 12,
    minPriceLkr: 350,
    maxPriceLkr: 400,
    aiPriceBenchmark: 380,
    qualityGrade: 'Export Grade A',
    deliveryFrequency: 'Weekly',
    applicantCount: 8,
    district: 'Jaffna',
    escrowGuaranteed: true,
    certifications: ['🌱 GAP Certified', '🔒 ISO 22000'],
    description: 'Long-term 12-month supply contract for high-spice green chillies with automated temperature-controlled logistics.',
    qualityStandards: 'Uniform dark green color, minimum length 7cm, crisp texture, maximum 3% moisture loss during transit.',
    logisticsProtocol: 'Ventilated crate transport. Direct regional collection center drop-off in Jaffna or Dambulla.',
    milestonePayment: '100% Escrow backed. Bi-weekly automated settlement directly to farmer bank account.'
  },
  {
    id: 'TENDER-803',
    buyerName: 'Shangri-La Hotels & Resorts',
    buyerCategory: 'Hospitality Group',
    cropName: 'Samba Rice',
    category: 'Grains',
    icon: '🌾',
    monthlyQuantityKg: 5000,
    durationMonths: 6,
    minPriceLkr: 210,
    maxPriceLkr: 230,
    aiPriceBenchmark: 222,
    qualityGrade: 'Premium Aged Samba',
    deliveryFrequency: 'Bi-Weekly',
    applicantCount: 22,
    district: 'Anuradhapura',
    escrowGuaranteed: true,
    certifications: ['🌿 100% Organic', '🔒 ISO 22000'],
    description: 'Direct procurement of aged tank Samba rice for luxury hotel chain kitchen dining operations.',
    qualityStandards: 'Aged minimum 6 months, maximum 11% moisture content, zero foreign matter or broken grains > 2%.',
    logisticsProtocol: '25kg moisture-barrier sealed sacks. Delivery to Colombo Central Receiving Dock.',
    milestonePayment: '25% Advance Escrow Lock. Remaining 75% settled upon automated batch quality certificate verification.'
  },
  {
    id: 'TENDER-804',
    buyerName: 'Dilmah Ceylon Tea & Spices',
    buyerCategory: 'Exporter & Processor',
    cropName: 'Alba Cinnamon Quills',
    category: 'Spices',
    icon: '🌿',
    monthlyQuantityKg: 350,
    durationMonths: 12,
    minPriceLkr: 1400,
    maxPriceLkr: 1650,
    aiPriceBenchmark: 1550,
    qualityGrade: 'Alba Export Grade',
    deliveryFrequency: 'Monthly',
    applicantCount: 11,
    district: 'Galle',
    escrowGuaranteed: true,
    certifications: ['🇪🇺 EU Export Standard', '🌱 Organic Certified'],
    description: 'Export-grade thin quills Ceylon cinnamon with low coumarin certification for European retail distribution.',
    qualityStandards: 'Pencil-thin Alba quills diameter < 6mm, certified coumarin < 0.002%, hand-peeled smooth finish.',
    logisticsProtocol: 'Vacuum-sealed double cartons. Direct delivery to Galle Processing Facility.',
    milestonePayment: '30% Escrow deposit upon contract acceptance. 70% paid immediately after lab coumarin analysis.'
  },
  {
    id: 'TENDER-805',
    buyerName: 'Elephant House / CCS',
    buyerCategory: 'Food & Beverage Corp',
    cropName: 'Sugar-Baby Watermelons',
    category: 'Fruits',
    icon: '🍉',
    monthlyQuantityKg: 3000,
    durationMonths: 3,
    minPriceLkr: 160,
    maxPriceLkr: 190,
    aiPriceBenchmark: 178,
    qualityGrade: 'Grade A High Brix',
    deliveryFrequency: 'Weekly',
    applicantCount: 19,
    district: 'Hambantota',
    escrowGuaranteed: true,
    certifications: ['🌱 GAP Certified'],
    description: 'High Brix natural sweetness watermelons for beverage processing and retail distribution.',
    qualityStandards: 'Minimum Brix sugar content 11.5°, fruit weight 3.5kg - 5.5kg, undamaged rind.',
    logisticsProtocol: 'Bulk padded crates. Weekly dispatch from Hambantota collection hub to Biyagama plant.',
    milestonePayment: '100% Escrow vaulted. Weekly payouts upon weighbridge verification.'
  },
  {
    id: 'TENDER-806',
    buyerName: 'SPAR Supermarket Sri Lanka',
    buyerCategory: 'Supermarket Chain',
    cropName: 'Highland Carrots',
    category: 'Vegetables',
    icon: '🥕',
    monthlyQuantityKg: 1200,
    durationMonths: 6,
    minPriceLkr: 240,
    maxPriceLkr: 280,
    aiPriceBenchmark: 265,
    qualityGrade: 'Grade A Harvest',
    deliveryFrequency: 'Bi-Weekly',
    applicantCount: 7,
    district: 'Nuwara Eliya',
    escrowGuaranteed: true,
    certifications: ['🌱 GAP Certified'],
    description: 'Washed and sorted crisp highland carrots for retail supermarket produce shelves.',
    qualityStandards: 'Washed, tops trimmed, length 12-18cm, smooth skin, zero soil accumulation.',
    logisticsProtocol: 'Perforated 10kg crates. Temperature maintained at 8°C during transit.',
    milestonePayment: '20% Escrow advance. 80% released upon store reception confirmation.'
  }
];

const INITIAL_APPLICATIONS = [
  {
    id: 'APP-901',
    tenderId: 'TENDER-803',
    buyerName: 'Shangri-La Hotels & Resorts',
    farmerName: 'Sunil Perera (Green Valley Farm)',
    cropName: 'Samba Rice',
    offeredQtyKg: 2500,
    offeredPrice: 220,
    isCounterOffer: false,
    status: 'APPROVED',
    statusBadge: 'Approved - Escrow Locked 🔒',
    appliedDate: '2026-08-10',
    district: 'Anuradhapura',
    contractTerm: '6 Months',
    signed: true,
    deliveredKg: 1250,
    escrowReleasedLkr: 275000,
    nextPickupDate: '2026-08-24',
    iotTemp: '11.8°C',
    iotHumidity: '82%',
    iotEta: 'En-route to Colombo Dock (ETA 45m)',
    isDisputed: false,
    batchCode: 'BATCH-2026-ANU-8941'
  },
  {
    id: 'APP-902',
    tenderId: 'TENDER-801',
    buyerName: 'Keells Supermarket',
    farmerName: 'Kamal Fernando (Highland Organics)',
    cropName: 'Organic Tomato',
    offeredQtyKg: 1000,
    offeredPrice: 225,
    isCounterOffer: true,
    counterReason: 'Requesting +Rs 15/kg due to USDA Organic certification and greenhouse cultivation.',
    status: 'UNDER_REVIEW',
    statusBadge: 'Counter-Offer Proposed 💬',
    appliedDate: '2026-08-18',
    district: 'Nuwara Eliya',
    contractTerm: '6 Months',
    signed: false,
    deliveredKg: 0,
    escrowReleasedLkr: 0,
    nextPickupDate: 'Pending Signing',
    iotTemp: '12.0°C',
    iotHumidity: '78%',
    iotEta: 'Pending Pickup',
    isDisputed: false,
    batchCode: 'BATCH-2026-NWR-0941'
  }
];

export const ContractFarming = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('active-tenders');
  const [contractsList, setContractsList] = useState(DEFAULT_CONTRACTS);
  const [myApplications, setMyApplications] = useState(INITIAL_APPLICATIONS);
  const [appliedIds, setAppliedIds] = useState(['TENDER-803', 'TENDER-801']);
  const [loading, setLoading] = useState(false);

  // Currency Toggle State (LKR vs USD)
  const [currency, setCurrency] = useState('LKR');
  const LKR_TO_USD = 1 / 300;

  // Search & Filter States
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [sortBy, setSortBy] = useState('DEFAULT');

  // Modal States
  const [selectedTenderForApply, setSelectedTenderForApply] = useState(null);
  const [selectedTenderForView, setSelectedTenderForView] = useState(null);
  const [selectedTenderForCalc, setSelectedTenderForCalc] = useState(null);
  const [selectedAppForSign, setSelectedAppForSign] = useState(null);
  const [selectedAppForPdf, setSelectedAppForPdf] = useState(null);
  const [selectedAppForDispute, setSelectedAppForDispute] = useState(null);
  const [selectedAppForQrScan, setSelectedAppForQrScan] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [applySuccessMsg, setApplySuccessMsg] = useState('');

  // Counter-Offer Toggle State
  const [isCounterOfferMode, setIsCounterOfferMode] = useState(false);

  // Dispute Reason State
  const [disputeReason, setDisputeReason] = useState('Quality Mismatch / Damage');
  const [disputeNotes, setDisputeNotes] = useState('');

  // Calculator Form State
  const [calcData, setCalcData] = useState({
    monthlyKg: 1000,
    priceLkr: 200,
    durationMonths: 6,
    frequency: 'Weekly'
  });

  // Agreement Terms Simulator & Yield Guarantee State
  const [simulatorData, setSimulatorData] = useState({
    cropName: 'Organic Tomato',
    category: 'Vegetables',
    buyerType: 'Supermarket Chain (e.g. Keells, Cargills)',
    acreage: 2.0,
    expectedYieldPerAcre: 1500,
    targetFloorPrice: 210,
    durationMonths: 6,
    advanceEscrowPct: 25,
    dispatchFrequency: 'Weekly',
    weatherRiskLevel: 'Moderate Risk',
    guaranteeCommitmentPct: 90
  });

  const [activeTimelineStep, setActiveTimelineStep] = useState(1);

  // Digital Signature State
  const [digitalSignature, setDigitalSignature] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);

  // Form States for Apply Modal
  const [applyForm, setApplyForm] = useState({
    farmerName: '',
    capacityKg: '',
    district: 'Nuwara Eliya',
    offerPrice: '',
    counterReason: '',
    notes: ''
  });

  // Form States for Create Modal
  const [createForm, setCreateForm] = useState({
    buyerName: '',
    buyerCategory: 'Supermarket Chain',
    cropName: '',
    category: 'Vegetables',
    monthlyQuantityKg: '',
    durationMonths: '6',
    minPriceLkr: '',
    maxPriceLkr: '',
    qualityGrade: 'Grade A',
    deliveryFrequency: 'Weekly',
    district: 'Nuwara Eliya',
    description: ''
  });

  useEffect(() => {
    const fetchContracts = async () => {
      setLoading(true);
      try {
        const res = await contractFarmingAPI.getAll();
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          setContractsList(res.data);
        }
      } catch (err) {
        console.warn('Backend API contracts endpoint unavailable. Using default B2B tenders catalog:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, []);

  const formatPrice = (priceLkr) => {
    if (currency === 'USD') {
      return `$${(priceLkr * LKR_TO_USD).toFixed(2)}`;
    }
    return `Rs. ${priceLkr.toLocaleString()}`;
  };

  const getCategoryBadgeClass = (categoryName) => {
    switch (categoryName) {
      case 'Supermarket Chain':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
      case 'Hospitality Group':
        return 'bg-purple-50 text-purple-800 border-purple-200/80';
      case 'Exporter & Processor':
        return 'bg-amber-50 text-amber-800 border-amber-200/80';
      default:
        return 'bg-sky-50 text-sky-800 border-sky-200/80';
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!selectedTenderForApply) return;
    
    const newApp = {
      id: `APP-${Math.floor(900 + Math.random() * 100)}`,
      tenderId: selectedTenderForApply.id,
      buyerName: selectedTenderForApply.buyerName,
      farmerName: applyForm.farmerName || 'Registered Farmer',
      cropName: selectedTenderForApply.cropName,
      offeredQtyKg: Number(applyForm.capacityKg) || 500,
      offeredPrice: Number(applyForm.offerPrice) || selectedTenderForApply.minPriceLkr,
      isCounterOffer: isCounterOfferMode,
      counterReason: applyForm.counterReason || '',
      status: 'UNDER_REVIEW',
      statusBadge: isCounterOfferMode ? 'Counter-Offer Proposed 💬' : 'Under Review ⏳',
      appliedDate: new Date().toISOString().split('T')[0],
      district: applyForm.district,
      contractTerm: `${selectedTenderForApply.durationMonths} Months`,
      signed: false,
      deliveredKg: 0,
      escrowReleasedLkr: 0,
      nextPickupDate: 'Pending Signing',
      iotTemp: '12.0°C',
      iotHumidity: '80%',
      iotEta: 'Scheduled',
      isDisputed: false,
      batchCode: `BATCH-2026-${applyForm.district.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
    };

    try {
      await contractFarmingAPI.apply();
    } catch (err) {
      // Fallback
    }

    setAppliedIds((prev) => [...prev, selectedTenderForApply.id]);
    setMyApplications((prev) => [newApp, ...prev]);
    setApplySuccessMsg(`Application for ${selectedTenderForApply.buyerName} submitted successfully!`);
    setSelectedTenderForApply(null);
    setIsCounterOfferMode(false);
    
    setTimeout(() => {
      setApplySuccessMsg('');
    }, 4000);
  };

  const handleApproveApplication = (appId) => {
    setMyApplications((prev) =>
      prev.map((app) =>
        app.id === appId
          ? {
              ...app,
              status: 'APPROVED',
              statusBadge: 'Approved - Escrow Locked 🔒'
            }
          : app
      )
    );
    setApplySuccessMsg(`Application ${appId} approved & Escrow funds locked in vault!`);

    setTimeout(() => {
      setApplySuccessMsg('');
    }, 4000);
  };

  const handleSimulateQrScanConfirm = () => {
    if (!selectedAppForQrScan) return;
    const appId = selectedAppForQrScan.id;
    
    setMyApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          const newDelivered = Math.min(app.offeredQtyKg, app.deliveredKg + 500);
          const newReleased = newDelivered * app.offeredPrice;
          return {
            ...app,
            deliveredKg: newDelivered,
            escrowReleasedLkr: newReleased
          };
        }
        return app;
      })
    );

    setApplySuccessMsg(`QR Scan Verified! Batch Code ${selectedAppForQrScan.batchCode || 'BATCH-2026'} received. Escrow payout released! 🎉`);
    setSelectedAppForQrScan(null);

    setTimeout(() => {
      setApplySuccessMsg('');
    }, 4000);
  };

  const handleLogDispatch = (appId) => {
    setMyApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          const newDelivered = Math.min(app.offeredQtyKg, app.deliveredKg + 500);
          const newReleased = newDelivered * app.offeredPrice;
          return {
            ...app,
            deliveredKg: newDelivered,
            escrowReleasedLkr: newReleased
          };
        }
        return app;
      })
    );
    setApplySuccessMsg(`Logged shipment dispatch of +500kg! Escrow payment automatically released to farmer account.`);

    setTimeout(() => {
      setApplySuccessMsg('');
    }, 4000);
  };

  const handleRenewContract = (appId) => {
    setMyApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            offeredQtyKg: app.offeredQtyKg + 1000,
            deliveredKg: 0,
            statusBadge: 'Renewed for 6 Months 🔄'
          };
        }
        return app;
      })
    );
    setApplySuccessMsg(`Contract ${appId} extended by +6 Months & +1,000kg quota successfully!`);

    setTimeout(() => {
      setApplySuccessMsg('');
    }, 4000);
  };

  const handleRaiseDisputeSubmit = (e) => {
    e.preventDefault();
    if (!selectedAppForDispute) return;

    setMyApplications((prev) =>
      prev.map((app) =>
        app.id === selectedAppForDispute.id
          ? {
              ...app,
              status: 'DISPUTED',
              statusBadge: 'Dispute in Escrow Arbitration ⚠️',
              isDisputed: true
            }
          : app
      )
    );

    setApplySuccessMsg(`Dispute claim filed for ${selectedAppForDispute.buyerName}. AgroLink Escrow Arbitration initiated.`);
    setSelectedAppForDispute(null);
    setDisputeNotes('');

    setTimeout(() => {
      setApplySuccessMsg('');
    }, 4000);
  };

  const handleExportCsv = () => {
    const headers = ['Tender ID', 'Buyer Name', 'Category', 'Crop Name', 'Monthly Quota (kg)', 'Min Price (Rs)', 'Max Price (Rs)', 'District', 'Duration (Mos)'];
    const rows = contractsList.map((c) => [
      c.id,
      `"${c.buyerName}"`,
      c.buyerCategory,
      `"${c.cropName}"`,
      c.monthlyQuantityKg,
      c.minPriceLkr,
      c.maxPriceLkr,
      `"${c.district}"`,
      c.durationMonths
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'agrolink_b2b_tenders.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDigitalSignSubmit = (e) => {
    e.preventDefault();
    if (!selectedAppForSign || !digitalSignature || !termsAgreed) return;

    setMyApplications((prev) =>
      prev.map((app) =>
        app.id === selectedAppForSign.id
          ? { ...app, signed: true }
          : app
      )
    );

    setApplySuccessMsg(`B2B Escrow Supply Agreement digitally signed by ${digitalSignature}!`);
    setSelectedAppForSign(null);
    setDigitalSignature('');
    setTermsAgreed(false);

    setTimeout(() => {
      setApplySuccessMsg('');
    }, 4000);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const newTender = {
      id: `TENDER-${Math.floor(800 + Math.random() * 100)}`,
      buyerName: createForm.buyerName || 'Enterprise Buyer',
      buyerCategory: createForm.buyerCategory,
      cropName: createForm.cropName,
      category: createForm.category,
      icon: createForm.category === 'Grains' ? '🌾' : createForm.category === 'Spices' ? '🌶️' : createForm.category === 'Fruits' ? '🍎' : '🥬',
      monthlyQuantityKg: Number(createForm.monthlyQuantityKg) || 1000,
      durationMonths: Number(createForm.durationMonths) || 6,
      minPriceLkr: Number(createForm.minPriceLkr) || 200,
      maxPriceLkr: Number(createForm.maxPriceLkr) || 250,
      aiPriceBenchmark: Math.round((Number(createForm.minPriceLkr) + Number(createForm.maxPriceLkr)) / 2),
      qualityGrade: createForm.qualityGrade,
      deliveryFrequency: createForm.deliveryFrequency,
      applicantCount: 0,
      district: createForm.district,
      escrowGuaranteed: true,
      certifications: ['🌱 GAP Certified'],
      description: createForm.description || 'Enterprise contract procurement requirement.',
      qualityStandards: 'Grade A standard, zero synthetic pesticide residues.',
      logisticsProtocol: 'Standard temperature controlled transport.',
      milestonePayment: '100% Escrow backed. Bi-weekly settlement upon QR scan.'
    };

    try {
      await contractFarmingAPI.create(newTender);
    } catch (err) {
      // Fallback
    }

    setContractsList((prev) => [newTender, ...prev]);
    setShowCreateModal(false);
    setApplySuccessMsg(`New B2B Purchase Request for ${newTender.cropName} created successfully!`);

    setTimeout(() => {
      setApplySuccessMsg('');
    }, 4000);

    setCreateForm({
      buyerName: '',
      buyerCategory: 'Supermarket Chain',
      cropName: '',
      category: 'Vegetables',
      monthlyQuantityKg: '',
      durationMonths: '6',
      minPriceLkr: '',
      maxPriceLkr: '',
      qualityGrade: 'Grade A',
      deliveryFrequency: 'Weekly',
      district: 'Nuwara Eliya',
      description: ''
    });
  };

  // Filter & Sort Logic
  const getFilteredContracts = () => {
    let result = contractsList.filter((item) => {
      const matchesKeyword =
        !searchKeyword ||
        item.cropName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.buyerName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.district.toLowerCase().includes(searchKeyword.toLowerCase());

      const matchesCategory =
        !selectedCategory || item.category === selectedCategory || item.cropName.toLowerCase().includes(selectedCategory.toLowerCase());

      const matchesDistrict =
        !selectedDistrict || item.district.toLowerCase().includes(selectedDistrict.toLowerCase());

      const matchesDuration =
        !selectedDuration || item.durationMonths === Number(selectedDuration);

      return matchesKeyword && matchesCategory && matchesDistrict && matchesDuration;
    });

    if (sortBy === 'QTY_HIGH') {
      result.sort((a, b) => b.monthlyQuantityKg - a.monthlyQuantityKg);
    } else if (sortBy === 'PRICE_HIGH') {
      result.sort((a, b) => b.maxPriceLkr - a.maxPriceLkr);
    } else if (sortBy === 'NEWEST') {
      result.sort((a, b) => b.id.localeCompare(a.id));
    }

    return result;
  };

  const filteredContracts = getFilteredContracts();

  // Calculator Math
  const monthlyRevenue = calcData.monthlyKg * calcData.priceLkr;
  const totalContractRevenue = monthlyRevenue * calcData.durationMonths;
  const escrowAdvanceLock = totalContractRevenue * 0.20;
  const perDispatchPayout = calcData.frequency === 'Weekly' ? monthlyRevenue / 4 : monthlyRevenue / 2;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
      {/* HERO HEADER & ACTION TOOLBAR WITH BACKGROUND GRID */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 text-white shadow-2xl relative overflow-hidden border border-emerald-800/40">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold uppercase tracking-wider border border-emerald-500/30">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Direct Enterprise Procurement &amp; Escrow Guarantee</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
              Contract Farming &amp; B2B Purchase Requests 📑
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
              Supermarkets, luxury hotel chains, and exporters publish long-term future harvest requirements. Farmers apply to lock in guaranteed prices backed 100% by AgroLink Bank Escrow.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* CURRENCY TOGGLE */}
            <button
              onClick={() => setCurrency(currency === 'LKR' ? 'USD' : 'LKR')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-extrabold text-xs rounded-xl border border-white/20 transition flex items-center gap-2 cursor-pointer"
              title="Toggle currency view"
            >
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>{currency === 'LKR' ? '🇱🇰 LKR (Rs)' : '💵 USD ($)'}</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-xs rounded-xl border border-white/20 transition flex items-center gap-2 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export CSV
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/30 flex items-center gap-2 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Post Purchase Request</span>
            </button>
          </div>
        </div>
      </div>

      {/* FEEDBACK SUCCESS NOTIFICATION BANNER */}
      {applySuccessMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg flex items-center justify-between font-bold text-xs"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <span>{applySuccessMsg}</span>
          </div>
          <button onClick={() => setApplySuccessMsg('')} className="p-1 hover:bg-emerald-700 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* STATS HIGHLIGHT BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-3xl shadow-md border border-slate-100">
        <div className="space-y-1 p-2">
          <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Active Contract Value</span>
          <h4 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
            {currency === 'USD' ? '$228.3K+' : 'Rs 68.5M+'}
          </h4>
          <p className="text-[11px] text-slate-400">Guaranteed Enterprise Trade</p>
        </div>

        <div className="space-y-1 p-2">
          <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Registered Enterprise Buyers</span>
          <h4 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">24 Chains</h4>
          <p className="text-[11px] text-slate-400">Supermarkets &amp; Exporters</p>
        </div>

        <div className="space-y-1 p-2">
          <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Escrow Vault Security</span>
          <h4 className="text-2xl sm:text-3xl font-extrabold font-display text-emerald-600">100% Locked</h4>
          <p className="text-[11px] text-slate-400">Zero Default Risk</p>
        </div>

        <div className="space-y-1 p-2">
          <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Contracted Growers</span>
          <h4 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">185 Farmers</h4>
          <p className="text-[11px] text-slate-400">Across 16 Districts</p>
        </div>
      </div>

      {/* FLOATING PILL NAVIGATION TABS */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setActiveTab('active-tenders')}
          className={`px-5 py-3 rounded-2xl text-xs font-extrabold transition-all duration-200 flex items-center gap-2 cursor-pointer border ${
            activeTab === 'active-tenders'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Active B2B Tenders</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'active-tenders' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
            {contractsList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('my-applications')}
          className={`px-5 py-3 rounded-2xl text-xs font-extrabold transition-all duration-200 flex items-center gap-2 cursor-pointer border ${
            activeTab === 'my-applications'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>My Submitted Applications</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'my-applications' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
            {myApplications.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('buyer-manager')}
          className={`px-5 py-3 rounded-2xl text-xs font-extrabold transition-all duration-200 flex items-center gap-2 cursor-pointer border ${
            activeTab === 'buyer-manager'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Enterprise Buyer Portal</span>
        </button>

        <button
          onClick={() => setActiveTab('terms-simulator')}
          className={`px-5 py-3 rounded-2xl text-xs font-extrabold transition-all duration-200 flex items-center gap-2 cursor-pointer border ${
            activeTab === 'terms-simulator'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Calculator className="w-4 h-4 text-emerald-500" />
          <span>Agreement Simulator &amp; Yield Guarantee 🌾</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-extrabold">
            NEW
          </span>
        </button>
      </div>

      {/* TAB 1: ALL ACTIVE B2B TENDERS */}
      {activeTab === 'active-tenders' && (
        <div className="space-y-6">
          {/* FILTER & SEARCH BAR */}
          <div className="premium-card p-5 bg-white border border-slate-100 shadow-md flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search crop, buyer, or district..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 transition"
              />
              {searchKeyword && (
                <button onClick={() => setSearchKeyword('')} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              {/* CATEGORY PILLS */}
              <div className="flex flex-wrap gap-1.5 items-center">
                {[
                  { label: 'All', value: '' },
                  { label: '🥬 Vegetables', value: 'Vegetables' },
                  { label: '🌾 Grains', value: 'Grains' },
                  { label: '🌶️ Spices', value: 'Spices' },
                  { label: '🍎 Fruits', value: 'Fruits' }
                ].map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                      selectedCategory === cat.value
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* DISTRICT SELECT */}
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer shadow-2xs"
              >
                <option value="">All Districts 📍</option>
                {['Nuwara Eliya', 'Jaffna', 'Kandy', 'Galle', 'Anuradhapura', 'Hambantota'].map((dist) => (
                  <option key={dist} value={dist}>📍 {dist}</option>
                ))}
              </select>

              {/* DURATION SELECT */}
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer shadow-2xs"
              >
                <option value="">All Durations</option>
                <option value="3">3 Months</option>
                <option value="6">6 Months</option>
                <option value="12">12 Months</option>
              </select>

              {/* SORT BY */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer shadow-2xs"
              >
                <option value="DEFAULT">⭐ Featured</option>
                <option value="QTY_HIGH">🌾 Volume: High to Low</option>
                <option value="PRICE_HIGH">💲 Price: High to Low</option>
                <option value="NEWEST">🕒 Newest Tenders</option>
              </select>
            </div>
          </div>

          {/* TENDERS GRID */}
          {filteredContracts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 space-y-3 shadow-md">
              <div className="text-4xl">📑</div>
              <h3 className="text-lg font-bold text-slate-800 font-display">No Contract Tenders Found</h3>
              <p className="text-slate-500 text-sm">Try adjusting your keyword query or category filters.</p>
              <button
                onClick={() => {
                  setSearchKeyword('');
                  setSelectedCategory('');
                  setSelectedDistrict('');
                  setSelectedDuration('');
                }}
                className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContracts.map((item) => {
                const isApplied = appliedIds.includes(item.id);
                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -6 }}
                    className="premium-card p-6 bg-white border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5"
                  >
                    <div className="space-y-4">
                      {/* BUYER HEADER */}
                      <div className="flex justify-between items-start">
                        <div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getCategoryBadgeClass(item.buyerCategory)}`}>
                            {item.buyerCategory}
                          </span>
                          <h3 className="text-lg font-extrabold text-slate-900 font-display mt-1">
                            {item.buyerName}
                          </h3>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5">📍 Target District: {item.district}</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60 text-[10px] font-extrabold uppercase shrink-0">
                          {item.qualityGrade}
                        </span>
                      </div>

                      {/* CERTIFICATION BADGES */}
                      {item.certifications && (
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {item.certifications.map((c) => (
                            <span key={c} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[9px] font-extrabold border border-slate-200">
                              {c}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* AI MARKET BENCHMARK WIDGET */}
                      {item.aiPriceBenchmark && (
                        <div className="p-2.5 bg-emerald-50/80 border border-emerald-200/80 rounded-xl flex items-center justify-between text-[11px]">
                          <span className="flex items-center gap-1 font-bold text-emerald-800">
                            <Bot className="w-3.5 h-3.5 text-emerald-600" /> AI Market Price Benchmark:
                          </span>
                          <span className="font-extrabold text-emerald-700 font-display">
                            {formatPrice(item.aiPriceBenchmark)}/kg
                          </span>
                        </div>
                      )}

                      {/* REQUIREMENT CARD WITH ICON */}
                      <div className="p-3.5 bg-gradient-to-r from-emerald-50/80 to-teal-50/50 rounded-2xl border border-emerald-100/80 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{item.icon || '🌾'}</span>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Harvest</span>
                            <span className="text-sm font-extrabold text-emerald-800 font-display">
                              {item.cropName}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Monthly Quota</span>
                          <span className="text-xs font-black text-slate-900">
                            {item.monthlyQuantityKg.toLocaleString()} kg/mo
                          </span>
                        </div>
                      </div>

                      {/* DESCRIPTION */}
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>

                      {/* KEY CONTRACT METRICS */}
                      <div className="space-y-2 text-xs pt-1">
                        <div className="flex justify-between items-center text-slate-600">
                          <span className="font-medium">Contract Duration:</span>
                          <span className="font-extrabold text-slate-900">{item.durationMonths} Months Guaranteed</span>
                        </div>

                        <div className="flex justify-between items-center text-slate-600">
                          <span className="font-medium">Offered Price Range:</span>
                          <span className="font-extrabold text-emerald-600">
                            {formatPrice(item.minPriceLkr)} – {formatPrice(item.maxPriceLkr)}/kg
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-slate-600">
                          <span className="font-medium">Dispatch Frequency:</span>
                          <span className="font-bold text-slate-800">{item.deliveryFrequency} Schedule</span>
                        </div>
                      </div>
                    </div>

                    {/* FOOTER ACTIONS */}
                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setSelectedTenderForView(item)}
                          className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-600" /> Specs
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTenderForCalc(item);
                            setCalcData({
                              monthlyKg: item.monthlyQuantityKg,
                              priceLkr: Math.round((item.minPriceLkr + item.maxPriceLkr) / 2),
                              durationMonths: item.durationMonths,
                              frequency: item.deliveryFrequency
                            });
                          }}
                          className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] rounded-xl border border-emerald-200 transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Calculator className="w-3.5 h-3.5 text-emerald-600" /> Revenue Calc
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          {item.applicantCount} Farmers Applied
                        </span>

                        {isApplied ? (
                          <span className="px-4 py-2.5 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs border border-emerald-200">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Application Sent
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedTenderForApply(item);
                              setApplyForm({
                                farmerName: user?.email ? user.email.split('@')[0] : 'Sunil Perera',
                                capacityKg: Math.round(item.monthlyQuantityKg * 0.5),
                                district: item.district.split('/')[0].trim(),
                                offerPrice: Math.round((item.minPriceLkr + item.maxPriceLkr) / 2),
                                counterReason: '',
                                notes: 'Verified grower with organic certification.'
                              });
                            }}
                            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition flex items-center gap-1.5 cursor-pointer"
                          >
                            Apply for Contract →
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY SUBMITTED APPLICATIONS */}
      {activeTab === 'my-applications' && (
        <div className="space-y-6">
          {/* WEEKLY DISPATCH CALENDAR TIMELINE WIDGET */}
          <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-xl space-y-4 border border-slate-800 relative overflow-hidden">
            <div className="flex justify-between items-center">
              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-500/30">
                  Monthly Supply Schedule Calendar
                </span>
                <h3 className="text-xl font-extrabold font-display mt-1">Upcoming Harvest Dispatches 📅</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">August - September 2026</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span>🗓️ Mon, Aug 24</span>
                  <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-md">500 kg Pickup</span>
                </div>
                <p className="text-slate-300 text-[11px]">Shangri-La Hotels • Aged Samba Rice</p>
              </div>

              <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-amber-400 font-bold">
                  <span>🗓️ Fri, Aug 28</span>
                  <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded-md">300 kg Pickup</span>
                </div>
                <p className="text-slate-300 text-[11px]">Keells Supermarket • Organic Tomato</p>
              </div>

              <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-teal-400 font-bold">
                  <span>🗓️ Wed, Sep 02</span>
                  <span className="text-[10px] bg-teal-500/20 px-2 py-0.5 rounded-md">100 kg Pickup</span>
                </div>
                <p className="text-slate-300 text-[11px]">Dilmah Spices • Alba Cinnamon</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myApplications.map((app) => {
              const fulfillmentPct = Math.min(100, Math.round((app.deliveredKg / app.offeredQtyKg) * 100));
              return (
                <div key={app.id} className="premium-card p-6 bg-white border border-slate-100 shadow-md space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Application ID: {app.id}</span>
                        <h4 className="text-lg font-extrabold text-slate-900 font-display mt-0.5">{app.buyerName}</h4>
                        <p className="text-xs font-bold text-emerald-700">Harvest: 🌾 {app.cropName}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                        app.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : app.status === 'DISPUTED' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {app.statusBadge}
                      </span>
                    </div>

                    {app.isCounterOffer && (
                      <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-semibold space-y-1">
                        <span className="font-extrabold block">💬 Counter-Offer Submitted: {formatPrice(app.offeredPrice)}/kg</span>
                        <p className="text-[11px] text-amber-800 line-clamp-2">{app.counterReason}</p>
                      </div>
                    )}

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-2 gap-2 text-xs font-semibold">
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase block">Submitted Quota</span>
                        <span className="text-slate-900 font-extrabold">{app.offeredQtyKg.toLocaleString()} kg / month</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase block">Agreed Rate</span>
                        <span className="text-emerald-600 font-extrabold">{formatPrice(app.offeredPrice)} / kg</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase block">Contract Term</span>
                        <span className="text-slate-800 font-bold">{app.contractTerm}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase block">Next Pickup</span>
                        <span className="text-slate-800 font-bold">{app.nextPickupDate}</span>
                      </div>
                    </div>

                    {/* IOT COLD-CHAIN TELEMETRY SENSOR WIDGET */}
                    {app.status === 'APPROVED' && (
                      <div className="p-3 bg-teal-50/70 border border-teal-200/80 rounded-2xl space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase text-teal-800">
                          <span className="flex items-center gap-1">
                            <Radio className="w-3.5 h-3.5 text-teal-600 animate-pulse" /> Live IoT Cold-Chain Sensors
                          </span>
                          <span className="text-teal-700">100% Signal</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="p-1.5 bg-white rounded-xl border border-teal-100">
                            <span className="text-[9px] text-slate-400 uppercase font-bold block">Temp</span>
                            <span className="font-extrabold text-teal-700">{app.iotTemp}</span>
                          </div>
                          <div className="p-1.5 bg-white rounded-xl border border-teal-100">
                            <span className="text-[9px] text-slate-400 uppercase font-bold block">Humidity</span>
                            <span className="font-extrabold text-teal-700">{app.iotHumidity}</span>
                          </div>
                          <div className="p-1.5 bg-white rounded-xl border border-teal-100">
                            <span className="text-[9px] text-slate-400 uppercase font-bold block">Status</span>
                            <span className="font-extrabold text-emerald-600">Optimal</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-teal-800 font-bold text-center">📍 {app.iotEta}</p>
                      </div>
                    )}

                    {/* FULFILLMENT MILESTONE PROGRESS TRACKER */}
                    {app.status === 'APPROVED' && (
                      <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 shadow-inner">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-300 font-bold">Monthly Supply Fulfillment:</span>
                          <span className="text-emerald-400 font-extrabold">{app.deliveredKg.toLocaleString()} / {app.offeredQtyKg.toLocaleString()} kg ({fulfillmentPct}%)</span>
                        </div>

                        {/* PROGRESS BAR */}
                        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${fulfillmentPct}%` }}
                          />
                        </div>

                        <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-800 text-slate-300">
                          <span>Escrow Released to Account:</span>
                          <span className="text-emerald-400 font-extrabold font-display">
                            {formatPrice(app.escrowReleasedLkr)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    {app.status === 'APPROVED' && (
                      <>
                        <button
                          onClick={() => setSelectedAppForQrScan(app)}
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer"
                        >
                          <Scan className="w-3.5 h-3.5" /> Scan QR 🔎
                        </button>

                        <button
                          onClick={() => handleLogDispatch(app.id)}
                          className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5" /> +500kg
                        </button>

                        <button
                          onClick={() => handleRenewContract(app.id)}
                          className="px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer"
                          title="Renew contract term"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Renew
                        </button>

                        <button
                          onClick={() => setSelectedAppForPdf(app)}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-600" /> PDF 📄
                        </button>
                      </>
                    )}

                    {app.status !== 'APPROVED' && (
                      <span className="text-xs text-slate-400 font-bold">Waiting for buyer approval &amp; Escrow lock</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: ENTERPRISE BUYER PORTAL MANAGER */}
      {activeTab === 'buyer-manager' && (
        <div className="space-y-6">
          <div className="premium-card p-6 bg-slate-900 text-white shadow-xl space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
                  Enterprise Buyer Control Center
                </span>
                <h3 className="text-xl font-extrabold font-display mt-2">Incoming Farmer Tenders &amp; Counter-Offers</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" /> Post New Tender
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Review farmer capacity proposals and price counter-offers. Accept proposals to automatically lock Escrow funds.
            </p>
          </div>

          <div className="space-y-4">
            {myApplications.map((app) => (
              <div key={app.id} className="premium-card p-6 bg-white border border-slate-100 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">Tender: {app.tenderId}</span>
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      🌾 {app.cropName}
                    </span>
                    {app.isCounterOffer && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-black rounded-md">
                        Counter-Offer Proposed 💬
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 font-display">Farmer: {app.farmerName}</h4>
                  <p className="text-xs text-slate-600">
                    District: 📍 {app.district} • Offered Yield: <strong>{app.offeredQtyKg.toLocaleString()} kg/mo</strong> @ <strong className="text-emerald-600">{formatPrice(app.offeredPrice)}/kg</strong>
                  </p>
                  {app.counterReason && (
                    <p className="text-[11px] text-slate-500 italic mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      "{app.counterReason}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {app.status === 'APPROVED' ? (
                    <span className="px-4 py-2 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-xl flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" /> Escrow Locked &amp; Approved
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApproveApplication(app.id)}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" /> Approve &amp; Lock Escrow 🔒
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AGREEMENT TERMS SIMULATOR, ESCROW MILESTONE TIMELINE & YIELD GUARANTEE */}
      {activeTab === 'terms-simulator' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* TOP BANNER */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white border border-emerald-800/50 shadow-xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-emerald-400" /> B2B CONTRACT SIMULATOR &amp; RISK ENGINE
              </span>
              <span className="text-xs font-mono font-bold text-teal-200">• ESCROW BACKED</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
              Agreement Terms Simulator &amp; Crop Yield Guarantee 🌾
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
              Model forward purchasing agreements, simulate buyer advance escrow deposits, map out your 4-stage fulfillment milestone timeline, and calculate weather buffer protection.
            </p>
          </div>

          {/* SIMULATOR TWO-COLUMN LAYOUT: CONFIGURATOR + LIVE RESULTS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: INTERACTIVE AGREEMENT CONFIGURATOR (7 Cols) */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-lg space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <PenTool className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 font-display">Contract Terms Configurator</h3>
                    <p className="text-xs text-slate-500">Adjust variables to simulate guaranteed forward cashflows</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                  Interactive Model
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                {/* CROP SELECTOR */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Target Crop / Harvest</label>
                  <select
                    value={simulatorData.cropName}
                    onChange={(e) => {
                      const crop = e.target.value;
                      let defaultPrice = 210;
                      let defaultYield = 1500;
                      if (crop === 'Samba Rice') { defaultPrice = 220; defaultYield = 1800; }
                      else if (crop === 'Green Chillies') { defaultPrice = 380; defaultYield = 600; }
                      else if (crop === 'Highland Carrots') { defaultPrice = 260; defaultYield = 1400; }
                      else if (crop === 'Alba Cinnamon') { defaultPrice = 1550; defaultYield = 150; }
                      else if (crop === 'Watermelons') { defaultPrice = 175; defaultYield = 2500; }
                      setSimulatorData({
                        ...simulatorData,
                        cropName: crop,
                        targetFloorPrice: defaultPrice,
                        expectedYieldPerAcre: defaultYield
                      });
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="Organic Tomato">🍅 Organic Tomato</option>
                    <option value="Samba Rice">🌾 Polonnaruwa Samba Rice</option>
                    <option value="Green Chillies">🌶️ Jaffna Green Chillies</option>
                    <option value="Highland Carrots">🥕 Highland Carrots</option>
                    <option value="Alba Cinnamon">🌿 Alba Ceylon Cinnamon</option>
                    <option value="Watermelons">🍉 Sugar-Baby Watermelons</option>
                  </select>
                </div>

                {/* BUYER TYPE */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Enterprise Buyer Tier</label>
                  <select
                    value={simulatorData.buyerType}
                    onChange={(e) => setSimulatorData({ ...simulatorData, buyerType: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="Supermarket Chain (e.g. Keells, Cargills)">🏬 Supermarket Retail Chain</option>
                    <option value="Luxury Hospitality (e.g. Shangri-La, Cinnamon)">🏨 Luxury Hospitality Group</option>
                    <option value="Exporter & Processor (e.g. Dilmah, Hayleys)">🌍 Exporter &amp; Processor</option>
                    <option value="Food & Beverage Manufacturer">🏭 Food &amp; Beverage Manufacturer</option>
                  </select>
                </div>

                {/* ACREAGE SLIDER */}
                <div className="space-y-1 sm:col-span-2 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Cultivated Land Acreage:</span>
                    <span className="font-black text-emerald-700 text-sm font-display">{simulatorData.acreage} Acres</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="10"
                    step="0.5"
                    value={simulatorData.acreage}
                    onChange={(e) => setSimulatorData({ ...simulatorData, acreage: parseFloat(e.target.value) })}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                    <span>0.5 Acre (Smallholder)</span>
                    <span>5.0 Acres</span>
                    <span>10.0 Acres (Commercial)</span>
                  </div>
                </div>

                {/* TARGET FLOOR PRICE */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Guaranteed Floor Price (Rs/kg)</label>
                  <input
                    type="number"
                    value={simulatorData.targetFloorPrice}
                    onChange={(e) => setSimulatorData({ ...simulatorData, targetFloorPrice: Math.max(1, Number(e.target.value)) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-black text-emerald-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* CONTRACT DURATION */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Contract Duration</label>
                  <select
                    value={simulatorData.durationMonths}
                    onChange={(e) => setSimulatorData({ ...simulatorData, durationMonths: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value={3}>3 Months (Seasonal Trial)</option>
                    <option value={6}>6 Months (Standard Season)</option>
                    <option value={12}>12 Months (Annual Supply Contract)</option>
                  </select>
                </div>

                {/* ADVANCE ESCROW PERCENTAGE */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Upfront Escrow Deposit Rate</label>
                  <select
                    value={simulatorData.advanceEscrowPct}
                    onChange={(e) => setSimulatorData({ ...simulatorData, advanceEscrowPct: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value={15}>15% Advance Lock</option>
                    <option value={20}>20% Standard Escrow Lock</option>
                    <option value={25}>25% Premium Escrow Lock</option>
                    <option value={30}>30% Maximum Escrow Guarantee</option>
                  </select>
                </div>

                {/* DISPATCH FREQUENCY */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Fleet Dispatch Frequency</label>
                  <select
                    value={simulatorData.dispatchFrequency}
                    onChange={(e) => setSimulatorData({ ...simulatorData, dispatchFrequency: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="Weekly">Weekly Scheduled Dispatches (4x / mo)</option>
                    <option value="Bi-Weekly">Bi-Weekly Scheduled Dispatches (2x / mo)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: SIMULATION FINANCIAL BREAKDOWN CARD (5 Cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-400" /> GUARANTEED REVENUE MATRIX
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-extrabold text-[10px] border border-emerald-800">
                    100% Escrow Protected
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Total Multi-Month Contract Value:</span>
                  <div className="text-3xl sm:text-4xl font-black font-display text-emerald-400">
                    Rs. {((simulatorData.acreage * simulatorData.expectedYieldPerAcre * simulatorData.durationMonths) * simulatorData.targetFloorPrice).toLocaleString()}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    For {(simulatorData.acreage * simulatorData.expectedYieldPerAcre * simulatorData.durationMonths).toLocaleString()} kg of {simulatorData.cropName} over {simulatorData.durationMonths} months.
                  </p>
                </div>

                {/* BREAKDOWN METRICS */}
                <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Buyer Advance Escrow Locked:</span>
                    <span className="font-extrabold text-white">
                      Rs. {(((simulatorData.acreage * simulatorData.expectedYieldPerAcre * simulatorData.durationMonths) * simulatorData.targetFloorPrice) * (simulatorData.advanceEscrowPct / 100)).toLocaleString()} ({simulatorData.advanceEscrowPct}%)
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Monthly Guaranteed Cashflow:</span>
                    <span className="font-extrabold text-slate-200">
                      Rs. {((((simulatorData.acreage * simulatorData.expectedYieldPerAcre * simulatorData.durationMonths) * simulatorData.targetFloorPrice)) / simulatorData.durationMonths).toLocaleString()}/mo
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">{simulatorData.dispatchFrequency} Dispatch Payout:</span>
                    <span className="font-extrabold text-emerald-300">
                      Rs. {Math.round((((simulatorData.acreage * simulatorData.expectedYieldPerAcre * simulatorData.durationMonths) * simulatorData.targetFloorPrice) / simulatorData.durationMonths) / (simulatorData.dispatchFrequency === 'Weekly' ? 4 : 2)).toLocaleString()}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-emerald-400 font-bold">
                    <span>Spot Market Premium Gain:</span>
                    <span className="text-xs bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      +Rs. {Math.round(((simulatorData.acreage * simulatorData.expectedYieldPerAcre * simulatorData.durationMonths) * simulatorData.targetFloorPrice) * 0.18).toLocaleString()} (+18% vs Open Market)
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setCreateForm({
                    ...createForm,
                    cropName: simulatorData.cropName,
                    monthlyQuantityKg: simulatorData.acreage * simulatorData.expectedYieldPerAcre,
                    minPriceLkr: simulatorData.targetFloorPrice,
                    maxPriceLkr: Math.round(simulatorData.targetFloorPrice * 1.15),
                    durationMonths: simulatorData.durationMonths
                  });
                  setShowCreateModal(true);
                }}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileCheck className="w-4 h-4" />
                <span>Generate Official B2B Tender from this Simulation 🚀</span>
              </button>
            </div>
          </div>

          {/* BUYER-FARMER ESCROW MILESTONE TIMELINE */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-700 border border-teal-100">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 font-display">Buyer-Farmer Escrow Milestone Timeline</h3>
                  <p className="text-xs text-slate-500">4-Stage automated escrow disbursement protocol</p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-500">Click any milestone stage to view protocol:</span>
            </div>

            {/* 4-STAGE TIMELINE CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  step: 1,
                  title: 'Milestone 1: Smart Contract & Advance Vault',
                  timing: 'Day 0 (Execution)',
                  icon: '✍️',
                  desc: 'Buyer deposits 20–30% advance escrow into AgroLink Vault. Digital signatures registered on immutable ledger.',
                  payout: `${simulatorData.advanceEscrowPct}% Locked in Vault`
                },
                {
                  step: 2,
                  title: 'Milestone 2: IoT Telemetry & Farm Audit',
                  timing: 'Month 1–2 (Mid-Growth)',
                  icon: '🌱',
                  desc: 'Soil moisture, temperature sensors, and DOA GAP standard verified via IoT telemetry and localized AI health check.',
                  payout: 'Agronomy Certificate Issued'
                },
                {
                  step: 3,
                  title: 'Milestone 3: Fleet Dispatch & QR Scan',
                  timing: `${simulatorData.dispatchFrequency} Schedule`,
                  icon: '🚚',
                  desc: 'Fleet driver scans crate QR code, validates temperature log (8–12°C), and confirms net weighbridge volume.',
                  payout: 'Dispatch Receipt Locked'
                },
                {
                  step: 4,
                  title: 'Milestone 4: Instant Bank Settlement',
                  timing: '< 2 Hours Post-Delivery',
                  icon: '💳',
                  desc: 'Smart contract automatically executes direct wire payment to farmer bank account upon store reception confirmation.',
                  payout: '100% Final Settlement'
                }
              ].map((m) => (
                <div
                  key={m.step}
                  onClick={() => setActiveTimelineStep(m.step)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    activeTimelineStep === m.step
                      ? 'bg-emerald-50/90 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl">{m.icon}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        activeTimelineStep === m.step ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        Stage {m.step}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-sm font-display leading-tight">{m.title}</h4>
                    <p className="text-[10px] text-slate-400 font-bold">{m.timing}</p>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{m.desc}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold text-emerald-800">
                    <span>{m.payout}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CROP YIELD GUARANTEE & WEATHER RISK PROTECTION CALCULATOR */}
          <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/90 shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-700 border border-amber-100">
                  <CloudRain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 font-display">Crop Yield Guarantee &amp; Weather Risk Protection</h3>
                  <p className="text-xs text-slate-500">AgroLink parametric weather insurance &amp; yield indemnification</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                🛡️ Weather Buffer Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* COMMITMENT CARD */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">1. Yield Commitment</span>
                <h4 className="text-base font-extrabold text-slate-900 font-display">90% Harvest Quota Commitment</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Farmer guarantees delivery of at least 90% of contracted quota. Minor variations (up to 10%) are automatically buffered by AgroLink cooperative pool.
                </p>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-bold text-xs text-slate-800">
                  Guaranteed Volume: {Math.round((simulatorData.acreage * simulatorData.expectedYieldPerAcre * simulatorData.durationMonths) * 0.90).toLocaleString()} kg
                </div>
              </div>

              {/* WEATHER RISK INDEX */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">2. Regional Climate Risk</span>
                <h4 className="text-base font-extrabold text-slate-900 font-display">Parametric Rain / Heat Index</h4>
                <div className="flex gap-2">
                  {['Low Risk', 'Moderate Risk', 'High Rain Zone'].map((risk) => (
                    <button
                      key={risk}
                      type="button"
                      onClick={() => setSimulatorData({ ...simulatorData, weatherRiskLevel: risk })}
                      className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold border transition ${
                        simulatorData.weatherRiskLevel === risk
                          ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50'
                      }`}
                    >
                      {risk}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Linked to Department of Meteorology Doppler radar stations. Extreme rainfall triggers automated claim without paperwork.
                </p>
              </div>

              {/* INDEMNITY COVERAGE */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider block">3. Weather Escrow Protection</span>
                  <h4 className="text-base font-extrabold text-emerald-950 font-display">Automatic Buffer Payout</h4>
                  <p className="text-xs text-emerald-900/80 mt-1 leading-relaxed">
                    In the event of unseasonal flood or drought causing &gt;15% crop loss, AgroLink Escrow covers up to:
                  </p>
                  <div className="text-2xl font-black text-emerald-700 font-display mt-2">
                    Rs. {Math.round(((simulatorData.acreage * simulatorData.expectedYieldPerAcre * simulatorData.durationMonths) * simulatorData.targetFloorPrice) * 0.15).toLocaleString()}
                  </div>
                </div>
                <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-300/50 self-start">
                  ✓ Zero Farmer Deductible
                </span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* QR CODE BATCH SCAN VERIFICATION MODAL */}
      <AnimatePresence>
        {selectedAppForQrScan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 space-y-5 overflow-hidden relative text-center"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                  Batch Delivery QR Scanner
                </span>
                <button
                  onClick={() => setSelectedAppForQrScan(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="w-32 h-32 mx-auto bg-slate-900 rounded-2xl p-3 shadow-inner flex items-center justify-center border-4 border-emerald-500 relative">
                  <QrCode className="w-full h-full text-emerald-400 animate-pulse" />
                </div>

                <div>
                  <h4 className="text-base font-extrabold text-slate-900 font-display">
                    {selectedAppForQrScan.cropName} — {selectedAppForQrScan.buyerName}
                  </h4>
                  <p className="text-xs font-mono text-emerald-600 font-bold mt-0.5">
                    Batch Code: {selectedAppForQrScan.batchCode || 'BATCH-2026-NWR-0941'}
                  </p>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-semibold space-y-1">
                  <span>✓ 9-Stage Telemetry Verified</span>
                  <p className="text-[11px] text-emerald-700">Refrigeration &amp; weight sensor check passed.</p>
                </div>

                <button
                  onClick={handleSimulateQrScanConfirm}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" /> Confirm Reception &amp; Release Escrow 🔒
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DISPUTE ARBITRATION MODAL */}
      <AnimatePresence>
        {selectedAppForDispute && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 space-y-5 overflow-hidden relative"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase">
                    Escrow Arbitration
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 font-display mt-1">
                    Raise Contract Dispute ⚠️
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedAppForDispute(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRaiseDisputeSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Dispute Reason</label>
                  <select
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="Quality Mismatch / Damage">Quality Mismatch / Damage</option>
                    <option value="Logistics Transit Delay">Logistics Transit Delay</option>
                    <option value="Moisture Content Discrepancy">Moisture Content Discrepancy</option>
                    <option value="Shortage in Delivered Volume">Shortage in Delivered Volume</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Dispute Evidence &amp; Description</label>
                  <textarea
                    rows={3}
                    required
                    value={disputeNotes}
                    onChange={(e) => setDisputeNotes(e.target.value)}
                    placeholder="Provide details on damaged crates, temperature reading log, or photo proof..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedAppForDispute(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <AlertTriangle className="w-4 h-4" /> File Dispute Claim
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SEALED PDF B2B AGREEMENT DOCUMENT VIEW MODAL */}
      <AnimatePresence>
        {selectedAppForPdf && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-2xl w-full p-8 space-y-6 overflow-hidden relative max-h-[90vh] overflow-y-auto"
            >
              {/* PDF HEADER */}
              <div className="flex justify-between items-start pb-6 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                      🛡️
                    </div>
                    <h2 className="text-xl font-black text-slate-900 font-display">AgroLink B2B Escrow Agreement</h2>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Official Legal Procurement Certificate • Ref: {selectedAppForPdf.id}</p>
                </div>
                <button
                  onClick={() => setSelectedAppForPdf(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* AGREEMENT DETAILS */}
              <div className="space-y-4 text-xs text-slate-700">
                <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 grid grid-cols-2 gap-3 font-semibold">
                  <div>
                    <span className="text-[10px] uppercase text-emerald-800 block font-bold">Enterprise Contracting Party</span>
                    <span className="text-sm font-extrabold text-slate-900">{selectedAppForPdf.buyerName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-emerald-800 block font-bold">Registered Grower</span>
                    <span className="text-sm font-extrabold text-slate-900">{selectedAppForPdf.farmerName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-emerald-800 block font-bold">Harvest Commodity</span>
                    <span className="text-slate-900 font-bold">🌾 {selectedAppForPdf.cropName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-emerald-800 block font-bold">Agreed Quota &amp; Rate</span>
                    <span className="text-emerald-700 font-extrabold">{selectedAppForPdf.offeredQtyKg.toLocaleString()} kg/mo @ {formatPrice(selectedAppForPdf.offeredPrice)}/kg</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <h4 className="font-extrabold text-slate-900 font-display text-xs uppercase tracking-wider">Terms &amp; Settlement Warranty</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    This agreement certifies that {selectedAppForPdf.buyerName} has deposited and locked full monthly escrow reserves for {selectedAppForPdf.cropName}. Delivery verification is governed by AgroLink 9-Stage Fleet Telemetry and QR Code scanning.
                  </p>
                </div>

                {/* SIGNATURE STAMP SECTION */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Digital Verification QR</span>
                    <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 text-xs font-bold text-slate-400">
                      <QrCode className="w-10 h-10 text-slate-700" />
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase inline-block">
                      OFFICIAL ESCROW SEALED 🛡️
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono">HASH: 0x89F4...A21E</p>
                  </div>
                </div>
              </div>

              {/* MODAL FOOTER */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Download / Print Official PDF Sheet
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REVENUE CALCULATOR MODAL */}
      <AnimatePresence>
        {selectedTenderForCalc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 space-y-5 overflow-hidden relative"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                    Escrow Financial Simulator
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 font-display mt-1">
                    Contract Revenue Calculator 🧮
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedTenderForCalc(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Monthly Supply Quota (kg)</label>
                    <input
                      type="number"
                      value={calcData.monthlyKg}
                      onChange={(e) => setCalcData({ ...calcData, monthlyKg: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Agreed Price ({currency === 'USD' ? '$' : 'Rs'}/kg)</label>
                    <input
                      type="number"
                      value={calcData.priceLkr}
                      onChange={(e) => setCalcData({ ...calcData, priceLkr: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* CALCULATED FINANCIAL MATRIX */}
                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 shadow-inner">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Monthly Gross Revenue:</span>
                    <span className="text-base font-extrabold text-emerald-400 font-display">
                      {formatPrice(monthlyRevenue)}.00
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Total {calcData.durationMonths}-Month Contract Value:</span>
                    <span className="text-lg font-extrabold text-emerald-300 font-display">
                      {formatPrice(totalContractRevenue)}.00
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      🔒 20% Advance Escrow Lock:
                    </span>
                    <span className="text-sm font-black text-emerald-400">
                      {formatPrice(escrowAdvanceLock)}.00
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Est. Payout Per Dispatch:</span>
                    <span className="text-xs font-bold text-white">
                      {formatPrice(perDispatchPayout)}.00 / shipment
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedTenderForCalc(null)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
                >
                  Close Calculator
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DIGITAL SIGNATURE MODAL */}
      <AnimatePresence>
        {selectedAppForSign && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 space-y-5 overflow-hidden relative"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                    Legal B2B Execution
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 font-display mt-1">
                    Digital Contract Signing ✍️
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedAppForSign(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleDigitalSignSubmit} className="space-y-4">
                <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs space-y-1.5">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Buyer: {selectedAppForSign.buyerName}</span>
                    <span>Harvest: {selectedAppForSign.cropName}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-600">
                    <span>Quota: {selectedAppForSign.offeredQtyKg} kg/mo</span>
                    <span>Rate: {formatPrice(selectedAppForSign.offeredPrice)}/kg</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Type Full Authorized Signature</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sunil Perera"
                    value={digitalSignature}
                    onChange={(e) => setDigitalSignature(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 font-display"
                  />
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-[11px] text-slate-600 font-semibold cursor-pointer">
                    I confirm supply capacity and agree to AgroLink Escrow delivery protocols.
                  </label>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedAppForSign(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <PenTool className="w-4 h-4" /> Sign &amp; Seal Agreement
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VIEW DETAILED SPECIFICATION & TERMS MODAL */}
      <AnimatePresence>
        {selectedTenderForView && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-2xl w-full p-6 space-y-6 overflow-hidden relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                    Specification &amp; Protocol Sheet
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 font-display mt-1">
                    {selectedTenderForView.buyerName} — {selectedTenderForView.cropName}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedTenderForView(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <h4 className="font-extrabold text-slate-900 font-display text-sm">📋 Quality &amp; Inspection Criteria</h4>
                  <p className="text-slate-600 leading-relaxed font-semibold">
                    {selectedTenderForView.qualityStandards || 'Standard Grade A inspection required.'}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <h4 className="font-extrabold text-slate-900 font-display text-sm">🚚 Logistics &amp; Transport Protocol</h4>
                  <p className="text-slate-600 leading-relaxed font-semibold">
                    {selectedTenderForView.logisticsProtocol || 'Standard temperature-controlled fleet pickup.'}
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl space-y-2">
                  <h4 className="font-extrabold text-emerald-900 font-display text-sm flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Escrow Milestone Payment Terms
                  </h4>
                  <p className="text-emerald-800 leading-relaxed font-semibold">
                    {selectedTenderForView.milestonePayment || '100% Escrow guaranteed trade settlement.'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Print Contract Terms Sheet
                </button>

                <button
                  onClick={() => {
                    const t = selectedTenderForView;
                    setSelectedTenderForView(null);
                    setSelectedTenderForApply(t);
                  }}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition"
                >
                  Apply for this Tender →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* APPLY FOR CONTRACT MODAL (WITH COUNTER-OFFER TOGGLE) */}
      <AnimatePresence>
        {selectedTenderForApply && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-xl w-full p-6 space-y-5 overflow-hidden relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                    B2B Application Form
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 font-display mt-1">
                    Apply: {selectedTenderForApply.buyerName}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedTenderForApply(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* CONTRACT BRIEF */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl space-y-2 text-xs text-emerald-900">
                <div className="flex justify-between font-bold">
                  <span>Requirement: 🌾 {selectedTenderForApply.cropName}</span>
                  <span>Quota: {selectedTenderForApply.monthlyQuantityKg} kg/mo</span>
                </div>
                <div className="flex justify-between text-[11px] text-emerald-800">
                  <span>Duration: {selectedTenderForApply.durationMonths} Months</span>
                  <span>Target Range: {formatPrice(selectedTenderForApply.minPriceLkr)} - {formatPrice(selectedTenderForApply.maxPriceLkr)}/kg</span>
                </div>
              </div>

              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Applicant Name / Farm Name</label>
                  <input
                    type="text"
                    required
                    value={applyForm.farmerName}
                    onChange={(e) => setApplyForm({ ...applyForm, farmerName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Monthly Supply Offer (kg)</label>
                    <input
                      type="number"
                      required
                      value={applyForm.capacityKg}
                      onChange={(e) => setApplyForm({ ...applyForm, capacityKg: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Proposed Price ({currency === 'USD' ? '$' : 'Rs'}/kg)</label>
                    <input
                      type="number"
                      required
                      value={applyForm.offerPrice}
                      onChange={(e) => setApplyForm({ ...applyForm, offerPrice: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* COUNTER OFFER TOGGLE */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Propose Counter-Offer Rate 💬</span>
                    <button
                      type="button"
                      onClick={() => setIsCounterOfferMode(!isCounterOfferMode)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                        isCounterOfferMode ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isCounterOfferMode ? 'Counter-Offer Enabled ✓' : 'Enable Counter-Offer'}
                    </button>
                  </div>

                  {isCounterOfferMode && (
                    <div className="pt-2 space-y-2">
                      <label className="block text-[10px] font-bold uppercase text-amber-800">Counter-Offer Justification Note</label>
                      <textarea
                        rows={2}
                        value={applyForm.counterReason}
                        onChange={(e) => setApplyForm({ ...applyForm, counterReason: e.target.value })}
                        placeholder="Explain counter-offer justification (e.g., GAP organic certification, special variety)..."
                        className="w-full px-3 py-2 rounded-xl border border-amber-300 text-xs font-semibold focus:outline-none bg-amber-50/50"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Farm Location District</label>
                  <select
                    value={applyForm.district}
                    onChange={(e) => setApplyForm({ ...applyForm, district: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    {['Nuwara Eliya', 'Jaffna', 'Kandy', 'Galle', 'Anuradhapura', 'Polonnaruwa', 'Badulla', 'Dambulla', 'Hambantota'].map((d) => (
                      <option key={d} value={d}>📍 {d} District</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Capacity Notes &amp; Certifications</label>
                  <textarea
                    rows={2}
                    value={applyForm.notes}
                    onChange={(e) => setApplyForm({ ...applyForm, notes: e.target.value })}
                    placeholder="Mention organic certifications, greenhouse infrastructure..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedTenderForApply(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-4 h-4" /> Submit Application
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE NEW B2B PURCHASE REQUEST MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-xl w-full p-6 space-y-5 overflow-hidden relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                    Enterprise Buyer Portal
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 font-display mt-1">
                    Publish B2B Contract Tender
                  </h3>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Company / Enterprise Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Keells Supermarket"
                      value={createForm.buyerName}
                      onChange={(e) => setCreateForm({ ...createForm, buyerName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Buyer Category</label>
                    <select
                      value={createForm.buyerCategory}
                      onChange={(e) => setCreateForm({ ...createForm, buyerCategory: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 bg-white"
                    >
                      <option value="Supermarket Chain">Supermarket Chain</option>
                      <option value="Hospitality Group">Hospitality Group</option>
                      <option value="Exporter & Processor">Exporter &amp; Processor</option>
                      <option value="Food & Beverage Corp">Food &amp; Beverage Corp</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Required Produce</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Organic Tomatoes"
                      value={createForm.cropName}
                      onChange={(e) => setCreateForm({ ...createForm, cropName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Produce Category</label>
                    <select
                      value={createForm.category}
                      onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 bg-white"
                    >
                      <option value="Vegetables">Vegetables 🥬</option>
                      <option value="Grains">Grains 🌾</option>
                      <option value="Spices">Spices 🌶️</option>
                      <option value="Fruits">Fruits 🍎</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Monthly Quantity (kg)</label>
                    <input
                      type="number"
                      required
                      placeholder="2000"
                      value={createForm.monthlyQuantityKg}
                      onChange={(e) => setCreateForm({ ...createForm, monthlyQuantityKg: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Contract Duration (Months)</label>
                    <select
                      value={createForm.durationMonths}
                      onChange={(e) => setCreateForm({ ...createForm, durationMonths: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 bg-white"
                    >
                      <option value="3">3 Months</option>
                      <option value="6">6 Months</option>
                      <option value="12">12 Months</option>
                      <option value="24">24 Months</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Min Offered Price (Rs/kg)</label>
                    <input
                      type="number"
                      required
                      placeholder="180"
                      value={createForm.minPriceLkr}
                      onChange={(e) => setCreateForm({ ...createForm, minPriceLkr: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Max Offered Price (Rs/kg)</label>
                    <input
                      type="number"
                      required
                      placeholder="220"
                      value={createForm.maxPriceLkr}
                      onChange={(e) => setCreateForm({ ...createForm, maxPriceLkr: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Requirement Overview</label>
                  <textarea
                    rows={2}
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    placeholder="Specify delivery requirements, grade standards, or packaging preferences..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" /> Publish Contract Tender
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContractFarming;

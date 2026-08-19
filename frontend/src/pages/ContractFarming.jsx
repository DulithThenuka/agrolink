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
  Lock
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
    monthlyQuantityKg: 2000,
    durationMonths: 6,
    minPriceLkr: 180,
    maxPriceLkr: 220,
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
    monthlyQuantityKg: 1500,
    durationMonths: 12,
    minPriceLkr: 350,
    maxPriceLkr: 400,
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
    monthlyQuantityKg: 5000,
    durationMonths: 6,
    minPriceLkr: 210,
    maxPriceLkr: 230,
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
    monthlyQuantityKg: 350,
    durationMonths: 12,
    minPriceLkr: 1400,
    maxPriceLkr: 1650,
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
    monthlyQuantityKg: 3000,
    durationMonths: 3,
    minPriceLkr: 160,
    maxPriceLkr: 190,
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
    monthlyQuantityKg: 1200,
    durationMonths: 6,
    minPriceLkr: 240,
    maxPriceLkr: 280,
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
    status: 'APPROVED',
    statusBadge: 'Approved - Escrow Locked 🔒',
    appliedDate: '2026-08-10',
    district: 'Anuradhapura',
    contractTerm: '6 Months',
    signed: true
  },
  {
    id: 'APP-902',
    tenderId: 'TENDER-801',
    buyerName: 'Keells Supermarket',
    farmerName: 'Kamal Fernando (Highland Organics)',
    cropName: 'Organic Tomato',
    offeredQtyKg: 1000,
    offeredPrice: 200,
    status: 'UNDER_REVIEW',
    statusBadge: 'Under Review ⏳',
    appliedDate: '2026-08-18',
    district: 'Nuwara Eliya',
    contractTerm: '6 Months',
    signed: false
  }
];

export const ContractFarming = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('active-tenders');
  const [contractsList, setContractsList] = useState(DEFAULT_CONTRACTS);
  const [myApplications, setMyApplications] = useState(INITIAL_APPLICATIONS);
  const [appliedIds, setAppliedIds] = useState(['TENDER-803', 'TENDER-801']);
  const [loading, setLoading] = useState(false);

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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [applySuccessMsg, setApplySuccessMsg] = useState('');

  // Calculator Form State
  const [calcData, setCalcData] = useState({
    monthlyKg: 1000,
    priceLkr: 200,
    durationMonths: 6,
    frequency: 'Weekly'
  });

  // Digital Signature State
  const [digitalSignature, setDigitalSignature] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);

  // Form States for Apply Modal
  const [applyForm, setApplyForm] = useState({
    farmerName: '',
    capacityKg: '',
    district: 'Nuwara Eliya',
    offerPrice: '',
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

  const handleApplySubmit = (e) => {
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
      status: 'UNDER_REVIEW',
      statusBadge: 'Under Review ⏳',
      appliedDate: new Date().toISOString().split('T')[0],
      district: applyForm.district,
      contractTerm: `${selectedTenderForApply.durationMonths} Months`,
      signed: false
    };

    setAppliedIds((prev) => [...prev, selectedTenderForApply.id]);
    setMyApplications((prev) => [newApp, ...prev]);
    setApplySuccessMsg(`Application for ${selectedTenderForApply.buyerName} submitted successfully!`);
    setSelectedTenderForApply(null);
    
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
    setApplySuccessMsg(`Application ${appId} has been Approved and Escrow funds locked!`);

    setTimeout(() => {
      setApplySuccessMsg('');
    }, 4000);
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

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const newTender = {
      id: `TENDER-${Math.floor(800 + Math.random() * 100)}`,
      buyerName: createForm.buyerName || 'Enterprise Buyer',
      buyerCategory: createForm.buyerCategory,
      cropName: createForm.cropName,
      category: createForm.category,
      monthlyQuantityKg: Number(createForm.monthlyQuantityKg) || 1000,
      durationMonths: Number(createForm.durationMonths) || 6,
      minPriceLkr: Number(createForm.minPriceLkr) || 200,
      maxPriceLkr: Number(createForm.maxPriceLkr) || 250,
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
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-slate-200/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2.5 border border-emerald-200/80 shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>Guaranteed B2B Contract Farming Ecosystem</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display flex items-center gap-2">
            Contract Farming &amp; B2B Purchase Requests 📑
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-3xl">
            Commercial supermarkets, luxury hotel chains, and exporters publish long-term future harvest requirements. Farmers apply to secure guaranteed prices locked in AgroLink Escrow.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-2 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Post Purchase Request</span>
          </button>
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-900 text-white rounded-3xl shadow-xl border border-slate-800">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Active Contract Value</span>
          <h4 className="text-2xl sm:text-3xl font-extrabold font-display">Rs 68.5M+</h4>
          <p className="text-[11px] text-slate-400">Guaranteed Enterprise Trade</p>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Registered Enterprise Buyers</span>
          <h4 className="text-2xl sm:text-3xl font-extrabold font-display">24 Chains</h4>
          <p className="text-[11px] text-slate-400">Supermarkets &amp; Exporters</p>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Escrow Security</span>
          <h4 className="text-2xl sm:text-3xl font-extrabold font-display text-emerald-400">100% Locked</h4>
          <p className="text-[11px] text-slate-400">Zero Default Risk</p>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Contracted Growers</span>
          <h4 className="text-2xl sm:text-3xl font-extrabold font-display">185 Farmers</h4>
          <p className="text-[11px] text-slate-400">Across 16 Districts</p>
        </div>
      </div>

      {/* MAIN NAVIGATION TABS */}
      <div className="flex border-b border-slate-200 gap-8 text-sm font-extrabold">
        <button
          onClick={() => setActiveTab('active-tenders')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'active-tenders'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Active B2B Purchase Tenders ({contractsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('my-applications')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'my-applications'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>My Submitted Applications ({myApplications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('buyer-manager')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'buyer-manager'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Enterprise Buyer Portal</span>
        </button>
      </div>

      {/* TAB 1: ALL ACTIVE B2B TENDERS */}
      {activeTab === 'active-tenders' && (
        <div className="space-y-6">
          {/* FILTER & SEARCH BAR */}
          <div className="premium-card p-5 bg-white border border-slate-100 shadow-md flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search crop, buyer, or district..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* CATEGORY PILLS */}
              <div className="flex flex-wrap gap-1.5 items-center">
                {['', 'Vegetables', 'Grains', 'Spices', 'Fruits'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                      selectedCategory === cat
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    {cat === '' ? 'All Produce' : cat}
                  </button>
                ))}
              </div>

              {/* DISTRICT SELECT */}
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
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
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
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
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
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
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 space-y-3">
              <div className="text-4xl">📑</div>
              <h3 className="text-lg font-bold text-slate-800 font-display">No Contract Tenders Found</h3>
              <p className="text-slate-500 text-sm">Try adjusting your keyword query or category filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContracts.map((item) => {
                const isApplied = appliedIds.includes(item.id);
                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -4 }}
                    className="premium-card p-6 bg-white border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5"
                  >
                    <div className="space-y-4">
                      {/* BUYER HEADER */}
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider border border-emerald-200/60">
                            {item.buyerCategory}
                          </span>
                          <h3 className="text-lg font-extrabold text-slate-900 font-display mt-1">
                            {item.buyerName}
                          </h3>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5">📍 Target District: {item.district}</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60 text-[10px] font-extrabold uppercase">
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

                      {/* REQUIREMENT CARD */}
                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Harvest</span>
                          <span className="text-sm font-extrabold text-emerald-700 font-display">
                            🌾 {item.cropName}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Monthly Quota</span>
                          <span className="text-xs font-black text-slate-800">
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
                          <span className="font-extrabold text-emerald-600">Rs. {item.minPriceLkr} – {item.maxPriceLkr}/kg</span>
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
                          className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
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
                          className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] rounded-xl border border-emerald-200 transition flex items-center justify-center gap-1 cursor-pointer"
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
                          <span className="px-4 py-2 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs border border-emerald-200">
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
                                notes: 'Verified grower with organic certification.'
                              });
                            }}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
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
          <div className="premium-card p-6 bg-white border border-slate-100 shadow-md">
            <h3 className="text-lg font-extrabold text-slate-900 font-display mb-1">
              Your Submitted B2B Contract Proposals 📑
            </h3>
            <p className="text-slate-500 text-xs">
              Track contract proposal statuses, escrow lock confirmations, and enterprise buyer responses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myApplications.map((app) => (
              <div key={app.id} className="premium-card p-6 bg-white border border-slate-100 shadow-md space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Application ID: {app.id}</span>
                    <h4 className="text-lg font-extrabold text-slate-900 font-display mt-0.5">{app.buyerName}</h4>
                    <p className="text-xs font-bold text-emerald-700">Harvest: 🌾 {app.cropName}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                    app.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {app.statusBadge}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-2 gap-2 text-xs font-semibold">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block">Submitted Capacity</span>
                    <span className="text-slate-900 font-extrabold">{app.offeredQtyKg.toLocaleString()} kg / month</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block">Offered Rate</span>
                    <span className="text-emerald-600 font-extrabold">Rs. {app.offeredPrice} / kg</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block">Contract Term</span>
                    <span className="text-slate-800 font-bold">{app.contractTerm}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block">Application Date</span>
                    <span className="text-slate-800 font-bold">{app.appliedDate}</span>
                  </div>
                </div>

                {app.status === 'APPROVED' && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-emerald-800 font-bold text-xs">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" /> Escrow Locked: Rs. 550,000.00
                      </span>
                      {app.signed ? (
                        <span className="px-2 py-0.5 bg-emerald-700 text-white text-[10px] font-black rounded-md">
                          Digitally Signed ✓
                        </span>
                      ) : (
                        <button
                          onClick={() => setSelectedAppForSign(app)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                        >
                          Sign B2B Agreement ✍️
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] leading-tight text-emerald-700 font-medium">
                      Enterprise buyer locked advance funds in Escrow. Deliveries scheduled via Smart Logistics.
                    </p>
                  </div>
                )}
              </div>
            ))}
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
                <h3 className="text-xl font-extrabold font-display mt-2">Incoming Farmer Tenders &amp; Proposals</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" /> Post New Tender
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Review farmer capacity proposals for your published tenders. Approve proposals to automatically lock Escrow funds.
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
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 font-display">Farmer: {app.farmerName}</h4>
                  <p className="text-xs text-slate-600">
                    District: 📍 {app.district} • Offered Yield: <strong>{app.offeredQtyKg.toLocaleString()} kg/mo</strong> @ <strong>Rs. {app.offeredPrice}/kg</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
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
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Agreed Price (Rs/kg)</label>
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
                      Rs. {monthlyRevenue.toLocaleString()}.00
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Total {calcData.durationMonths}-Month Contract Value:</span>
                    <span className="text-lg font-extrabold text-emerald-300 font-display">
                      Rs. {totalContractRevenue.toLocaleString()}.00
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      🔒 20% Advance Escrow Lock:
                    </span>
                    <span className="text-sm font-black text-emerald-400">
                      Rs. {escrowAdvanceLock.toLocaleString()}.00
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Est. Payout Per Dispatch:</span>
                    <span className="text-xs font-bold text-white">
                      Rs. {perDispatchPayout.toLocaleString()}.00 / shipment
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
                    <span>Rate: Rs. {selectedAppForSign.offeredPrice}/kg</span>
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

      {/* APPLY FOR CONTRACT MODAL */}
      <AnimatePresence>
        {selectedTenderForApply && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-xl w-full p-6 space-y-6 overflow-hidden relative"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
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
                  <span>Target Range: Rs. {selectedTenderForApply.minPriceLkr} - {selectedTenderForApply.maxPriceLkr}/kg</span>
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
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Proposed Price (Rs/kg)</label>
                    <input
                      type="number"
                      required
                      value={applyForm.offerPrice}
                      onChange={(e) => setApplyForm({ ...applyForm, offerPrice: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
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

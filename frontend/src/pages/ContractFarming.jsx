import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  DollarSign,
  Truck,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Building2,
  User,
  MapPin,
  ShieldCheck,
  Scale,
  Check,
  X,
  ChevronRight,
  Printer,
  Sparkles,
  Package,
  Layers,
  ArrowUpRight,
  BadgeCheck,
  PlayCircle,
  HelpCircle,
  Send,
  Leaf
} from 'lucide-react';
import api, { contractFarmingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Standardized Contract Status Definitions
// Communicated via Text + Subtle Visual Indicator (icon + text, never color alone)
const STATUS_CONFIG = {
  'Active': {
    label: 'Active',
    icon: CheckCircle2,
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    indicatorClass: 'bg-emerald-500'
  },
  'In Progress': {
    label: 'In Progress',
    icon: PlayCircle,
    badgeClass: 'bg-teal-50 text-teal-700 border-teal-200',
    indicatorClass: 'bg-teal-500'
  },
  'Pending Approval': {
    label: 'Pending Approval',
    icon: Clock,
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    indicatorClass: 'bg-amber-500'
  },
  'Draft': {
    label: 'Draft',
    icon: FileText,
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
    indicatorClass: 'bg-slate-400'
  },
  'Completed': {
    label: 'Completed',
    icon: BadgeCheck,
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    indicatorClass: 'bg-blue-500'
  },
  'Cancelled': {
    label: 'Cancelled',
    icon: AlertCircle,
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    indicatorClass: 'bg-rose-500'
  }
};

// Initial realistic Crop Supply Contracts covering both Farmer and Buyer roles
const INITIAL_CONTRACTS = [
  {
    id: 'CTR-801',
    crop: 'Tomato Supply Contract',
    cropName: 'Organic Tomato',
    farmer: 'Sunil Perera (Green Valley Farm)',
    farmerEmail: 'sunil.perera@agrolink.lk',
    buyer: 'Keells Supermarket Chains',
    buyerCategory: 'Supermarket Chain',
    quantity: 5,
    unit: 'MT',
    quantityKg: 5000,
    pricePerKg: 185,
    priceFormatted: 'Rs. 185 / kg',
    startDate: '2026-08-01',
    deliveryDate: '24 Sept 2026',
    deliveryDueTimestamp: '2026-09-24',
    location: 'Nuwara Eliya / Dambulla Hub',
    status: 'Active',
    qualityRequirements: 'Grade A vine-ripened, min 55mm diameter, firm texture, max 2% surface blemish, zero chemical residue.',
    paymentTerms: '20% advance bank escrow lock, 80% disbursement upon digital delivery receipt & weighbridge signoff.',
    nextAction: 'Pre-harvest quality inspection due in 4 days before bulk harvest.',
    nextActionParty: 'Farmer',
    completedMilestonesCount: 3,
    totalMilestonesCount: 6,
    milestones: [
      { id: 'm1', title: 'Contract Signed & Escrow Locked', due: '01 Aug 2026', status: 'Completed', note: 'Agreement digitally signed by Sunil Perera & Keells Procurement.' },
      { id: 'm2', title: 'Field Preparation & Nursery Transplanting', due: '12 Aug 2026', status: 'Completed', note: 'High tunnel greenhouses prepped; seedlings successfully transplanted.' },
      { id: 'm3', title: 'Mid-Cycle Vegetative & Pest Audit', due: '28 Aug 2026', status: 'Completed', note: 'GAP certified agronomist conducted leaf inspection with zero fungal alerts.' },
      { id: 'm4', title: 'Pre-Harvest Quality Inspection', due: '18 Sept 2026', status: 'In Progress', note: 'Yield sizing assessment and blemish audit prior to first picking batch.' },
      { id: 'm5', title: 'Scheduled Logistics Dispatch (5 MT)', due: '24 Sept 2026', status: 'Upcoming', note: 'Temperature-monitored refrigerated transit to Keells Central Dambulla Hub.' },
      { id: 'm6', title: 'Dock Inspection & Final Escrow Release', due: '25 Sept 2026', status: 'Upcoming', note: 'Dock reception verification and auto-settlement of remaining Rs. 740,000 balance.' }
    ]
  },
  {
    id: 'CTR-802',
    crop: 'Green Chillies Supply Contract',
    cropName: 'Green Chillies',
    farmer: 'Kamal Fernando (Jaffna Agro Fields)',
    farmerEmail: 'kamal.fernando@agrolink.lk',
    buyer: 'Cargills Food City PLC',
    buyerCategory: 'Supermarket Chain',
    quantity: 1.5,
    unit: 'MT',
    quantityKg: 1500,
    pricePerKg: 380,
    priceFormatted: 'Rs. 380 / kg',
    startDate: '2026-07-15',
    deliveryDate: '28 Sept 2026',
    deliveryDueTimestamp: '2026-09-28',
    location: 'Jaffna / Dambulla Distribution Hub',
    status: 'In Progress',
    qualityRequirements: 'Export Grade A, crisp texture, deep green, 7-10cm uniform pods, max 3% moisture transit variance.',
    paymentTerms: '100% AgroLink Escrow Vault backing with bi-weekly automated bank release upon QR receipt verification.',
    nextAction: 'Batch harvesting and crate packaging underway; dispatch scheduled for Mon morning.',
    nextActionParty: 'Farmer',
    completedMilestonesCount: 3,
    totalMilestonesCount: 6,
    milestones: [
      { id: 'm1', title: 'Contract Terms Established', due: '15 Jul 2026', status: 'Completed', note: 'Terms established with guaranteed price floor of Rs. 380/kg.' },
      { id: 'm2', title: 'Crop Health Verification', due: '05 Aug 2026', status: 'Completed', note: 'Irrigation & pod development verified by Jaffna field inspector.' },
      { id: 'm3', title: 'First Batch Picking & Sorting', due: '10 Sept 2026', status: 'Completed', note: '500 kg harvested, graded, and inspected into ventilated crates.' },
      { id: 'm4', title: 'Bulk Harvesting & Packaging', due: '22 Sept 2026', status: 'In Progress', note: '1,000 kg pod harvesting and packaging in progress.' },
      { id: 'm5', title: 'Regional Collection Dispatch', due: '28 Sept 2026', status: 'Upcoming', note: 'Delivery to regional collection center for direct cross-docking.' },
      { id: 'm6', title: 'Escrow Settlement', due: '29 Sept 2026', status: 'Upcoming', note: 'Automated escrow payment transfer of Rs. 570,000 to farmer bank account.' }
    ]
  },
  {
    id: 'CTR-803',
    crop: 'Aged Samba Rice Supply Contract',
    cropName: 'Samba Rice',
    farmer: 'Anura Bandara (Rajarata Rice Mills)',
    farmerEmail: 'anura.b@agrolink.lk',
    buyer: 'Shangri-La Hotels & Resorts',
    buyerCategory: 'Hospitality Group',
    quantity: 10,
    unit: 'MT',
    quantityKg: 10000,
    pricePerKg: 220,
    priceFormatted: 'Rs. 220 / kg',
    startDate: '2026-06-01',
    deliveryDate: '15 Oct 2026',
    deliveryDueTimestamp: '2026-10-15',
    location: 'Anuradhapura / Colombo Dock',
    status: 'Active',
    qualityRequirements: 'Premium Aged Samba, moisture content < 11%, zero foreign matter, broken grain ratio < 1.5%.',
    paymentTerms: '25% advance locked at sowing; 75% settled via automated lab moisture certificate sign-off.',
    nextAction: 'Final milling batch quality certification test pending at Rajarata Grain Depot.',
    nextActionParty: 'Buyer',
    completedMilestonesCount: 4,
    totalMilestonesCount: 6,
    milestones: [
      { id: 'm1', title: 'Agreement Signed & Advance Locked', due: '01 Jun 2026', status: 'Completed', note: 'Rs. 550,000 escrow advance locked.' },
      { id: 'm2', title: 'Harvest & Paddy Storage Ageing', due: '15 Jul 2026', status: 'Completed', note: 'Paddy stored in aeration silos for 6-month ageing process.' },
      { id: 'm3', title: 'De-husking & Precision Grading', due: '20 Aug 2026', status: 'Completed', note: 'Milled into 25kg moisture-barrier sealed sacks.' },
      { id: 'm4', title: 'Lab Moisture & Purity Analysis', due: '25 Sept 2026', status: 'In Progress', note: 'Independent lab assay verification for hotel kitchen standards.' },
      { id: 'm5', title: 'Logistics Transport to Colombo', due: '15 Oct 2026', status: 'Upcoming', note: 'Palletized container transport to Colombo Central Receiving Dock.' },
      { id: 'm6', title: 'Receiving Dock Sign-off & Final Release', due: '16 Oct 2026', status: 'Upcoming', note: 'Executive Chef quality verification & escrow transfer of Rs. 1,650,000.' }
    ]
  },
  {
    id: 'CTR-804',
    crop: 'Alba Cinnamon Quills Contract',
    cropName: 'Alba Cinnamon',
    farmer: 'Nihal Jayasuriya (Southern Spice Estate)',
    farmerEmail: 'nihal.j@agrolink.lk',
    buyer: 'Dilmah Ceylon Tea & Spices',
    buyerCategory: 'Exporter & Processor',
    quantity: 500,
    unit: 'kg',
    quantityKg: 500,
    pricePerKg: 1550,
    priceFormatted: 'Rs. 1,550 / kg',
    startDate: '2026-09-01',
    deliveryDate: '05 Nov 2026',
    deliveryDueTimestamp: '2026-11-05',
    location: 'Galle / Matara Processing Hub',
    status: 'Pending Approval',
    qualityRequirements: 'Export-grade thin quills diameter < 6mm, low coumarin (< 0.002%), hand-peeled smooth finish, vacuum sealed.',
    paymentTerms: '30% escrow deposit upon bilateral contract signing; 70% paid immediately after chemical assay verification.',
    nextAction: 'Farmer digital signature required on agreed price and delivery terms.',
    nextActionParty: 'Farmer',
    completedMilestonesCount: 1,
    totalMilestonesCount: 5,
    milestones: [
      { id: 'm1', title: 'Tender Quota Awarded', due: '01 Sept 2026', status: 'Completed', note: 'Buyer published export requirement; farmer terms agreed.' },
      { id: 'm2', title: 'Bilateral Agreement Signing', due: '20 Sept 2026', status: 'In Progress', note: 'Pending digital signature acceptance from Southern Spice Estate.' },
      { id: 'm3', title: 'Harvest & Quill Peeling Process', due: '15 Oct 2026', status: 'Upcoming', note: 'Hand peeling of slender inner bark and drying under shade.' },
      { id: 'm4', title: 'Coumarin Lab Verification', due: '30 Oct 2026', status: 'Upcoming', note: 'European retail export purity testing.' },
      { id: 'm5', title: 'Final Delivery & Payout', due: '05 Nov 2026', status: 'Upcoming', note: 'Galle Processing Facility delivery and settlement of Rs. 775,000.' }
    ]
  },
  {
    id: 'CTR-805',
    crop: 'Highland Carrots Supply Contract',
    cropName: 'Highland Carrots',
    farmer: 'Priyantha Dissanayake (Kandurata Farms)',
    farmerEmail: 'priyantha.d@agrolink.lk',
    buyer: 'SPAR Supermarket Sri Lanka',
    buyerCategory: 'Supermarket Chain',
    quantity: 3,
    unit: 'MT',
    quantityKg: 3000,
    pricePerKg: 260,
    priceFormatted: 'Rs. 260 / kg',
    startDate: '2026-05-10',
    deliveryDate: '10 Aug 2026',
    deliveryDueTimestamp: '2026-08-10',
    location: 'Nuwara Eliya / Colombo SPAR Stores',
    status: 'Completed',
    qualityRequirements: 'Washed, tops trimmed, length 12-18cm, smooth skin, zero soil accumulation, crisp texture.',
    paymentTerms: '100% Escrow backed. Paid in full upon produce reception and weighbridge confirmation.',
    nextAction: 'Contract successfully fulfilled. Ready for next season renewal.',
    nextActionParty: 'None',
    completedMilestonesCount: 5,
    totalMilestonesCount: 5,
    milestones: [
      { id: 'm1', title: 'Agreement Signed & Sowing', due: '10 May 2026', status: 'Completed', note: 'Seed sowing in terraced Nuwara Eliya highland beds.' },
      { id: 'm2', title: 'Growth & Irrigation Verification', due: '15 Jun 2026', status: 'Completed', note: 'Field inspection confirmed uniform root sizing.' },
      { id: 'm3', title: 'Harvesting & Washing', due: '02 Aug 2026', status: 'Completed', note: 'Mechanized wash line sorting and 10kg perforated crate pack.' },
      { id: 'm4', title: 'Cold-Chain Transit', due: '09 Aug 2026', status: 'Completed', note: '8°C refrigerated transit to Colombo logistics hub.' },
      { id: 'm5', title: 'Delivery Received & Escrow Settled', due: '10 Aug 2026', status: 'Completed', note: 'Full Rs. 780,000 escrow payment deposited to farmer account.' }
    ]
  }
];

export const ContractFarming = () => {
  const { user, isFarmer, isBuyer, isBusinessBuyer, isAdmin } = useAuth();

  // Role permissions
  const canCreateContract = isBuyer || isBusinessBuyer || isAdmin;
  const isFarmerRole = isFarmer;
  const isBuyerRole = isBuyer || isBusinessBuyer;

  // State
  const [contracts, setContracts] = useState(INITIAL_CONTRACTS);
  const [selectedContractId, setSelectedContractId] = useState('CTR-801');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [feedbackMsg, setFeedbackMsg] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [signatureName, setSignatureName] = useState('');
  const [signConsent, setSignConsent] = useState(false);

  // New contract form state
  const [newContractForm, setNewContractForm] = useState({
    cropName: '',
    farmerName: '',
    farmerEmail: '',
    buyerName: user?.name || 'Enterprise Buyer',
    quantity: '',
    unit: 'MT',
    pricePerKg: '',
    startDate: new Date().toISOString().split('T')[0],
    deliveryDate: '',
    location: 'Nuwara Eliya / Central Hub',
    qualityRequirements: 'Grade A standard, zero chemical residue, firm texture.',
    paymentTerms: '20% escrow advance lock, 80% disbursement on digital delivery verification.'
  });

  // Update milestone form state
  const [updateNote, setUpdateNote] = useState('');
  const [selectedMilestoneId, setSelectedMilestoneId] = useState('');

  // Refs for smooth scroll
  const detailsRef = useRef(null);

  // Sync with backend API if available
  useEffect(() => {
    let isMounted = true;
    const loadBackendContracts = async () => {
      try {
        const res = await contractFarmingAPI.getAll();
        if (isMounted && res?.data && Array.isArray(res.data) && res.data.length > 0) {
          // Merge any backend items into our rich model
          const backendItems = res.data.map((b, idx) => ({
            id: b.id || `CTR-BE-${idx + 1}`,
            crop: `${b.cropName} Supply Contract`,
            cropName: b.cropName,
            farmer: 'Registered Farmer Network',
            farmerEmail: 'farmer@agrolink.lk',
            buyer: b.buyerName || 'Enterprise Buyer',
            buyerCategory: b.buyerCategory || 'Procurement',
            quantity: b.monthlyQuantityKg ? Math.round(b.monthlyQuantityKg / 1000 * 10) / 10 : 2,
            unit: 'MT',
            quantityKg: b.monthlyQuantityKg || 2000,
            pricePerKg: b.minPriceLkr ? Number(b.minPriceLkr) : 200,
            priceFormatted: `Rs. ${b.minPriceLkr || 200} / kg`,
            startDate: '2026-08-01',
            deliveryDate: '30 Sept 2026',
            deliveryDueTimestamp: '2026-09-30',
            location: 'Central Hub / Dambulla',
            status: b.status === 'OPEN' ? 'Active' : (b.status === 'FULFILLED' ? 'Completed' : 'In Progress'),
            qualityRequirements: b.qualityGrade ? `${b.qualityGrade} quality standards.` : 'Grade A standard.',
            paymentTerms: '100% Escrow protected with milestone delivery release.',
            nextAction: 'Delivery dispatch scheduled per weekly frequency.',
            nextActionParty: 'Farmer',
            completedMilestonesCount: 2,
            totalMilestonesCount: 4,
            milestones: [
              { id: 'bm1', title: 'Contract Created & Escrow Deposited', due: '01 Aug 2026', status: 'Completed', note: 'Purchase request accepted and funded in escrow.' },
              { id: 'bm2', title: 'Field Preparation & Sowing', due: '15 Aug 2026', status: 'Completed', note: 'Transplanting verified.' },
              { id: 'bm3', title: 'Quality Grading & Dispatch', due: '25 Sept 2026', status: 'In Progress', note: 'Final grading in progress.' },
              { id: 'bm4', title: 'Dock Inspection & Escrow Payout', due: '30 Sept 2026', status: 'Upcoming', note: 'Final delivery verification.' }
            ]
          }));

          setContracts(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const freshOnes = backendItems.filter(bi => !existingIds.has(bi.id));
            return [...prev, ...freshOnes];
          });
        }
      } catch (err) {
        // Fallback to rich initial contracts
      }
    };

    loadBackendContracts();
    return () => { isMounted = false; };
  }, []);

  // Filtered contracts
  const filteredContracts = useMemo(() => {
    return contracts.filter(c => {
      const matchSearch =
        c.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [contracts, searchTerm, statusFilter]);

  // Selected contract object
  const selectedContract = useMemo(() => {
    return contracts.find(c => c.id === selectedContractId) || contracts[0] || null;
  }, [contracts, selectedContractId]);

  // Summary Metrics calculations
  const summaryMetrics = useMemo(() => {
    const total = contracts.length;
    const active = contracts.filter(c => c.status === 'Active' || c.status === 'In Progress').length;
    const pending = contracts.filter(c => c.status === 'Pending Approval' || c.status === 'Draft').length;
    const completed = contracts.filter(c => c.status === 'Completed').length;
    const totalVolumeMt = contracts.reduce((acc, c) => acc + (c.unit === 'MT' ? c.quantity : c.quantity / 1000), 0);
    const totalEscrowVal = contracts.reduce((acc, c) => acc + (c.quantityKg * c.pricePerKg), 0);

    return { total, active, pending, completed, totalVolumeMt: totalVolumeMt.toFixed(1), totalEscrowVal };
  }, [contracts]);

  // Upcoming Milestones across all active/in-progress contracts
  const upcomingMilestonesList = useMemo(() => {
    const list = [];
    contracts.forEach(c => {
      if (c.status === 'Active' || c.status === 'In Progress' || c.status === 'Pending Approval') {
        c.milestones.forEach(m => {
          if (m.status === 'In Progress' || m.status === 'Upcoming') {
            list.push({
              contractId: c.id,
              crop: c.cropName,
              buyer: c.buyer,
              farmer: c.farmer,
              milestoneTitle: m.title,
              dueDate: m.due,
              milestoneStatus: m.status,
              contractStatus: c.status
            });
          }
        });
      }
    });
    return list.slice(0, 4);
  }, [contracts]);

  // Notification Banner trigger
  const showFeedback = (msg, type = 'success') => {
    setFeedbackMsg({ text: msg, type });
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 4500);
  };

  // Handler: Select contract to view
  const handleSelectContract = (contractId) => {
    setSelectedContractId(contractId);
    if (detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handler: Create Contract (Buyer/Admin)
  const handleCreateContractSubmit = async (e) => {
    e.preventDefault();
    if (!newContractForm.cropName || !newContractForm.quantity || !newContractForm.pricePerKg) {
      showFeedback('Please fill out all required fields: Crop, Quantity, and Price.', 'error');
      return;
    }

    const qtyNumber = Number(newContractForm.quantity);
    const priceNum = Number(newContractForm.pricePerKg);
    const qtyInKg = newContractForm.unit === 'MT' ? qtyNumber * 1000 : qtyNumber;
    const newId = `CTR-${Math.floor(810 + Math.random() * 90)}`;

    const newContractObj = {
      id: newId,
      crop: `${newContractForm.cropName} Supply Contract`,
      cropName: newContractForm.cropName,
      farmer: newContractForm.farmerName || 'Allocated Certified Grower',
      farmerEmail: newContractForm.farmerEmail || 'grower@agrolink.lk',
      buyer: newContractForm.buyerName || user?.name || 'Enterprise Buyer',
      buyerCategory: 'Commercial Buyer',
      quantity: qtyNumber,
      unit: newContractForm.unit,
      quantityKg: qtyInKg,
      pricePerKg: priceNum,
      priceFormatted: `Rs. ${priceNum.toLocaleString()} / kg`,
      startDate: newContractForm.startDate,
      deliveryDate: newContractForm.deliveryDate || '30 Oct 2026',
      deliveryDueTimestamp: newContractForm.deliveryDate || '2026-10-30',
      location: newContractForm.location,
      status: 'Pending Approval',
      qualityRequirements: newContractForm.qualityRequirements,
      paymentTerms: newContractForm.paymentTerms,
      nextAction: 'Farmer digital review and acceptance required.',
      nextActionParty: 'Farmer',
      completedMilestonesCount: 1,
      totalMilestonesCount: 5,
      milestones: [
        { id: 'm1', title: 'Contract Proposed & Terms Issued', due: newContractForm.startDate, status: 'Completed', note: 'Purchase agreement terms created by buyer.' },
        { id: 'm2', title: 'Farmer Sign-Off & Escrow Locking', due: 'Pending', status: 'In Progress', note: 'Awaiting grower digital signature.' },
        { id: 'm3', title: 'Land Preparation & Sowing Confirmation', due: 'Pending', status: 'Upcoming', note: 'Nursery seedlings transplanting.' },
        { id: 'm4', title: 'Pre-Harvest Quality Inspection', due: 'Pending', status: 'Upcoming', note: 'Sizing & chemical residue testing.' },
        { id: 'm5', title: 'Delivery & Escrow Release', due: newContractForm.deliveryDate || '30 Oct 2026', status: 'Upcoming', note: 'Verification at receiving dock.' }
      ]
    };

    // Try backend API integration
    try {
      await api.post('/contracts', {
        id: newId,
        buyerName: newContractObj.buyer,
        buyerCategory: newContractObj.buyerCategory,
        cropName: newContractObj.cropName,
        monthlyQuantityKg: qtyInKg,
        durationMonths: 6,
        minPriceLkr: priceNum,
        maxPriceLkr: priceNum,
        qualityGrade: 'Grade A',
        deliveryFrequency: 'Scheduled',
        status: 'OPEN',
        applicantCount: 1
      });
    } catch (err) {
      // Backend fallback handled smoothly in local state
    }

    setContracts(prev => [newContractObj, ...prev]);
    setSelectedContractId(newId);
    setIsCreateModalOpen(false);
    showFeedback(`Supply contract for ${newContractObj.cropName} created successfully! Reference: ${newId}`);

    // Reset form
    setNewContractForm({
      cropName: '',
      farmerName: '',
      farmerEmail: '',
      buyerName: user?.name || 'Enterprise Buyer',
      quantity: '',
      unit: 'MT',
      pricePerKg: '',
      startDate: new Date().toISOString().split('T')[0],
      deliveryDate: '',
      location: 'Nuwara Eliya / Central Hub',
      qualityRequirements: 'Grade A standard, zero chemical residue, firm texture.',
      paymentTerms: '20% escrow advance lock, 80% disbursement on digital delivery verification.'
    });
  };

  // Handler: Farmer Accept / Sign Contract
  const handleFarmerSignSubmit = (e) => {
    e.preventDefault();
    if (!signatureName.trim() || !signConsent) {
      showFeedback('Please provide your full signature name and check the acceptance box.', 'error');
      return;
    }

    setContracts(prev => prev.map(c => {
      if (c.id === selectedContract.id) {
        const updatedMilestones = c.milestones.map((m, idx) => {
          if (idx === 0 || idx === 1) {
            return { ...m, status: 'Completed', note: `Signed by ${signatureName} on ${new Date().toLocaleDateString()}.` };
          }
          if (idx === 2) {
            return { ...m, status: 'In Progress' };
          }
          return m;
        });

        return {
          ...c,
          status: 'Active',
          nextAction: 'Proceed with land preparation and upload sowing photo log.',
          nextActionParty: 'Farmer',
          completedMilestonesCount: 2,
          milestones: updatedMilestones
        };
      }
      return c;
    }));

    setIsSignModalOpen(false);
    setSignatureName('');
    setSignConsent(false);
    showFeedback(`Contract ${selectedContract.id} successfully accepted and signed! Escrow deposit activated.`);
  };

  // Handler: Farmer Submit Progress / Delivery Update
  const handleFarmerSubmitUpdate = (e) => {
    e.preventDefault();
    if (!updateNote.trim()) {
      showFeedback('Please enter progress notes or batch dispatch details.', 'error');
      return;
    }

    setContracts(prev => prev.map(c => {
      if (c.id === selectedContract.id) {
        const updatedMilestones = c.milestones.map(m => {
          if (m.id === selectedMilestoneId) {
            return {
              ...m,
              status: 'Completed',
              note: `${m.note} • Update: ${updateNote}`
            };
          }
          return m;
        });

        const newCompletedCount = updatedMilestones.filter(m => m.status === 'Completed').length;
        const nextMilestone = updatedMilestones.find(m => m.status === 'Upcoming');
        if (nextMilestone) {
          nextMilestone.status = 'In Progress';
        }

        return {
          ...c,
          status: 'In Progress',
          completedMilestonesCount: newCompletedCount,
          nextAction: `Buyer verification required for latest update: "${updateNote.slice(0, 45)}..."`,
          nextActionParty: 'Buyer',
          milestones: updatedMilestones
        };
      }
      return c;
    }));

    setIsUpdateModalOpen(false);
    setUpdateNote('');
    showFeedback(`Farming milestone update submitted for ${selectedContract.cropName}! Buyer notified for review.`);
  };

  // Handler: Buyer Confirm Delivery / Quality
  const handleBuyerConfirmDelivery = () => {
    setContracts(prev => prev.map(c => {
      if (c.id === selectedContract.id) {
        const allCompleted = c.milestones.map(m => ({ ...m, status: 'Completed' }));
        return {
          ...c,
          status: 'Completed',
          completedMilestonesCount: c.totalMilestonesCount,
          nextAction: 'Contract successfully fulfilled. Final escrow payout released.',
          nextActionParty: 'None',
          milestones: allCompleted
        };
      }
      return c;
    }));

    setIsConfirmModalOpen(false);
    showFeedback(`Delivery received & verified! Final Escrow payment released to ${selectedContract.farmer}.`);
  };

  // Handler: Print Contract Summary
  const handlePrintSummary = () => {
    window.print();
  };

  // Status renderer helper
  const renderStatusBadge = (statusName) => {
    const config = STATUS_CONFIG[statusName] || STATUS_CONFIG['Active'];
    const IconComponent = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.badgeClass}`}>
        <span className={`w-2 h-2 rounded-full ${config.indicatorClass}`} aria-hidden="true" />
        <IconComponent className="w-3.5 h-3.5" />
        <span>{config.label}</span>
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:p-0 print:m-0">
      {/* ─── 1. PAGE HEADER ────────────────────────────────────────── */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Leaf className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-display">
              Contract Farming
            </h1>
          </div>
          <p className="text-sm text-slate-600 max-w-2xl">
            Manage crop supply agreements, delivery commitments, and farming milestones in one place.
          </p>
        </div>

        {/* Primary Action where supported: Only for authorized buyers/admins */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrintSummary}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition shadow-xs cursor-pointer"
            title="Print or save PDF summary"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Summary</span>
          </button>

          {canCreateContract && (
            <button
              id="create-contract-btn"
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Contract</span>
            </button>
          )}
        </div>
      </header>

      {/* FEEDBACK BANNER */}
      {feedbackMsg && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`p-4 rounded-xl border flex items-center justify-between text-xs sm:text-sm font-medium ${
            feedbackMsg.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMsg.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMsg(null)}
            className="p-1 hover:bg-black/5 rounded-md text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* ─── 2. CONTRACT SUMMARY ───────────────────────────────────── */}
      <section aria-labelledby="summary-heading" className="space-y-3">
        <h2 id="summary-heading" className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Contract Portfolio Summary
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-600" /> Total Contracts
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900 font-display">{summaryMetrics.total}</span>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                {summaryMetrics.active} Active
              </span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">Across partner growers &amp; retail buyers</p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-teal-600" /> Committed Harvest Volume
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900 font-display">{summaryMetrics.totalVolumeMt} MT</span>
              <span className="text-[11px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-md">
                Contracted
              </span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">Guaranteed scheduled delivery quota</p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Protected Escrow Value
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900 font-display">
                Rs. {(summaryMetrics.totalEscrowVal / 1000000).toFixed(2)}M
              </span>
              <span className="text-[11px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded-md">
                100% Guaranteed
              </span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">Zero buyer default payment escrow</p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Milestones
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900 font-display">{summaryMetrics.pending}</span>
              <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md">
                Review Required
              </span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">Approvals &amp; pre-harvest checks</p>
          </div>
        </div>
      </section>

      {/* ─── 3. ACTIVE CONTRACTS ───────────────────────────────────── */}
      <section aria-labelledby="active-contracts-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 id="active-contracts-heading" className="text-lg font-bold text-slate-900 font-display">
              Active Contracts
            </h2>
            <p className="text-xs text-slate-500">
              Browse current supply agreements, verify parties, pricing, and delivery dates.
            </p>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search crop, farmer, or buyer..."
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-48 sm:w-56"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 px-3 text-xs bg-white border border-slate-300 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Contract Cards Grid */}
        {filteredContracts.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-2">
            <p className="text-sm font-medium">No contracts match your search filter.</p>
            <button
              onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); }}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredContracts.map((contract) => {
              const isSelected = contract.id === selectedContract?.id;
              return (
                <div
                  key={contract.id}
                  className={`relative p-5 rounded-2xl bg-white border transition-all duration-200 flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md ${
                    isSelected
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Card Header: Crop Title & Status */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-mono font-semibold text-slate-400">
                          {contract.id}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 leading-snug">
                          {contract.crop}
                        </h3>
                      </div>
                      <div className="shrink-0">
                        {renderStatusBadge(contract.status)}
                      </div>
                    </div>

                    {/* Parties: Farmer & Buyer */}
                    <div className="space-y-1 pt-1 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-slate-500">Farmer:</span>
                        <span className="font-semibold text-slate-900 truncate" title={contract.farmer}>
                          {contract.farmer}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-slate-500">Buyer:</span>
                        <span className="font-semibold text-slate-900 truncate" title={contract.buyer}>
                          {contract.buyer}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Core Metrics: Quantity, Price, Delivery Date */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Quantity</span>
                      <span className="text-sm font-extrabold text-slate-900">
                        {contract.quantity} {contract.unit}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Agreed Price</span>
                      <span className="text-sm font-extrabold text-emerald-700">
                        {contract.priceFormatted}
                      </span>
                    </div>

                    <div className="col-span-2 pt-1 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> Delivery:
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {contract.deliveryDate}
                      </span>
                    </div>
                  </div>

                  {/* Primary Action: View Contract */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">
                      Milestones: {contract.completedMilestonesCount}/{contract.totalMilestonesCount}
                    </span>
                    <button
                      onClick={() => handleSelectContract(contract.id)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-800 hover:bg-emerald-50 hover:text-emerald-800'
                      }`}
                    >
                      <span>{isSelected ? 'Viewing Contract' : 'View Contract'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ─── 4. UPCOMING MILESTONES ─────────────────────────────────── */}
      <section aria-labelledby="milestones-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="milestones-heading" className="text-lg font-bold text-slate-900 font-display">
              Upcoming Milestones
            </h2>
            <p className="text-xs text-slate-500">
              Immediate inspection dates, harvest windows, and fulfillment deadlines.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {upcomingMilestonesList.length} Upcoming Tasks
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {upcomingMilestonesList.map((item, idx) => (
            <div
              key={`${item.contractId}-${idx}`}
              onClick={() => handleSelectContract(item.contractId)}
              className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors cursor-pointer space-y-2 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  {item.contractId}
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {item.crop}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                  {item.milestoneTitle}
                </h4>
                <p className="text-[11px] text-slate-500 truncate">
                  Buyer: {item.buyer}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                <span className="text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" /> Due:
                </span>
                <span className="font-bold text-slate-800">
                  {item.dueDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 5. CONTRACT DETAILS ───────────────────────────────────── */}
      {selectedContract && (
        <section
          ref={detailsRef}
          aria-labelledby="details-heading"
          className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6"
        >
          {/* Details Header & Reference */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                  Ref: {selectedContract.id}
                </span>
                <h2 id="details-heading" className="text-xl font-bold text-slate-900 font-display">
                  {selectedContract.crop}
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Full bilateral agreement specifications, delivery commitments, and quality benchmarks.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {renderStatusBadge(selectedContract.status)}
            </div>
          </div>

          {/* WHAT NEEDS TO HAPPEN NEXT? BANNER */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/90 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">
                  Action Required • Next Step
                </span>
                <p className="text-xs sm:text-sm font-semibold text-amber-950">
                  {selectedContract.nextAction}
                </p>
              </div>
            </div>

            {/* Quick Contextual Trigger */}
            <div className="shrink-0">
              {selectedContract.status === 'Pending Approval' && isFarmerRole && (
                <button
                  onClick={() => setIsSignModalOpen(true)}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-xs cursor-pointer"
                >
                  Review &amp; Sign
                </button>
              )}
              {selectedContract.status === 'In Progress' && isFarmerRole && (
                <button
                  onClick={() => setIsUpdateModalOpen(true)}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-xs cursor-pointer"
                >
                  Submit Update
                </button>
              )}
              {selectedContract.status === 'In Progress' && isBuyerRole && (
                <button
                  onClick={() => setIsConfirmModalOpen(true)}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-xs cursor-pointer"
                >
                  Verify Delivery
                </button>
              )}
            </div>
          </div>

          {/* Contract Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 font-medium">Contract Reference</span>
              <p className="text-slate-900 font-bold font-mono text-sm">{selectedContract.id}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 font-medium">Crop Specification</span>
              <p className="text-slate-900 font-bold text-sm">{selectedContract.cropName}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 font-medium">Contracted Quantity &amp; Unit</span>
              <p className="text-slate-900 font-bold text-sm">
                {selectedContract.quantity} {selectedContract.unit} ({selectedContract.quantityKg.toLocaleString()} kg)
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 font-medium">Agreed Price &amp; Total Value</span>
              <p className="text-emerald-700 font-bold text-sm">
                {selectedContract.priceFormatted} (Rs. {(selectedContract.quantityKg * selectedContract.pricePerKg).toLocaleString()})
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 font-medium">Contracted Farmer</span>
              <p className="text-slate-900 font-semibold">{selectedContract.farmer}</p>
              <p className="text-[11px] text-slate-500 truncate">{selectedContract.farmerEmail}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 font-medium">Procurement Buyer</span>
              <p className="text-slate-900 font-semibold">{selectedContract.buyer}</p>
              <p className="text-[11px] text-slate-500">{selectedContract.buyerCategory}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 font-medium">Contract Start Date</span>
              <p className="text-slate-900 font-semibold">{selectedContract.startDate}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 font-medium">Delivery Due Date</span>
              <p className="text-slate-900 font-semibold">{selectedContract.deliveryDate}</p>
            </div>
          </div>

          {/* Detailed Terms: Location, Quality Requirements, Payment Terms */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Delivery Hub &amp; Location</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {selectedContract.location}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Scale className="w-4 h-4 text-teal-600" />
                <span>Quality Requirements</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {selectedContract.qualityRequirements}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Payment &amp; Escrow Terms</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {selectedContract.paymentTerms}
              </p>
            </div>
          </div>

          {/* ─── 6. TIMELINE / PROGRESS ─────────────────────────────────── */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Farming &amp; Delivery Milestone Timeline
                </h3>
                <p className="text-xs text-slate-500">
                  Step-by-step verified stage progression from initial signing to payment settlement.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {selectedContract.completedMilestonesCount} of {selectedContract.totalMilestonesCount} Completed
              </span>
            </div>

            {/* Visual Timeline Steps */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {selectedContract.milestones.map((milestone, idx) => {
                const isDone = milestone.status === 'Completed';
                const isCurrent = milestone.status === 'In Progress';
                const isUpcoming = milestone.status === 'Upcoming';

                return (
                  <div key={milestone.id} className="relative group">
                    {/* Node Dot */}
                    <div
                      className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isDone
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-white border-emerald-600 text-emerald-600 ring-4 ring-emerald-100'
                          : 'bg-white border-slate-300 text-slate-400'
                      }`}
                    >
                      {isDone ? (
                        <Check className="w-3 h-3 stroke-[3]" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      )}
                    </div>

                    {/* Milestone Card */}
                    <div className={`p-4 rounded-xl border text-xs space-y-1 transition-all ${
                      isCurrent
                        ? 'bg-emerald-50/40 border-emerald-200 shadow-xs'
                        : isDone
                        ? 'bg-white border-slate-200'
                        : 'bg-slate-50/60 border-slate-200/60 text-slate-500'
                    }`}>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">
                            {idx + 1}. {milestone.title}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isDone
                              ? 'bg-emerald-100 text-emerald-800'
                              : isCurrent
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            {milestone.status}
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Target Date: {milestone.due}
                        </span>
                      </div>

                      <p className="text-slate-600 leading-relaxed pt-0.5">
                        {milestone.note}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── 7. ROLE-BASED ACTIONS ─────────────────────────────────── */}
          <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Active User Role:{' '}
              <span className="font-bold text-slate-800">
                {user?.role || 'Authorized Member'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Farmer Actions */}
              {isFarmerRole && (
                <>
                  {selectedContract.status === 'Pending Approval' && (
                    <button
                      onClick={() => setIsSignModalOpen(true)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Accept &amp; Digitally Sign Agreement
                    </button>
                  )}

                  {(selectedContract.status === 'Active' || selectedContract.status === 'In Progress') && (
                    <button
                      onClick={() => {
                        const inProg = selectedContract.milestones.find(m => m.status === 'In Progress') || selectedContract.milestones[0];
                        setSelectedMilestoneId(inProg.id);
                        setIsUpdateModalOpen(true);
                      }}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Truck className="w-3.5 h-3.5" /> Submit Milestone / Delivery Update
                    </button>
                  )}
                </>
              )}

              {/* Buyer Actions */}
              {isBuyerRole && (
                <>
                  {(selectedContract.status === 'Active' || selectedContract.status === 'In Progress') && (
                    <button
                      onClick={() => setIsConfirmModalOpen(true)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <BadgeCheck className="w-3.5 h-3.5" /> Confirm Delivery &amp; Release Escrow
                    </button>
                  )}
                </>
              )}

              {/* General Actions */}
              <button
                onClick={handlePrintSummary}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" /> Export / Print
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ─── MODAL: CREATE CONTRACT (BUYERS ONLY) ────────────────────── */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    Create Crop Supply Contract
                  </h3>
                  <p className="text-xs text-slate-500">
                    Publish guaranteed procurement commitments backed by AgroLink Escrow.
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateContractSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Crop Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Organic Tomato, Green Chillies"
                      value={newContractForm.cropName}
                      onChange={(e) => setNewContractForm({ ...newContractForm, cropName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Contracted Farmer Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Sunil Perera (Leave empty for tender broadcast)"
                      value={newContractForm.farmerName}
                      onChange={(e) => setNewContractForm({ ...newContractForm, farmerName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 space-y-1">
                    <label className="font-semibold text-slate-700">Required Quantity *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      step="any"
                      placeholder="e.g. 5"
                      value={newContractForm.quantity}
                      onChange={(e) => setNewContractForm({ ...newContractForm, quantity: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Unit</label>
                    <select
                      value={newContractForm.unit}
                      onChange={(e) => setNewContractForm({ ...newContractForm, unit: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
                    >
                      <option value="MT">MT (Metric Tons)</option>
                      <option value="kg">kg (Kilograms)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Agreed Price (Rs / kg) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 185"
                      value={newContractForm.pricePerKg}
                      onChange={(e) => setNewContractForm({ ...newContractForm, pricePerKg: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Delivery Due Date *</label>
                    <input
                      type="date"
                      required
                      value={newContractForm.deliveryDate}
                      onChange={(e) => setNewContractForm({ ...newContractForm, deliveryDate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Delivery Hub / Destination</label>
                  <input
                    type="text"
                    value={newContractForm.location}
                    onChange={(e) => setNewContractForm({ ...newContractForm, location: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Quality Specifications</label>
                  <textarea
                    rows={2}
                    value={newContractForm.qualityRequirements}
                    onChange={(e) => setNewContractForm({ ...newContractForm, qualityRequirements: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 space-y-1">
                  <span className="font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> AgroLink Escrow Protection
                  </span>
                  <p>
                    Contract funds are vaulted upon bilateral signature and released per milestone verification.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                  >
                    Create &amp; Issue Contract
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL: FARMER SIGN CONTRACT ────────────────────────────── */}
      <AnimatePresence>
        {isSignModalOpen && selectedContract && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    Accept &amp; Digitally Sign Agreement
                  </h3>
                  <p className="text-xs text-slate-500">
                    Bilateral Supply Commitment: {selectedContract.id}
                  </p>
                </div>
                <button
                  onClick={() => setIsSignModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Crop &amp; Quota:</span>
                  <span className="font-bold text-slate-800">{selectedContract.cropName} ({selectedContract.quantity} {selectedContract.unit})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Agreed Price:</span>
                  <span className="font-bold text-emerald-700">{selectedContract.priceFormatted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Delivery Due:</span>
                  <span className="font-bold text-slate-800">{selectedContract.deliveryDate}</span>
                </div>
              </div>

              <form onSubmit={handleFarmerSignSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Digital Signature (Full Legal Name) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name to sign"
                    value={signatureName}
                    onChange={(e) => setSignatureName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                  />
                </div>

                <label className="flex items-start gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={signConsent}
                    onChange={(e) => setSignConsent(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-[11px] text-slate-600 leading-normal">
                    I confirm that I have reviewed the required quantity, quality standards, and delivery date, and agree to supply the produce backed by AgroLink Escrow guarantee.
                  </span>
                </label>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsSignModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                  >
                    Confirm &amp; Sign
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL: FARMER SUBMIT MILESTONE UPDATE ───────────────────── */}
      <AnimatePresence>
        {isUpdateModalOpen && selectedContract && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    Submit Farming Progress Update
                  </h3>
                  <p className="text-xs text-slate-500">
                    Log harvest advancement or batch dispatch for {selectedContract.id}
                  </p>
                </div>
                <button
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleFarmerSubmitUpdate} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Select Milestone</label>
                  <select
                    value={selectedMilestoneId}
                    onChange={(e) => setSelectedMilestoneId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
                  >
                    {selectedContract.milestones.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.title} ({m.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Progress / Dispatch Notes *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Sowing complete in Block B with 98% germination rate. First batch picking scheduled for Monday."
                    value={updateNote}
                    onChange={(e) => setUpdateNote(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsUpdateModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                  >
                    Submit Update
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL: BUYER CONFIRM DELIVERY & RELEASE ESCROW ──────────── */}
      <AnimatePresence>
        {isConfirmModalOpen && selectedContract && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    Confirm Produce Delivery &amp; Quality
                  </h3>
                  <p className="text-xs text-slate-500">
                    Verify batch reception and authorize final escrow release.
                  </p>
                </div>
                <button
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs space-y-2 text-slate-800">
                <div className="flex justify-between font-semibold">
                  <span>Contract Ref:</span>
                  <span className="font-mono">{selectedContract.id}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Produce Received:</span>
                  <span>{selectedContract.cropName} ({selectedContract.quantity} {selectedContract.unit})</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Farmer:</span>
                  <span>{selectedContract.farmer}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-800 pt-1 border-t border-emerald-200">
                  <span>Escrow Balance To Release:</span>
                  <span>Rs. {(selectedContract.quantityKg * selectedContract.pricePerKg).toLocaleString()}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600">
                By confirming, you certify that the received produce meets the agreed Grade A quality specifications and weighbridge quantities. The escrow vault will disburse the final payment immediately to the grower's bank account.
              </p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBuyerConfirmDelivery}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs cursor-pointer text-xs flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" /> Confirm &amp; Release Escrow
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContractFarming;

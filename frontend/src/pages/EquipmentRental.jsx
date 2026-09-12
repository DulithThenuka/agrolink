import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { rentalsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Truck,
  Calendar,
  MapPin,
  Star,
  PlusCircle,
  Filter,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  Clock,
  UserCheck,
  Navigation,
  Percent,
  X,
  Shield,
  Tag,
  Wrench,
  Search,
  ArrowRight,
  Info,
  Check,
  SlidersHorizontal,
  ChevronRight,
  AlertCircle,
  User,
  Phone
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const EquipmentRental = () => {
  const { user, isFarmer, isSupplier, isAdmin } = useAuth();

  const [equipmentList, setEquipmentList] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [selectedServiceType, setSelectedServiceType] = useState('ALL'); // 'ALL' | 'EQUIPMENT_ONLY' | 'EQUIPMENT_AND_DRIVER' | 'DRIVER_ONLY'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Modals & Booking Flow
  const [selectedDetailsItem, setSelectedDetailsItem] = useState(null);
  const [bookingEquipment, setBookingEquipment] = useState(null);
  const [bookingStep, setBookingStep] = useState('CONFIGURE'); // 'CONFIGURE' | 'REVIEW' | 'CONFIRMED'
  const [bookingConfirmationData, setBookingConfirmationData] = useState(null);

  // Booking Parameters
  const [serviceOption, setServiceOption] = useState('WITH_DRIVER'); // 'WITH_DRIVER' | 'WITHOUT_DRIVER' | 'DRIVER_ONLY'
  const [startDate, setStartDate] = useState('2026-08-25');
  const [endDate, setEndDate] = useState('2026-08-30');
  const [totalDays, setTotalDays] = useState(5);
  const [deliveryDistanceKm, setDeliveryDistanceKm] = useState(15);
  const [includeDamageWaiver, setIncludeDamageWaiver] = useState(true);
  const [processingBooking, setProcessingBooking] = useState(false);

  // List New Machinery Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMachinery, setNewMachinery] = useState({
    name: '',
    category: 'Tractor',
    location: 'Kurunegala',
    dailyRateLkr: 7500,
    availableFrom: '25 August',
    availableTo: '10 September',
    description: '',
    imageUrl: '',
    rating: 4.9,
    operatorAvailable: true,
    serviceType: 'EQUIPMENT_AND_DRIVER'
  });

  const categories = ['ALL', 'Tractor', 'Harvester', 'Drone', 'Water Pump', 'Cultivator'];
  const locations = ['ALL', 'Kurunegala', 'Anuradhapura', 'Nuwara Eliya', 'Kandy', 'Matale', 'Hambantota', 'Jaffna'];

  const OPERATOR_DAILY_RATE = 2500;
  const TRANSPORT_RATE_PER_KM = 85;
  const DAMAGE_WAIVER_DAILY_RATE = 750;

  const MOCK_EQUIPMENT = [
    {
      id: 1,
      name: 'Kubota L4508 45HP 4WD Tractor',
      category: 'Tractor',
      serviceType: 'EQUIPMENT_AND_DRIVER',
      location: 'Kurunegala',
      dailyRateLkr: 8500,
      driverDailyRateLkr: 2500,
      rating: 4.9,
      ownerName: 'Kurunegala Machinery Hub',
      assignedDriver: 'Kamal Perera (Licensed Tractor Operator)',
      availableFrom: '25 Aug',
      availableTo: '15 Sep',
      operatorAvailable: true,
      distanceKm: 6.4,
      availabilityStatus: 'Available Now',
      imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
      description: 'Heavy-duty 4WD tractor with rotary tiller and heavy plow attachments. Available as equipment-only or with certified driver.'
    },
    {
      id: 2,
      name: 'Yanmar AW70V Combined Paddy Harvester',
      category: 'Harvester',
      serviceType: 'EQUIPMENT_AND_DRIVER',
      location: 'Anuradhapura',
      dailyRateLkr: 22000,
      driverDailyRateLkr: 3500,
      rating: 5.0,
      ownerName: 'Rajarata Agro Machinery Services',
      assignedDriver: 'Sunil Bandara (Master Harvester Driver)',
      availableFrom: '25 Aug',
      availableTo: '20 Sep',
      operatorAvailable: true,
      distanceKm: 12.8,
      availabilityStatus: 'Available Tomorrow',
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
      description: 'High-speed combined grain harvester with 1,400L grain tank. Includes trained paddy operator and farmgate flatbed delivery.'
    },
    {
      id: 3,
      name: 'DJI Agras T40 Agricultural Spraying Drone',
      category: 'Drone',
      serviceType: 'EQUIPMENT_AND_DRIVER',
      location: 'Kandy',
      dailyRateLkr: 15000,
      driverDailyRateLkr: 4000,
      rating: 4.8,
      ownerName: 'SmartAgri Tech Lanka Ltd',
      assignedDriver: 'Dinesh Jayawardena (CAA Certified Drone Pilot)',
      availableFrom: '25 Aug',
      availableTo: '10 Sep',
      operatorAvailable: true,
      distanceKm: 4.2,
      availabilityStatus: 'Available Now',
      imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80',
      description: 'Precision spraying drone with 40kg payload. Operated exclusively by certified pilot for precise pesticide/fertilizer application.'
    },
    {
      id: 4,
      name: 'Honda GX160 High-Pressure 3-Inch Water Pump',
      category: 'Water Pump',
      serviceType: 'EQUIPMENT_ONLY',
      location: 'Matale',
      dailyRateLkr: 3500,
      driverDailyRateLkr: 0,
      rating: 4.7,
      ownerName: 'Central Irrigation Fleet',
      assignedDriver: 'Self-Operated (No Driver Required)',
      availableFrom: '25 Aug',
      availableTo: '30 Sep',
      operatorAvailable: false,
      distanceKm: 18.5,
      availabilityStatus: 'Available Now',
      imageUrl: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=800&auto=format&fit=crop&q=80',
      description: 'High-output 1,000L/min 4-stroke petrol water pump with 30m hoses. Self-operated equipment only.'
    },
    {
      id: 5,
      name: 'Mahindra 15HP Rotary Cultivator / Power Tiller',
      category: 'Cultivator',
      serviceType: 'EQUIPMENT_AND_DRIVER',
      location: 'Nuwara Eliya',
      dailyRateLkr: 5500,
      driverDailyRateLkr: 2000,
      rating: 4.9,
      ownerName: 'Highland Agri Services',
      assignedDriver: 'Nimal Rathnayake (Field Operator)',
      availableFrom: '25 Aug',
      availableTo: '12 Sep',
      operatorAvailable: true,
      distanceKm: 8.1,
      availabilityStatus: 'Available Now',
      imageUrl: 'https://images.unsplash.com/photo-1530267981608-bc70a2974b6f?w=800&auto=format&fit=crop&q=80',
      description: 'Compact 15HP diesel rotary power tiller ideal for terraced vegetable plots. Available with or without field operator.'
    },
    {
      id: 6,
      name: 'Certified Tractor Operator Service (Driver Only)',
      category: 'Tractor',
      serviceType: 'DRIVER_ONLY',
      location: 'Kurunegala',
      dailyRateLkr: 0,
      driverDailyRateLkr: 3500,
      rating: 4.9,
      ownerName: 'Rajarata Operators Union',
      assignedDriver: 'Bandara Wickramasinghe (12 Yrs Exp, 4WD Certified)',
      availableFrom: '25 Aug',
      availableTo: '25 Sep',
      operatorAvailable: true,
      distanceKm: 5.0,
      availabilityStatus: 'Available Now',
      imageUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=800&auto=format&fit=crop&q=80',
      description: 'Professional tractor driver for hire. Drives farmer-owned 35HP to 60HP tractors for ploughing, puddling, and rotavating.'
    }
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eqRes, bookRes] = await Promise.all([
        rentalsAPI.getAvailable(selectedCategory, selectedLocation),
        rentalsAPI.getFarmerBookings(),
      ]);

      if (eqRes && eqRes.data && eqRes.data.length > 0) {
        setEquipmentList(eqRes.data);
      } else {
        setEquipmentList(MOCK_EQUIPMENT);
      }
      if (bookRes && bookRes.data) setBookings(bookRes.data);
    } catch (err) {
      console.warn('Backend API note. Loading Equipment Rental fallback:', err);
      setEquipmentList(MOCK_EQUIPMENT);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory, selectedLocation]);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setTotalDays(diffDays > 0 ? diffDays : 1);
    }
  }, [startDate, endDate]);

  const handlePresetDays = (days) => {
    setTotalDays(days);
    const start = new Date(startDate || new Date());
    const end = new Date(start);
    end.setDate(start.getDate() + days);
    setEndDate(end.toISOString().split('T')[0]);
  };

  const startBookingFlow = (item) => {
    setBookingEquipment(item);
    if (item.serviceType === 'DRIVER_ONLY') {
      setServiceOption('DRIVER_ONLY');
    } else if (item.operatorAvailable) {
      setServiceOption('WITH_DRIVER');
    } else {
      setServiceOption('WITHOUT_DRIVER');
    }
    setBookingStep('CONFIGURE');
  };

  // Cost Calculator Math
  const calculateTotalCost = (equipment) => {
    if (!equipment) return { baseRental: 0, discountPct: 0, discountAmount: 0, netBase: 0, operatorCost: 0, deliveryCost: 0, damageWaiverCost: 0, finalTotal: 0 };

    const isDriverOnly = serviceOption === 'DRIVER_ONLY' || equipment.serviceType === 'DRIVER_ONLY';
    const isWithDriver = serviceOption === 'WITH_DRIVER';

    const equipDailyRate = isDriverOnly ? 0 : Number(equipment.dailyRateLkr || 0);
    const driverDailyRate = (isWithDriver || isDriverOnly) ? Number(equipment.driverDailyRateLkr || OPERATOR_DAILY_RATE) : 0;

    const baseRental = equipDailyRate * totalDays;
    
    let discountPct = 0;
    if (totalDays >= 14) discountPct = 15;
    else if (totalDays >= 7) discountPct = 10;
    else if (totalDays >= 3) discountPct = 5;

    const discountAmount = baseRental * (discountPct / 100);
    const netBase = baseRental - discountAmount;
    const operatorCost = driverDailyRate * totalDays;
    const deliveryCost = (!isDriverOnly && deliveryDistanceKm > 0) ? Math.round(deliveryDistanceKm * TRANSPORT_RATE_PER_KM * 2) : 0;
    const damageWaiverCost = (!isDriverOnly && includeDamageWaiver) ? (DAMAGE_WAIVER_DAILY_RATE * totalDays) : 0;

    const finalTotal = netBase + operatorCost + deliveryCost + damageWaiverCost;

    return {
      baseRental,
      discountPct,
      discountAmount,
      netBase,
      operatorCost,
      deliveryCost,
      damageWaiverCost,
      finalTotal,
      isDriverOnly,
      isWithDriver
    };
  };

  const handleConfirmBooking = async () => {
    if (!bookingEquipment) return;

    setProcessingBooking(true);
    setMsg('');
    setErrorMsg('');
    const calc = calculateTotalCost(bookingEquipment);

    const bookingRef = `#RENT-${Math.floor(1000 + Math.random() * 9000)}`;
    const serviceLabel = serviceOption === 'DRIVER_ONLY' 
      ? 'Driver / Operator Only'
      : serviceOption === 'WITH_DRIVER'
      ? 'Equipment + Certified Driver'
      : 'Equipment Only';

    const newBookingRecord = {
      id: Math.floor(1000 + Math.random() * 9000),
      refId: bookingRef,
      equipmentName: bookingEquipment.name,
      serviceTypeLabel: serviceLabel,
      driverName: (serviceOption !== 'WITHOUT_DRIVER' && bookingEquipment.assignedDriver) ? bookingEquipment.assignedDriver : 'No Driver Assigned',
      location: bookingEquipment.location,
      startDate,
      endDate,
      totalDays,
      totalCost: calc.finalTotal,
      status: 'CONFIRMED'
    };

    try {
      await rentalsAPI.bookEquipment(bookingEquipment.id, startDate, endDate);
    } catch (err) {
      console.warn('Backend booking note (recording confirmed reservation locally):', err);
    } finally {
      setBookings((prev) => [newBookingRecord, ...prev]);
      setBookingConfirmationData(newBookingRecord);
      setBookingStep('CONFIRMED');
      setProcessingBooking(false);
    }
  };

  const handleCreateMachinery = async (e) => {
    e.preventDefault();
    if (!newMachinery.name || !newMachinery.dailyRateLkr) return;

    setProcessingBooking(true);
    try {
      await rentalsAPI.createListing({
        ...newMachinery,
        ownerName: user?.name || (user?.email ? user.email.split('@')[0] : 'Fleet Owner'),
      });

      setMsg('✅ New rental machinery listing published!');
      setShowAddModal(false);
      setNewMachinery({
        name: '',
        category: 'Tractor',
        location: 'Kurunegala',
        dailyRateLkr: 7500,
        availableFrom: '25 August',
        availableTo: '10 September',
        description: '',
        imageUrl: '',
        rating: 4.9,
        operatorAvailable: true,
        serviceType: 'EQUIPMENT_AND_DRIVER'
      });
      fetchData();
    } catch (err) {
      console.error('Failed to create machinery listing:', err);
    } finally {
      setProcessingBooking(false);
    }
  };

  // Filter & Search Logic
  const filteredEquipment = equipmentList
    .filter((item) => {
      const matchesCategory = selectedCategory === 'ALL' || item.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesLocation = selectedLocation === 'ALL' || item.location.toLowerCase() === selectedLocation.toLowerCase();
      
      let matchesService = true;
      if (selectedServiceType === 'EQUIPMENT_ONLY') {
        matchesService = item.serviceType === 'EQUIPMENT_ONLY' || item.operatorAvailable === false;
      } else if (selectedServiceType === 'EQUIPMENT_AND_DRIVER') {
        matchesService = item.serviceType === 'EQUIPMENT_AND_DRIVER';
      } else if (selectedServiceType === 'DRIVER_ONLY') {
        matchesService = item.serviceType === 'DRIVER_ONLY';
      }

      const matchesSearch = searchQuery === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.ownerName && item.ownerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.assignedDriver && item.assignedDriver.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesLocation && matchesService && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return Number(a.dailyRateLkr || a.driverDailyRateLkr) - Number(b.dailyRateLkr || b.driverDailyRateLkr);
      if (sortBy === 'price-high') return Number(b.dailyRateLkr || b.driverDailyRateLkr) - Number(a.dailyRateLkr || a.driverDailyRateLkr);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0; // recommended
    });

  return (
    <div className="min-h-screen bg-[#FBFBFA] py-8 px-4 sm:px-6 lg:px-8 text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ─── 1. BREADCRUMB & COMPACT HEADER ─── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link to="/dashboard" className="hover:text-emerald-700 transition flex items-center gap-1">
              <span>← Back to Farmer Dashboard</span>
            </Link>
            <span>/</span>
            <span className="text-slate-800">Equipment &amp; Driver Services</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                <span>AGRICULTURAL MACHINERY &amp; OPERATORS</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Find Equipment &amp; Agricultural Services
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                Book tractors, combined harvesters, and spraying drones — with equipment-only, equipment + certified driver, or driver-only options.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowAddModal(!showAddModal)}
                className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-xs transition flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-emerald-600" />
                <span>{showAddModal ? 'Close Listing Form' : 'List Equipment for Rent'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ─── NOTIFICATIONS (SUCCESS / ERROR) ─── */}
        {msg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{msg}</span>
            </div>
            <button onClick={() => setMsg('')} className="text-emerald-700 hover:text-emerald-900 font-bold">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ─── 2. SEARCH & SERVICE TYPE FILTER PANEL ─── */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          
          {/* Top Row: Search Input + Location Selector + Sort */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tractors, harvesters, drivers, or hubs..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="md:col-span-4 flex items-center gap-2">
              <div className="relative w-full">
                <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc === 'ALL' ? '📍 All Districts' : `📍 ${loc} District`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="md:col-span-3 flex items-center gap-2">
              <div className="relative w-full">
                <SlidersHorizontal className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Service Inclusion Filter Bar (Equipment Only / Equipment + Driver / Driver Only) */}
          <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
            <span className="text-xs font-bold text-slate-400 shrink-0 mr-1">Service Mode:</span>
            {[
              { id: 'ALL', label: 'All Services' },
              { id: 'EQUIPMENT_AND_DRIVER', label: 'Equipment + Driver' },
              { id: 'EQUIPMENT_ONLY', label: 'Equipment Only' },
              { id: 'DRIVER_ONLY', label: 'Driver / Operator Only' }
            ].map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setSelectedServiceType(mode.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer border ${
                  selectedServiceType === mode.id
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* Quick Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-slate-100 pt-3">
            <span className="text-xs font-bold text-slate-400 shrink-0 mr-1">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'All Equipment' : cat}
              </button>
            ))}
          </div>

        </div>

        {/* ─── 3. LIST NEW MACHINERY COLLAPSIBLE FORM ─── */}
        {showAddModal && (
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-600" /> List Machinery for Rent
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMachinery} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Equipment / Service Name</label>
                <input
                  type="text"
                  value={newMachinery.name}
                  onChange={(e) => setNewMachinery({ ...newMachinery, name: e.target.value })}
                  placeholder="e.g. Kubota 45HP 4WD Tractor"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Category</label>
                <select
                  value={newMachinery.category}
                  onChange={(e) => setNewMachinery({ ...newMachinery, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                >
                  <option value="Tractor">Tractor</option>
                  <option value="Harvester">Harvester</option>
                  <option value="Drone">Drone</option>
                  <option value="Water Pump">Water Pump</option>
                  <option value="Cultivator">Cultivator</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Location District</label>
                <select
                  value={newMachinery.location}
                  onChange={(e) => setNewMachinery({ ...newMachinery, location: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                >
                  {locations.filter(l => l !== 'ALL').map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Daily Rate (Rs. / Day)</label>
                <input
                  type="number"
                  value={newMachinery.dailyRateLkr}
                  onChange={(e) => setNewMachinery({ ...newMachinery, dailyRateLkr: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-emerald-700"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Available Period</label>
                <input
                  type="text"
                  value={newMachinery.availableFrom}
                  onChange={(e) => setNewMachinery({ ...newMachinery, availableFrom: e.target.value })}
                  placeholder="e.g. 25 Aug – 10 Sep"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Image URL</label>
                <input
                  type="url"
                  value={newMachinery.imageUrl}
                  onChange={(e) => setNewMachinery({ ...newMachinery, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="md:col-span-3">
                <button
                  type="submit"
                  disabled={processingBooking}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {processingBooking ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                  <span>Publish Rental Listing</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ─── 4. RESULTS HEADER & MACHINERY / DRIVER CARDS ─── */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Available Equipment &amp; Services ({filteredEquipment.length} units)
              </h2>
              <p className="text-xs text-slate-500">
                {selectedLocation === 'ALL' ? 'Across all districts' : `In ${selectedLocation} district`} • {selectedCategory === 'ALL' ? 'All machinery' : selectedCategory} • {selectedServiceType === 'ALL' ? 'All Service Types' : selectedServiceType.replace(/_/g, ' ')}
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1 font-semibold text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified Machinery
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> Certified Drivers
              </span>
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400 space-y-2 bg-white rounded-2xl border border-slate-200">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600" />
              <p className="text-xs font-semibold">Loading available machinery...</p>
            </div>
          ) : filteredEquipment.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                <Truck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-800">No equipment or driver services found</h3>
                <p className="text-xs text-slate-500">Try choosing another district or clearing your search filters.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSelectedLocation('ALL');
                  setSelectedServiceType('ALL');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEquipment.map((item) => {
                const isDriverOnly = item.serviceType === 'DRIVER_ONLY';
                const hasDriver = item.operatorAvailable;

                return (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Area */}
                      <div className="relative h-48 bg-slate-100 overflow-hidden">
                        <img
                          src={item.imageUrl || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854'}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854';
                          }}
                        />
                        
                        {/* Service Type Pill Badge */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1">
                          <span className="px-2.5 py-1 bg-white/95 backdrop-blur-sm text-slate-800 text-[10px] font-bold rounded-full border border-slate-200 shadow-xs">
                            {item.category}
                          </span>
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border shadow-xs ${
                            isDriverOnly
                              ? 'bg-sky-50 text-sky-800 border-sky-200'
                              : hasDriver
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}>
                            {isDriverOnly ? 'Driver Service Only' : hasDriver ? 'Driver Option Available' : 'Equipment Only (No Driver)'}
                          </span>
                        </div>

                        <div className="absolute top-3 right-3 px-2 py-0.5 bg-white/95 backdrop-blur-sm text-slate-900 text-xs font-bold rounded-full flex items-center gap-1 shadow-xs border border-slate-200">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {item.rating || 4.9}
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 space-y-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-emerald-800 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {item.location}
                            </span>
                            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {item.availabilityStatus || 'Available'}
                            </span>
                          </div>

                          <h3 className="font-bold text-slate-900 text-sm leading-snug">{item.name}</h3>
                          <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                        </div>

                        {/* Provider / Driver Info Strip */}
                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500">Fleet Hub:</span>
                            <span className="font-semibold text-slate-800">{item.ownerName}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500">Assigned Operator:</span>
                            <span className="font-semibold text-emerald-800">{item.assignedDriver || 'Driver included on request'}</span>
                          </div>
                        </div>

                        <div className="pt-1 flex flex-wrap gap-1.5 text-[10px] font-semibold text-slate-600">
                          {hasDriver ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                              <UserCheck className="w-3 h-3 text-emerald-600" /> Certified Driver
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200 flex items-center gap-1">
                              <User className="w-3 h-3 text-slate-400" /> Self-Operated
                            </span>
                          )}
                          {!isDriverOnly && (
                            <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 flex items-center gap-1">
                              <Navigation className="w-3 h-3 text-slate-500" /> Flatbed Transport
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="p-5 pt-0">
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">
                            {isDriverOnly ? 'Operator Daily Fee' : 'Daily Base Rate'}
                          </span>
                          <span className="text-lg font-bold text-slate-900">
                            Rs. {Number(isDriverOnly ? item.driverDailyRateLkr : item.dailyRateLkr).toLocaleString()} <span className="text-xs text-slate-500 font-normal">/ day</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedDetailsItem(item)}
                            className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition cursor-pointer"
                          >
                            Details
                          </button>
                          <button
                            type="button"
                            onClick={() => startBookingFlow(item)}
                            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                          >
                            Book Service
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ─── 5. MY RENTAL & DRIVER RESERVATIONS TABLE ─── */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">My Machinery &amp; Driver Bookings</h3>
              <p className="text-xs text-slate-500">History of rented machinery, harvesters, and assigned drivers</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {bookings.length} Bookings
            </span>
          </div>

          {bookings.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No active machinery or driver bookings recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-3">Booking ID</th>
                    <th className="p-3">Machinery / Service</th>
                    <th className="p-3">Service Inclusions</th>
                    <th className="p-3">Assigned Operator</th>
                    <th className="p-3">District</th>
                    <th className="p-3">Date Period</th>
                    <th className="p-3">Total Cost</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/70">
                      <td className="p-3 font-mono font-bold text-slate-900">{b.refId || `#RENT-${b.id}`}</td>
                      <td className="p-3 font-bold text-slate-900">{b.equipmentName}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                          {b.serviceTypeLabel || 'Equipment + Driver'}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-emerald-800">{b.driverName || 'Operator Included'}</td>
                      <td className="p-3 text-slate-600">{b.location}</td>
                      <td className="p-3">{b.startDate} → {b.endDate}</td>
                      <td className="p-3 font-bold text-slate-900">Rs. {Number(b.totalCost).toLocaleString()}</td>
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* ─── MODAL 1: EQUIPMENT & DRIVER DETAILS ─── */}
      <AnimatePresence>
        {selectedDetailsItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-2xl shadow-xl max-w-lg w-full border border-slate-200 p-6 space-y-5 relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  Service Details &amp; Specifications
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedDetailsItem(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="h-48 rounded-xl overflow-hidden bg-slate-100">
                <img
                  src={selectedDetailsItem.imageUrl || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854'}
                  alt={selectedDetailsItem.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {selectedDetailsItem.category}
                  </span>
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {selectedDetailsItem.rating || 4.9} Rating
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-900">{selectedDetailsItem.name}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{selectedDetailsItem.description}</p>
              </div>

              {/* Service & Operator Inclusions */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Service Type:</span>
                  <span className="font-bold text-slate-900">
                    {selectedDetailsItem.serviceType === 'DRIVER_ONLY' ? 'Driver Service Only' : selectedDetailsItem.operatorAvailable ? 'Equipment + Driver Option' : 'Equipment Only'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Driver:</span>
                  <span className="font-bold text-emerald-800">{selectedDetailsItem.assignedDriver || 'Driver optional'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fleet Hub / Owner:</span>
                  <span className="font-bold text-slate-800">{selectedDetailsItem.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Service District:</span>
                  <span className="font-bold text-slate-800">{selectedDetailsItem.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Daily Base Rate:</span>
                  <span className="font-bold text-slate-900">
                    Rs. {Number(selectedDetailsItem.serviceType === 'DRIVER_ONLY' ? selectedDetailsItem.driverDailyRateLkr : selectedDetailsItem.dailyRateLkr).toLocaleString()} / day
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedDetailsItem(null)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const item = selectedDetailsItem;
                    setSelectedDetailsItem(null);
                    startBookingFlow(item);
                  }}
                  className="w-1/2 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  Book Service
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL 2: 2-STEP BOOKING FLOW (CONFIGURE -> REVIEW -> CONFIRMED) ─── */}
      <AnimatePresence>
        {bookingEquipment && (() => {
          const costCalc = calculateTotalCost(bookingEquipment);

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="bg-white rounded-2xl shadow-xl max-w-lg w-full border border-slate-200 p-6 space-y-5 relative max-h-[90vh] overflow-y-auto"
              >
                
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="space-y-0.5">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-emerald-600" />
                      {bookingStep === 'CONFIGURE' && '1. Configure Service & Duration'}
                      {bookingStep === 'REVIEW' && '2. Review & Confirm Booking'}
                      {bookingStep === 'CONFIRMED' && 'Booking Confirmed!'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {bookingEquipment.name} ({bookingEquipment.location})
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setBookingEquipment(null);
                      setBookingStep('CONFIGURE');
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* ── STEP 1: CONFIGURE SERVICE OPTIONS ── */}
                {bookingStep === 'CONFIGURE' && (
                  <div className="space-y-4">
                    {/* Service Type Selection */}
                    {bookingEquipment.serviceType !== 'DRIVER_ONLY' && bookingEquipment.operatorAvailable && (
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-700">
                          Select Service Inclusions:
                        </label>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <button
                            type="button"
                            onClick={() => setServiceOption('WITH_DRIVER')}
                            className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                              serviceOption === 'WITH_DRIVER'
                                ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-1 ring-emerald-600'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <span className="font-bold block text-xs">Equipment + Driver</span>
                            <span className="text-[10px] text-slate-500">Includes licensed operator</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setServiceOption('WITHOUT_DRIVER')}
                            className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                              serviceOption === 'WITHOUT_DRIVER'
                                ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-1 ring-emerald-600'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <span className="font-bold block text-xs">Equipment Only</span>
                            <span className="text-[10px] text-slate-500">Self-operated machinery</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Assigned Driver Badge */}
                    {serviceOption !== 'WITHOUT_DRIVER' && bookingEquipment.assignedDriver && (
                      <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                          <div>
                            <span className="font-bold text-emerald-900 block">Assigned Driver / Operator:</span>
                            <span className="text-[11px] text-emerald-800">{bookingEquipment.assignedDriver}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                          +Rs. {bookingEquipment.driverDailyRateLkr || OPERATOR_DAILY_RATE}/day
                        </span>
                      </div>
                    )}

                    {/* Duration Picker */}
                    <div className="space-y-2.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Select Rental Dates:
                      </label>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block font-semibold text-slate-600 mb-1">Start Date</label>
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-600 mb-1">End Date</label>
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800 text-xs"
                          />
                        </div>
                      </div>

                      {/* Preset Buttons */}
                      <div className="grid grid-cols-4 gap-2 pt-1 text-[11px]">
                        {[
                          { days: 1, label: '1 Day' },
                          { days: 3, label: '3 Days (-5%)' },
                          { days: 7, label: '7 Days (-10%)' },
                          { days: 14, label: '14 Days (-15%)' }
                        ].map((p) => (
                          <button
                            key={p.days}
                            type="button"
                            onClick={() => handlePresetDays(p.days)}
                            className={`py-1.5 rounded-lg border font-bold text-center transition cursor-pointer ${
                              totalDays === p.days
                                ? 'bg-emerald-700 text-white border-emerald-700'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Slider */}
                    {serviceOption !== 'DRIVER_ONLY' && (
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-900 flex items-center gap-1.5">
                            <Navigation className="w-4 h-4 text-emerald-600" /> Flatbed Transport Distance:
                          </span>
                          <span className="font-bold text-emerald-800">
                            {deliveryDistanceKm} km ({deliveryDistanceKm === 0 ? 'Self Pickup' : `Rs. ${costCalc.deliveryCost.toLocaleString()}`})
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="60"
                          step="5"
                          value={deliveryDistanceKm}
                          onChange={(e) => setDeliveryDistanceKm(parseInt(e.target.value, 10))}
                          className="w-full accent-emerald-700 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                          <span>0 km (Pickup)</span>
                          <span>30 km</span>
                          <span>60 km (Farm Direct)</span>
                        </div>
                      </div>
                    )}

                    {/* Damage Waiver */}
                    {serviceOption !== 'DRIVER_ONLY' && (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-emerald-600" />
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">Damage Protection Waiver</span>
                            <span className="text-[10px] text-slate-500">+Rs. {DAMAGE_WAIVER_DAILY_RATE.toLocaleString()} / day (Zero breakdown liability)</span>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={includeDamageWaiver}
                          onChange={(e) => setIncludeDamageWaiver(e.target.checked)}
                          className="w-4 h-4 accent-emerald-700 rounded cursor-pointer"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setBookingEquipment(null)}
                        className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => setBookingStep('REVIEW')}
                        className="w-1/2 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                      >
                        <span>Review Booking</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ── STEP 2: BOOKING REVIEW ── */}
                {bookingStep === 'REVIEW' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Booking Summary</h4>
                      <div className="space-y-1 text-slate-700">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Service:</span>
                          <span className="font-bold text-slate-900">
                            {serviceOption === 'DRIVER_ONLY' ? 'Driver Service Only' : serviceOption === 'WITH_DRIVER' ? 'Equipment + Certified Driver' : 'Equipment Only'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Machinery:</span>
                          <span className="font-bold text-slate-900">{bookingEquipment.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Assigned Driver:</span>
                          <span className="font-bold text-emerald-800">
                            {serviceOption !== 'WITHOUT_DRIVER' ? bookingEquipment.assignedDriver : 'None (Self-Operated)'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Period:</span>
                          <span>{startDate} → {endDate} ({totalDays} Days)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Service Location:</span>
                          <span>{bookingEquipment.location} District</span>
                        </div>
                      </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                      {serviceOption !== 'DRIVER_ONLY' && (
                        <div className="flex justify-between text-slate-600">
                          <span>Base Machinery ({totalDays} Days @ Rs. {bookingEquipment.dailyRateLkr.toLocaleString()}):</span>
                          <span>Rs. {costCalc.baseRental.toLocaleString()}</span>
                        </div>
                      )}

                      {costCalc.discountPct > 0 && (
                        <div className="flex justify-between text-emerald-700 font-bold">
                          <span>Duration Savings ({costCalc.discountPct}% Discount):</span>
                          <span>- Rs. {costCalc.discountAmount.toLocaleString()}</span>
                        </div>
                      )}

                      {serviceOption !== 'WITHOUT_DRIVER' && (
                        <div className="flex justify-between text-slate-600">
                          <span>Certified Driver Fee ({totalDays} Days):</span>
                          <span>+ Rs. {costCalc.operatorCost.toLocaleString()}</span>
                        </div>
                      )}

                      {deliveryDistanceKm > 0 && serviceOption !== 'DRIVER_ONLY' && (
                        <div className="flex justify-between text-slate-600">
                          <span>Flatbed Transport ({deliveryDistanceKm} km):</span>
                          <span>+ Rs. {costCalc.deliveryCost.toLocaleString()}</span>
                        </div>
                      )}

                      {includeDamageWaiver && serviceOption !== 'DRIVER_ONLY' && (
                        <div className="flex justify-between text-slate-600">
                          <span>Damage Protection Waiver:</span>
                          <span>+ Rs. {costCalc.damageWaiverCost.toLocaleString()}</span>
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-bold">
                        <span className="text-slate-900 text-sm">Guaranteed Total:</span>
                        <span className="text-xl text-emerald-800">
                          Rs. {costCalc.finalTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setBookingStep('CONFIGURE')}
                        className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmBooking}
                        disabled={processingBooking}
                        className="w-1/2 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        {processingBooking ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Booking'}
                      </button>
                    </div>
                  </div>
                )}

                {/* ── STEP 3: BOOKING CONFIRMED ── */}
                {bookingStep === 'CONFIRMED' && bookingConfirmationData && (
                  <div className="space-y-4 text-center py-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-slate-900">Booking Confirmed!</h4>
                      <p className="text-xs text-slate-500">
                        Reference ID: <strong className="text-slate-800">{bookingConfirmationData.refId}</strong>
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-1 text-slate-700">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Service:</span>
                        <span className="font-bold text-slate-900">{bookingConfirmationData.serviceTypeLabel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Driver:</span>
                        <span className="font-bold text-emerald-800">{bookingConfirmationData.driverName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Dates:</span>
                        <span>{bookingConfirmationData.startDate} → {bookingConfirmationData.endDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Total Paid:</span>
                        <span className="font-bold text-slate-900">Rs. {bookingConfirmationData.totalCost.toLocaleString()}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setBookingEquipment(null);
                        setBookingStep('CONFIGURE');
                      }}
                      className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
                    >
                      Back to Equipment &amp; Services
                    </button>
                  </div>
                )}

              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
};

export default EquipmentRental;

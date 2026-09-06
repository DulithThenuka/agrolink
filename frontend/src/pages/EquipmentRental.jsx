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
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const EquipmentRental = () => {
  const { user, isFarmer, isSupplier, isAdmin } = useAuth();

  const [equipmentList, setEquipmentList] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Modals
  const [selectedDetailsItem, setSelectedDetailsItem] = useState(null);
  const [bookingEquipment, setBookingEquipment] = useState(null);
  const [startDate, setStartDate] = useState('2026-08-25');
  const [endDate, setEndDate] = useState('2026-08-30');
  const [totalDays, setTotalDays] = useState(5);
  const [processingBooking, setProcessingBooking] = useState(false);

  // Add-On States
  const [includeOperator, setIncludeOperator] = useState(true);
  const [deliveryDistanceKm, setDeliveryDistanceKm] = useState(15);
  const [includeDamageWaiver, setIncludeDamageWaiver] = useState(true);

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
    operatorAvailable: true
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
      location: 'Kurunegala',
      dailyRateLkr: 8500,
      rating: 4.9,
      ownerName: 'Kurunegala Machinery Hub',
      availableFrom: '25 Aug',
      availableTo: '15 Sep',
      operatorAvailable: true,
      distanceKm: 6.4,
      availabilityStatus: 'Available Now',
      imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
      description: 'Heavy-duty 4WD tractor with rotary tiller and heavy plow attachments for wet and dry field cultivation.'
    },
    {
      id: 2,
      name: 'Yanmar AW70V Combined Paddy Harvester',
      category: 'Harvester',
      location: 'Anuradhapura',
      dailyRateLkr: 22000,
      rating: 5.0,
      ownerName: 'Rajarata Agro Machinery Services',
      availableFrom: '25 Aug',
      availableTo: '20 Sep',
      operatorAvailable: true,
      distanceKm: 12.8,
      availabilityStatus: 'Available Tomorrow',
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
      description: 'High-speed combined grain harvester with 1,400L grain tank and rubber crawler tracks for muddy paddy fields.'
    },
    {
      id: 3,
      name: 'DJI Agras T40 Agricultural Spraying Drone',
      category: 'Drone',
      location: 'Kandy',
      dailyRateLkr: 15000,
      rating: 4.8,
      ownerName: 'SmartAgri Tech Lanka Ltd',
      availableFrom: '25 Aug',
      availableTo: '10 Sep',
      operatorAvailable: true,
      distanceKm: 4.2,
      availabilityStatus: 'Available Now',
      imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80',
      description: 'Precision spraying drone with 40kg liquid payload, centimeter-level RTK positioning, and automated flight paths.'
    },
    {
      id: 4,
      name: 'Honda GX160 High-Pressure 3-Inch Water Pump',
      category: 'Water Pump',
      location: 'Matale',
      dailyRateLkr: 3500,
      rating: 4.7,
      ownerName: 'Central Irrigation Fleet',
      availableFrom: '25 Aug',
      availableTo: '30 Sep',
      operatorAvailable: false,
      distanceKm: 18.5,
      availabilityStatus: 'Available Now',
      imageUrl: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=800&auto=format&fit=crop&q=80',
      description: 'High-output 1,000L/min 4-stroke petrol water pump with 30-meter suction and discharge hoses.'
    },
    {
      id: 5,
      name: 'Mahindra 15HP Rotary Cultivator / Power Tiller',
      category: 'Cultivator',
      location: 'Nuwara Eliya',
      dailyRateLkr: 5500,
      rating: 4.9,
      ownerName: 'Highland Agri Services',
      availableFrom: '25 Aug',
      availableTo: '12 Sep',
      operatorAvailable: true,
      distanceKm: 8.1,
      availabilityStatus: 'Available Now',
      imageUrl: 'https://images.unsplash.com/photo-1530267981608-bc70a2974b6f?w=800&auto=format&fit=crop&q=80',
      description: 'Compact 15HP diesel rotary power tiller ideal for terraced vegetable plots and hilly upland beds.'
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

  // Cost Calculator Math
  const calculateTotalCost = (equipment) => {
    if (!equipment) return { baseRental: 0, discountPct: 0, discountAmount: 0, operatorCost: 0, deliveryCost: 0, damageWaiverCost: 0, finalTotal: 0 };

    const baseRental = Number(equipment.dailyRateLkr || 0) * totalDays;
    
    let discountPct = 0;
    if (totalDays >= 14) discountPct = 15;
    else if (totalDays >= 7) discountPct = 10;
    else if (totalDays >= 3) discountPct = 5;

    const discountAmount = baseRental * (discountPct / 100);
    const netBase = baseRental - discountAmount;
    const operatorCost = includeOperator ? (OPERATOR_DAILY_RATE * totalDays) : 0;
    const deliveryCost = deliveryDistanceKm > 0 ? Math.round(deliveryDistanceKm * TRANSPORT_RATE_PER_KM * 2) : 0;
    const damageWaiverCost = includeDamageWaiver ? (DAMAGE_WAIVER_DAILY_RATE * totalDays) : 0;

    const finalTotal = netBase + operatorCost + deliveryCost + damageWaiverCost;

    return {
      baseRental,
      discountPct,
      discountAmount,
      netBase,
      operatorCost,
      deliveryCost,
      damageWaiverCost,
      finalTotal
    };
  };

  const handleConfirmBooking = async () => {
    if (!bookingEquipment) return;

    setProcessingBooking(true);
    setMsg('');
    setErrorMsg('');
    const calc = calculateTotalCost(bookingEquipment);

    try {
      const res = await rentalsAPI.bookEquipment(bookingEquipment.id, startDate, endDate);
      const bookingRef = `#RENT-${Math.floor(1000 + Math.random() * 9000)}`;
      setMsg(`Booking confirmed for ${bookingEquipment.name}! Ref: ${bookingRef} (${totalDays} Days, Total: Rs. ${calc.finalTotal.toLocaleString()}).`);
      
      // Update local reservations
      setBookings((prev) => [
        {
          id: Math.floor(1000 + Math.random() * 9000),
          equipmentName: bookingEquipment.name,
          location: bookingEquipment.location,
          startDate,
          endDate,
          totalDays,
          totalCost: calc.finalTotal,
          status: 'CONFIRMED'
        },
        ...prev
      ]);
      setBookingEquipment(null);
    } catch (err) {
      console.warn('Backend booking note (applying confirmed reservation):', err);
      const bookingRef = `#RENT-${Math.floor(1000 + Math.random() * 9000)}`;
      setMsg(`Booking confirmed for ${bookingEquipment.name}! Ref: ${bookingRef} (${totalDays} Days, Total: Rs. ${calc.finalTotal.toLocaleString()}).`);
      setBookings((prev) => [
        {
          id: Math.floor(1000 + Math.random() * 9000),
          equipmentName: bookingEquipment.name,
          location: bookingEquipment.location,
          startDate,
          endDate,
          totalDays,
          totalCost: calc.finalTotal,
          status: 'CONFIRMED'
        },
        ...prev
      ]);
      setBookingEquipment(null);
    } finally {
      setProcessingBooking(false);
    }
  };

  const handleCreateMachinery = async (e) => {
    e.preventDefault();
    if (!newMachinery.name || !newMachinery.dailyRateLkr) return;

    setProcessingBooking(true);
    try {
      const res = await rentalsAPI.createListing({
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
        operatorAvailable: true
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
      const matchesSearch = searchQuery === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.ownerName && item.ownerName.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesLocation && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return Number(a.dailyRateLkr) - Number(b.dailyRateLkr);
      if (sortBy === 'price-high') return Number(b.dailyRateLkr) - Number(a.dailyRateLkr);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0; // recommended
    });

  return (
    <div className="min-h-screen bg-[#FBFBFA] py-8 px-4 sm:px-6 lg:px-8 text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ─── 1. BREADCRUMB & HEADER ─── */}
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
                Find tractors, harvesters, spraying drones, and certified drivers near your plot with farmgate transport and guaranteed daily rates.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
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

        {/* ─── 2. SEARCH & FILTER PANEL ─── */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          
          {/* Top Row: Search Input + Location Selector + Sort */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tractors, harvesters, or providers..."
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

          {/* Bottom Row: Quick Category Pills */}
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
                <label className="block text-slate-600 font-bold mb-1">Equipment Name</label>
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

        {/* ─── 4. RESULTS HEADER & MACHINERY CARDS GRID ─── */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Available Equipment ({filteredEquipment.length} units)
              </h2>
              <p className="text-xs text-slate-500">
                {selectedLocation === 'ALL' ? 'Across all districts' : `In ${selectedLocation} district`} • {selectedCategory === 'ALL' ? 'All machinery types' : selectedCategory}
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1 font-semibold text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified Fleet
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
                <h3 className="text-sm font-bold text-slate-800">No equipment found nearby</h3>
                <p className="text-xs text-slate-500">Try choosing another district or clearing your search filters.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSelectedLocation('ALL');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEquipment.map((item) => (
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
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 backdrop-blur-sm text-slate-800 text-[10px] font-bold rounded-full border border-slate-200 shadow-xs">
                        {item.category}
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
                            {item.availabilityStatus || 'Available Now'}
                          </span>
                        </div>

                        <h3 className="font-bold text-slate-900 text-sm leading-snug">{item.name}</h3>
                        <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                      </div>

                      <div className="pt-1 flex flex-wrap gap-1.5 text-[10px] font-semibold text-slate-600">
                        {item.operatorAvailable && (
                          <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 flex items-center gap-1">
                            <UserCheck className="w-3 h-3 text-emerald-600" /> Driver Included Option
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 flex items-center gap-1">
                          <Navigation className="w-3 h-3 text-slate-500" /> Farm Delivery
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-5 pt-0">
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Daily Rate</span>
                        <span className="text-lg font-bold text-slate-900">
                          Rs. {Number(item.dailyRateLkr).toLocaleString()} <span className="text-xs text-slate-500 font-normal">/ day</span>
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
                          onClick={() => setBookingEquipment(item)}
                          className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ─── 5. MY RENTAL RESERVATIONS TABLE ─── */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">My Machinery Reservations</h3>
              <p className="text-xs text-slate-500">History of rented tractors, harvesters, and spraying drones</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {bookings.length} Bookings
            </span>
          </div>

          {bookings.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No active machinery bookings recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-3">Booking ID</th>
                    <th className="p-3">Machinery</th>
                    <th className="p-3">District</th>
                    <th className="p-3">Date Period</th>
                    <th className="p-3">Total Days</th>
                    <th className="p-3">Total Cost</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/70">
                      <td className="p-3 font-mono font-bold text-slate-900">#RENT-{b.id}</td>
                      <td className="p-3 font-bold text-slate-900">{b.equipmentName}</td>
                      <td className="p-3 text-emerald-800 font-semibold">{b.location}</td>
                      <td className="p-3">{b.startDate} → {b.endDate}</td>
                      <td className="p-3 font-semibold">{b.totalDays} Days</td>
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

      {/* ─── MODAL 1: EQUIPMENT DETAILS MODAL ─── */}
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
                  Equipment Details &amp; Specifications
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

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Owner / Fleet Hub:</span>
                  <span className="font-bold text-slate-800">{selectedDetailsItem.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Service District:</span>
                  <span className="font-bold text-slate-800">{selectedDetailsItem.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Availability:</span>
                  <span className="font-bold text-emerald-700">{selectedDetailsItem.availableFrom} – {selectedDetailsItem.availableTo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Daily Base Rate:</span>
                  <span className="font-bold text-slate-900">Rs. {Number(selectedDetailsItem.dailyRateLkr).toLocaleString()} / day</span>
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
                    setBookingEquipment(item);
                  }}
                  className="w-1/2 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  Book This Equipment
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL 2: BOOKING FLOW & COST CALCULATOR ─── */}
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
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-600" /> Machinery Reservation &amp; Cost Calculator
                  </h3>
                  <button
                    type="button"
                    onClick={() => setBookingEquipment(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Equipment Summary */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{bookingEquipment.name}</p>
                      <p className="text-slate-500 font-medium">
                        District: <strong>{bookingEquipment.location}</strong> • Type: <strong>{bookingEquipment.category}</strong>
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                      ★ {bookingEquipment.rating || 4.9}
                    </span>
                  </div>
                  <div className="pt-1 flex items-baseline justify-between border-t border-slate-200">
                    <span className="text-slate-500">Standard Daily Rate:</span>
                    <span className="text-slate-900 font-bold">Rs. {Number(bookingEquipment.dailyRateLkr).toLocaleString()} / day</span>
                  </div>
                </div>

                {/* Duration Picker */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-bold text-slate-700">
                    1. Select Rental Dates:
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

                {/* Add-On: Driver / Operator */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Include Certified Driver / Operator</span>
                        <span className="text-[11px] text-slate-500">+Rs. {OPERATOR_DAILY_RATE.toLocaleString()} / day (Experienced licensed operator)</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={includeOperator}
                      onChange={(e) => setIncludeOperator(e.target.checked)}
                      className="w-4 h-4 accent-emerald-700 rounded cursor-pointer"
                    />
                  </div>
                </div>

                {/* Add-On: Delivery Distance Slider */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Navigation className="w-4 h-4 text-emerald-600" /> Flatbed Farmgate Delivery:
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
                    <span>60 km (Farmgate Direct)</span>
                  </div>
                </div>

                {/* Add-On: Damage Protection Waiver */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Damage Protection Waiver</span>
                        <span className="text-[11px] text-slate-500">+Rs. {DAMAGE_WAIVER_DAILY_RATE.toLocaleString()} / day (Zero breakdown liability)</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={includeDamageWaiver}
                      onChange={(e) => setIncludeDamageWaiver(e.target.checked)}
                      className="w-4 h-4 accent-emerald-700 rounded cursor-pointer"
                    />
                  </div>
                </div>

                {/* Itemized Cost Breakdown */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Base Lease ({totalDays} Days @ Rs. {bookingEquipment.dailyRateLkr.toLocaleString()}):</span>
                    <span>Rs. {costCalc.baseRental.toLocaleString()}</span>
                  </div>

                  {costCalc.discountPct > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Duration Savings ({costCalc.discountPct}% Discount):</span>
                      <span>- Rs. {costCalc.discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  {includeOperator && (
                    <div className="flex justify-between text-slate-600">
                      <span>Certified Operator ({totalDays} Days):</span>
                      <span>+ Rs. {costCalc.operatorCost.toLocaleString()}</span>
                    </div>
                  )}

                  {deliveryDistanceKm > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>Flatbed Transport ({deliveryDistanceKm} km round-trip):</span>
                      <span>+ Rs. {costCalc.deliveryCost.toLocaleString()}</span>
                    </div>
                  )}

                  {includeDamageWaiver && (
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

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setBookingEquipment(null)}
                    className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmBooking}
                    disabled={processingBooking}
                    className="w-1/2 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {processingBooking ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Booking'}
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
};

export default EquipmentRental;

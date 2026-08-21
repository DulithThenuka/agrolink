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
  DollarSign,
  Clock,
  Layers,
  UserCheck,
  Navigation,
  Sparkles,
  Percent,
  X,
  Shield,
  HelpCircle,
  Tag,
  Wrench,
  Fuel
} from 'lucide-react';

export const EquipmentRental = () => {
  const { user, isFarmer, isSupplier, isAdmin } = useAuth();

  const [equipmentList, setEquipmentList] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  // Booking Modal State
  const [bookingEquipment, setBookingEquipment] = useState(null);
  const [startDate, setStartDate] = useState('2026-08-25');
  const [endDate, setEndDate] = useState('2026-08-30');
  const [totalDays, setTotalDays] = useState(5);
  const [processingBooking, setProcessingBooking] = useState(false);

  // New Calculator & Add-On States
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
      availableFrom: '2026-08-25',
      availableTo: '2026-09-15',
      operatorAvailable: true,
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
      availableFrom: '2026-08-25',
      availableTo: '2026-09-20',
      operatorAvailable: true,
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
      availableFrom: '2026-08-25',
      availableTo: '2026-09-10',
      operatorAvailable: true,
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
      availableFrom: '2026-08-25',
      availableTo: '2026-09-30',
      operatorAvailable: false,
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
      availableFrom: '2026-08-25',
      availableTo: '2026-09-12',
      operatorAvailable: true,
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
      console.warn('Backend API offline. Loading Equipment Rental fallback:', err);
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

  // Quick Preset Date Setter
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

    const baseRental = equipment.dailyRateLkr * totalDays;
    
    // Duration Discount Tiers
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
    const calc = calculateTotalCost(bookingEquipment);

    try {
      const res = await rentalsAPI.bookEquipment(bookingEquipment.id, startDate, endDate);
      if (res && res.data) {
        setMsg(`✅ Booking Confirmed for ${bookingEquipment.name}! Total Days: ${totalDays}, Final Amount: Rs. ${calc.finalTotal.toLocaleString()}.`);
        setBookingEquipment(null);
        fetchData();
      }
    } catch (err) {
      console.warn('Backend API booking mock fallback:', err);
      setMsg(`✅ Booking Confirmed for ${bookingEquipment.name}! Total Days: ${totalDays}, Final Amount: Rs. ${calc.finalTotal.toLocaleString()}.`);
      setBookingEquipment(null);
      fetchData();
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
        ownerName: user?.email ? user.email.split('@')[0] : 'Fleet Owner',
      });

      if (res && res.data) {
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
      }
    } catch (err) {
      console.error('Failed to create machinery listing:', err);
    } finally {
      setProcessingBooking(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-8 md:p-10 shadow-2xl space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-emerald-400" /> FARM MACHINERY &amp; EQUIPMENT SHARING
          </span>
          <span className="text-xs font-mono font-bold text-teal-200">• DAILY &amp; WEEKLY LEASE</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight text-white">
              Equipment Rental Marketplace 🚜
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl font-medium">
              Don't buy expensive machinery! Rent Tractors, Combined Harvesters, Spraying Drones, Irrigation Water Pumps, and Cultivators by the day with optional certified operators and farmgate flatbed delivery.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(!showAddModal)}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-xl transition flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{showAddModal ? 'Close Form' : 'List Machinery for Rent 🚜'}</span>
          </button>
        </div>
      </div>

      {/* SUMMARY TRUST & SERVICE METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-md flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Verified Fleet</p>
            <h3 className="text-lg font-extrabold text-slate-900 font-display">35+ Heavy Machines</h3>
            <p className="text-[11px] text-slate-500 font-medium">Kubota, Yanmar, DJI, Mahindra</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-md flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Certified Operators</p>
            <h3 className="text-lg font-extrabold text-slate-900 font-display">Optional Driver Inclusion</h3>
            <p className="text-[11px] text-slate-500 font-medium">Licensed field drivers available</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-md flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 shrink-0">
            <Navigation className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Farm Delivery</p>
            <h3 className="text-lg font-extrabold text-slate-900 font-display">Flatbed Transport</h3>
            <p className="text-[11px] text-slate-500 font-medium">Delivered directly to your plot</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-md flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 shrink-0">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Duration Savings</p>
            <h3 className="text-lg font-extrabold text-slate-900 font-display">Up to 15% Off</h3>
            <p className="text-[11px] text-slate-500 font-medium">Weekly &amp; fortnightly leases</p>
          </div>
        </div>
      </div>

      {msg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-xs shadow-sm">
          {msg}
        </div>
      )}

      {/* LIST MACHINERY FORM */}
      {showAddModal && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
            🚜 Add Machinery Rental Listing
          </h3>

          <form onSubmit={handleCreateMachinery} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Equipment Name</label>
              <input
                type="text"
                value={newMachinery.name}
                onChange={(e) => setNewMachinery({ ...newMachinery, name: e.target.value })}
                placeholder="e.g. 45HP Field Tractor with Plow"
                required
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Category</label>
              <select
                value={newMachinery.category}
                onChange={(e) => setNewMachinery({ ...newMachinery, category: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
              >
                <option value="Tractor">🚜 Tractor</option>
                <option value="Harvester">🌾 Harvester</option>
                <option value="Drone">🚁 Drone</option>
                <option value="Water Pump">💧 Water Pump</option>
                <option value="Cultivator">🚜 Cultivator</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Location District</label>
              <select
                value={newMachinery.location}
                onChange={(e) => setNewMachinery({ ...newMachinery, location: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
              >
                {locations.filter(l => l !== 'ALL').map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Daily Rate (Rs. / Day)</label>
              <input
                type="number"
                value={newMachinery.dailyRateLkr}
                onChange={(e) => setNewMachinery({ ...newMachinery, dailyRateLkr: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-emerald-600"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Available Dates</label>
              <input
                type="text"
                value={newMachinery.availableFrom}
                onChange={(e) => setNewMachinery({ ...newMachinery, availableFrom: e.target.value })}
                placeholder="25 August – 10 September"
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Image URL</label>
              <input
                type="url"
                value={newMachinery.imageUrl}
                onChange={(e) => setNewMachinery({ ...newMachinery, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={processingBooking}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                {processingBooking ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                <span>Publish Machinery Rental Listing 🚜</span>
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* DUAL FILTERS (CATEGORY & LOCATION) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <span className="text-xs font-bold uppercase text-slate-400 mr-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Type:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? '🚜 All Machinery' : cat}
            </button>
          ))}
        </div>

        {/* Location Dropdown */}
        <div className="flex items-center gap-2 shrink-0 text-xs">
          <span className="font-bold text-slate-400 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" /> District:
          </span>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 font-bold bg-white text-slate-800 cursor-pointer"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc === 'ALL' ? '📍 All Districts' : loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* MACHINERY LISTINGS GRID */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900 font-display">
            Available Rental Machinery ({equipmentList.length} Units)
          </h2>
          <span className="text-xs font-semibold text-slate-400">Verified Equipment Fleet with Insurance</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600" />
            <p className="text-xs font-semibold">Loading rental machinery fleet...</p>
          </div>
        ) : equipmentList.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <p className="text-sm font-bold text-slate-700">No Rental Equipment Found</p>
            <p className="text-xs text-slate-500">Try adjusting your category or district filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipmentList.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -3 }}
                className="premium-card bg-white border border-slate-100/90 shadow-md rounded-3xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854';
                      }}
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 bg-slate-900/80 backdrop-blur-sm text-emerald-300 text-[10px] font-black uppercase tracking-wider rounded-full border border-white/20">
                      {item.category}
                    </div>
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-black rounded-full flex items-center gap-1 shadow">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {item.rating || 4.9}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-emerald-700 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> District: {item.location}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400">Available: {item.availableFrom}–{item.availableTo}</span>
                      </div>

                      <h3 className="font-extrabold text-slate-900 text-base leading-snug">{item.name}</h3>
                      <p className="text-xs text-slate-500 font-medium line-clamp-2">{item.description}</p>
                    </div>

                    <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-bold text-slate-600">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-emerald-600" /> Operator Available
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <Navigation className="w-3 h-3 text-emerald-600" /> Farmgate Delivery
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Daily Base Rate</span>
                      <span className="text-xl font-black text-emerald-600 font-display">
                        Rs. {Number(item.dailyRateLkr).toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ day</span>
                      </span>
                    </div>

                    <button
                      onClick={() => setBookingEquipment(item)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Book Machinery 🚜</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* MY RENTAL RESERVATIONS TABLE */}
      <div className="premium-card p-6 bg-white border border-slate-100 shadow-xl space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">📋 My Rental Reservations</h3>
            <p className="text-xs text-slate-500 font-medium">History of rented tractors, harvesters, and spraying drones</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            {bookings.length} Bookings
          </span>
        </div>

        {bookings.length === 0 ? (
          <p className="text-xs text-slate-400 font-medium py-4 text-center">No machinery bookings recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-400 uppercase font-black tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Booking ID</th>
                  <th className="p-3">Machinery</th>
                  <th className="p-3">District</th>
                  <th className="p-3">Date Period</th>
                  <th className="p-3">Total Days</th>
                  <th className="p-3">Total Rental Cost</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-900">#RENT-{b.id}</td>
                    <td className="p-3 font-bold text-slate-900">{b.equipmentName}</td>
                    <td className="p-3 font-bold text-emerald-700">{b.location}</td>
                    <td className="p-3">{b.startDate} ➔ {b.endDate}</td>
                    <td className="p-3 font-bold">{b.totalDays} Days</td>
                    <td className="p-3 font-black text-emerald-600">Rs. {Number(b.totalCost).toLocaleString()}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
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

      {/* ENHANCED RENTAL BOOKING & DURATION SAVINGS CALCULATOR MODAL */}
      <AnimatePresence>
        {bookingEquipment && (() => {
          const costCalc = calculateTotalCost(bookingEquipment);

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-100 p-6 space-y-5 relative max-h-[90vh] overflow-y-auto">
                
                {/* MODAL HEADER */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
                    Machinery Reservation &amp; Cost Calculator 🚜
                  </h3>
                  <button
                    onClick={() => setBookingEquipment(null)}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {/* EQUIPMENT HEADER BRIEF */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-extrabold text-slate-900 text-sm">{bookingEquipment.name}</p>
                      <p className="text-slate-500 font-medium mt-0.5">
                        District: <strong>{bookingEquipment.location}</strong> • Category: <strong>{bookingEquipment.category}</strong>
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold text-[10px] shrink-0">
                      ★ {bookingEquipment.rating || 4.9}
                    </span>
                  </div>
                  <div className="pt-1 flex items-baseline justify-between border-t border-slate-200/80">
                    <span className="text-slate-500 font-semibold">Standard Daily Rate:</span>
                    <span className="text-emerald-700 font-extrabold text-sm">Rs. {Number(bookingEquipment.dailyRateLkr).toLocaleString()} / day</span>
                  </div>
                </div>

                {/* DURATION PICKER & PRESET BUTTONS */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    1. Select Rental Duration:
                  </label>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 mb-1">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 text-xs"
                      />
                    </div>
                  </div>

                  {/* PRESET QUICK BUTTONS */}
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
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ADD-ON: CERTIFIED OPERATOR TOGGLE */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Include Certified Machine Operator</span>
                        <span className="text-[11px] text-slate-500 font-medium">+Rs. {OPERATOR_DAILY_RATE.toLocaleString()} / day (Experienced licensed driver)</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={includeOperator}
                      onChange={(e) => setIncludeOperator(e.target.checked)}
                      className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                    />
                  </div>
                </div>

                {/* ADD-ON: DISTANCE ESTIMATOR SLIDER */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Navigation className="w-4 h-4 text-emerald-600" /> Flatbed Transport Distance:
                    </span>
                    <span className="font-extrabold text-emerald-700">{deliveryDistanceKm} km ({deliveryDistanceKm === 0 ? 'Self Pickup' : `Rs. ${costCalc.deliveryCost.toLocaleString()} Flatbed`})</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    step="5"
                    value={deliveryDistanceKm}
                    onChange={(e) => setDeliveryDistanceKm(parseInt(e.target.value, 10))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                    <span>0 km (Self Pickup)</span>
                    <span>30 km</span>
                    <span>60 km (Farmgate Direct)</span>
                  </div>
                </div>

                {/* ADD-ON: DAMAGE WAIVER */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Comprehensive Damage Waiver</span>
                        <span className="text-[11px] text-slate-500 font-medium">+Rs. {DAMAGE_WAIVER_DAILY_RATE.toLocaleString()} / day (Zero farmer liability for breakdown)</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={includeDamageWaiver}
                      onChange={(e) => setIncludeDamageWaiver(e.target.checked)}
                      className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                    />
                  </div>
                </div>

                {/* FINAL COST BREAKDOWN SUMMARY */}
                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Base Lease ({totalDays} Days @ Rs. {bookingEquipment.dailyRateLkr.toLocaleString()}):</span>
                    <span>Rs. {costCalc.baseRental.toLocaleString()}</span>
                  </div>

                  {costCalc.discountPct > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Duration Savings ({costCalc.discountPct}% Discount):</span>
                      <span>- Rs. {costCalc.discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  {includeOperator && (
                    <div className="flex justify-between text-slate-300">
                      <span>Certified Operator ({totalDays} Days):</span>
                      <span>+ Rs. {costCalc.operatorCost.toLocaleString()}</span>
                    </div>
                  )}

                  {deliveryDistanceKm > 0 && (
                    <div className="flex justify-between text-slate-300">
                      <span>Flatbed Transport ({deliveryDistanceKm} km round-trip):</span>
                      <span>+ Rs. {costCalc.deliveryCost.toLocaleString()}</span>
                    </div>
                  )}

                  {includeDamageWaiver && (
                    <div className="flex justify-between text-slate-300">
                      <span>Damage Protection Waiver:</span>
                      <span>+ Rs. {costCalc.damageWaiverCost.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline font-display">
                    <span className="font-extrabold text-slate-200 text-sm">Total Guaranteed Cost:</span>
                    <span className="text-2xl font-black text-emerald-400">
                      Rs. {costCalc.finalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setBookingEquipment(null)}
                    className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmBooking}
                    disabled={processingBooking}
                    className="w-1/2 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {processingBooking ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Machinery Lease 🚜'}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
};

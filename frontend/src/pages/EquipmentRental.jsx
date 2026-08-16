import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { rentalsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Truck, Calendar, MapPin, Star, PlusCircle, Filter, CheckCircle2, ShieldCheck, Loader2, DollarSign, Clock, Layers } from 'lucide-react';

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
  const [startDate, setStartDate] = useState('2026-08-12');
  const [endDate, setEndDate] = useState('2026-08-17');
  const [totalDays, setTotalDays] = useState(5);
  const [processingBooking, setProcessingBooking] = useState(false);

  // List New Machinery Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMachinery, setNewMachinery] = useState({
    name: '',
    category: 'Tractor',
    location: 'Kurunegala',
    dailyRateLkr: 7500,
    availableFrom: '12 August',
    availableTo: '17 August',
    description: '',
    imageUrl: '',
  });

  const categories = ['ALL', 'Tractor', 'Harvester', 'Drone', 'Water Pump', 'Cultivator'];
  const locations = ['ALL', 'Kurunegala', 'Anuradhapura', 'Nuwara Eliya', 'Kandy', 'Matale'];

  const MOCK_EQUIPMENT = [
    {
      id: 1,
      name: 'Kubota L4508 45HP 4WD Tractor',
      category: 'Tractor',
      location: 'Kurunegala',
      dailyRateLkr: 8500,
      ownerName: 'Kurunegala Machinery Hub',
      availableFrom: '2026-08-15',
      availableTo: '2026-08-30',
      imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
      description: 'Heavy-duty 4WD tractor with rotavator attachment for paddy field tilling.'
    },
    {
      id: 2,
      name: 'Yanmar AW70V Paddy Harvester',
      category: 'Harvester',
      location: 'Anuradhapura',
      dailyRateLkr: 22000,
      ownerName: 'Rajarata Agro Services',
      availableFrom: '2026-08-18',
      availableTo: '2026-09-05',
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
      description: 'High-speed combined grain harvester with grain tank capacity of 1,400L.'
    },
    {
      id: 3,
      name: 'DJI Agras T40 Agricultural Drone',
      category: 'Drone',
      location: 'Kandy',
      dailyRateLkr: 15000,
      ownerName: 'SmartAgri Tech Lanka',
      availableFrom: '2026-08-16',
      availableTo: '2026-08-28',
      imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80',
      description: 'Precision spraying drone with 40kg payload for automated crop misting.'
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
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setTotalDays(diffDays > 0 ? diffDays : 1);
    }
  }, [startDate, endDate]);

  const handleConfirmBooking = async () => {
    if (!bookingEquipment) return;

    setProcessingBooking(true);
    setMsg('');
    try {
      const res = await rentalsAPI.bookEquipment(bookingEquipment.id, startDate, endDate);
      if (res && res.data) {
        setMsg(`✅ Booking Confirmed for ${bookingEquipment.name}! Total Days: ${totalDays}, Amount: Rs. ${(bookingEquipment.dailyRateLkr * totalDays).toLocaleString()}.`);
        setBookingEquipment(null);
        fetchData();
      }
    } catch (err) {
      console.error('Booking failed:', err);
      setMsg('❌ Failed to reserve machinery. Please check dates.');
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
          availableFrom: '12 August',
          availableTo: '17 August',
          description: '',
          imageUrl: '',
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
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-8 md:p-10 shadow-2xl space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-emerald-400" /> FARM MACHINERY &amp; EQUIPMENT SHARING
          </span>
          <span className="text-xs font-mono font-bold text-teal-200">• DAILY RENTAL MARKET</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight text-white">
              Equipment Rental Marketplace 🚜
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl font-medium">
              Don't buy expensive machinery! Rent Tractors, Harvesters, Spraying Drones, Irrigation Water Pumps, and Cultivators by the day with location delivery.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(!showAddModal)}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-xl transition flex items-center gap-2 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{showAddModal ? 'Close Form' : 'List Machinery for Rent 🚜'}</span>
          </button>
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
                <option value="Kurunegala">Kurunegala</option>
                <option value="Anuradhapura">Anuradhapura</option>
                <option value="Nuwara Eliya">Nuwara Eliya</option>
                <option value="Kandy">Kandy</option>
                <option value="Matale">Matale</option>
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
                placeholder="12–17 August"
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
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition shrink-0 ${
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
            className="p-2 rounded-xl border border-slate-200 font-bold bg-white text-slate-800"
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
          <span className="text-xs font-semibold text-slate-400">Verified Equipment Fleet</span>
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
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {item.rating}
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
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

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Daily Rate</span>
                      <span className="text-xl font-black text-emerald-600 font-display">Rs. {item.dailyRateLkr.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ day</span></span>
                    </div>

                    <button
                      onClick={() => setBookingEquipment(item)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
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
                    <td className="p-3 font-black text-emerald-600">Rs. {b.totalCost.toLocaleString()}</td>
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

      {/* RENTAL BOOKING MODAL */}
      {bookingEquipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-100 p-6 space-y-5 relative">
            <h3 className="text-lg font-black text-slate-900 font-display">Book Machinery Rental 🚜</h3>
            
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <p className="font-extrabold text-slate-900 text-sm">{bookingEquipment.name}</p>
              <p className="text-slate-500 font-medium">
                District: <strong>{bookingEquipment.location}</strong> • Available: <strong>{bookingEquipment.availableFrom}–{bookingEquipment.availableTo}</strong>
              </p>
              <p className="text-emerald-700 font-extrabold text-sm">Daily Rate: Rs. {bookingEquipment.dailyRateLkr.toLocaleString()} / day</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-500 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-500 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-800"
                />
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1 text-xs">
              <div className="flex justify-between font-bold text-emerald-900">
                <span>Rental Duration:</span>
                <span>{totalDays} Days</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-emerald-200/60">
                <span className="font-black text-emerald-950">Total Rental Cost:</span>
                <span className="text-xl font-black text-emerald-700">Rs. {(bookingEquipment.dailyRateLkr * totalDays).toLocaleString()}</span>
              </div>
            </div>

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
                onClick={handleConfirmBooking}
                disabled={processingBooking}
                className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
              >
                {processingBooking ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Booking 🚜'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

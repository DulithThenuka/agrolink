import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cropsAPI, ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, Loader2, ShoppingBag, MapPin, Tag, Trash2, QrCode, PlusCircle, LayoutGrid, List } from 'lucide-react';
import { FarmerProfileModal } from '../components/FarmerProfileModal';
import { TraceabilityModal } from '../components/TraceabilityModal';
import { BuyCropModal } from '../components/BuyCropModal';
import { PostHarvestModal } from '../components/PostHarvestModal';

const MOCK_CROPS = [
  {
    id: 1,
    name: 'Organic Nuwara Eliya Tomatoes',
    category: 'Vegetables',
    location: 'Nuwara Eliya',
    price: 210,
    quantity: 450,
    farmerName: 'Sunil Perera (Green Valley)',
    farmerId: 2,
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
    description: 'Fresh grade-A vine-ripened organic tomatoes grown in high-altitude soil. Zero chemical pesticides.',
    batchCode: 'BATCH-2026-NWR-0941'
  },
  {
    id: 2,
    name: 'Jaffna Red Onions (Grade A)',
    category: 'Vegetables',
    location: 'Jaffna',
    price: 340,
    quantity: 800,
    farmerName: 'Kamal Fernando (Jaffna Organics)',
    farmerId: 3,
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80',
    description: 'Pungent, sun-cured Jaffna shallots with high oil content. Ideal for long-term commercial storage.',
    batchCode: 'BATCH-2026-JAF-0822'
  },
  {
    id: 3,
    name: 'Ceylon Organic Cinnamon Bark',
    category: 'Spices',
    location: 'Galle',
    price: 1450,
    quantity: 120,
    farmerName: 'Sunil Perera (Green Valley)',
    farmerId: 2,
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
    description: 'Authentic Alba-grade Ceylon quills. Hand-peeled in Southern Sri Lanka with certified low coumarin.',
    batchCode: 'BATCH-2026-GAL-0519'
  },
  {
    id: 4,
    name: 'Hambantota Sweet Watermelons',
    category: 'Fruits',
    location: 'Hambantota',
    price: 180,
    quantity: 650,
    farmerName: 'Kamal Fernando (Jaffna Organics)',
    farmerId: 3,
    imageUrl: 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=800&auto=format&fit=crop&q=80',
    description: 'Juicy, high-brix sugar-baby watermelons harvested fresh from dry zone farms. Direct dispatch.',
    batchCode: 'BATCH-2026-HMB-0312'
  },
  {
    id: 5,
    name: 'Anuradhapura White Samba Rice',
    category: 'Grains',
    location: 'Anuradhapura',
    price: 260,
    quantity: 1500,
    farmerName: 'Sunil Perera (Green Valley)',
    farmerId: 2,
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    description: 'Aromatic long-grain paddy harvested from Ancient Tank Irrigation zones. Aged 6 months for premium texture.',
    batchCode: 'BATCH-2026-ANU-1104'
  },
  {
    id: 6,
    name: 'Kandy Ceylon Green Tea Leaves',
    category: 'Spices',
    location: 'Kandy',
    price: 890,
    quantity: 350,
    farmerName: 'Sunil Perera (Green Valley)',
    farmerId: 2,
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
    description: 'Hand-picked two-leaves-and-a-bud fresh tea flush from central hill slopes. Rich in natural antioxidants.',
    batchCode: 'BATCH-2026-KDY-0731'
  }
];

export const CropsList = () => {
  const { isBuyer, isFarmer } = useAuth();
  const navigate = useNavigate();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [selectedTraceCrop, setSelectedTraceCrop] = useState(null);
  const [selectedBuyCrop, setSelectedBuyCrop] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('DEFAULT');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const filterMockData = () => {
    let result = [...MOCK_CROPS];
    if (keyword) {
      result = result.filter(c => c.name.toLowerCase().includes(keyword.toLowerCase()));
    }
    if (category) {
      result = result.filter(c => c.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (location) {
      result = result.filter(c => c.location.toLowerCase().includes(location.toLowerCase()));
    }
    if (minPrice) {
      result = result.filter(c => c.price >= Number(minPrice));
    }
    if (maxPrice) {
      result = result.filter(c => c.price <= Number(maxPrice));
    }

    // Apply Sorting Controls
    if (sortBy === 'PRICE_LOW') {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'PRICE_HIGH') {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === 'QTY_HIGH') {
      result.sort((a, b) => Number(b.quantity) - Number(a.quantity));
    } else if (sortBy === 'NEWEST') {
      result.sort((a, b) => Number(b.id) - Number(a.id));
    }

    return result;
  };

  const fetchCrops = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 12,
        ...(keyword && { keyword }),
        ...(category && { category }),
        ...(location && { location }),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
      };
      const res = await cropsAPI.getAll(params);
      if (res && res.data && Array.isArray(res.data.content) && res.data.content.length > 0) {
        setCrops(res.data.content);
        setTotalPages(res.data.totalPages || 1);
      } else {
        const filtered = filterMockData();
        setCrops(filtered);
        setTotalPages(1);
      }
    } catch (err) {
      console.warn('Backend API offline or unreachable. Loading mock crops catalog:', err);
      const filtered = filterMockData();
      setCrops(filtered);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, [page, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchCrops();
  };

  const handleBuy = async (cropId) => {
    try {
      await ordersAPI.place({ cropId, quantity: 1 });
      alert('Order placed successfully!');
      fetchCrops();
    } catch (err) {
      alert(typeof err === 'string' ? err : 'Order placement failed');
    }
  };

  const handleDelete = async (cropId) => {
    if (!window.confirm('Are you sure you want to delete this crop listing?')) return;
    try {
      await cropsAPI.delete(cropId);
      fetchCrops();
    } catch (err) {
      alert('Failed to delete crop');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-slate-200/60">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">Available Crops 🌾</h1>
          <p className="text-slate-500 text-sm mt-1">Discover, order, or sell fresh organic agriculture harvests directly.</p>
        </div>

        {/* SEARCH BAR & POST HARVEST BUTTON */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowPostModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-2 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Post New Harvest</span>
          </button>

          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search crops..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
              />
            </div>
            <button type="submit" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-sm transition">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* QUICK CATEGORY PILLS & SORT CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2.5 items-center">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mr-1">Category Pill Filters:</span>
          {['', 'Vegetables', 'Grains', 'Fruits', 'Spices'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setPage(0);
                fetchCrops();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
                category === cat
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              {cat === '' ? 'All Produce' : cat}
            </button>
          ))}
        </div>

        {/* SORT & VIEW MODE CONTROLS */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(0);
              }}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-800 focus:outline-none focus:border-emerald-500 shadow-sm cursor-pointer"
            >
              <option value="DEFAULT">⭐ Featured</option>
              <option value="PRICE_LOW">💲 Price: Low to High</option>
              <option value="PRICE_HIGH">💲 Price: High to Low</option>
              <option value="QTY_HIGH">🌾 Stock: High to Low</option>
              <option value="NEWEST">🕒 Newest First</option>
            </select>
          </div>

          <div className="flex items-center p-1 bg-white border border-slate-200 rounded-xl shadow-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                viewMode === 'grid' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                viewMode === 'table' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>


      {/* FILTER BAR */}
      <div className="premium-card p-6 bg-white border border-slate-100 shadow-md">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Produce Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 bg-white transition cursor-pointer"
            >
              <option value="">All Categories 🌾</option>
              <option value="Vegetables">🥬 Vegetables</option>
              <option value="Grains">🌾 Grains &amp; Cereals</option>
              <option value="Fruits">🍎 Fresh Fruits</option>
              <option value="Spices">🌶️ Spices &amp; Tea</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Agricultural District 🇱🇰</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 bg-white transition cursor-pointer"
            >
              <option value="">All Sri Lanka Districts 📍</option>
              {[
                'Nuwara Eliya',
                'Jaffna',
                'Kandy',
                'Galle',
                'Hambantota',
                'Anuradhapura',
                'Polonnaruwa',
                'Badulla',
                'Dambulla',
                'Matale',
                'Kurunegala',
                'Ratnapura',
                'Kegalle',
                'Ampara',
                'Batticaloa',
                'Trincomalee',
                'Kilinochchi',
                'Mannar',
                'Vavuniya',
                'Mullaitivu',
                'Monaragala',
                'Puttalam',
                'Kalutara',
                'Colombo'
              ].map((dist) => (
                <option key={dist} value={dist}>
                  📍 {dist}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Min Price (Rs.)</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Max Price (Rs.)</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="2000"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <button type="submit" className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Apply Filters
          </button>
        </form>
      </div>

      {/* CROP CATALOG DISPLAY (GRID vs TABLE VIEW) */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <p className="text-sm font-semibold">Loading agricultural catalog...</p>
        </div>
      ) : crops.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 space-y-3">
          <div className="text-4xl">🌾</div>
          <h3 className="text-lg font-bold text-slate-800 font-display">No Crops Found</h3>
          <p className="text-slate-500 text-sm">Try adjusting your search query or filter parameters.</p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="premium-card overflow-hidden bg-white border border-slate-100 shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Produce Harvest</th>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4">District</th>
                  <th className="px-4 py-4">Farmer Grower</th>
                  <th className="px-4 py-4">Direct Price</th>
                  <th className="px-4 py-4">Stock Left</th>
                  <th className="px-4 py-4">Traceability</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {crops.map((crop) => (
                  <tr key={crop.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                      <img
                        src={crop.imageUrl || 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=150&q=80'}
                        alt={crop.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <Link to={`/crops/${crop.id}`} className="hover:text-emerald-600 font-bold transition block text-sm">
                          {crop.name}
                        </Link>
                        <span className="text-[10px] text-emerald-600 font-bold">🌱 Organic Grade A</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-600">{crop.category || 'Vegetables'}</td>
                    <td className="px-4 py-4 font-medium text-slate-600">📍 {crop.location || 'Nuwara Eliya'}</td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => setSelectedFarmer({ id: crop.farmerId, name: crop.farmerName })}
                        className="text-emerald-700 font-bold hover:underline"
                      >
                        🧑‍🌾 {crop.farmerName || 'Sunil Perera'}
                      </button>
                    </td>
                    <td className="px-4 py-4 font-black text-emerald-600 text-sm">Rs. {crop.price}/kg</td>
                    <td className="px-4 py-4 font-bold text-slate-700">{crop.quantity} kg</td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => setSelectedTraceCrop(crop)}
                        className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
                      >
                        <QrCode className="w-3 h-3 text-emerald-600" /> Verify Batch
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!isFarmer && (
                          <button
                            onClick={() => setSelectedBuyCrop(crop)}
                            disabled={crop.quantity <= 0}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                          >
                            Buy
                          </button>
                        )}
                        <Link
                          to={`/crops/${crop.id}`}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                        >
                          Details
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {crops.map((crop) => (
            <motion.div
              key={crop.id}
              whileHover={{ y: -4 }}
              className="premium-card overflow-hidden bg-white border border-slate-100/90 flex flex-col justify-between h-full group shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="h-52 overflow-hidden bg-slate-100 relative">
                <img
                  src={crop.imageUrl || 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=600&q=80'}
                  alt={crop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-70" />

                <div className="absolute top-3 left-3 right-16 flex flex-col gap-1 items-start z-10">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFarmer({ id: crop.farmerId, name: crop.farmerName });
                    }}
                    className="px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold border border-white/20 shadow-lg truncate max-w-[130px] hover:bg-slate-900 transition"
                  >
                    🧑‍🌾 {crop.farmerName || 'Sunil Perera'} ✓
                  </button>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 backdrop-blur-md text-emerald-200 text-[9px] font-bold border border-emerald-400/30">
                    🌱 Organic
                  </span>
                </div>

                <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-extrabold text-[10px] uppercase shadow-md">
                  Grade A
                </span>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                  <span className="px-2 py-0.5 rounded-lg glass-dark text-[10px] font-bold border border-white/20 flex items-center gap-1">
                    📍 {crop.location || 'Nuwara Eliya'}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg glass-dark text-[10px] font-bold border border-white/20">
                    {crop.quantity || 230}kg Available
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">
                    <span>{crop.category || 'Fresh Produce'}</span>
                    <span className="text-slate-500 font-bold lowercase">Harvested: Today</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-800 font-display hover:text-emerald-600 transition">
                    <Link to={`/crops/${crop.id}`}>{crop.name}</Link>
                  </h3>

                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="font-bold text-amber-500 text-xs">
                      ★★★★★ 4.8
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTraceCrop(crop);
                      }}
                      className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1 transition"
                    >
                      <QrCode className="w-3 h-3 text-emerald-600" /> Scan QR 🔎
                    </button>
                  </div>

                  <div className="mt-3 p-2.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5">
                    <div className="flex items-baseline justify-between">
                      <span className="text-lg font-extrabold text-emerald-600 font-display">Rs. {crop.price || 210}/kg</span>
                      <span className="text-[10px] text-slate-400 line-through font-semibold">Market: Rs. 225/kg</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-bold text-emerald-700">
                      <span>Direct Farm Price</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-emerald-100">You save: 6.7%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {!isFarmer && (
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <button
                        onClick={() => setSelectedBuyCrop(crop)}
                        disabled={crop.quantity <= 0}
                        className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-1"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Buy Now
                      </button>
                      <Link
                        to={`/crops/${crop.id}`}
                        className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition text-center flex items-center justify-center"
                      >
                        Details
                      </Link>
                    </div>
                  )}

                  {isFarmer && (
                    <button
                      onClick={() => handleDelete(crop.id)}
                      className="ml-auto p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}


      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 pt-6">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl disabled:opacity-50 shadow-sm"
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-100">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl disabled:opacity-50 shadow-sm"
          >
            Next
          </button>
        </div>
      )}

      {selectedFarmer && (
        <FarmerProfileModal
          farmerId={selectedFarmer.id}
          farmerName={selectedFarmer.name}
          onClose={() => setSelectedFarmer(null)}
        />
      )}

      {selectedTraceCrop && (
        <TraceabilityModal
          cropId={selectedTraceCrop.id}
          batchCode={selectedTraceCrop.batchCode}
          onClose={() => setSelectedTraceCrop(null)}
        />
      )}

      {selectedBuyCrop && (
        <BuyCropModal
          crop={selectedBuyCrop}
          onClose={() => setSelectedBuyCrop(null)}
          onOrderPlaced={fetchCrops}
        />
      )}

      {showPostModal && (
        <PostHarvestModal
          onClose={() => setShowPostModal(false)}
          onCropCreated={(newCrop) => {
            setCrops((prev) => [newCrop, ...prev]);
            fetchCrops();
          }}
        />
      )}
    </div>
  );
};

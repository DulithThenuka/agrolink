import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { suppliersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Package, ShoppingBag, PlusCircle, Filter, CheckCircle2, ShieldCheck, Truck, Loader2, Sparkles, Sprout, Wrench, Cpu, DollarSign, Layers } from 'lucide-react';

export const SupplierMarketplace = () => {
  const { user, isFarmer, isSupplier, isAdmin } = useAuth();

  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  // Purchase Modal State
  const [purchasingItem, setPurchasingItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [processingPurchase, setProcessingPurchase] = useState(false);

  // New Item Form State (for Suppliers)
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Seeds',
    brand: '',
    description: '',
    price: 1500,
    quantity: 50,
    imageUrl: '',
  });

  const categories = ['ALL', 'Seeds', 'Fertilizer', 'Pesticides', 'Tools', 'Irrigation', 'Machinery'];

  const MOCK_SUPPLIER_ITEMS = [
    {
      id: 1,
      name: 'CIC Hybrid Paddy Seeds (BG-352)',
      category: 'Seeds',
      brand: 'CIC Agri Businesses',
      supplierName: 'CIC Ceylon Organics',
      price: 1850,
      quantity: 120,
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
      description: 'High-yield certified 3.5-month paddy seeds resistant to blast disease.'
    },
    {
      id: 2,
      name: 'Baurs Organic NPK Fertilizer (50kg)',
      category: 'Fertilizer',
      brand: 'A. Baur & Co.',
      supplierName: 'Baurs Agricultural Inputs',
      price: 4500,
      quantity: 250,
      imageUrl: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=800&auto=format&fit=crop&q=80',
      description: 'Balanced bio-organic fertilizer blend for vegetables and tea plantations.'
    },
    {
      id: 3,
      name: 'Hayleys Bio-Pesticide Spray (1L)',
      category: 'Pesticides',
      brand: 'Hayleys Agriculture',
      supplierName: 'Hayleys Plant Protection',
      price: 2200,
      quantity: 85,
      imageUrl: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&auto=format&fit=crop&q=80',
      description: 'Eco-friendly neem-extract botanical pesticide for organic pest control.'
    },
    {
      id: 4,
      name: 'Jacto 16L Knapsack Sprayer',
      category: 'Tools',
      brand: 'Jacto Lanka',
      supplierName: 'Lanka Agro Tools Ltd',
      price: 12500,
      quantity: 30,
      imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
      description: 'Ergonomic high-pressure manual knapsack sprayer for crop maintenance.'
    }
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [itemsRes, ordersRes] = await Promise.all([
        suppliersAPI.getItems(selectedCategory),
        isSupplier ? suppliersAPI.getSupplierOrders() : suppliersAPI.getFarmerOrders(),
      ]);

      if (itemsRes && itemsRes.data && itemsRes.data.length > 0) {
        setItems(itemsRes.data);
      } else {
        setItems(MOCK_SUPPLIER_ITEMS);
      }
      if (ordersRes && ordersRes.data) setOrders(ordersRes.data);
    } catch (err) {
      console.warn('Backend API offline. Loading Supplier Marketplace fallback:', err);
      setItems(MOCK_SUPPLIER_ITEMS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory, isSupplier]);

  const handlePurchase = async () => {
    if (!purchasingItem || quantity < 1) return;

    setProcessingPurchase(true);
    setMsg('');
    try {
      const res = await suppliersAPI.purchaseItem(purchasingItem.id, quantity);
      if (res && res.data) {
        setMsg(`✅ Successfully purchased ${quantity}x ${purchasingItem.name}! Order confirmed.`);
        setPurchasingItem(null);
        setQuantity(1);
        fetchData();
      }
    } catch (err) {
      console.error('Purchase failed:', err);
      setMsg('❌ Purchase failed. Please verify inventory availability.');
    } finally {
      setProcessingPurchase(false);
    }
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;

    setProcessingPurchase(true);
    try {
      const res = await suppliersAPI.createItem({
        ...newItem,
        supplierName: user?.email ? user.email.split('@')[0] : 'Lanka Agri-Supply',
      });

      if (res && res.data) {
        setMsg('✅ New input supply item added to the marketplace!');
        setShowAddItemForm(false);
        setNewItem({
          name: '',
          category: 'Seeds',
          brand: '',
          description: '',
          price: 1500,
          quantity: 50,
          imageUrl: '',
        });
        fetchData();
      }
    } catch (err) {
      console.error('Failed to create item:', err);
    } finally {
      setProcessingPurchase(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-emerald-950 to-teal-950 text-white p-8 md:p-10 shadow-2xl space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" /> PRE-PRODUCTION SUPPLIER ECOSYSTEM
          </span>
          <span className="text-xs font-mono font-bold text-teal-200">• SUPPLIER ➔ FARMER</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight text-white">
              Agricultural Supplier Marketplace 🧰
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl font-medium">
              Equip your farm before cultivation! Purchase certified hybrid seeds, organic fertilizers, pesticides, precision tools, drip irrigation kits, and farm machinery.
            </p>
          </div>

          {(isSupplier || isAdmin) && (
            <button
              onClick={() => setShowAddItemForm(!showAddItemForm)}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-xl transition flex items-center gap-2 shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{showAddItemForm ? 'Close Form' : 'List New Input Supply 📦'}</span>
            </button>
          )}
        </div>
      </div>

      {msg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-xs shadow-sm">
          {msg}
        </div>
      )}

      {/* SUPPLIER NEW ITEM CREATION FORM */}
      {showAddItemForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" /> Add Agricultural Supply Listing
          </h3>

          <form onSubmit={handleCreateItem} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Item Title</label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="e.g. Organic NPK Fertilizer 50kg"
                required
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Category</label>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
              >
                <option value="Seeds">🌱 Seeds</option>
                <option value="Fertilizer">🧪 Fertilizer</option>
                <option value="Pesticides">🐛 Pesticides</option>
                <option value="Tools">🛠️ Tools</option>
                <option value="Irrigation">🚰 Irrigation</option>
                <option value="Machinery">🚜 Machinery</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Brand / Manufacturer</label>
              <input
                type="text"
                value={newItem.brand}
                onChange={(e) => setNewItem({ ...newItem, brand: e.target.value })}
                placeholder="e.g. Lanka AgriTech"
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Price (Rs.)</label>
              <input
                type="number"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-emerald-600"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Stock Quantity</label>
              <input
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Image URL</label>
              <input
                type="url"
                value={newItem.imageUrl}
                onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Description</label>
              <textarea
                rows="2"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Detailed specifications, usage guidelines, and chemical composition..."
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={processingPurchase}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                {processingPurchase ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                <span>Publish Item to Marketplace 🚀</span>
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* CATEGORY FILTER BAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        <span className="text-xs font-bold uppercase text-slate-400 mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Category:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition shrink-0 ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat === 'ALL' ? '📦 All Categories' : cat}
          </button>
        ))}
      </div>

      {/* ITEMS CATALOG GRID */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900 font-display">
            Available Supplies ({items.length} Products)
          </h2>
          <span className="text-xs font-semibold text-slate-400">Direct Delivery to Farm Location</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600" />
            <p className="text-xs font-semibold">Loading marketplace catalog...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <p className="text-sm font-bold text-slate-700">No Supply Items Found</p>
            <p className="text-xs text-slate-500">Try selecting another category filter above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -3 }}
                className="premium-card bg-white border border-slate-100/90 shadow-md rounded-3xl overflow-hidden flex flex-col justify-between"
              >
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a2e'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a2e';
                    }}
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-slate-900/80 backdrop-blur-sm text-emerald-300 text-[10px] font-black uppercase tracking-wider rounded-full border border-white/20">
                    {item.category}
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 block">{item.brand} • {item.supplierName}</span>
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug">{item.name}</h3>
                    <p className="text-xs text-slate-500 font-medium line-clamp-2">{item.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Unit Price</span>
                      <span className="text-xl font-black text-emerald-600 font-display">Rs. {item.price.toLocaleString()}</span>
                    </div>

                    <button
                      onClick={() => {
                        setPurchasingItem(item);
                        setQuantity(1);
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Buy Supplies 🛒
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* FARMER PURCHASE ORDERS & SUPPLIER SALES HISTORY */}
      <div className="premium-card p-6 bg-white border border-slate-100 shadow-xl space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              {isSupplier ? '📦 Supplier Sales Orders' : '🛒 My Farm Supply Purchases'}
            </h3>
            <p className="text-xs text-slate-500 font-medium">Input supplies &amp; equipment order history</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            {orders.length} Orders Recorded
          </span>
        </div>

        {orders.length === 0 ? (
          <p className="text-xs text-slate-400 font-medium py-4 text-center">No supply orders recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-400 uppercase font-black tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Supply Product</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-900">#SUP-{ord.id}</td>
                    <td className="p-3 font-bold text-slate-900">{ord.supplierItemName}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-extrabold text-[10px]">
                        {ord.category}
                      </span>
                    </td>
                    <td className="p-3 font-bold">{ord.quantity} Units</td>
                    <td className="p-3 font-black text-emerald-600">Rs. {ord.totalPrice.toLocaleString()}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PURCHASE MODAL */}
      {purchasingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-100 p-6 space-y-5 relative">
            <h3 className="text-lg font-black text-slate-900 font-display">Confirm Supply Purchase 🛒</h3>
            
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <p className="font-extrabold text-slate-900 text-sm">{purchasingItem.name}</p>
              <p className="text-slate-500 font-medium">Category: {purchasingItem.category} • Brand: {purchasingItem.brand}</p>
              <p className="text-emerald-700 font-extrabold text-sm">Unit Price: Rs. {purchasingItem.price.toLocaleString()}</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                max={purchasingItem.quantity}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-extrabold"
              />
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center text-xs">
              <span className="font-bold text-emerald-900">Total Purchase Amount:</span>
              <span className="text-lg font-black text-emerald-700">Rs. {(purchasingItem.price * quantity).toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPurchasingItem(null)}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePurchase}
                disabled={processingPurchase}
                className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
              >
                {processingPurchase ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Order 🛒'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

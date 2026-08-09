import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { ShoppingBag, Loader2, CheckCircle2, Clock, Truck, MapPin, ChevronDown, ChevronUp, Navigation, AlertCircle } from 'lucide-react';

const LOGISTICS_STAGES = [
  { key: 'PENDING', label: 'Buyer Orders' },
  { key: 'FARMER_ACCEPTED', label: 'Farmer Accepts' },
  { key: 'TRANSPORT_REQUESTED', label: 'Transport Requested' },
  { key: 'DRIVER_ASSIGNED', label: 'Driver Assigned' },
  { key: 'COLLECTED', label: 'Crop Collected' },
  { key: 'IN_TRANSIT', label: 'Live Tracking' },
  { key: 'DELIVERED', label: 'Delivered' },
  { key: 'CONFIRMED', label: 'Buyer Confirms' },
  { key: 'PAID', label: 'Farmer Paid' },
];

const getStageIndex = (status) => {
  switch (status) {
    case 'PENDING': return 0;
    case 'FARMER_ACCEPTED': return 1;
    case 'TRANSPORT_REQUESTED': return 2;
    case 'DRIVER_ASSIGNED': return 3;
    case 'COLLECTED': return 4;
    case 'IN_TRANSIT': return 5;
    case 'DELIVERED': return 6;
    case 'CONFIRMED': return 7;
    case 'PAID': return 8;
    default: return 0;
  }
};

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [msg, setMsg] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await ordersAPI.getMyOrders({ page: 0, size: 50 });
      if (res && res.data) {
        setOrders(res.data.content || []);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleBuyerConfirm = async (orderId) => {
    setActionLoading(orderId);
    setMsg('');
    try {
      const res = await ordersAPI.buyerConfirm(orderId);
      if (res && res.status === 'SUCCESS') {
        setMsg('🎉 Delivery confirmed! Settlement complete - Farmer paid.');
        fetchOrders();
      }
    } catch (err) {
      setMsg(`❌ Confirmation error: ${err}`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center pb-5 border-b border-slate-200/60">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">My Trade Orders 📦</h1>
          <p className="text-slate-500 text-sm mt-1">Track 9-stage smart logistics dispatches, live tracking, and farmer payouts.</p>
        </div>

        <Link to="/crops" className="text-xs text-emerald-600 hover:text-emerald-700 font-bold transition flex items-center gap-1">
          Browse Catalog →
        </Link>
      </div>

      {msg && (
        <div className={`p-4 rounded-2xl border font-bold text-xs ${msg.startsWith('🎉') ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {msg}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <p className="text-sm font-semibold">Loading orders history...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 space-y-4 shadow-sm">
          <div className="text-4xl">📦</div>
          <h3 className="text-lg font-bold text-slate-800 font-display">No Orders Placed Yet</h3>
          <p className="text-slate-500 text-sm">Explore our crop catalog to place your first direct order with local farmers.</p>
          <Link to="/crops" className="inline-block px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20">
            Browse Crops Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const currentStageIndex = getStageIndex(order.status);

            return (
              <div key={order.id} className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden transition">
                {/* Order Summary Bar */}
                <div
                  onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                  className="p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                      🌾
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-slate-900 text-base">{order.cropName || 'Crop Harvest'}</h3>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded-md">
                          #{order.id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Quantity: <strong>{order.quantity} Kg</strong> • Total: <strong className="text-emerald-600">Rs. {Number(order.totalPrice).toLocaleString()}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 block">
                        {order.statusLabel || order.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="text-slate-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Logistics Pipeline View */}
                {isExpanded && (
                  <div className="p-6 bg-slate-50/70 border-t border-slate-100 space-y-6">
                    {/* Stage Timeline */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-display">
                          Smart Logistics Lifecycle Flow
                        </h4>
                        <span className="text-xs font-extrabold text-emerald-700">
                          Step {currentStageIndex + 1} of 9
                        </span>
                      </div>

                      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
                        {LOGISTICS_STAGES.map((stage, idx) => {
                          const isDone = idx <= currentStageIndex;
                          const isCurrent = idx === currentStageIndex;

                          return (
                            <div
                              key={stage.key}
                              className={`p-2.5 rounded-xl border text-center text-[10px] font-extrabold transition flex flex-col items-center justify-center space-y-1 ${
                                isCurrent
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                                  : isDone
                                  ? 'bg-emerald-100/70 text-emerald-800 border-emerald-200'
                                  : 'bg-white text-slate-400 border-slate-200'
                              }`}
                            >
                              <span>{isDone ? '✓' : idx + 1}</span>
                              <span className="leading-tight">{stage.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Logistics Card Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 text-xs font-semibold">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Pickup (Farmer)
                        </span>
                        <p className="font-extrabold text-slate-800 text-sm">{order.pickupLocation || 'Homagama'}</p>
                        <p className="text-[11px] text-slate-500">Producer: {order.farmerName || 'Farmer'}</p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <Navigation className="w-3.5 h-3.5 text-emerald-600" /> Delivery (Buyer)
                        </span>
                        <p className="font-extrabold text-slate-800 text-sm">{order.deliveryLocation || 'Colombo'}</p>
                        <p className="text-[11px] text-slate-500">Distance: {order.distanceKm || 31} km</p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5 text-emerald-600" /> Logistics Driver
                        </span>
                        <p className="font-extrabold text-slate-800 text-sm">{order.driverName || 'Assigning driver...'}</p>
                        <p className="text-[11px] text-emerald-600 font-bold">
                          Fee: Rs. {order.logisticsFee ? Number(order.logisticsFee).toLocaleString() : '4,800'}
                        </p>
                      </div>
                    </div>

                    {/* Live Tracking Note */}
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs space-y-1">
                      <span className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-emerald-600" /> Live Dispatch Update:
                      </span>
                      <p className="text-emerald-800 font-medium italic">
                        "{order.trackingNotes || 'Waiting for farmer acceptance.'}"
                      </p>
                    </div>

                    {/* Buyer Action Button when DELIVERED */}
                    {order.status === 'DELIVERED' && (
                      <div className="pt-2 flex items-center justify-between bg-purple-50 p-4 rounded-2xl border border-purple-200">
                        <div>
                          <p className="font-extrabold text-slate-900 text-xs">Crop Delivered to Destination!</p>
                          <p className="text-[11px] text-slate-500 font-medium">Please inspect cargo and confirm receipt to release payout to farmer.</p>
                        </div>

                        <button
                          onClick={() => handleBuyerConfirm(order.id)}
                          disabled={actionLoading === order.id}
                          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-2 disabled:opacity-50"
                        >
                          {actionLoading === order.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Confirm Receipt (Release Payment)</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

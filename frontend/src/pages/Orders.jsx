import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import {
  ShoppingBag,
  Loader2,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  ChevronDown,
  ChevronUp,
  Navigation,
  AlertCircle,
  AlertTriangle,
  QrCode,
  Package,
  XCircle,
} from 'lucide-react';
import { FarmerProfileModal } from '../components/FarmerProfileModal';
import { TraceabilityModal } from '../components/TraceabilityModal';
import { DisputeModal } from '../components/DisputeModal';

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
  const s = (status || 'PENDING').toUpperCase();
  if (s === 'CANCELLED') return -1;
  switch (s) {
    case 'PENDING':
    case 'PLACED':
      return 0;
    case 'FARMER_ACCEPTED':
      return 1;
    case 'TRANSPORT_REQUESTED':
      return 2;
    case 'DRIVER_ASSIGNED':
      return 3;
    case 'COLLECTED':
      return 4;
    case 'IN_TRANSIT':
    case 'DISPATCHED':
    case 'SHIPPED':
      return 5;
    case 'DELIVERED':
      return 6;
    case 'CONFIRMED':
      return 7;
    case 'PAID':
    case 'COMPLETED':
      return 8;
    default:
      return 0;
  }
};

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [msg, setMsg] = useState('');
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [selectedTraceOrder, setSelectedTraceOrder] = useState(null);
  const [disputeOrder, setDisputeOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await ordersAPI.getMyOrders({ page: 0, size: 50 });
      if (res && res.data) {
        setOrders(res.data.content || (Array.isArray(res.data) ? res.data : []));
      } else if (Array.isArray(res)) {
        setOrders(res);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
      setMsg(`Failed to load orders: ${err?.response?.data?.message || err?.message || 'Network error'}`);
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
      if (res && (res.success || res.data)) {
        setMsg('🎉 Delivery confirmed! AgroLink Escrow released funds to farmer.');
        fetchOrders();
      }
    } catch (err) {
      setMsg(`❌ Confirmation error: ${err?.response?.data?.message || err?.message || 'Failed to confirm delivery'}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRaiseDisputeSubmit = async (orderId, reason) => {
    const res = await ordersAPI.raiseDispute(orderId, { reason });
    if (res && (res.success || res.data)) {
      setMsg('⚠️ Escrow dispute filed successfully! Funds locked under Admin Investigation.');
      setDisputeOrder(null);
      fetchOrders();
    }
  };

  const renderStatusBadge = (status) => {
    const s = (status || 'PENDING').toUpperCase();

    if (['DELIVERED', 'COMPLETED', 'CONFIRMED', 'PAID'].includes(s)) {
      const label = s === 'PAID' ? 'Paid & Completed' : s === 'CONFIRMED' ? 'Confirmed' : 'Delivered';
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{label}</span>
        </span>
      );
    }

    if (['IN_TRANSIT', 'DISPATCHED', 'SHIPPED', 'COLLECTED', 'DRIVER_ASSIGNED', 'TRANSPORT_REQUESTED'].includes(s)) {
      const label =
        s === 'IN_TRANSIT' || s === 'DISPATCHED' || s === 'SHIPPED'
          ? 'In Transit'
          : s === 'COLLECTED'
          ? 'Crop Collected'
          : s === 'DRIVER_ASSIGNED'
          ? 'Driver Assigned'
          : 'Transport Requested';

      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200/80 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
          <Truck className="w-3.5 h-3.5 text-sky-600" />
          <span>{label}</span>
        </span>
      );
    }

    if (['PENDING', 'PLACED', 'FARMER_ACCEPTED', 'PROCESSING'].includes(s)) {
      const label = s === 'FARMER_ACCEPTED' ? 'Farmer Accepted' : 'Pending Order';
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/80 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>{label}</span>
        </span>
      );
    }

    if (['DISPUTED', 'CANCELLED', 'ESCROW_LOCKED', 'REJECTED'].includes(s)) {
      const isDispute = s === 'DISPUTED' || s === 'ESCROW_LOCKED';
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/80 shadow-sm">
          {isDispute ? <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> : <XCircle className="w-3.5 h-3.5 text-rose-600" />}
          <span>{isDispute ? 'Dispute Under Review' : 'Cancelled'}</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 shadow-sm">
        <Package className="w-3.5 h-3.5 text-slate-500" />
        <span>{status}</span>
      </span>
    );
  };

  const renderEscrowBadge = (escrowStatus) => {
    switch (escrowStatus) {
      case 'RELEASED_TO_FARMER':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
            🛡️ Escrow: Released
          </span>
        );
      case 'DISPUTED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
            ⚠️ Escrow: Disputed
          </span>
        );
      case 'REFUNDED_TO_BUYER':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-100 text-purple-800 border border-purple-200">
            ↩️ Escrow: Refunded
          </span>
        );
      case 'HELD_IN_ESCROW':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-50 text-blue-700 border border-blue-200">
            🛡️ Escrow: Held in Vault
          </span>
        );
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
        <div className={`p-4 rounded-2xl border font-bold text-xs ${msg.startsWith('🎉') ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
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
            const isCancelled = currentStageIndex === -1;
            const isDisputed = order.escrowStatus === 'DISPUTED';

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
                    <div className="text-right flex flex-col items-end gap-1.5">
                      {renderStatusBadge(order.status)}
                      <div className="flex items-center gap-2">
                        {renderEscrowBadge(order.escrowStatus)}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTraceOrder(order);
                          }}
                          className="px-2.5 py-1 bg-emerald-950 hover:bg-slate-900 text-emerald-300 text-[10px] font-extrabold rounded-lg flex items-center gap-1 transition shadow-sm border border-emerald-800 cursor-pointer"
                        >
                          <QrCode className="w-3 h-3 text-emerald-400" /> QR Trace 🔎
                        </button>
                      </div>
                    </div>

                    <div className="text-slate-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Logistics Pipeline View */}
                {isExpanded && (
                  <div className="p-6 bg-slate-50/70 border-t border-slate-100 space-y-6">
                    {/* Stage Timeline or Cancelled State */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-display">
                          Smart Logistics Lifecycle Flow
                        </h4>
                        <span className="text-xs font-extrabold">
                          {isCancelled ? (
                            <span className="text-rose-600 font-bold">Order Cancelled</span>
                          ) : isDisputed ? (
                            <span className="text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                              ⚠️ Step {currentStageIndex + 1} of 9 (Dispute Investigation)
                            </span>
                          ) : (
                            <span className="text-emerald-700 font-bold">
                              Step {currentStageIndex + 1} of 9
                            </span>
                          )}
                        </span>
                      </div>

                      {isCancelled ? (
                        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-xs font-bold">
                          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                          <span>This trade order has been cancelled and will not progress through logistics delivery.</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
                          {LOGISTICS_STAGES.map((stage, idx) => {
                            const isDone = idx < currentStageIndex || (idx === currentStageIndex && currentStageIndex === 8);
                            const isCurrent = idx === currentStageIndex && currentStageIndex !== 8;

                            let stepClass = 'bg-white text-slate-400 border-slate-200';
                            if (isCurrent) {
                              stepClass = isDisputed
                                ? 'bg-amber-500 text-white border-amber-500 shadow-md ring-2 ring-amber-500/20'
                                : 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20';
                            } else if (isDone) {
                              stepClass = 'bg-emerald-100/70 text-emerald-800 border-emerald-200';
                            }

                            return (
                              <div
                                key={stage.key}
                                className={`p-2.5 rounded-xl border text-center text-[10px] font-extrabold transition flex flex-col items-center justify-center space-y-1 ${stepClass}`}
                              >
                                <span>{isDone ? '✓' : isCurrent && isDisputed ? '⚠️' : idx + 1}</span>
                                <span className="leading-tight">{stage.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Logistics Card Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 text-xs font-semibold">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Pickup (Farmer)
                        </span>
                        <p className="font-extrabold text-slate-800 text-sm">{order.pickupLocation || 'Local Farm Hub'}</p>
                        <p className="text-[11px] text-slate-500">
                          Producer:{' '}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFarmer({ id: order.farmerId, name: order.farmerName || 'Local Farmer' });
                            }}
                            className="text-emerald-700 font-bold hover:underline cursor-pointer"
                          >
                            {order.farmerName || 'Local Farmer'} 🌾
                          </button>
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <Navigation className="w-3.5 h-3.5 text-emerald-600" /> Delivery (Buyer)
                        </span>
                        <p className="font-extrabold text-slate-800 text-sm">{order.deliveryLocation || 'Colombo Wholesale Hub'}</p>
                        <p className="text-[11px] text-slate-500">Distance: {order.distanceKm || 32} km</p>
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
                        "{order.trackingNotes || 'Waiting for farmer acceptance and transport dispatch.'}"
                      </p>
                    </div>

                    {/* Escrow Dispute Info if Disputed */}
                    {order.escrowStatus === 'DISPUTED' && (
                      <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-xs space-y-1">
                        <span className="font-extrabold text-amber-900 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-amber-600" /> AgroLink Escrow Locked under Admin Investigation:
                        </span>
                        <p className="text-amber-800 font-medium italic">
                          Reason: "{order.disputeReason || 'Dispute raised by buyer.'}"
                        </p>
                        {order.disputeResolution && (
                          <p className="text-emerald-800 font-bold mt-1">
                            Resolution: {order.disputeResolution}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Buyer Actions: Confirm Delivery or Raise Dispute */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
                      <div>
                        <p className="font-extrabold text-slate-900 text-xs">AgroLink Escrow Protection 🛡️</p>
                        <p className="text-[11px] text-slate-500 font-medium">Funds are safely held in vault until you confirm delivery or raise a dispute.</p>
                      </div>

                      <div className="flex items-center gap-3">
                        {order.status === 'DELIVERED' && order.escrowStatus !== 'RELEASED_TO_FARMER' && order.escrowStatus !== 'REFUNDED_TO_BUYER' && (
                          <button
                            onClick={() => handleBuyerConfirm(order.id)}
                            disabled={actionLoading === order.id}
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                          >
                            {actionLoading === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Delivery (Release Escrow)'}
                          </button>
                        )}

                        {order.status !== 'CANCELLED' && order.escrowStatus !== 'RELEASED_TO_FARMER' && order.escrowStatus !== 'REFUNDED_TO_BUYER' && order.escrowStatus !== 'DISPUTED' && (
                          <button
                            onClick={() => setDisputeOrder(order)}
                            disabled={actionLoading === order.id}
                            className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold text-xs rounded-xl transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                          >
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                            <span>Raise Dispute ⚠️</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {selectedFarmer && (
        <FarmerProfileModal
          farmerId={selectedFarmer.id}
          farmerName={selectedFarmer.name}
          onClose={() => setSelectedFarmer(null)}
        />
      )}

      {selectedTraceOrder && (
        <TraceabilityModal
          cropId={selectedTraceOrder.cropId || selectedTraceOrder.crop?.id}
          batchCode={selectedTraceOrder.batchCode || 'BATCH-2026-NWR-0941'}
          onClose={() => setSelectedTraceOrder(null)}
        />
      )}

      {disputeOrder && (
        <DisputeModal
          order={disputeOrder}
          onClose={() => setDisputeOrder(null)}
          onSubmitDispute={handleRaiseDisputeSubmit}
        />
      )}
    </div>
  );
};

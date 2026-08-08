import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { ShoppingBag, Loader2, ArrowLeft, CheckCircle2, Clock, Truck } from 'lucide-react';

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await ordersAPI.getMyOrders({ page: 0, size: 20 });
        if (res && res.data) {
          setOrders(res.data.content || []);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center pb-5 border-b border-slate-200/60">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">My Trade Orders 📦</h1>
          <p className="text-slate-500 text-sm mt-1">Track purchase order lifecycles, logistics dispatches, and direct settlements.</p>
        </div>

        <Link to="/crops" className="text-xs text-emerald-600 hover:text-emerald-700 font-bold transition flex items-center gap-1">
          Browse Catalog →
        </Link>
      </div>

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
        <div className="premium-card overflow-hidden bg-white border border-slate-100/90 shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-widest border-b border-slate-100">
                <tr>
                  <th className="p-4">Harvest Listing</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Total Settlement</th>
                  <th className="p-4">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-emerald-50/40 transition">
                    <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        🌾
                      </div>
                      <span>{order.cropName || order.crop?.name || 'Crop Item'}</span>
                    </td>
                    <td className="p-4 text-slate-600 font-bold">{order.quantity} Kg</td>
                    <td className="p-4 font-extrabold text-emerald-600 font-display">${order.totalPrice}</td>
                    <td className="p-4">
                      <span className="badge-premium badge-delivered">
                        {order.status || 'PENDING'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};


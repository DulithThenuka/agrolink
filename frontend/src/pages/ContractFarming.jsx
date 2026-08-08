import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Building2, CheckCircle2, Calendar, Package, DollarSign, Truck, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ContractFarming = () => {
  const [appliedId, setAppliedId] = useState(null);

  const contracts = [
    {
      id: 'TENDER-801',
      buyerName: 'Keells Supermarket',
      buyerCategory: 'Supermarket Chain',
      cropName: 'Tomato',
      monthlyQuantityKg: 2000,
      durationMonths: 6,
      minPriceLkr: 180,
      maxPriceLkr: 220,
      qualityGrade: 'Grade A',
      deliveryFrequency: 'Weekly',
      applicantCount: 14,
    },
    {
      id: 'TENDER-802',
      buyerName: 'Cargills Food City',
      buyerCategory: 'Supermarket Chain',
      cropName: 'Green Chillies',
      monthlyQuantityKg: 1500,
      durationMonths: 12,
      minPriceLkr: 350,
      maxPriceLkr: 400,
      qualityGrade: 'Grade A',
      deliveryFrequency: 'Weekly',
      applicantCount: 8,
    },
    {
      id: 'TENDER-803',
      buyerName: 'Shangri-La Hotels & Resorts',
      buyerCategory: 'Hospitality Group',
      cropName: 'Samba Rice',
      monthlyQuantityKg: 5000,
      durationMonths: 6,
      minPriceLkr: 210,
      maxPriceLkr: 230,
      qualityGrade: 'Premium Grade',
      deliveryFrequency: 'Bi-Weekly',
      applicantCount: 22,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> B2B Contract Farming Hub
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display flex items-center gap-2">
            Contract Farming &amp; B2B Purchase Requests 📑
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Commercial supermarkets, hotel chains, and exporters publish long-term future harvest requirements. Apply to secure guaranteed income.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Purchase Tender creation modal opened for Enterprise Buyers')}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 hover:from-emerald-600 hover:to-emerald-700 transition flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" /> Create Purchase Request
          </button>
        </div>
      </div>

      {/* CONTRACT TENDERS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contracts.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -4 }}
            className="premium-card p-6 bg-white border border-slate-100/90 shadow-lg space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider border border-emerald-200/50">
                    {item.buyerCategory}
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 font-display mt-1">
                    {item.buyerName}
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase">
                  {item.qualityGrade}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Requirement:</span>
                <span className="text-sm font-extrabold text-emerald-600 font-display">
                  🌾 {item.cropName}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span className="font-medium">Monthly Quantity:</span>
                  <span className="font-extrabold text-slate-900">{item.monthlyQuantityKg.toLocaleString()} kg / month</span>
                </div>

                <div className="flex justify-between items-center text-slate-600">
                  <span className="font-medium">Contract Term:</span>
                  <span className="font-extrabold text-slate-900">{item.durationMonths} Months</span>
                </div>

                <div className="flex justify-between items-center text-slate-600">
                  <span className="font-medium">Expected Price:</span>
                  <span className="font-extrabold text-emerald-600">Rs. {item.minPriceLkr} – {item.maxPriceLkr}/kg</span>
                </div>

                <div className="flex justify-between items-center text-slate-600">
                  <span className="font-medium">Delivery Frequency:</span>
                  <span className="font-bold text-slate-800">{item.deliveryFrequency}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-400 font-semibold">{item.applicantCount} farmers applied</span>
              {appliedId === item.id ? (
                <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                </span>
              ) : (
                <button
                  onClick={() => setAppliedId(item.id)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
                >
                  Apply for Contract →
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

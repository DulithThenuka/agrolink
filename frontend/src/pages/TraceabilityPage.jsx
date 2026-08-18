import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { TraceabilityModal } from '../components/TraceabilityModal';
import { ArrowLeft } from 'lucide-react';

export const TraceabilityPage = () => {
  const { batchCode } = useParams();
  const navigate = useNavigate();

  return (
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/crops" className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-100 hover:bg-emerald-100 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Produce Marketplace
        </Link>
      </div>

      <div className="flex justify-center items-center py-4">
        <TraceabilityModal
          batchCode={batchCode || 'BATCH-2026-NWR-0941'}
          onClose={() => navigate('/crops')}
        />
      </div>
    </div>
  );
};

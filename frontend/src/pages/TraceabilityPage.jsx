import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { TraceabilityModal } from '../components/TraceabilityModal';
import { ArrowLeft } from 'lucide-react';

export const TraceabilityPage = () => {
  const { batchCode } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 p-6 flex flex-col items-center justify-center">
      <div className="mb-4">
        <Link to="/crops" className="text-xs font-extrabold text-emerald-400 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Crop Marketplace
        </Link>
      </div>

      <TraceabilityModal
        batchCode={batchCode || 'BATCH-2026-NWR-0941'}
        onClose={() => navigate('/crops')}
      />
    </div>
  );
};

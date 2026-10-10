import React from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Building2, 
  TrendingUp, 
  Scale, 
  Clock, 
  CheckCircle2, 
  Wheat, 
  Calendar 
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';
import { usePriceData } from '../context/PriceDataContext';
import { MANDIS } from '../data/mockData';

export const MarketDetailPage: React.FC = () => {
  const { params, navigate } = useRouter();
  const { t, language } = useLanguage();
  const { records, formatPrice, unit, unitLabel } = usePriceData();

  const mandiId = params.marketId || 'mandi-azadpur';
  const mandi = MANDIS.find(m => m.id === mandiId) || MANDIS[0];

  // Records for this mandi
  const mandiRecords = records.filter(r => r.mandiId === mandi.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Back button */}
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <button
          onClick={() => navigate('/markets')}
          className="inline-flex items-center gap-1 hover:text-[#176B35] font-semibold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Mandi Directory</span>
        </button>
        <span>/</span>
        <span className="text-stone-800 font-bold">{mandi.name}</span>
      </div>

      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">
              {mandi.marketType}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-serif mt-1">
              {mandi.name}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{mandi.address}</span>
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2 text-xs">
            <div className="bg-stone-50 border border-stone-200 px-3 py-2 rounded-lg text-stone-700">
              <span className="text-stone-400 block text-[10px] font-bold uppercase">Yard Phone</span>
              <span className="font-semibold">{mandi.phone}</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg text-emerald-900">
              <span className="text-emerald-700 block text-[10px] font-bold uppercase">Daily Turnover</span>
              <span className="font-bold font-mono">~{mandi.dailyArrivalTons.toLocaleString('en-IN')} Tonnes</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-stone-400" />
            <span>Auction Hours: <strong>06:00 AM – 02:00 PM</strong> IST</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>e-NAM Integrated Electronic Auction Platform</span>
          </div>
        </div>
      </div>

      {/* Traded Commodities Table */}
      <div className="bg-white rounded-xl border border-stone-200/90 shadow-xs overflow-hidden space-y-3">
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-stone-900">
              Today's Traded Commodities at {mandi.name} ({unitLabel})
            </h3>
            <p className="text-xs text-stone-500">
              Wholesale modal and boundary prices reported by yard supervisors
            </p>
          </div>
          <span className="text-xs font-semibold text-stone-500">
            {mandiRecords.length} Active lots
          </span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 uppercase font-bold">
                <th className="py-3.5 px-4">Commodity</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Variety & Grade</th>
                <th className="py-3.5 px-3 text-right">Min Rate</th>
                <th className="py-3.5 px-3 text-right">Max Rate</th>
                <th className="py-3.5 px-4 text-right font-bold text-[#176B35]">Modal Rate</th>
                <th className="py-3.5 px-3 text-right">Price Change</th>
                <th className="py-3.5 px-3 text-right">Arrivals</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {mandiRecords.length > 0 ? (
                mandiRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-stone-900">
                      <button
                        onClick={() => navigate(`/crops/${r.cropId}`)}
                        className="hover:text-[#176B35] text-left"
                      >
                        {r.cropName}
                      </button>
                    </td>
                    <td className="py-3.5 px-3 text-stone-600">
                      {r.category}
                    </td>
                    <td className="py-3.5 px-3 text-stone-600">
                      {r.variety} ({r.qualityGrade})
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-stone-600">
                      {formatPrice(r.minPrice)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-stone-600">
                      {formatPrice(r.maxPrice)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-[#176B35] text-sm">
                      {formatPrice(r.modalPrice)}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <span className={`inline-flex items-center text-xs font-bold ${
                        r.priceChange > 0 ? 'text-emerald-700' : r.priceChange < 0 ? 'text-red-600' : 'text-stone-500'
                      }`}>
                        {r.priceChange > 0 ? `+₹${r.priceChange}` : r.priceChange < 0 ? `-₹${Math.abs(r.priceChange)}` : '₹0'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-stone-600">
                      {r.arrivalsTons} T
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => navigate(`/crops/${r.cropId}`)}
                        className="px-2.5 py-1 text-xs font-semibold text-[#176B35] bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors border border-emerald-200"
                      >
                        Crop Trends
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-stone-500 text-xs">
                    No active trading lots recorded for this yard today.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

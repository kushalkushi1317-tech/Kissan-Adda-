import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Scale, 
  ShieldCheck, 
  Clock, 
  Layers, 
  Award,
  ChevronRight
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';
import { usePriceData } from '../context/PriceDataContext';
import { CROP_HISTORY_MAP } from '../data/mockData';

export const CropDetailPage: React.FC = () => {
  const { params, navigate } = useRouter();
  const { t, language } = useLanguage();
  const { crops, records, formatPrice, unit, unitLabel } = usePriceData();

  const cropId = params.cropId || 'tomato';
  const crop = crops.find(c => c.id === cropId) || crops[0];

  const [timeRange, setTimeRange] = useState<'7' | '30' | '90'>('30');

  // All price records for this crop
  const cropRecords = useMemo(() => {
    return records.filter(r => r.cropId === crop.id);
  }, [records, crop.id]);

  // Historical data
  const rawHistory = CROP_HISTORY_MAP[crop.id] || [];
  const chartHistory = useMemo(() => {
    const days = parseInt(timeRange, 10);
    const slice = rawHistory.slice(rawHistory.length - days);
    return slice.map(pt => ({
      ...pt,
      chartModal: unit === 'kg' ? pt.modalPrice / 100 : pt.modalPrice,
    }));
  }, [rawHistory, timeRange, unit]);

  // Modal price statistics across current mandis
  const modalRates = cropRecords.map(r => r.modalPrice);
  const highestRate = modalRates.length > 0 ? Math.max(...modalRates) : 0;
  const lowestRate = modalRates.length > 0 ? Math.min(...modalRates) : 0;
  const bestMandi = cropRecords.find(r => r.modalPrice === highestRate);

  const getCropTitle = () => {
    if (language === 'hi') return crop.hindiName;
    if (language === 'te') return crop.teluguName;
    return crop.name;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Breadcrumb & Back */}
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <button 
          onClick={() => navigate('/prices')}
          className="inline-flex items-center gap-1 hover:text-[#176B35] font-semibold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Prices</span>
        </button>
        <span>/</span>
        <span className="text-stone-400">{crop.category}</span>
        <span>/</span>
        <span className="text-stone-800 font-bold">{crop.name}</span>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3">
        <div className="h-64 md:h-auto overflow-hidden relative bg-stone-100">
          <img 
            src={crop.imageUrl} 
            alt={crop.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-md">
            {crop.category}
          </div>
        </div>

        <div className="md:col-span-2 p-6 sm:p-8 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight font-serif">
                {getCropTitle()}
              </h1>
              {language !== 'en' && (
                <span className="text-lg text-stone-400 font-normal">
                  ({crop.name})
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
              {crop.description}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-stone-100 text-xs">
            <div>
              <span className="text-stone-400 uppercase font-bold text-[10px] block">Season</span>
              <span className="font-semibold text-stone-800">{crop.season}</span>
            </div>
            <div>
              <span className="text-stone-400 uppercase font-bold text-[10px] block">Primary Variety</span>
              <span className="font-semibold text-stone-800">{crop.defaultVariety}</span>
            </div>
            <div>
              <span className="text-stone-400 uppercase font-bold text-[10px] block">Central MSP</span>
              <span className="font-semibold text-emerald-800">
                {crop.msp ? formatPrice(crop.msp) : 'Market Driven'}
              </span>
            </div>
            <div>
              <span className="text-stone-400 uppercase font-bold text-[10px] block">Active Mandis</span>
              <span className="font-semibold text-stone-800">{cropRecords.length} Yards Reporting</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
            Top Paying Mandi Today
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-[#176B35] font-mono mt-1">
            {formatPrice(highestRate)}
          </div>
          <p className="text-xs text-stone-600 font-medium mt-1">
            {bestMandi ? `${bestMandi.mandiName} (${bestMandi.state})` : 'N/A'}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
            Lowest Mandi Today
          </span>
          <div className="text-xl sm:text-2xl font-bold text-stone-700 font-mono mt-1">
            {formatPrice(lowestRate)}
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Baseline local floor price
          </p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
            Current Price Spread
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-stone-900 font-mono mt-1">
            {formatPrice(highestRate - lowestRate)}
          </div>
          <p className="text-xs text-emerald-700 font-semibold mt-1">
            Arbitrage potential between mandis
          </p>
        </div>
      </div>

      {/* Historical Trend Chart Section */}
      <div className="bg-white rounded-xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div>
            <h3 className="font-bold text-base text-stone-900">
              {crop.name} Price Movement Over Time ({unitLabel})
            </h3>
            <p className="text-xs text-stone-500">
              Daily modal benchmark prices recorded across agricultural mandis
            </p>
          </div>

          <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs font-semibold">
            <button
              onClick={() => setTimeRange('7')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                timeRange === '7' ? 'bg-[#176B35] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('30')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                timeRange === '30' ? 'bg-[#176B35] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange('90')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                timeRange === '90' ? 'bg-[#176B35] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              90 Days
            </button>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartHistory} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="displayDate" 
                tick={{ fill: '#475569', fontSize: 11 }}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis 
                tick={{ fill: '#475569', fontSize: 11 }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickFormatter={(val) => `₹${val}`}
                domain={['dataMin - 50', 'dataMax + 50']}
              />
              <Tooltip 
                formatter={(val: any) => [`₹${val}`, 'Modal Rate']}
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line 
                type="monotone" 
                dataKey="chartModal" 
                name="Modal Price" 
                stroke="#176B35" 
                strokeWidth={2.5}
                dot={timeRange === '7'}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Available Mandi Rates for this Crop Table */}
      <div className="bg-white rounded-xl border border-stone-200/90 shadow-xs overflow-hidden space-y-2">
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <h3 className="font-bold text-sm text-stone-900">
            Today's Mandi Rates for {crop.name}
          </h3>
          <button
            onClick={() => navigate('/compare')}
            className="text-xs font-bold text-[#176B35] hover:underline"
          >
            Compare These Mandis →
          </button>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 uppercase font-bold">
                <th className="py-3 px-4">Mandi Yard</th>
                <th className="py-3 px-3">State / District</th>
                <th className="py-3 px-3">Variety / Grade</th>
                <th className="py-3 px-3 text-right">Min Rate</th>
                <th className="py-3 px-3 text-right">Max Rate</th>
                <th className="py-3 px-4 text-right font-bold text-[#176B35]">Modal Rate</th>
                <th className="py-3 px-3 text-right">Arrivals</th>
                <th className="py-3 px-3">Last Updated</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {cropRecords.map((r) => (
                <tr key={r.id} className="hover:bg-emerald-50/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-stone-900">
                    <button
                      onClick={() => navigate(`/markets/${r.mandiId}`)}
                      className="hover:text-[#176B35] text-left"
                    >
                      {r.mandiName}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-stone-600">
                    {r.district}, {r.state}
                  </td>
                  <td className="py-3 px-3 text-stone-600">
                    {r.variety} · {r.qualityGrade}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-stone-600">
                    {formatPrice(r.minPrice)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-stone-600">
                    {formatPrice(r.maxPrice)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-extrabold text-[#176B35] text-sm">
                    {formatPrice(r.modalPrice)}
                  </td>
                  <td className="py-3 px-3 text-right text-stone-600 font-mono">
                    {r.arrivalsTons} T
                  </td>
                  <td className="py-3 px-3 text-stone-400 text-[11px]">
                    {r.lastUpdated}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => navigate('/compare')}
                      className="px-2 py-1 text-xs font-semibold text-[#176B35] bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
                    >
                      Compare
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

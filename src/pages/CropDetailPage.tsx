import React, { useState, useEffect, useMemo } from 'react';
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
  ChevronRight,
  Star,
  Globe
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';
import { usePriceData } from '../context/PriceDataContext';
import { useTheme } from '../context/ThemeContext';
import { CROP_HISTORY_MAP } from '../data/mockData';

export const CropDetailPage: React.FC = () => {
  const { params, navigate } = useRouter();
  const { t, language, getCropLocalizedName } = useLanguage();
  const { 
    crops, 
    records, 
    formatPrice, 
    unit, 
    unitLabel, 
    isCropInWatchlist, 
    toggleCropWatchlist,
    recordCropView 
  } = usePriceData();
  const { isDark } = useTheme();

  const cropId = params.cropId || 'tomato';
  const crop = crops.find(c => c.id === cropId) || crops[0];

  useEffect(() => {
    if (crop) {
      recordCropView(crop.id);
    }
  }, [crop?.id]);

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
  const isStarred = isCropInWatchlist(crop.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Breadcrumb & Back */}
      <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
        <button 
          onClick={() => navigate('/prices')}
          className="inline-flex items-center gap-1 hover:text-[#14532D] dark:hover:text-emerald-400 font-semibold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Prices</span>
        </button>
        <span>/</span>
        <button 
          onClick={() => navigate('/directory')}
          className="hover:text-[#14532D] dark:hover:text-emerald-400 font-semibold transition-colors"
        >
          Directory
        </button>
        <span>/</span>
        <span className="text-stone-400">{crop.category}</span>
        <span>/</span>
        <span className="text-stone-800 dark:text-white font-bold">{crop.name}</span>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3">
        <div className="h-64 md:h-auto overflow-hidden relative bg-stone-100 dark:bg-stone-800">
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
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight font-serif">
                  {getCropLocalizedName(crop)}
                </h1>
                {language !== 'en' && (
                  <span className="text-lg text-stone-400 font-normal">
                    ({crop.name})
                  </span>
                )}
              </div>

              {/* Watchlist Star Toggle */}
              <button
                onClick={() => toggleCropWatchlist(crop.id)}
                className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-semibold ${
                  isStarred 
                    ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 shadow-xs' 
                    : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100'
                }`}
              >
                <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span className="hidden sm:inline">{isStarred ? 'Starred' : 'Add to Watchlist'}</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
              {crop.description}
            </p>

            {/* Regional Language Names pill strip */}
            {crop.regionalNames && (
              <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2 overflow-x-auto custom-scrollbar text-[11px] text-stone-500 dark:text-stone-400 pb-1">
                <Globe className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                <span className="font-bold shrink-0">Regional Names:</span>
                {crop.regionalNames.hi && <span className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">हिन्दी: {crop.regionalNames.hi}</span>}
                {crop.regionalNames.kn && <span className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">ಕನ್ನಡ: {crop.regionalNames.kn}</span>}
                {crop.regionalNames.ta && <span className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">தமிழ்: {crop.regionalNames.ta}</span>}
                {crop.regionalNames.te && <span className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">తెలుగు: {crop.regionalNames.te}</span>}
                {crop.regionalNames.mr && <span className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">मराठी: {crop.regionalNames.mr}</span>}
                {crop.regionalNames.bn && <span className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">বাংলা: {crop.regionalNames.bn}</span>}
                {crop.regionalNames.gu && <span className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">ગુજરાતી: {crop.regionalNames.gu}</span>}
                {crop.regionalNames.pa && <span className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">ਪੰਜਾਬੀ: {crop.regionalNames.pa}</span>}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-stone-100 dark:border-stone-800 text-xs">
            <div>
              <span className="text-stone-400 uppercase font-bold text-[10px] block">Season</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200">{crop.season}</span>
            </div>
            <div>
              <span className="text-stone-400 uppercase font-bold text-[10px] block">Primary Variety</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200">{crop.defaultVariety}</span>
            </div>
            <div>
              <span className="text-stone-400 uppercase font-bold text-[10px] block">Central MSP</span>
              <span className="font-semibold text-emerald-800 dark:text-emerald-400">
                {crop.msp ? formatPrice(crop.msp) : 'Market Driven'}
              </span>
            </div>
            <div>
              <span className="text-stone-400 uppercase font-bold text-[10px] block">Active Mandis</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200">{cropRecords.length} Yards Reporting</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
            Top Paying Mandi Today
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-[#14532D] dark:text-emerald-400 font-mono mt-1">
            {formatPrice(highestRate)}
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-300 font-medium mt-1">
            {bestMandi ? `${bestMandi.mandiName} (${bestMandi.state})` : 'N/A'}
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Lowest Mandi Today
          </span>
          <div className="text-xl sm:text-2xl font-bold text-stone-700 dark:text-stone-300 font-mono mt-1">
            {formatPrice(lowestRate)}
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Baseline local floor price
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Current Price Spread
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white font-mono mt-1">
            {formatPrice(highestRate - lowestRate)}
          </div>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mt-1">
            Arbitrage potential between mandis
          </p>
        </div>
      </div>

      {/* Historical Trend Chart Section */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-3">
          <div>
            <h3 className="font-bold text-base text-stone-900 dark:text-white">
              {crop.name} Price Movement Over Time ({unitLabel})
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Daily modal benchmark prices recorded across agricultural mandis
            </p>
          </div>

          <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-lg border border-stone-200 dark:border-stone-700 text-xs font-semibold">
            <button
              onClick={() => setTimeRange('7')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                timeRange === '7' ? 'bg-[#14532D] text-white shadow-xs' : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('30')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                timeRange === '30' ? 'bg-[#14532D] text-white shadow-xs' : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange('90')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                timeRange === '90' ? 'bg-[#14532D] text-white shadow-xs' : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
              }`}
            >
              90 Days
            </button>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartHistory} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1C5436' : '#f1f5f9'} />
              <XAxis 
                dataKey="displayDate" 
                tick={{ fill: isDark ? '#94A3B8' : '#475569', fontSize: 11 }}
                axisLine={{ stroke: isDark ? '#1C5436' : '#cbd5e1' }}
              />
              <YAxis 
                tick={{ fill: isDark ? '#94A3B8' : '#475569', fontSize: 11 }}
                axisLine={{ stroke: isDark ? '#1C5436' : '#cbd5e1' }}
                tickFormatter={(val) => `₹${val}`}
                domain={['dataMin - 50', 'dataMax + 50']}
              />
              <Tooltip 
                formatter={(val: any) => [`₹${val}`, 'Modal Rate']}
                contentStyle={{ 
                  backgroundColor: isDark ? '#0E2E1D' : '#ffffff', 
                  color: isDark ? '#F2FDF5' : '#1C1917',
                  borderRadius: '8px', 
                  border: isDark ? '1px solid #1C5436' : '1px solid #e2e8f0', 
                  fontSize: '12px' 
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line 
                type="monotone" 
                dataKey="chartModal" 
                name="Modal Price" 
                stroke="#22A447" 
                strokeWidth={2.5}
                dot={timeRange === '7'}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Available Mandi Rates for this Crop Table */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-xs overflow-hidden space-y-2">
        <div className="p-4 bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <h3 className="font-bold text-sm text-stone-900 dark:text-white">
            Today's Mandi Rates for {crop.name}
          </h3>
          <button
            onClick={() => navigate('/compare')}
            className="text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline"
          >
            Compare These Mandis →
          </button>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 uppercase font-bold">
                <th className="py-3 px-4">Mandi Yard</th>
                <th className="py-3 px-3">State / District</th>
                <th className="py-3 px-3">Variety / Grade</th>
                <th className="py-3 px-3 text-right">Min Rate</th>
                <th className="py-3 px-3 text-right">Max Rate</th>
                <th className="py-3 px-4 text-right font-bold text-[#14532D] dark:text-emerald-400">Modal Rate</th>
                <th className="py-3 px-3 text-right">Arrivals</th>
                <th className="py-3 px-3">Last Updated</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {cropRecords.map((r) => (
                <tr key={r.id} className="hover:bg-emerald-50/30 dark:hover:bg-emerald-950/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-stone-900 dark:text-white">
                    <button
                      onClick={() => navigate(`/markets/${r.mandiId}`)}
                      className="hover:text-emerald-700 dark:hover:text-emerald-400 text-left"
                    >
                      {r.mandiName}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-stone-600 dark:text-stone-300">
                    {r.district}, {r.state}
                  </td>
                  <td className="py-3 px-3 text-stone-600 dark:text-stone-300">
                    {r.variety} · {r.qualityGrade}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-stone-600 dark:text-stone-300">
                    {formatPrice(r.minPrice)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-stone-600 dark:text-stone-300">
                    {formatPrice(r.maxPrice)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-extrabold text-[#14532D] dark:text-emerald-400 text-sm">
                    {formatPrice(r.modalPrice)}
                  </td>
                  <td className="py-3 px-3 text-right text-stone-600 dark:text-stone-300 font-mono">
                    {r.arrivalsTons} T
                  </td>
                  <td className="py-3 px-3 text-stone-400 text-[11px]">
                    {r.lastUpdated}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => navigate('/compare')}
                      className="px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 rounded-md transition-colors border border-emerald-200 dark:border-emerald-800"
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

import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { 
  TrendingUp, 
  Calendar, 
  Layers, 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity,
  Info,
  Scale
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';
import { usePriceData } from '../context/PriceDataContext';
import { CROP_HISTORY_MAP } from '../data/mockData';

export const TrendsPage: React.FC = () => {
  const { navigate } = useRouter();
  const { t, language } = useLanguage();
  const { crops, formatPrice, unit, unitLabel } = usePriceData();

  const [selectedCropId, setSelectedCropId] = useState<string>('tomato');
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90'>('30');
  const [chartType, setChartType] = useState<'line' | 'band'>('band');

  const selectedCrop = crops.find(c => c.id === selectedCropId) || crops[0];

  // Retrieve historical dataset for this crop
  const rawHistory = CROP_HISTORY_MAP[selectedCropId] || [];

  // Filter by time range
  const displayHistory = useMemo(() => {
    const days = parseInt(timeRange, 10);
    const slice = rawHistory.slice(rawHistory.length - days);

    return slice.map((pt) => {
      const modal = unit === 'kg' ? pt.modalPrice / 100 : pt.modalPrice;
      const min = unit === 'kg' ? pt.minPrice / 100 : pt.minPrice;
      const max = unit === 'kg' ? pt.maxPrice / 100 : pt.maxPrice;

      return {
        ...pt,
        chartModal: modal,
        chartMin: min,
        chartMax: max,
      };
    });
  }, [rawHistory, timeRange, unit]);

  // Summary statistics
  const stats = useMemo(() => {
    if (displayHistory.length === 0) return { min: 0, max: 0, avg: 0, change: 0, changePct: 0 };
    const modals = displayHistory.map(h => h.modalPrice);
    const minVal = Math.min(...modals);
    const maxVal = Math.max(...modals);
    const avgVal = Math.round(modals.reduce((a, b) => a + b, 0) / modals.length);
    const firstVal = modals[0];
    const lastVal = modals[modals.length - 1];
    const change = lastVal - firstVal;
    const changePct = ((change / firstVal) * 100).toFixed(1);

    return { min: minVal, max: maxVal, avg: avgVal, change, changePct };
  }, [displayHistory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Title */}
      <div className="border-b border-stone-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#176B35]">
          <TrendingUp className="w-4 h-4" />
          <span>Longitudinal Market Analysis</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
          {t('trendsTitle', 'Historical Price Trends')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          {t('trendsSubtitle', 'Interactive Recharts analysis tracking commodity price movements and seasonal cycles.')}
        </p>
      </div>

      {/* Control Bar: Crop Selector, Timeframe, Chart Switcher */}
      <div className="bg-white rounded-xl border border-stone-200/90 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Crop Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
            Commodity:
          </label>
          <select
            value={selectedCropId}
            onChange={(e) => setSelectedCropId(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg font-bold text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
          >
            {crops.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {language !== 'en' ? `(${language === 'hi' ? c.hindiName : c.teluguName})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* View Options: 7D, 30D, 90D & Chart Style */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Time range tabs */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs font-semibold">
            <button
              onClick={() => setTimeRange('7')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                timeRange === '7' ? 'bg-[#176B35] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t('view7Days', '7 Days')}
            </button>
            <button
              onClick={() => setTimeRange('30')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                timeRange === '30' ? 'bg-[#176B35] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t('view30Days', '30 Days')}
            </button>
            <button
              onClick={() => setTimeRange('90')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                timeRange === '90' ? 'bg-[#176B35] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t('view90Days', '90 Days')}
            </button>
          </div>

          {/* Chart Style Toggle */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs font-semibold">
            <button
              onClick={() => setChartType('band')}
              className={`px-2.5 py-1.5 rounded-md transition-colors ${
                chartType === 'band' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Show price range envelope"
            >
              Range Band
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-2.5 py-1.5 rounded-md transition-colors ${
                chartType === 'line' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Show simple line"
            >
              Trend Line
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
            Average Modal Price
          </span>
          <div className="text-xl font-extrabold text-[#176B35] font-mono mt-1">
            {formatPrice(stats.avg)}
          </div>
          <p className="text-[11px] text-stone-400 mt-0.5">
            Over selected {timeRange} days
          </p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
            Highest Price Point
          </span>
          <div className="text-xl font-bold text-stone-800 font-mono mt-1">
            {formatPrice(stats.max)}
          </div>
          <p className="text-[11px] text-stone-400 mt-0.5">
            Peak historical rate
          </p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
            Lowest Price Point
          </span>
          <div className="text-xl font-bold text-stone-800 font-mono mt-1">
            {formatPrice(stats.min)}
          </div>
          <p className="text-[11px] text-stone-400 mt-0.5">
            Valley historical rate
          </p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
            Period Trajectory
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <div className={`text-xl font-extrabold font-mono ${
              stats.change >= 0 ? 'text-emerald-700' : 'text-red-600'
            }`}>
              {stats.change >= 0 ? `+${stats.changePct}%` : `${stats.changePct}%`}
            </div>
            {stats.change >= 0 ? (
              <ArrowUpRight className="w-5 h-5 text-emerald-700" />
            ) : (
              <ArrowDownRight className="w-5 h-5 text-red-600" />
            )}
          </div>
          <p className="text-[11px] text-stone-400 mt-0.5">
            Net change: {stats.change >= 0 ? '+' : ''}{formatPrice(stats.change)}
          </p>
        </div>
      </div>

      {/* Primary Historical Chart */}
      <div className="bg-white rounded-xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h3 className="font-bold text-base text-stone-900">
              {selectedCrop.name} Daily Price Trajectory ({unitLabel})
            </h3>
            <p className="text-xs text-stone-500">
              Tracking modal rates with daily APMC minimum and maximum range bands
            </p>
          </div>
        </div>

        {displayHistory.length > 0 ? (
          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'band' ? (
                <AreaChart data={displayHistory} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorModal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#176B35" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#176B35" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
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
                    domain={['dataMin - 100', 'dataMax + 100']}
                  />
                  <Tooltip 
                    formatter={(val: any) => [`₹${val}`, 'Rate']}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Area 
                    type="monotone" 
                    dataKey="chartMax" 
                    name={t('maxPriceLabel', 'Max Price')} 
                    stroke="#94a3b8" 
                    strokeDasharray="4 4"
                    fill="none" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="chartModal" 
                    name={t('modalPriceLabel', 'Modal Price')} 
                    stroke="#176B35" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorModal)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="chartMin" 
                    name={t('minPriceLabel', 'Min Price')} 
                    stroke="#cbd5e1" 
                    strokeDasharray="4 4"
                    fill="none" 
                  />
                </AreaChart>
              ) : (
                <LineChart data={displayHistory} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
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
                    domain={['dataMin - 100', 'dataMax + 100']}
                  />
                  <Tooltip 
                    formatter={(val: any) => [`₹${val}`, 'Rate']}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="chartModal" 
                    name={t('modalPriceLabel', 'Modal Price')} 
                    stroke="#176B35" 
                    strokeWidth={2.5}
                    dot={timeRange === '7'}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="chartMax" 
                    name={t('maxPriceLabel', 'Max Price')} 
                    stroke="#2563eb" 
                    strokeWidth={1.5}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="chartMin" 
                    name={t('minPriceLabel', 'Min Price')} 
                    stroke="#d97706" 
                    strokeWidth={1.5}
                    dot={false}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="py-16 text-center text-stone-500 text-xs">
            Historical price records for this selection are currently unavailable.
          </div>
        )}
      </div>

      {/* Arrival Volumes Chart */}
      <div className="bg-white rounded-xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="border-b border-stone-100 pb-3">
          <h3 className="font-bold text-base text-stone-900">
            Market Arrival Volumes (Metric Tonnes)
          </h3>
          <p className="text-xs text-stone-500">
            Higher mandi arrivals often lead to softening prices; tracking supply patterns helps forecast price dips.
          </p>
        </div>

        <div className="h-56 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={displayHistory} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="displayDate" 
                tick={{ fill: '#475569', fontSize: 11 }}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis 
                tick={{ fill: '#475569', fontSize: 11 }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickFormatter={(val) => `${val}T`}
              />
              <Tooltip 
                formatter={(val: any) => [`${val} Tonnes`, 'Daily Arrival']}
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Bar dataKey="arrivalsTons" name="Arrivals (Tonnes)" fill="#0d9488" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

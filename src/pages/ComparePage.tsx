import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  Scale, 
  Check, 
  ArrowRight, 
  ArrowUpDown, 
  TrendingUp, 
  TrendingDown, 
  MapPin, 
  Truck,
  Sparkles
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';
import { usePriceData } from '../context/PriceDataContext';
import { TransportationCalculator } from '../components/TransportationCalculator';
import { MarketPriceRecord } from '../types';

export const ComparePage: React.FC = () => {
  const { navigate } = useRouter();
  const { t, language } = useLanguage();
  const { records, crops, formatPrice, unit, unitLabel } = usePriceData();

  // Selected crop for comparison
  const [selectedCropId, setSelectedCropId] = useState<string>('tomato');

  // Find all market records for this crop
  const cropRecords = useMemo(() => {
    return records.filter(r => r.cropId === selectedCropId);
  }, [records, selectedCropId]);

  // Selected mandi record IDs (2 to 4 mandis)
  const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>(() => {
    const initial = cropRecords.slice(0, 3).map(r => r.id);
    return initial;
  });

  // When crop changes, update selection to that crop's mandis
  const handleCropChange = (cropId: string) => {
    setSelectedCropId(cropId);
    const newCropRecs = records.filter(r => r.cropId === cropId);
    setSelectedRecordIds(newCropRecs.slice(0, 3).map(r => r.id));
  };

  const toggleRecordSelection = (id: string) => {
    if (selectedRecordIds.includes(id)) {
      if (selectedRecordIds.length <= 2) {
        // keep at least 2 for comparison
        return;
      }
      setSelectedRecordIds(prev => prev.filter(item => item !== id));
    } else {
      if (selectedRecordIds.length >= 4) {
        // replace last
        setSelectedRecordIds(prev => [...prev.slice(0, 3), id]);
      } else {
        setSelectedRecordIds(prev => [...prev, id]);
      }
    }
  };

  const activeRecords = useMemo(() => {
    return cropRecords.filter(r => selectedRecordIds.includes(r.id));
  }, [cropRecords, selectedRecordIds]);

  const selectedCrop = crops.find(c => c.id === selectedCropId) || crops[0];

  // Highest and lowest modal prices in comparison set
  const modalPrices = activeRecords.map(r => r.modalPrice);
  const highestPrice = modalPrices.length > 0 ? Math.max(...modalPrices) : 0;
  const lowestPrice = modalPrices.length > 0 ? Math.min(...modalPrices) : 0;
  const spreadDiff = highestPrice - lowestPrice;

  // Chart dataset
  const chartData = useMemo(() => {
    return activeRecords.map((r) => {
      const minVal = unit === 'kg' ? r.minPrice / 100 : r.minPrice;
      const maxVal = unit === 'kg' ? r.maxPrice / 100 : r.maxPrice;
      const modalVal = unit === 'kg' ? r.modalPrice / 100 : r.modalPrice;

      return {
        name: r.mandiName.replace(' APMC', '').replace(' Mandi', ''),
        fullName: r.mandiName,
        state: r.state,
        minPrice: minVal,
        modalPrice: modalVal,
        maxPrice: maxVal,
      };
    });
  }, [activeRecords, unit]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Title & Introduction */}
      <div className="border-b border-stone-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#176B35]">
          <Scale className="w-4 h-4" />
          <span>Inter-Mandi Arbitrage & Price Spread</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
          {t('compareTitle', 'Compare Mandi Prices')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          {t('compareSubtitle', 'Select a crop and compare real-time prices across multiple agricultural market yards.')}
        </p>
      </div>

      {/* Crop Selector Tabs / Dropdown */}
      <div className="bg-white rounded-xl border border-stone-200/90 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
              {t('selectCropToCompare', 'Select Crop to Compare')}
            </label>
            <p className="text-xs text-stone-400">
              Comparing rates for {selectedCrop.name} ({selectedCrop.category})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCropId}
              onChange={(e) => handleCropChange(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg font-bold text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
            >
              {crops.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {language !== 'en' ? `(${language === 'hi' ? c.hindiName : c.teluguName})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mandi Selection Chips (Pick 2 to 4) */}
        <div>
          <span className="block text-xs font-semibold text-stone-600 mb-2">
            Available Mandis for {selectedCrop.name} (Pick 2 to 4 to compare):
          </span>
          <div className="flex flex-wrap gap-2">
            {cropRecords.map((rec) => {
              const isSelected = selectedRecordIds.includes(rec.id);
              return (
                <button
                  key={rec.id}
                  onClick={() => toggleRecordSelection(rec.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-50 border-[#2E8B45] text-[#176B35] shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] ${
                    isSelected ? 'bg-[#176B35] text-white' : 'border border-stone-300'
                  }`}>
                    {isSelected && <Check className="w-2.5 h-2.5" />}
                  </div>
                  <span>{rec.mandiName}</span>
                  <span className="font-mono text-[11px] text-stone-500">
                    ({formatPrice(rec.modalPrice)})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Comparison Highlights Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
            Highest Modal Rate
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-[#176B35] font-mono mt-1">
            {formatPrice(highestPrice)}
          </div>
          <p className="text-[11px] text-stone-400 mt-0.5">
            Best selling yard in selection
          </p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
            Lowest Modal Rate
          </span>
          <div className="text-xl sm:text-2xl font-bold text-stone-700 font-mono mt-1">
            {formatPrice(lowestPrice)}
          </div>
          <p className="text-[11px] text-stone-400 mt-0.5">
            Baseline local rate
          </p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
            Inter-Mandi Price Spread
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 font-mono mt-1">
            {formatPrice(spreadDiff)}
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">
            Gross arbitrage spread per {unit === 'kg' ? 'kg' : 'quintal'}
          </p>
        </div>
      </div>

      {/* Recharts Bar Chart Comparison */}
      <div className="bg-white rounded-xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h3 className="font-bold text-base text-stone-900">
              Modal vs Min vs Max Price Comparison ({unitLabel})
            </h3>
            <p className="text-xs text-stone-500">
              Visualizing price brackets across selected mandis for {selectedCrop.name}
            </p>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#475569', fontSize: 12 }} 
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis 
                tick={{ fill: '#475569', fontSize: 11 }} 
                axisLine={{ stroke: '#cbd5e1' }}
                tickFormatter={(val) => `₹${val}`}
              />
              <Tooltip 
                formatter={(val: any) => [`₹${val}`, 'Rate']}
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="minPrice" name="Min Price" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="modalPrice" name="Modal Price" fill="#176B35" radius={[4, 4, 0, 0]} />
              <Bar dataKey="maxPrice" name="Max Price" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Side-by-Side Comparison Table */}
      <div className="bg-white rounded-xl border border-stone-200/90 shadow-xs overflow-hidden">
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <h3 className="font-bold text-sm text-stone-900">
            Side-by-Side Mandi Breakdown Table
          </h3>
          <span className="text-xs text-stone-500">
            {activeRecords.length} mandis selected
          </span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Market Yard</th>
                <th className="py-3 px-3">State / District</th>
                <th className="py-3 px-3">Variety & Grade</th>
                <th className="py-3 px-3 text-right">Min Rate</th>
                <th className="py-3 px-3 text-right">Max Rate</th>
                <th className="py-3 px-4 text-right font-bold text-[#176B35]">Modal Rate</th>
                <th className="py-3 px-3 text-right">Spread vs Best</th>
                <th className="py-3 px-3 text-stone-400">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {activeRecords.map((r) => {
                const diffFromBest = highestPrice - r.modalPrice;
                const isBest = r.modalPrice === highestPrice;

                return (
                  <tr key={r.id} className="hover:bg-stone-50">
                    <td className="py-3.5 px-4 font-bold text-stone-900">
                      <div className="flex items-center gap-1.5">
                        <span>{r.mandiName}</span>
                        {isBest && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-100 text-[#176B35] rounded">
                            Top Rate
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-stone-600">
                      {r.district}, {r.state}
                    </td>
                    <td className="py-3.5 px-3 text-stone-600">
                      {r.variety} · {r.qualityGrade}
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
                    <td className="py-3.5 px-3 text-right font-mono text-xs">
                      {isBest ? (
                        <span className="text-emerald-700 font-bold">Highest</span>
                      ) : (
                        <span className="text-stone-500">-{formatPrice(diffFromBest)}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-stone-400 text-[11px]">
                      {r.marketDate}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Integrated Transportation & Net Proceeds Calculator */}
      <section className="space-y-4">
        <div className="border-b border-stone-200 pb-3">
          <h3 className="text-xl font-bold text-stone-900">
            {t('transportCalculatorTitle', 'Transportation & Net Return Calculator')}
          </h3>
          <p className="text-xs text-stone-500">
            Plug in your truck freight and distance to check if moving produce to a higher-paying mandi yields higher net profit.
          </p>
        </div>

        <TransportationCalculator
          mandiAName={activeRecords[0] ? activeRecords[0].mandiName : 'Nearby Yard'}
          mandiAPrice={activeRecords[0] ? activeRecords[0].modalPrice : 2100}
          mandiBName={activeRecords[1] ? activeRecords[1].mandiName : 'Distant Terminal Yard'}
          mandiBPrice={activeRecords[1] ? activeRecords[1].modalPrice : 2450}
          cropName={selectedCrop.name}
        />
      </section>
    </div>
  );
};

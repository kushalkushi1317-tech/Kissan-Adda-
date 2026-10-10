import React, { useState } from 'react';
import { Truck, Calculator, ArrowRight, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePriceData } from '../context/PriceDataContext';

interface Props {
  mandiAName?: string;
  mandiAPrice?: number;
  mandiBName?: string;
  mandiBPrice?: number;
  cropName?: string;
}

export const TransportationCalculator: React.FC<Props> = ({
  mandiAName = 'Local Mandi (Yard A)',
  mandiAPrice = 2200,
  mandiBName = 'Distant APMC (Yard B)',
  mandiBPrice = 2550,
  cropName = 'Produce',
}) => {
  const { t } = useLanguage();
  const { formatPrice, unit } = usePriceData();

  // Inputs
  const [loadQuintals, setLoadQuintals] = useState<number>(40); // 40 quintals = 4 tonnes (Eicher/Pick-up)
  const [distA, setDistA] = useState<number>(25); // 25 km
  const [distB, setDistB] = useState<number>(95); // 95 km
  const [freightRatePerKm, setFreightRatePerKm] = useState<number>(22); // ₹22/km
  const [cessAndHandlingPerQtl, setCessAndHandlingPerQtl] = useState<number>(30); // ₹30/qtl loading & toll

  // Calculations for Mandi A
  const grossA = loadQuintals * mandiAPrice;
  const transportCostA = distA * freightRatePerKm * 2; // Round trip vehicle booking
  const handlingCostA = loadQuintals * cessAndHandlingPerQtl;
  const totalCostA = transportCostA + handlingCostA;
  const netEarningsA = grossA - totalCostA;
  const netPerQtlA = loadQuintals > 0 ? netEarningsA / loadQuintals : 0;

  // Calculations for Mandi B
  const grossB = loadQuintals * mandiBPrice;
  const transportCostB = distB * freightRatePerKm * 2; // Round trip vehicle booking
  const handlingCostB = loadQuintals * cessAndHandlingPerQtl;
  const totalCostB = transportCostB + handlingCostB;
  const netEarningsB = grossB - totalCostB;
  const netPerQtlB = loadQuintals > 0 ? netEarningsB / loadQuintals : 0;

  const netDiff = netEarningsB - netEarningsA;
  const isWorthTraveling = netDiff > 0;

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-[#14532D] to-[#22A447] text-white p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
            <Truck className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight">
              {t('transportCalculatorTitle', 'Transportation & Net Return Calculator')}
            </h3>
            <p className="text-xs text-emerald-100/90">
              Calculate whether traveling to a higher-paying mandi covers transport expenses for {cropName}.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              {t('loadQuintals', 'Cargo Load (Quintals)')}
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="500"
                value={loadQuintals}
                onChange={(e) => setLoadQuintals(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-[#22A447] focus:outline-hidden text-stone-900 dark:text-white"
              />
              <span className="absolute right-3 top-2.5 text-xs text-stone-400 font-medium">
                Qtl ({loadQuintals * 100} kg)
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              {t('freightRate', 'Freight Cost per km (₹)')}
            </label>
            <div className="relative">
              <input
                type="number"
                min="5"
                max="150"
                value={freightRatePerKm}
                onChange={(e) => setFreightRatePerKm(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-[#22A447] focus:outline-hidden text-stone-900 dark:text-white"
              />
              <span className="absolute right-3 top-2.5 text-xs text-stone-400 font-medium">₹/km</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Distance to {mandiAName.split(' ')[0]} (km)
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="1000"
                value={distA}
                onChange={(e) => setDistA(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-[#22A447] focus:outline-hidden text-stone-900 dark:text-white"
              />
              <span className="absolute right-3 top-2.5 text-xs text-stone-400 font-medium">km</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Distance to {mandiBName.split(' ')[0]} (km)
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="1000"
                value={distB}
                onChange={(e) => setDistB(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-[#22A447] focus:outline-hidden text-stone-900 dark:text-white"
              />
              <span className="absolute right-3 top-2.5 text-xs text-stone-400 font-medium">km</span>
            </div>
          </div>
        </div>

        {/* Comparison Result Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Mandi A */}
          <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-800/60 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Option 1: Nearby Market
                </span>
                <h4 className="font-bold text-stone-900 dark:text-white text-sm mt-0.5">{mandiAName}</h4>
              </div>
              <span className="text-xs font-bold text-stone-700 dark:text-stone-200 bg-white dark:bg-stone-900 px-2 py-1 rounded border border-stone-200 dark:border-stone-700">
                Rate: {formatPrice(mandiAPrice)}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300 border-t border-stone-200/60 dark:border-stone-700 pt-2">
              <div className="flex justify-between">
                <span>Gross Value ({loadQuintals} qtl):</span>
                <span className="font-semibold text-stone-900 dark:text-white">₹{grossA.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-red-600 dark:text-red-400">
                <span>Transport & Toll ({distA * 2} km RT):</span>
                <span>- ₹{transportCostA.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-red-600 dark:text-red-400">
                <span>Handling / Cess:</span>
                <span>- ₹{handlingCostA.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-200 dark:border-stone-700 text-sm font-bold text-stone-900 dark:text-white">
                <span>Net In-Pocket Proceeds:</span>
                <span className="text-emerald-700 dark:text-emerald-400">₹{Math.round(netEarningsA).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[11px] text-stone-500 dark:text-stone-400">
                <span>Effective Net Realization:</span>
                <span className="font-semibold">₹{Math.round(netPerQtlA).toLocaleString('en-IN')}/qtl</span>
              </div>
            </div>
          </div>

          {/* Mandi B */}
          <div className="p-4 rounded-xl border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50/40 dark:bg-emerald-950/40 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Option 2: Alternative Market
                </span>
                <h4 className="font-bold text-stone-900 dark:text-white text-sm mt-0.5">{mandiBName}</h4>
              </div>
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-200 bg-white dark:bg-stone-900 px-2 py-1 rounded border border-emerald-300 dark:border-emerald-700">
                Rate: {formatPrice(mandiBPrice)}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300 border-t border-stone-200/60 dark:border-stone-700 pt-2">
              <div className="flex justify-between">
                <span>Gross Value ({loadQuintals} qtl):</span>
                <span className="font-semibold text-stone-900 dark:text-white">₹{grossB.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-red-600 dark:text-red-400">
                <span>Transport & Toll ({distB * 2} km RT):</span>
                <span>- ₹{transportCostB.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-red-600 dark:text-red-400">
                <span>Handling / Cess:</span>
                <span>- ₹{handlingCostB.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-200 dark:border-stone-700 text-sm font-bold text-stone-900 dark:text-white">
                <span>Net In-Pocket Proceeds:</span>
                <span className="text-emerald-700 dark:text-emerald-400">₹{Math.round(netEarningsB).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[11px] text-stone-500 dark:text-stone-400">
                <span>Effective Net Realization:</span>
                <span className="font-semibold">₹{Math.round(netPerQtlB).toLocaleString('en-IN')}/qtl</span>
              </div>
            </div>
          </div>
        </div>

        {/* Verdict Banner */}
        <div className={`p-4 rounded-xl flex items-start gap-3 border ${
          isWorthTraveling 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          {isWorthTraveling ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div className="text-xs leading-relaxed">
            <h5 className="font-bold text-sm mb-0.5">
              {isWorthTraveling
                ? `Profitable Arbitrage: Extra Profit of +₹${Math.round(netDiff).toLocaleString('en-IN')}`
                : `Travel Not Recommended: Higher Freight Erases Price Difference`}
            </h5>
            <p>
              {isWorthTraveling
                ? `After paying for an additional ${(distB - distA) * 2} km round-trip transport cost, taking your ${loadQuintals} quintals to ${mandiBName} earns you an extra ₹${Math.round(netDiff).toLocaleString('en-IN')} (approx ₹${Math.round(netPerQtlB - netPerQtlA)} more per quintal).`
                : `Even though ${mandiBName} quotes a higher rate, the higher transport cost exceeds the price premium by ₹${Math.round(Math.abs(netDiff)).toLocaleString('en-IN')}. Selling at ${mandiAName} is economically safer.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

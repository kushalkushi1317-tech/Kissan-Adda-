import React, { useState, useMemo } from 'react';
import { 
  Store, 
  MapPin, 
  Phone, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Search,
  Filter,
  ExternalLink,
  Scale
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';
import { usePriceData } from '../context/PriceDataContext';
import { Mandi } from '../types';

export const DavanagereMarketsSection: React.FC = () => {
  const { navigate } = useRouter();
  const { t, language } = useLanguage();
  const { davanagereMarkets, records, formatPrice } = usePriceData();

  const [selectedSubRegion, setSelectedSubRegion] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const towns = ['All', 'Davanagere', 'Harihara', 'Channagiri', 'Honnali', 'Harapanahalli', 'Jagalur'];

  const filteredMarkets = useMemo(() => {
    return davanagereMarkets.filter((m) => {
      // Town filter
      if (selectedSubRegion !== 'All' && m.city !== selectedSubRegion && m.town !== selectedSubRegion) {
        return false;
      }
      // Search filter
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase().trim();
        const matchName = m.name.toLowerCase().includes(q);
        const matchCity = m.city?.toLowerCase().includes(q) || false;
        const matchCrops = m.featuredCrops.some(c => c.toLowerCase().includes(q));
        return matchName || matchCity || matchCrops;
      }
      return true;
    });
  }, [davanagereMarkets, selectedSubRegion, searchFilter]);

  // Find latest price records for each market
  const getMarketPrices = (mandiId: string) => {
    return records.filter(r => r.mandiId === mandiId).slice(0, 3);
  };

  return (
    <section 
      id="davanagere-markets" 
      className="space-y-6 pt-4"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Karnataka APMC Network · Davanagere Region</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif text-stone-900 dark:text-white">
            {language === 'kn' ? 'ದಾವಣಗೆರೆ ಸ್ಥಳೀಯ ಮಾರುಕಟ್ಟೆಗಳು' : 'Davanagere Local Markets'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-2xl mt-1">
            Verified agricultural wholesale mandis, APMC principal yards, and regulated commodity markets across Davanagere district and surrounding border taluks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/markets')}
            className="px-3.5 py-2 text-xs font-bold rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center gap-1.5 text-stone-700 dark:text-stone-200"
          >
            <Store className="w-4 h-4 text-emerald-600" />
            <span>All Karnataka Mandis</span>
          </button>
          <button
            onClick={() => {
              navigate('/prices');
            }}
            className="px-4 py-2 text-xs font-bold rounded-xl text-white shadow-xs flex items-center gap-1.5 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--theme-primary, #14532D)' }}
          >
            <span>All Davanagere Rates</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sub-region Pills & Quick Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-50 dark:bg-stone-900/50 p-3 rounded-xl border border-stone-200 dark:border-stone-800">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <span className="text-xs font-bold text-stone-500 dark:text-stone-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Taluk / Yard:
          </span>
          {towns.map((tn) => (
            <button
              key={tn}
              onClick={() => setSelectedSubRegion(tn)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedSubRegion === tn
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700'
              }`}
            >
              {tn}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter Davanagere crops or yard..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-medium"
          />
        </div>
      </div>

      {/* 8 Market Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredMarkets.map((mandi) => {
          const prices = getMarketPrices(mandi.id);

          // Verification badge styling
          const isOfficialAPMC = mandi.verificationStatus === 'Verified Official APMC';
          const isSpecialSubYard = mandi.verificationStatus === 'Verified Special Sub-Yard';

          return (
            <div
              key={mandi.id}
              className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Status Badges */}
                <div className="flex items-center justify-between gap-1 text-[11px]">
                  <span className="font-bold text-stone-500 dark:text-stone-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{mandi.city || mandi.town}, Davanagere</span>
                  </span>

                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isOfficialAPMC 
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                      : isSpecialSubYard
                      ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                      : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                  }`}>
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{mandi.verificationStatus || 'Verified'}</span>
                  </span>
                </div>

                {/* Market Title */}
                <div>
                  <h3 className="font-extrabold text-stone-900 dark:text-white text-base group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                    {mandi.name}
                  </h3>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 line-clamp-1">
                    {mandi.address}
                  </p>
                </div>

                {/* Arrival & Yard Stats */}
                <div className="grid grid-cols-2 gap-2 p-2 bg-stone-50 dark:bg-stone-800/60 rounded-xl text-center text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-medium">Daily Arrivals</span>
                    <span className="font-bold font-mono text-stone-800 dark:text-stone-200">
                      {mandi.dailyArrivalTons.toLocaleString()} t
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block font-medium">Market Class</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 truncate block text-[11px]">
                      {mandi.marketType}
                    </span>
                  </div>
                </div>

                {/* Top Commodities & Benchmark Rates */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
                    Today's Benchmark Rates:
                  </span>
                  {prices.length > 0 ? (
                    <div className="space-y-1">
                      {prices.map((p) => (
                        <div key={p.id} className="flex items-center justify-between text-xs py-0.5 border-b border-stone-100 dark:border-stone-800">
                          <span className="font-medium text-stone-700 dark:text-stone-300 truncate max-w-[130px]">
                            {p.cropName}
                          </span>
                          <span className="font-bold font-mono text-emerald-700 dark:text-emerald-400">
                            {formatPrice(p.modalPrice)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {mandi.featuredCrops.slice(0, 4).map((fc) => (
                        <span key={fc} className="text-[10px] px-1.5 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded font-medium">
                          {fc}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Official Source Note */}
                <p className="text-[10px] text-stone-400 italic leading-tight">
                  Source: {mandi.officialSource}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2 mt-3">
                <button
                  onClick={() => navigate(`/markets/${mandi.id}`)}
                  className="flex-1 py-1.5 px-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Store className="w-3.5 h-3.5 text-stone-500" />
                  <span>Yard Profile</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/prices');
                  }}
                  className="flex-1 py-1.5 px-2 text-white text-xs font-bold rounded-lg transition-opacity hover:opacity-90 flex items-center justify-center gap-1 cursor-pointer"
                  style={{ backgroundColor: 'var(--theme-primary, #14532D)' }}
                >
                  <span>Rates</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

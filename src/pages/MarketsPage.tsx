import React, { useState, useMemo } from 'react';
import { 
  Store, 
  MapPin, 
  Phone, 
  TrendingUp, 
  ArrowRight, 
  Search, 
  Building2, 
  Wheat,
  CheckCircle2
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';
import { usePriceData } from '../context/PriceDataContext';
import { MANDIS } from '../data/mockData';

export const MarketsPage: React.FC = () => {
  const { navigate } = useRouter();
  const { t } = useLanguage();
  const { records, statesList } = usePriceData();

  const [searchMandi, setSearchMandi] = useState('');
  const [selectedState, setSelectedState] = useState('');

  const filteredMandis = useMemo(() => {
    return MANDIS.filter((m) => {
      if (searchMandi.trim()) {
        const q = searchMandi.toLowerCase();
        const matchName = m.name.toLowerCase().includes(q) || 
          m.district.toLowerCase().includes(q) || 
          m.address.toLowerCase().includes(q);
        if (!matchName) return false;
      }
      if (selectedState && m.state.toLowerCase() !== selectedState.toLowerCase()) {
        return false;
      }
      return true;
    });
  }, [searchMandi, selectedState]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#176B35]">
          <Store className="w-4 h-4" />
          <span>Agricultural Produce Market Committees (APMC)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
          {t('navMarkets', 'Market Directory')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Explore principal agricultural wholesale yards, contact offices, daily arrival capacities, and active commodity trades.
        </p>
      </div>

      {/* Filter and Search Box */}
      <div className="bg-white rounded-xl border border-stone-200/90 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchMandi}
            onChange={(e) => setSearchMandi(e.target.value)}
            placeholder="Search mandi name, district, or address..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-[#2E8B45] focus:outline-hidden"
          />
        </div>

        <div className="sm:w-64">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="">{t('selectState', 'All States')}</option>
            {statesList.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Mandi Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMandis.map((mandi) => {
          // Count active commodities reported today
          const activeRecords = records.filter(r => r.mandiId === mandi.id);

          return (
            <div
              key={mandi.id}
              className="bg-white rounded-xl border border-stone-200/90 p-5 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      {mandi.marketType}
                    </span>
                    <h3 className="text-base font-bold text-stone-900 mt-1">
                      {mandi.name}
                    </h3>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-stone-100 text-[#176B35] flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex items-start gap-1.5 text-xs text-stone-600">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                  <span>{mandi.address}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-stone-600">
                  <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>Yard Office: {mandi.phone}</span>
                </div>

                <div className="pt-2 border-t border-stone-100 text-xs">
                  <span className="text-[11px] font-semibold text-stone-500 block mb-1">
                    Featured Commodities:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {mandi.featuredCrops.map(fc => (
                      <span key={fc} className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[11px]">
                        {fc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">
                    Daily Arrivals
                  </span>
                  <span className="text-xs font-bold text-stone-800 font-mono">
                    ~{mandi.dailyArrivalTons.toLocaleString('en-IN')} Tonnes
                  </span>
                </div>

                <button
                  onClick={() => navigate(`/markets/${mandi.id}`)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#176B35] hover:bg-[#12572a] text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  <span>View Yard Rates</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

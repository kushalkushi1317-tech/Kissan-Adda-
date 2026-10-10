import React from 'react';
import { Star, X, ExternalLink, ArrowRight, Store, Wheat } from 'lucide-react';
import { usePriceData } from '../context/PriceDataContext';
import { useLanguage } from '../context/LanguageContext';
import { useRouter } from '../context/RouterContext';

interface WatchlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WatchlistModal: React.FC<WatchlistModalProps> = ({ isOpen, onClose }) => {
  const { 
    crops, 
    mandis, 
    records, 
    watchlist, 
    toggleCropWatchlist, 
    toggleMandiWatchlist,
    formatPrice 
  } = usePriceData();
  const { t, getCropLocalizedName } = useLanguage();
  const { navigate } = useRouter();

  if (!isOpen) return null;

  const watchedCrops = crops.filter(c => watchlist.cropIds.includes(c.id));
  const watchedMandis = mandis.filter(m => watchlist.mandiIds.includes(m.id));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/70 dark:bg-stone-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <Star className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900 dark:text-white">
                {t('navWatchlist', 'My Watchlist')}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Quick access to your saved crops and favorite mandi yards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 custom-scrollbar">
          {/* Watched Crops */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                <Wheat className="w-3.5 h-3.5 text-emerald-600" />
                <span>Starred Crops ({watchedCrops.length})</span>
              </span>
            </div>

            {watchedCrops.length > 0 ? (
              <div className="space-y-2">
                {watchedCrops.map((c) => {
                  const cropRecs = records.filter(r => r.cropId === c.id);
                  const benchmarkPrice = cropRecs.length > 0 ? cropRecs[0].modalPrice : null;

                  return (
                    <div
                      key={c.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 hover:border-emerald-500 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={c.imageUrl} 
                          alt={c.name} 
                          className="w-10 h-10 rounded-lg object-cover" 
                        />
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-white">
                            {getCropLocalizedName(c)}
                          </h4>
                          <span className="text-[11px] text-stone-500 dark:text-stone-400">
                            {c.name} · {c.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {benchmarkPrice && (
                          <div className="text-right">
                            <span className="text-[10px] text-stone-400 uppercase font-bold block">Modal</span>
                            <span className="font-mono font-extrabold text-xs sm:text-sm text-emerald-700 dark:text-emerald-400">
                              {formatPrice(benchmarkPrice)}
                            </span>
                          </div>
                        )}

                        <button
                          onClick={() => {
                            navigate(`/crops/${c.id}`);
                            onClose();
                          }}
                          className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100"
                          title="View Crop Details"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => toggleCropWatchlist(c.id)}
                          className="p-1 text-amber-500 hover:text-stone-400"
                          title="Remove from watchlist"
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 text-center text-stone-400 text-xs bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-dashed border-stone-200 dark:border-stone-700">
                No crops starred yet. Click the star icon on any crop card to save it here!
              </div>
            )}
          </div>

          {/* Watched Mandis */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-emerald-600" />
                <span>Saved Mandis ({watchedMandis.length})</span>
              </span>
            </div>

            {watchedMandis.length > 0 ? (
              <div className="space-y-2">
                {watchedMandis.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 hover:border-emerald-500 transition-colors"
                  >
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-white">
                        {m.name}
                      </h4>
                      <span className="text-[11px] text-stone-500 dark:text-stone-400">
                        {m.district}, {m.state}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          navigate(`/markets/${m.id}`);
                          onClose();
                        }}
                        className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100"
                        title="View Mandi Yard"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => toggleMandiWatchlist(m.id)}
                        className="p-1 text-amber-500 hover:text-stone-400"
                        title="Remove from saved"
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-stone-400 text-xs bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-dashed border-stone-200 dark:border-stone-700">
                No mandis saved yet. Star a market in the directory for rapid access.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

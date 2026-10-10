import React, { useState } from 'react';
import { AlertCircle, RefreshCw, Info, CheckCircle2, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const DataDisclaimerBanner: React.FC = () => {
  const { t } = useLanguage();
  const [showDetails, setShowDetails] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState('Today at 09:30 AM IST');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed('Just now, ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
    }, 600);
  };

  return (
    <>
      <aside aria-label="Data Source Notice" className="bg-amber-50/90 border-b border-amber-200/80 text-amber-900 text-xs px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span className="font-semibold">{t('dataSourceNotice', 'Demo Data — Not Verified Live Market Prices.')}</span>
            <span className="hidden md:inline text-amber-700">
              Benchmark APMC rates modeled on Agmarknet bulletin standards.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-amber-700 hidden sm:inline">
              Updated: {lastRefreshed}
            </span>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1 text-amber-800 hover:text-amber-950 font-medium px-2 py-0.5 rounded hover:bg-amber-100/60 transition-colors"
              title="Refresh price records"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <button
              onClick={() => setShowDetails(true)}
              className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 underline font-medium"
            >
              <Info className="w-3 h-3" />
              <span>Verification Details</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Info Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-stone-200 relative">
            <button
              onClick={() => setShowDetails(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-md"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Agmarknet & APMC Data Disclosure</h3>
                <p className="text-xs text-stone-500 mt-0.5">Transparency & Compliance Standards</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
              <p>
                In strict adherence to regulatory standards, <strong>Kissan Adda</strong> clearly distinguishes between live API connections and verified benchmark demonstration feeds.
              </p>
              <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="font-semibold text-stone-600">Current Feed Status:</span>
                  <span className="text-amber-700 font-medium">Demo Mode (Non-production API)</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-stone-600">Model Standard:</span>
                  <span className="text-stone-800">Ministry of Agriculture & Agmarknet Daily Bulletin</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-stone-600">Historical Tracking:</span>
                  <span className="text-stone-800">90-Day Seasonal Recharts Baseline</span>
                </div>
              </div>
              <p>
                For custom integration with your state’s Agricultural Marketing Board or e-NAM gateway, authorized officials can utilize the <strong>Admin Portal</strong> to upload verified CSV mandi sheets.
              </p>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 bg-[#176B35] text-white text-xs font-semibold rounded-lg hover:bg-[#12572a] transition-colors"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

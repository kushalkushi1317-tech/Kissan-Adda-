import React from 'react';
import { PhoneCall, Mail, MapPin, ExternalLink, ShieldCheck, Heart } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { navigate } = useRouter();
  const { t } = useLanguage();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-14 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#176B35] to-[#2E8B45] text-white flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 fill-current text-emerald-100" viewBox="0 0 24 24">
                  <path d="M12 2C6.5 2 2 6.5 2 12c0 3.58 1.9 6.72 4.74 8.46L12 12V2zm0 10l5.26 8.46C20.1 18.72 22 15.58 22 12c0-5.5-4.5-10-10-10v10z" />
                </svg>
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight font-serif">
                KISSAN ADDA
              </span>
            </div>

            <p className="text-sm font-semibold text-emerald-400">
              “{t('mainTagline', "Know Today's Price. Sell at the Right Price.")}”
            </p>

            <p className="text-xs text-stone-400 leading-relaxed max-w-md">
              {t('secondaryTagline', 'Your Trusted Partner for Smart Farming and Better Crop Prices.')} Kissan Adda brings price transparency to India’s farmers through real-time APMC mandi price tracking, inter-market arbitrage tools, and historical commodity trends.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs text-stone-400">
              <div className="flex items-center gap-1.5 text-stone-300">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>Kisan Call Centre: <strong>1800-180-1551</strong> (Toll Free)</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-100 mb-4">
              Market Services
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => navigate('/prices')} className="hover:text-emerald-400 transition-colors">
                  {t('navPrices', 'Crop Prices')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/compare')} className="hover:text-emerald-400 transition-colors">
                  {t('navCompare', 'Compare Markets')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/trends')} className="hover:text-emerald-400 transition-colors">
                  {t('navTrends', 'Price Trends')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/markets')} className="hover:text-emerald-400 transition-colors">
                  {t('navMarkets', 'Market Directory')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/admin')} className="hover:text-emerald-400 transition-colors">
                  {t('navAdmin', 'Admin Dashboard')}
                </button>
              </li>
            </ul>
          </div>

          {/* Key APMC Hubs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-100 mb-4">
              Key APMC Hubs
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => navigate('/markets/mandi-azadpur')} className="hover:text-emerald-400 transition-colors">
                  Azadpur Mandi (Delhi)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/markets/mandi-lasalgaon')} className="hover:text-emerald-400 transition-colors">
                  Lasalgaon APMC (Nashik)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/markets/mandi-guntur')} className="hover:text-emerald-400 transition-colors">
                  Guntur Mirchi Yard (AP)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/markets/mandi-khanna')} className="hover:text-emerald-400 transition-colors">
                  Khanna Grain Mandi (Punjab)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/markets/mandi-kolar')} className="hover:text-emerald-400 transition-colors">
                  Kolar APMC Yard (Karnataka)
                </button>
              </li>
            </ul>
          </div>

          {/* About & Trust */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-100 mb-4">
              Transparency
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-emerald-400 transition-colors">
                  About Kissan Adda
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-emerald-400 transition-colors">
                  Helpline & Contact
                </button>
              </li>
              <li className="pt-2 text-[11px] text-stone-500 leading-snug">
                Data sources: APMC market bulletins, state agricultural marketing boards, and authorized e-NAM yard feeds.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & disclaimers */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Kissan Adda. Built for Indian Farmers & APMC Market Transparency.</p>
          <div className="flex items-center gap-4">
            <span className="text-stone-400">
              Prices updated daily at 09:30 AM & 02:00 PM IST
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React from 'react';
import { 
  Sprout, 
  Target, 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  Scale, 
  BookOpen, 
  CheckCircle2,
  HeartHandshake
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useLanguage } from '../context/LanguageContext';

export const AboutPage: React.FC = () => {
  const { navigate } = useRouter();
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Header */}
      <div className="border-b border-stone-200 pb-5 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#176B35]">
          <Sprout className="w-4 h-4" />
          <span>Agricultural Transparency Initiative</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight font-serif mt-1">
          About Kissan Adda
        </h1>
        <p className="text-sm sm:text-base text-stone-600 mt-2 leading-relaxed">
          Kissan Adda was founded to solve a historic problem faced by smallholder farmers across India: asymmetric price information at the farm gate.
        </p>
      </div>

      {/* Core Mission Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#176B35] flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-stone-900">
            Our Purpose
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Eliminate price exploitation and emergency distress sales by giving every farmer instant, transparent access to modal prices across nearby and terminal APMC markets.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#176B35] flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-stone-900">
            Arbitrage & Freight Realism
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            A higher headline rate in another district means nothing if road freight consumes the profit. Our integrated freight calculation models net in-hand proceeds before you travel.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#176B35] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-stone-900">
            Data Integrity
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            We follow strict reporting protocols. When utilizing simulated benchmarks for demonstration, we openly label data rather than masquerading mock feeds as live feeds.
          </p>
        </div>
      </div>

      {/* How APMC Mandis Work in India */}
      <section className="bg-white rounded-2xl border border-stone-200/90 p-8 shadow-xs space-y-6">
        <div className="border-b border-stone-100 pb-4">
          <h2 className="text-xl font-bold text-stone-900">
            Understanding APMC Mandi Mechanics
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Key concepts every producer must know before entering the wholesale auction yard
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-700 leading-relaxed">
          <div className="space-y-2 p-4 bg-stone-50 rounded-xl border border-stone-200/60">
            <h4 className="font-bold text-sm text-stone-900">1. Modal Price vs Minimum/Maximum</h4>
            <p>
              While minimum and maximum prices show the extremes of damaged or exceptional quality lots, the <strong>Modal Price</strong> represents the exact price at which the majority of transaction volume occurred on that trading day.
            </p>
          </div>

          <div className="space-y-2 p-4 bg-stone-50 rounded-xl border border-stone-200/60">
            <h4 className="font-bold text-sm text-stone-900">2. Quintal to Kilogram Conversion</h4>
            <p>
              In agricultural trade, 1 Quintal equals exactly 100 Kilograms. A mandi price of ₹2,400 per quintal equals ₹24.00 per kilogram. Use Kissan Adda's unit toggle in the top bar for instant recalculation.
            </p>
          </div>

          <div className="space-y-2 p-4 bg-stone-50 rounded-xl border border-stone-200/60">
            <h4 className="font-bold text-sm text-stone-900">3. MSP (Minimum Support Price)</h4>
            <p>
              For designated crops (like Wheat, Paddy, Cotton, Soybean, Mustard, Gram), the Government of India announces a guaranteed baseline MSP to prevent crash below cost of cultivation.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-[#176B35] to-[#2E8B45] text-white p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xl font-bold font-serif">
            Empower Your Next Harvest Sale
          </h3>
          <p className="text-xs text-emerald-100">
            Compare wholesale rates across your state and discover where your produce commands highest value.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/prices')}
            className="px-5 py-2.5 bg-white text-[#176B35] font-bold text-xs rounded-xl shadow-xs hover:bg-emerald-50 transition-colors"
          >
            Check Today's Prices
          </button>
          <button
            onClick={() => navigate('/compare')}
            className="px-5 py-2.5 bg-emerald-900/60 text-white font-semibold text-xs rounded-xl border border-white/20 hover:bg-emerald-900 transition-colors"
          >
            Compare Markets
          </button>
        </div>
      </div>
    </div>
  );
};

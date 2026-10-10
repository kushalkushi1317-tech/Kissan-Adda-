import React, { useState } from 'react';
import { 
  PhoneCall, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ContactPage: React.FC = () => {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    district: '',
    mandiName: '',
    inquiryType: 'Rate Verification',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Header */}
      <div className="border-b border-stone-200 pb-5 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#176B35]">
          <PhoneCall className="w-4 h-4" />
          <span>Farmer Helpline & Inquiries</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight font-serif mt-1">
          Contact Kissan Adda
        </h1>
        <p className="text-sm sm:text-base text-stone-600 mt-2 leading-relaxed">
          Need assistance verifying a mandi price, reporting a rate discrepancy, or connecting with local APMC market officers? We are here to support.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-4 lg:col-span-1">
          {/* Toll Free Helpline */}
          <div className="bg-gradient-to-br from-[#176B35] to-[#2E8B45] text-white rounded-xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <PhoneCall className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold text-emerald-200 tracking-wider">
                Government Toll-Free Hotline
              </span>
              <h3 className="text-2xl font-extrabold font-mono mt-0.5">
                1800-180-1551
              </h3>
              <p className="text-xs text-emerald-100 mt-1 leading-snug">
                Kisan Call Centre (KCC) — 22 Indian regional languages supported, 6:00 AM to 10:00 PM daily.
              </p>
            </div>
          </div>

          {/* Email and Support Desk */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4 text-xs text-stone-700">
            <h4 className="font-bold text-stone-900 text-sm">
              Kissan Adda Market Intelligence
            </h4>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-stone-800">Support Email</span>
                  <span className="text-stone-500">support@kissanadda.org</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-stone-800">Mandi Bulletin Updates</span>
                  <span className="text-stone-500">Daily batches: 09:30 AM & 02:00 PM IST</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-stone-800">National Liaison Office</span>
                  <span className="text-stone-500">Agricultural Complex, Pusa Institutional Area, New Delhi 110012</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Inquiry & Discrepancy Form */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200/90 p-6 sm:p-8 shadow-xs">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-stone-900">
                Message Received!
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.name}</strong>. Your feedback regarding <em>{formData.mandiName || 'mandi rates'}</em> has been logged. Our agricultural data audit team will review the details.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', phone: '', district: '', mandiName: '', inquiryType: 'Rate Verification', message: '' });
                }}
                className="px-4 py-2 bg-[#176B35] text-white text-xs font-semibold rounded-lg hover:bg-[#12572a] transition-colors"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-b border-stone-100 pb-3">
                <h3 className="text-base font-bold text-stone-900">
                  Report a Rate or Send Feedback
                </h3>
                <p className="text-xs text-stone-500">
                  Notice an outdated modal rate at your local mandi? Let us know so our team can verify and synchronize.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-[#2E8B45] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-[#2E8B45] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Inquiry Type
                  </label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData(p => ({ ...p, inquiryType: e.target.value }))}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-[#2E8B45] focus:outline-hidden text-stone-800"
                  >
                    <option value="Rate Verification">Rate Discrepancy / Update</option>
                    <option value="Missing Mandi">Request Missing Mandi</option>
                    <option value="Technical Bug">Technical Problem</option>
                    <option value="General Feedback">General Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData(p => ({ ...p, district: e.target.value }))}
                    placeholder="e.g. Nashik / Guntur"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-[#2E8B45] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Mandi Name
                  </label>
                  <input
                    type="text"
                    value={formData.mandiName}
                    onChange={(e) => setFormData(p => ({ ...p, mandiName: e.target.value }))}
                    placeholder="e.g. Lasalgaon APMC"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-[#2E8B45] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Message Details
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
                  placeholder="Describe the discrepancy, crop name, reported price, or your suggestion..."
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-[#2E8B45] focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#176B35] hover:bg-[#12572a] text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Share2, Copy, Check, Send, PhoneCall, X, FileText, Printer, Building2 } from 'lucide-react';
import { CurrencyUnit } from '../types';
import { formatCurrency, spelloutCurrency, toPersianDigits } from '../utils/numberUtils';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  calcTypeTitle: string;
  totalRial?: number;
  currency: CurrencyUnit;
  details: Array<{ label: string; value: string }>;
}

export function ShareModal({
  isOpen,
  onClose,
  title,
  calcTypeTitle,
  totalRial = 0,
  currency,
  details,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = 'https://www.notary662th.ir/calculator/';

  const priceSection = totalRial > 0 ? `💰 *مبلغ کل قابل پرداخت:* ${formatCurrency(totalRial, currency)}
🗣️ (${spelloutCurrency(totalRial, currency)})
` : '';

  // Format share text
  const formattedSummaryText = `📜 *محاسبه تعرفه دفتر اسناد رسمی ۶۶۲ تهران*
📌 *نوع سند:* ${calcTypeTitle}
──────────────────────
${(details || []).map((d) => `▫️ *${d.label}:* ${d.value}`).join('\n')}
──────────────────────
${priceSection}📍 *دفتر اسناد رسمی ۶۶۲ تهران*
👤 *سردفتر:* خانم لیلا فرج زاده
🌐 *محاسبه آنلاین و وب‌سایت:* ${currentUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedSummaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(formattedSummaryText)}`;
    window.open(url, '_blank');
  };

  const shareTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(formattedSummaryText)}`;
    window.open(url, '_blank');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 border-2 border-[#D3B574]/60 shadow-2xl space-y-5 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D3B574]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-gradient-to-br from-[#001755] to-[#002279] text-[#D3B574] rounded-2xl">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-[#002279] text-base">اشتراک‌گذاری خلاصه محاسبات</h3>
              <p className="text-xs text-slate-500 font-medium">دفتر اسناد رسمی ۶۶۲ تهران</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
            title="بستن پنجره"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Text Preview Box */}
        <div className="bg-[#FAF8F6] p-4 rounded-2xl border border-[#D3B574]/30 space-y-2 dir-rtl">
          <span className="text-xs font-bold text-[#002279] block">پیش‌نمایش متن اشتراک‌گذاری:</span>
          <textarea
            readOnly
            rows={7}
            value={formattedSummaryText}
            className="w-full bg-white border border-[#D3B574]/40 rounded-xl p-3 text-xs text-slate-800 font-medium leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-[#D3B574]"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={shareWhatsApp}
            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>واتساپ</span>
          </button>

          <button
            type="button"
            onClick={shareTelegram}
            className="w-full bg-[#0088cc] hover:bg-[#0077b3] text-white py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>تلگرام</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="w-full bg-gradient-to-r from-[#001755] to-[#002279] hover:from-[#002279] hover:to-[#001755] text-[#D3B574] border border-[#D3B574]/50 py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'کپی شد!' : 'کپی متن'}</span>
          </button>
        </div>

        {/* Bottom Close Button */}
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <X className="w-4 h-4 text-slate-500" />
            <span>بستن پنجره اشتراک‌گذاری</span>
          </button>
        </div>

      </div>
    </div>
  );
}

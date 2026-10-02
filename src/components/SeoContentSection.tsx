import React, { useState } from 'react';
import { HelpCircle, ChevronDown, BookOpen, Tag, CheckCircle2, ShieldAlert } from 'lucide-react';

export interface SeoFaqItem {
  question: string;
  answer: string;
}

export interface SeoContentSectionProps {
  title: string;
  subtitle: string;
  badge?: string;
  legalPoints: Array<{ title: string; desc: string }>;
  faqs: SeoFaqItem[];
  keywords: string[];
}

export function SeoContentSection({
  title,
  subtitle,
  badge = 'راهنمای حقوقی و ثبتی',
  legalPoints,
  faqs,
  keywords,
}: SeoContentSectionProps) {
  // State for accordion items
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Structured Data (JSON-LD) for Google FAQ Rich Snippets
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <section className="mt-10 pt-8 border-t-2 border-[#D3B574]/30 space-y-6">
      {/* Inject FAQ Schema for this specific section */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Header of SEO Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#FAF8F6] to-white p-5 rounded-3xl border border-[#D3B574]/40 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-[#001755] to-[#002279] text-[#D3B574] rounded-2xl shadow-xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#A88640] mb-0.5">
              <span>{badge}</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-[#002279]">
              {title}
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* 2-Column Responsive Layout: Legal Points + FAQs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Key Legal Notes & Insights (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <h4 className="text-xs font-black text-[#002279] flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldAlert className="w-4 h-4 text-[#D3B574]" />
              <span>نکات کلیدی محاسبات و مقررات ثبتی</span>
            </h4>

            <div className="space-y-3 text-xs">
              {legalPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-[#FAF8F6] border border-[#D3B574]/30 space-y-1"
                >
                  <span className="font-extrabold text-[#002279] block flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                    {point.title}
                  </span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {point.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Keyword badges */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                <Tag className="w-3 h-3 text-[#D3B574]" />
                مفاهیم و اصطلاحات مرتبط:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {keywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-slate-100 hover:bg-[#F5F0E6] text-slate-700 px-2.5 py-1 rounded-full font-medium transition-colors border border-slate-200"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: FAQ Accordion (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h4 className="text-xs font-black text-[#002279] flex items-center gap-2 border-b border-slate-100 pb-3">
              <HelpCircle className="w-4 h-4 text-[#D3B574]" />
              <span>پرسش‌های متداول مراجعین (FAQ)</span>
            </h4>

            <div className="space-y-2">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className={`rounded-2xl border transition-all ${
                      isOpen
                        ? 'bg-[#FAF8F6] border-[#D3B574]/60 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full text-right p-3.5 flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <span className="text-xs font-bold text-[#002279] leading-snug">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#D3B574] shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#002279]' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-3.5 pb-3.5 pt-1 text-[11px] text-slate-600 leading-relaxed border-t border-[#D3B574]/20 animate-in fade-in duration-200">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

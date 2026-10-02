import React from 'react';
import { BookOpen, Building, Landmark, Key, Users, CheckCircle, Info, Shield, HelpCircle } from 'lucide-react';
import { SeoContentSection } from './SeoContentSection';
import { SEO_DATA_MAP } from '../data/seoContentData';

export function FormulasGuide() {
  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-gradient-to-r from-[#001755] via-[#002279] to-[#001755] rounded-3xl p-6 text-white shadow-xl border border-[#D3B574]/40 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#D3B574]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#D3B574]/20 text-[#D3B574] px-3 py-1 rounded-full text-xs font-bold border border-[#D3B574]/30 mb-2">
              <BookOpen className="w-4 h-4" />
              <span>راهنمای جامع فرمول‌ها و بخشنامه‌های تعرفه</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>توضیح کامل روند فرمول‌های محاسباتی دفتر اسناد رسمی ۶۶۲</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl leading-relaxed font-medium">
              تشریح دقیق مأخذ محاسباتی حق‌التحریر، حق‌الثبت، کاداستر، ارزش افزوده، هزینه‌های استعلامی و مبانی فقهی-حقوقی تقسیم ترکه و سهم‌الارث
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-center shrink-0">
            <span className="text-[11px] text-[#D3B574] font-black block">مصوب سازمان ثبت اسناد</span>
            <span className="text-xs font-bold text-white block mt-0.5">بروزرسانی رسمی ۱۴۰۵</span>
          </div>
        </div>
      </div>

      {/* Grid of 4 Detailed Formula Cards */}
      <div className="space-y-6">

        {/* 1. Real Estate Formula (اسناد غیرمنقول و پیش‌فروش) */}
        <div className="bg-white rounded-3xl p-6 border-2 border-[#D3B574]/50 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#D3B574]/20 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#F5F0E6] text-[#002279] rounded-2xl border border-[#D3B574]/40">
                <Building className="w-6 h-6 text-[#D3B574]" />
              </div>
              <div>
                <h3 className="font-black text-[#002279] text-base">
                  ۱. فرمول محاسبه اسناد غیرمنقول و پیش‌فروش ساختمان
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  اسناد انتقال قطعی، صلح ملک، وکالت فروش غیرمنقول و پیش‌فروش
                </span>
              </div>
            </div>
            <span className="text-xs bg-[#001755] text-[#D3B574] px-3 py-1 rounded-full font-bold border border-[#D3B574]/30">
              ویژه املاک
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-700 leading-relaxed font-medium">
            <p>
              در اسناد غیرمنقول (املاک)، مأخذ محاسبه حق‌التحریر برابر با ارزش معاملاتی ملک (قیمت اعلامی سند) می‌باشد. نحوه محاسبه بخش‌های مختلف به شرح زیر است:
            </p>

            {/* Highlighted Tax Rule */}
            <div className="bg-[#F5F0E6] p-4 rounded-2xl border-2 border-[#D3B574] space-y-1.5 text-[#002279]">
              <div className="flex items-center gap-2 font-black text-sm text-[#002279]">
                <Shield className="w-4 h-4 text-[#D3B574]" />
                <span>⚠️ نکته بسیار مهم در مالیات بر ارزش افزوده اسناد غیرمنقول:</span>
              </div>
              <p className="text-xs leading-relaxed font-bold">
                در این سامانه جهت محاسبه دقیق سند غیرمنقول، مالیات بر ارزش افزوده (VAT) به صورت مستفاد <span className="underline decoration-[#D3B574] decoration-2">دقیقاً ۱۰ درصد از هزینه حق‌التحریر (هزینه تحریر)</span> محاسبه می‌گردد. این شرط و فرمول محاسباتی صرفاً مخصوص اسناد غیرمنقول تنظیم گردیده است.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-bold text-[#002279] block">الف) تعرفه حق‌التحریر:</span>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
                  <li>تا ۱۰ میلیون ریال: پایه ۴,۷۲۵,۰۰۰ ریال + ۱۱۸.۸٪ مازاد</li>
                  <li>۱۰ تا ۵۰ میلیون ریال: ۷۵.۶٪ مازاد</li>
                  <li>۵۰ تا ۱۰۰ میلیون ریال: ۲۴.۳٪ مازاد</li>
                  <li>۱۰۰ تا ۲۰۰ میلیون ریال: ۱۰.۸٪ مازاد</li>
                  <li>۲۰۰ تا ۵۰۰ میلیون ریال: ۶.۷۵٪ مازاد</li>
                  <li>۵۰۰ میلیون تا ۱ میلیارد ریال: ۳.۳۷۵٪ مازاد</li>
                  <li>مازاد بر ۱ میلیارد ریال: ۱.۳۵٪</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-bold text-[#002279] block">ب) سایر حقوق ثبتی و هزینه‌های ثابت:</span>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600">
                  <li><strong>حق الثبت (۰.۵٪):</strong> ۰.۵ درصد از مأخذ ویژه (۹٪ قیمت ملک)</li>
                  <li><strong>کاداستر (۰.۵٪):</strong> ۰.۵ درصد از مأخذ ویژه (۹٪ قیمت ملک)</li>
                  <li><strong>حق‌الزحمه سامانه الکترونیک:</strong> ۳۰۰,۰۰۰ ریال</li>
                  <li><strong>متعاملین مازاد:</strong> ۱۰۹,۰۰۰ ریال به ازای هر خریدار/فروشنده اضافی (بیش از ۱ نفر)</li>
                  <li><strong>صفحات اضافی:</strong> ۲۰۰,۰۰۰ ریال به ازای هر صفحه مازاد</li>
                  <li><strong>استعلامات:</strong> استعلام ثبت (۱,۲۶۰,۰۰۰)، دارایی (۱,۵۰۰,۰۰۰)، شهرداری (۶۰۰,۰۰۰)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Financial & Mortgage Formula (اسناد مالی و رهنی) */}
        <div className="bg-white rounded-3xl p-6 border-2 border-[#D3B574]/50 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#D3B574]/20 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#F5F0E6] text-[#002279] rounded-2xl border border-[#D3B574]/40">
                <Landmark className="w-6 h-6 text-[#D3B574]" />
              </div>
              <div>
                <h3 className="font-black text-[#002279] text-base">
                  ۲. فرمول محاسبه اسناد مالی، وام و رهن بانکی
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  اسناد رهن بانک، اقرارنامه مالی، اسناد تعهدآور و متمم‌های رهنی
                </span>
              </div>
            </div>
            <span className="text-xs bg-[#001755] text-[#D3B574] px-3 py-1 rounded-full font-bold border border-[#D3B574]/30">
              اسناد مالی
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-700 leading-relaxed font-medium">
            <p>
              مأخذ محاسبه اسناد مالی و رهنی برابر با اصل مبلغ تسهیلات و سود متعلق به آن (مبلغ مندرج در سند) است:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-bold text-[#002279] block">حق‌الثبت اسناد رهنی:</span>
                <p className="text-[11px] text-slate-600">
                  حق‌الثبت اسناد مالی دقیقاً <span className="font-bold text-[#002279]">۱ درصد (۱٪) از کل مبلغ سند</span> می‌باشد.
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-[#D3B574]/40 space-y-1">
                <span className="font-bold text-[#002279] block">ارزش افزوده و اشخاص مازاد:</span>
                <p className="text-[11px] text-slate-600">
                  مالیات ارزش افزوده ۱۰٪ از کل حق‌التحریر است. به ازای هر شخص مازاد بر ۲ نفر (راهن، مرتهن، تسهیلات‌گیرنده)، مبلغ ۲۰۰,۰۰۰ ریال به تحریر اضافه می‌گردد.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Rent Formula (اسناد اجاره) */}
        <div className="bg-white rounded-3xl p-6 border-2 border-[#D3B574]/50 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#D3B574]/20 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#F5F0E6] text-[#002279] rounded-2xl border border-[#D3B574]/40">
                <Key className="w-6 h-6 text-[#D3B574]" />
              </div>
              <div>
                <h3 className="font-black text-[#002279] text-base">
                  ۳. فرمول محاسبه اسناد اجاره‌نامه رسمی
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  اسناد اجاره املاک مسکونی، تجاری و سرقفلی
                </span>
              </div>
            </div>
            <span className="text-xs bg-[#001755] text-[#D3B574] px-3 py-1 rounded-full font-bold border border-[#D3B574]/30">
              اجاره املاک
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-700 leading-relaxed font-medium">
            <div className="bg-[#F5F0E6]/70 p-3 rounded-xl border border-[#D3B574]/40 font-bold text-[#002279] flex items-center justify-between">
              <span>مأخذ کل محاسبه اجاره:</span>
              <span className="dir-ltr text-sm font-black">
                مبلغ ودیعه (قرض‌الحسنه) + (اجاره ماهانه × تعداد ماه اجاره)
              </span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600">
              <li><strong>حق‌الثبت (۰.۵٪):</strong> نصف یک درصد از مأخذ کل اجاره.</li>
              <li><strong>کاداستر (۰.۵٪):</strong> نصف یک درصد از مأخذ کل اجاره.</li>
              <li><strong>حق‌التحریر اجاره:</strong> مطابق جدول تعرفه مصوب از پایه ۲,۶۲۷,۰۰۰ ریال.</li>
            </ul>
          </div>
        </div>

        {/* 4. Inheritance Formula (محاسبه سهم‌الارث) */}
        <div className="bg-white rounded-3xl p-6 border-2 border-[#D3B574]/50 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#D3B574]/20 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#F5F0E6] text-[#002279] rounded-2xl border border-[#D3B574]/40">
                <Users className="w-6 h-6 text-[#D3B574]" />
              </div>
              <div>
                <h3 className="font-black text-[#002279] text-base">
                  ۴. فرمول فقهی و حقوقی تقسیم ترکه و سهم‌الارث (بر اساس مخرج مشترک)
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  مطابق قانون مدنی ایران (مواد ۸۶۱ تا ۹۴۹) و قواعد حجب و مخرج مشترک
                </span>
              </div>
            </div>
            <span className="text-xs bg-[#001755] text-[#D3B574] px-3 py-1 rounded-full font-bold border border-[#D3B574]/30">
              قواعد وراثت
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-700 leading-relaxed font-medium">
            <p>
              تقسیم ترکه متوفی ابتدا بر اساس تعیین صاحبان فرض (کسرهای معین در قانون) انجام شده و مخرج مشترک (ک.م.م) کلیه سهم‌ها محاسبه می‌گردد:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-[#002279] block mb-1">سهم همسران (زوجین):</span>
                <p className="text-[11px] text-slate-600">
                  شوهر: ۱/۲ (بدون فرزند) یا ۱/۴ (با فرزند).<br/>
                  زن: ۱/۴ (بدون فرزند) یا ۱/۸ (با فرزند) از بهای منقول و اعیانی.
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-[#002279] block mb-1">سهم پدر و مادر:</span>
                <p className="text-[11px] text-slate-600">
                  در حضور فرزند، هر یک از پدر و مادر ۱/۶ ترکه را به عنوان فرض می‌برند.
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-[#D3B574]/40">
                <span className="font-bold text-[#002279] block mb-1">سهم فرزندان (نسبت ۲ به ۱):</span>
                <p className="text-[11px] text-slate-600">
                  پس از کسر سهم فرض‌برها، باقیمانده ترکه بین فرزندان تقسیم می‌شود؛ به طوری که سهم هر پسر دو برابر سهم هر دختر می‌باشد.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* SEO & Legal FAQ Section */}
      <SeoContentSection {...SEO_DATA_MAP.formulas_guide} />
    </div>
  );
}

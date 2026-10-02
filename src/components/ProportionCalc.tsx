import React, { useState } from 'react';
import { Calculator, ArrowLeftRight, Layers, Scale, PieChart, Sparkles, Share2, Maximize2 } from 'lucide-react';
import { CurrencyUnit } from '../types';
import { toPersianDigits } from '../utils/numberUtils';
import { lcmArray, gcdArray, simplifyFraction } from '../utils/mathUtils';
import { ShareModal } from './ShareModal';
import { SeoContentSection } from './SeoContentSection';
import { SEO_DATA_MAP } from '../data/seoContentData';

interface ProportionCalcProps {
  currency: CurrencyUnit;
  onSave?: (title: string, desc: string, data: Record<string, unknown>) => void;
}

export function ProportionCalc({ currency }: ProportionCalcProps) {
  // Global / Primary Property Area (مساحت کل ملک)
  const [totalAreaSqm, setTotalAreaSqm] = useState<number>(120); // مساحت کل ملک به مترمربع

  // Mode 1: Proportion X shares of Y shares = ? Dang of 6 Dang
  const [propX, setPropX] = useState<number>(1.5);
  const [propY, setPropY] = useState<number>(6);

  // Mode 2: Sqm <-> Dang Converter
  const [inputDang, setInputDang] = useState<number>(1.5); // دانگ از ۶ دانگ
  const resultSqmFromDang = (totalAreaSqm * inputDang) / 6;

  const [inputSqmOwned, setInputSqmOwned] = useState<number>(30); // سهم به مترمربع
  const resultDangFromSqm = totalAreaSqm > 0 ? (inputSqmOwned * 6) / totalAreaSqm : 0;

  // Mode 3: Equal Share Distribution (تقسیم بالسویه)
  const [balSuyeShareNum, setBalSuyeShareNum] = useState<number>(6); // سهم در انتقال
  const [balSuyeShareDenom, setBalSuyeShareDenom] = useState<number>(6); // از کل سهم
  const [buyersCount, setBuyersCount] = useState<number>(3); // تعداد خریداران/مالکین
  const eachBuyerShareDecimal =
    balSuyeShareDenom > 0 && buyersCount > 0
      ? (balSuyeShareNum / balSuyeShareDenom) / buyersCount
      : 0;
  const eachBuyerDang = eachBuyerShareDecimal * 6;
  const eachBuyerSqm = totalAreaSqm > 0 ? totalAreaSqm * eachBuyerShareDecimal : 0;
  const simplifiedBuyerFraction = simplifyFraction(balSuyeShareNum, balSuyeShareDenom * buyersCount);

  // Mode 4: LCM (ک.م.م) & GCD (ب.م.م)
  const [num1, setNum1] = useState<number>(6);
  const [num2, setNum2] = useState<number>(8);
  const [num3, setNum3] = useState<number>(12);
  const [num4, setNum4] = useState<number>(24);
  const currentLCM = lcmArray([num1, num2, num3, num4]);
  const currentGCD = gcdArray([num1, num2, num3, num4]);

  // Mode 5: Land Share vs Built-up Area (قدرالسهم عرصه و اعیانی)
  const [landArea, setLandArea] = useState<number>(300); // مساحت کل عرصه (زمین) به مترمربع
  const [unitBuiltArea, setUnitBuiltArea] = useState<number>(85); // مساحت اعیانی واحد مورد نظر
  const [totalBuildingBuiltArea, setTotalBuildingBuiltArea] = useState<number>(680); // مجموع اعیانی کل آپارتمان‌ها

  const landShareSqm =
    totalBuildingBuiltArea > 0 ? (unitBuiltArea / totalBuildingBuiltArea) * landArea : 0;
  const landSharePercent = landArea > 0 ? (landShareSqm / landArea) * 100 : 0;
  const landShareDang = (landSharePercent / 100) * 6;

  // Share Modal state
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);

  // Calculations for Section 1 (Limited strictly to Dang of 6 Dang per user request)
  const dangResult = propY > 0 ? (propX / propY) * 6 : 0;
  const sqmResult = propY > 0 ? (propX / propY) * totalAreaSqm : 0;
  const percentResult = propY > 0 ? (propX / propY) * 100 : 0;
  const simplifiedFraction = simplifyFraction(
    Math.round(propX * 1000),
    Math.round(propY * 1000)
  );

  return (
    <div className="space-y-6">
      {/* Title Header Banner */}
      <div className="bg-gradient-to-r from-[#001755] via-[#002279] to-[#001755] rounded-3xl p-6 text-white shadow-xl border border-[#D3B574]/40 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#D3B574]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#D3B574]/20 text-[#D3B574] px-3 py-1 rounded-full text-xs font-bold border border-[#D3B574]/30 mb-2">
              <Scale className="w-4 h-4" />
              <span>سیستم محاسبات قدرالسهم و تناسب سهم</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>محاسبه تناسب سهم، قدرالسهم عرصه و اعیانی</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl leading-relaxed font-medium">
              ابزار هوشمند تبدیل دانگ به مترمربع، محاسبه تناسب سهام، تقسیم بالسویه بین خریداران، ک.م.م و ب.م.م و محاسبه دقیق سهم از زمین (عرصه)
            </p>
          </div>

          {/* Prominent Area Banner in Header */}
          <div className="bg-gradient-to-br from-[#D3B574]/20 to-amber-500/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border-2 border-[#D3B574] text-center shrink-0 shadow-lg">
            <span className="text-xs text-amber-200 font-extrabold block mb-1 flex items-center justify-center gap-1">
              <Maximize2 className="w-3.5 h-3.5 text-[#D3B574]" />
              مساحت کل ملک (پلاک ثبتی)
            </span>
            <div className="flex items-center gap-2 justify-center">
              <input
                type="number"
                min="0"
                step="any"
                value={totalAreaSqm || ''}
                onChange={(e) => setTotalAreaSqm(Math.max(0, Number(e.target.value)))}
                className="w-28 bg-white text-[#002279] text-center font-black rounded-xl text-lg py-1 border-2 border-[#D3B574] shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
              <span className="text-xs font-black text-[#D3B574]">مترمربع</span>
            </div>
            <div className="flex items-center justify-center gap-1 mt-1.5 text-[10px]">
              {[100, 120, 200, 500].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTotalAreaSqm(preset)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    totalAreaSqm === preset
                      ? 'bg-[#D3B574] text-[#001755]'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {toPersianDigits(preset)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Calculations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. Proportion Solver (تناسب سهام و محاسبه دانگ - محدود به ۶ دانگ و با مساحت کل ملک بسیار مشخص و توی چشم) */}
        <div className="bg-white rounded-3xl p-6 border-2 border-[#D3B574]/60 shadow-md space-y-5 hover:border-[#D3B574] transition-all">
          <div className="flex items-center justify-between border-b border-[#D3B574]/20 pb-3">
            <h3 className="font-extrabold text-[#002279] text-base flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-[#D3B574]" />
              <span>۱. تناسب سهام و محاسبه دانگ (بر مبنای ۶ دانگ)</span>
            </h3>
            <span className="text-xs bg-[#001755] text-[#D3B574] px-2.5 py-1 rounded-full font-bold border border-[#D3B574]/40">
              محاسبه دانگ رسمی
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            محاسبه سهم به دانگ دفاتر اسناد رسمی: مقدار X سهم از Y سهم مشاع برابر است با چند دانگ از ۶ دانگ؟
          </p>

          {/* HIGH-VISIBILITY DEDICATED TOTAL AREA BOX IN SECTION 1 */}
          <div className="bg-gradient-to-r from-amber-50 via-orange-50/60 to-amber-50 p-4 rounded-2xl border-2 border-[#D3B574] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-[#001755] text-[#D3B574] rounded-xl font-black shadow-xs">
                <Maximize2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-[#001755] block">
                  مساحت کل ملک (پایه محاسبات متراژ سهم):
                </span>
                <span className="text-[11px] text-slate-600 font-medium">
                  پلاک ثبتی یا متراژ کل زمین / آپارتمان
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center">
              <input
                type="number"
                min="0"
                step="any"
                value={totalAreaSqm || ''}
                onChange={(e) => setTotalAreaSqm(Math.max(0, Number(e.target.value)))}
                className="w-28 bg-white text-[#002279] text-center font-black rounded-xl text-base py-1.5 border-2 border-[#001755] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#D3B574]"
              />
              <span className="text-xs font-extrabold text-[#001755]">مترمربع</span>
            </div>
          </div>

          {/* Interactive Formula: X shares of Y shares */}
          <div className="bg-[#FAF8F6] p-4 rounded-2xl border-2 border-[#D3B574]/40 space-y-3">
            <span className="text-xs font-black text-[#002279] block">
              فرمول تناسب سهم و تبدیل به دانگ:
            </span>
            <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-[#002279] dir-rtl">
              <span>مقدار</span>
              <input
                type="number"
                step="any"
                min="0"
                value={propX || ''}
                onChange={(e) => setPropX(Number(e.target.value))}
                placeholder="X"
                className="w-20 bg-white border-2 border-[#D3B574] rounded-xl px-2 py-1.5 text-center font-black text-[#002279] text-base focus:outline-none focus:ring-2 focus:ring-[#001755]"
              />
              <span>سهم از</span>
              <input
                type="number"
                step="any"
                min="0.0001"
                value={propY || ''}
                onChange={(e) => setPropY(Number(e.target.value))}
                placeholder="Y"
                className="w-24 bg-white border-2 border-[#D3B574] rounded-xl px-2 py-1.5 text-center font-black text-[#002279] text-base focus:outline-none focus:ring-2 focus:ring-[#001755]"
              />
              <span>سهم مشاع، برابر است با:</span>
            </div>
          </div>

          {/* MAIN PROMINENT RESULT CARD: X سهم از Y سهم برابر است با Z دانگ از ۶ دانگ */}
          <div className="bg-gradient-to-r from-[#001755] via-[#002279] to-[#001755] p-5 rounded-2xl text-white border-2 border-[#D3B574] space-y-4 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
              <span className="text-slate-200 font-bold">نتیجه تناسب دانگ رسمی:</span>
              <span className="text-[#D3B574] font-black text-xs">پایه ۶ دانگ مشاع</span>
            </div>

            <div className="bg-white/10 p-3.5 rounded-xl border border-white/20 text-center">
              <span className="text-xs text-slate-300 block mb-1">
                مقدار {toPersianDigits(propX)} سهم از {toPersianDigits(propY)} سهم برابر است با:
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#D3B574] tracking-tight">
                {toPersianDigits(dangResult.toFixed(4))} دانگ از ۶ دانگ
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="bg-white/10 p-2.5 rounded-xl text-center border border-white/10">
                <span className="text-slate-300 text-[11px] block mb-0.5">متراژ سهم:</span>
                <span className="font-extrabold text-white text-sm">
                  {toPersianDigits(sqmResult.toFixed(2))} م²
                </span>
                <span className="text-[10px] text-slate-400 block">از {toPersianDigits(totalAreaSqm)} م² کل</span>
              </div>

              <div className="bg-white/10 p-2.5 rounded-xl text-center border border-white/10">
                <span className="text-slate-300 text-[11px] block mb-0.5">درصد مالکیت:</span>
                <span className="font-extrabold text-[#D3B574] text-sm">
                  {toPersianDigits(percentResult.toFixed(2))}٪
                </span>
                <span className="text-[10px] text-slate-400 block">از کل پلاک</span>
              </div>

              <div className="bg-white/10 p-2.5 rounded-xl text-center border border-white/10">
                <span className="text-slate-300 text-[11px] block mb-0.5">کسر ساده‌شده:</span>
                <span className="font-extrabold text-white text-sm">
                  {toPersianDigits(simplifiedFraction.numerator)} / {toPersianDigits(simplifiedFraction.denominator)}
                </span>
                <span className="text-[10px] text-slate-400 block">سهم مشاعی</span>
              </div>
            </div>
          </div>

          {/* Share Action */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsShareOpen(true)}
              className="w-full bg-[#F5F0E6] hover:bg-[#D3B574] text-[#002279] py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-[#D3B574]/40 cursor-pointer shadow-xs"
            >
              <Share2 className="w-4 h-4 text-[#D3B574]" />
              <span>اشتراک‌گذاری خلاصه تناسب سهام و دانگ</span>
            </button>
          </div>
        </div>

        {/* 2. Dang <-> Sqm Converter (تبدیل دانگ به مترمربع) */}
        <div className="bg-white rounded-3xl p-6 border border-[#D3B574]/30 shadow-sm space-y-4 hover:border-[#D3B574] transition-all">
          <div className="flex items-center justify-between border-b border-[#D3B574]/20 pb-3">
            <h3 className="font-extrabold text-[#002279] text-base flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#D3B574]" />
              <span>۲. تبدیل مستقیم دانگ و مترمربع</span>
            </h3>
            <span className="text-xs bg-[#F5F0E6] text-[#A88640] px-2.5 py-1 rounded-full font-bold border border-[#D3B574]/30">
              کل مساحت: {toPersianDigits(totalAreaSqm)} م²
            </span>
          </div>

          {/* Sub 2.1: Dang to Sqm */}
          <div className="bg-[#F5F0E6]/50 p-4 rounded-2xl border border-[#D3B574]/30 space-y-2">
            <span className="text-xs font-bold text-[#002279] block">الف) تبدیل دانگ به متراژ دقیق:</span>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-800">
              <input
                type="number"
                step="0.01"
                min="0"
                value={inputDang || ''}
                onChange={(e) => setInputDang(Number(e.target.value))}
                className="w-20 bg-white border border-[#D3B574] rounded-lg px-2 py-1 text-center font-black text-[#002279] text-sm"
              />
              <span>دانگ از ۶ دانگ =</span>
              <span className="text-sm font-black text-[#002279] bg-white px-3 py-1 rounded-lg border border-[#D3B574]">
                {toPersianDigits(resultSqmFromDang.toFixed(2))} مترمربع
              </span>
            </div>
          </div>

          {/* Sub 2.2: Sqm to Dang */}
          <div className="bg-[#F5F0E6]/50 p-4 rounded-2xl border border-[#D3B574]/30 space-y-2">
            <span className="text-xs font-bold text-[#002279] block">ب) تبدیل متراژ به دانگ ملک:</span>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-800">
              <input
                type="number"
                step="any"
                min="0"
                value={inputSqmOwned || ''}
                onChange={(e) => setInputSqmOwned(Number(e.target.value))}
                className="w-24 bg-white border border-[#D3B574] rounded-lg px-2 py-1 text-center font-black text-[#002279] text-sm"
              />
              <span>مترمربع از {toPersianDigits(totalAreaSqm)} م² =</span>
              <span className="text-sm font-black text-[#002279] bg-white px-3 py-1 rounded-lg border border-[#D3B574]">
                {toPersianDigits(resultDangFromSqm.toFixed(4))} دانگ
              </span>
            </div>
          </div>
        </div>

        {/* 3. Equal Share Transfer (تقسیم بالسویه) */}
        <div className="bg-white rounded-3xl p-6 border border-[#D3B574]/30 shadow-sm space-y-4 hover:border-[#D3B574] transition-all">
          <div className="flex items-center justify-between border-b border-[#D3B574]/20 pb-3">
            <h3 className="font-extrabold text-[#002279] text-base flex items-center gap-2">
              <PieChart className="w-5 h-5 text-[#D3B574]" />
              <span>۳. تقسیم بالسویه (بین چند خریدار/مالک)</span>
            </h3>
            <span className="text-xs bg-[#F5F0E6] text-[#A88640] px-2.5 py-1 rounded-full font-bold border border-[#D3B574]/30">
              انتقال بین چند نفر
            </span>
          </div>

          <div className="bg-[#F5F0E6]/50 p-4 rounded-2xl border border-[#D3B574]/30 space-y-3 dir-rtl text-xs font-bold text-[#002279]">
            <div className="flex flex-wrap items-center gap-2">
              <span>در انتقال</span>
              <input
                type="number"
                value={balSuyeShareNum}
                onChange={(e) => setBalSuyeShareNum(Number(e.target.value))}
                className="w-16 bg-white border border-[#D3B574] rounded-lg px-2 py-1 text-center font-black text-[#002279]"
              />
              <span>سهم از</span>
              <input
                type="number"
                value={balSuyeShareDenom}
                onChange={(e) => setBalSuyeShareDenom(Number(e.target.value))}
                className="w-16 bg-white border border-[#D3B574] rounded-lg px-2 py-1 text-center font-black text-[#002279]"
              />
              <span>سهم بین</span>
              <input
                type="number"
                value={buyersCount}
                onChange={(e) => setBuyersCount(Number(e.target.value))}
                className="w-16 bg-white border border-[#D3B574] rounded-lg px-2 py-1 text-center font-black text-[#002279]"
              />
              <span>نفر (بالسویه):</span>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-[#001755] to-[#002279] rounded-2xl text-white space-y-2 border border-[#D3B574]/40">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">سهم کسر هر خریدار:</span>
              <span className="font-black text-[#D3B574] text-sm">
                {toPersianDigits(simplifiedBuyerFraction.numerator)} / {toPersianDigits(simplifiedBuyerFraction.denominator)}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">سهم به دانگ برای هر نفر:</span>
              <span className="font-extrabold text-white text-xs">
                {toPersianDigits(eachBuyerDang.toFixed(4))} دانگ
              </span>
            </div>
            {totalAreaSqm > 0 && (
              <div className="flex justify-between items-center text-xs pt-1 border-t border-white/10">
                <span className="text-slate-300 font-medium">متراژ سهم هر نفر:</span>
                <span className="font-extrabold text-white text-xs">
                  {toPersianDigits(eachBuyerSqm.toFixed(2))} مترمربع
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 4. LCM & GCD Calculator (ک.م.م و ب.م.م) */}
        <div className="bg-white rounded-3xl p-6 border border-[#D3B574]/30 shadow-sm space-y-4 hover:border-[#D3B574] transition-all">
          <div className="flex items-center justify-between border-b border-[#D3B574]/20 pb-3">
            <h3 className="font-extrabold text-[#002279] text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#D3B574]" />
              <span>۴. محاسبه ک.م.م و ب.م.م (مخرج مشترک)</span>
            </h3>
            <span className="text-xs bg-[#F5F0E6] text-[#A88640] px-2.5 py-1 rounded-full font-bold border border-[#D3B574]/30">
              ساده‌سازی کسرها
            </span>
          </div>

          <p className="text-xs text-slate-600 font-medium">
            وارد کردن ۴ عدد جهت یافتن کوچکترین مضرب مشترک (ک.م.م) و بزرگترین مقسوم‌علیه مشترک (ب.م.م):
          </p>

          <div className="grid grid-cols-4 gap-2">
            {[
              { val: num1, set: setNum1 },
              { val: num2, set: setNum2 },
              { val: num3, set: setNum3 },
              { val: num4, set: setNum4 },
            ].map((item, idx) => (
              <input
                key={idx}
                type="number"
                value={item.val || ''}
                onChange={(e) => item.set(Number(e.target.value))}
                placeholder={`عدد ${idx + 1}`}
                className="w-full bg-[#F5F0E6]/50 border border-[#D3B574] rounded-xl py-2 text-center font-black text-[#002279] text-sm focus:bg-white"
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-gradient-to-br from-[#001755] to-[#002279] p-3.5 rounded-2xl text-white border border-[#D3B574]/30 text-center">
              <span className="text-[11px] text-slate-300 font-bold block mb-1">کوچکترین مضرب مشترک (ک.م.م)</span>
              <span className="text-xl font-black text-[#D3B574]">
                {toPersianDigits(currentLCM)}
              </span>
            </div>
            <div className="bg-[#F5F0E6] p-3.5 rounded-2xl border border-[#D3B574]/50 text-center">
              <span className="text-[11px] text-[#002279]/70 font-bold block mb-1">بزرگترین مقسوم‌علیه مشترک (ب.م.م)</span>
              <span className="text-xl font-black text-[#002279]">
                {toPersianDigits(currentGCD)}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 5. Land Share vs Built-up Area (قدرالسهم اختصاصی عرصه و اعیانی) */}
      <div className="bg-white rounded-3xl p-6 border-2 border-[#D3B574]/50 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#D3B574]/20 pb-4 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-[#F5F0E6] rounded-2xl text-[#002279] border border-[#D3B574]/40">
              <Calculator className="w-6 h-6 text-[#D3B574]" />
            </div>
            <div>
              <h3 className="font-black text-[#002279] text-lg">
                ۵. صفحه اختصاصی محاسبه قدرالسهم از عرصه (زمین)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                محاسبه میزان سهم هر آپارتمان یا واحد اعیانی از مساحت کل زمین مجتمع
              </p>
            </div>
          </div>
          <span className="text-xs bg-gradient-to-r from-[#001755] to-[#002279] text-white px-3 py-1.5 rounded-full font-bold border border-[#D3B574]/40 self-start sm:self-auto">
            محاسبه قدرالسهم عرصه
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#002279] flex items-center gap-1">
              <span>مساحت کل عرصه (زمین)</span>
              <span className="text-slate-400 font-normal">(مترمربع)</span>
            </label>
            <input
              type="number"
              value={landArea || ''}
              onChange={(e) => setLandArea(Number(e.target.value))}
              className="w-full bg-[#F5F0E6]/40 border border-[#D3B574]/60 rounded-xl px-3 py-2 text-center font-extrabold text-[#002279] text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D3B574]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#002279] flex items-center gap-1">
              <span>مساحت اعیانی واحد (آپارتمان)</span>
              <span className="text-slate-400 font-normal">(مترمربع)</span>
            </label>
            <input
              type="number"
              value={unitBuiltArea || ''}
              onChange={(e) => setUnitBuiltArea(Number(e.target.value))}
              className="w-full bg-[#F5F0E6]/40 border border-[#D3B574]/60 rounded-xl px-3 py-2 text-center font-extrabold text-[#002279] text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D3B574]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#002279] flex items-center gap-1">
              <span>مجموع کل اعیانی ساختمان</span>
              <span className="text-slate-400 font-normal">(کل واحدها)</span>
            </label>
            <input
              type="number"
              value={totalBuildingBuiltArea || ''}
              onChange={(e) => setTotalBuildingBuiltArea(Number(e.target.value))}
              className="w-full bg-[#F5F0E6]/40 border border-[#D3B574]/60 rounded-xl px-3 py-2 text-center font-extrabold text-[#002279] text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D3B574]"
            />
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#001755] via-[#002279] to-[#001755] p-5 rounded-2xl text-white border border-[#D3B574]/50 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-3 gap-2">
            <span className="text-sm font-bold text-slate-200">قدرالسهم دقیق این واحد از کل زمین (عرصه):</span>
            <span className="text-2xl font-black text-[#D3B574] font-bold">
              {toPersianDigits(landShareSqm.toFixed(3))} مترمربع
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
            <div className="flex justify-between items-center bg-white/10 px-3 py-2 rounded-xl">
              <span className="text-slate-300">درصد مالکیت از زمین:</span>
              <span className="font-extrabold text-white text-sm">
                {toPersianDigits(landSharePercent.toFixed(3))}٪
              </span>
            </div>
            <div className="flex justify-between items-center bg-white/10 px-3 py-2 rounded-xl">
              <span className="text-slate-300">سهم دانگ از ۶ دانگ زمین:</span>
              <span className="font-extrabold text-white text-sm">
                {toPersianDigits(landShareDang.toFixed(4))} دانگ
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title="محاسبه تناسب سهام و دانگ ملک"
        calcTypeTitle="تناسب سهام و تبدیل دانگ رسمی"
        currency={currency}
        details={[
          { label: 'مساحت کل ملک (پایه)', value: `${toPersianDigits(totalAreaSqm)} مترمربع` },
          { label: 'سهام مورد محاسبه', value: `مقدار ${toPersianDigits(propX)} سهم از ${toPersianDigits(propY)} سهم مشاع` },
          { label: 'معادل به دانگ رسمی', value: `${toPersianDigits(dangResult.toFixed(4))} دانگ از ۶ دانگ` },
          { label: 'متراژ معادل سهم', value: `${toPersianDigits(sqmResult.toFixed(2))} مترمربع` },
          { label: 'درصد مالکیت', value: `${toPersianDigits(percentResult.toFixed(2))}٪` },
          { label: 'کسر ساده‌شده', value: `${toPersianDigits(simplifiedFraction.numerator)} / ${toPersianDigits(simplifiedFraction.denominator)}` },
        ]}
      />

      {/* SEO & Legal FAQ Section */}
      <SeoContentSection {...SEO_DATA_MAP.proportions} />
    </div>
  );
}

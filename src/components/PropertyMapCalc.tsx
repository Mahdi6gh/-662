import React, { useState, useMemo } from 'react';
import { MapPin, Navigation, ExternalLink, Copy, Check, FileText, Globe, Search, ShieldCheck } from 'lucide-react';
import { parseJamCode, utmToLatLon, detectIranProvince } from '../utils/mathUtils';
import { toPersianDigits } from '../utils/numberUtils';
import { SeoContentSection } from './SeoContentSection';
import { SEO_DATA_MAP } from '../data/seoContentData';

export function PropertyMapCalc() {
  // Demo 24-digit JAM code for Tehran: 538412 3950123 39 0001234
  const [jamInput, setJamInput] = useState<string>('5384123950123390001234');
  const [customX, setCustomX] = useState<number>(538412);
  const [customY, setCustomY] = useState<number>(3950123);
  const [customZone, setCustomZone] = useState<number>(39);
  const [inputMode, setInputMode] = useState<'jam' | 'manual'>('jam');
  const [copied, setCopied] = useState<boolean>(false);

  // Parse result for JAM code mode
  const jamParsed = useMemo(() => {
    return parseJamCode(jamInput);
  }, [jamInput]);

  // Compute Lat/Lng for Manual UTM mode
  const manualParsed = useMemo(() => {
    const { lat, lng } = utmToLatLon(customX, customY, customZone);
    const province = detectIranProvince(lat, lng);
    return { lat, lng, province };
  }, [customX, customY, customZone]);

  const activeLat = inputMode === 'jam' ? jamParsed.lat ?? 35.6995 : manualParsed.lat;
  const activeLng = inputMode === 'jam' ? jamParsed.lng ?? 51.412 : manualParsed.lng;
  const activeProvince = inputMode === 'jam' ? jamParsed.province ?? 'استان تهران' : manualParsed.province;

  // External Action Links exactly as specified
  const taxGovLink = `https://tax.gov.ir/action/do/getaddressgeolocation/30/${activeLng.toFixed(5)}/${activeLat.toFixed(5)}`;
  const baladLink = `https://balad.ir/#15/${activeLat.toFixed(5)}/${activeLng.toFixed(5)}`;
  const neshanLink = `https://neshan.org/maps/routing/car#c${activeLat.toFixed(5)}-${activeLng.toFixed(5)}-16z-0p`;
  const googleMapsLink = `https://www.google.com/maps?q=${activeLat.toFixed(6)},${activeLng.toFixed(6)}`;
  const osmLink = `https://www.openstreetmap.org/?mlat=${activeLat.toFixed(5)}&mlon=${activeLng.toFixed(5)}#map=16/${activeLat.toFixed(5)}/${activeLng.toFixed(5)}`;

  const handleCopyCoords = () => {
    const text = `عرض جغرافیایی: ${activeLat}\nطول جغرافیایی: ${activeLng}\nاستان: ${activeProvince}\nلینک مالیات: ${taxGovLink}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title Header Banner */}
      <div className="bg-gradient-to-r from-[#001755] via-[#002279] to-[#001755] rounded-3xl p-6 text-white shadow-xl border border-[#D3B574]/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D3B574]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#D3B574]/20 text-[#D3B574] px-3 py-1 rounded-full text-xs font-bold border border-[#D3B574]/30 mb-2">
              <MapPin className="w-4 h-4" />
              <span>شناسه ملی جغرافیایی املاک (جام / UTM)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>جستجوی لوکیشن ملک روی نقشه و سامانه مالیاتی</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl leading-relaxed font-medium">
              استخراج طول و عرض جغرافیایی، تشخیص استان ملک و دریافت مستقیم لینک‌های مسیریابی در سامانه امور مالیاتی (tax.gov.ir)، بلد، نشان و گوگل‌مپ
            </p>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setInputMode('jam')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                inputMode === 'jam'
                  ? 'bg-[#D3B574] text-[#001755] shadow-sm'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              کد جام (۲۳-۲۴ رقمی)
            </button>
            <button
              type="button"
              onClick={() => setInputMode('manual')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                inputMode === 'manual'
                  ? 'bg-[#D3B574] text-[#001755] shadow-sm'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              ورود UTM دستی (X, Y)
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Input & Parsing Section */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-[#D3B574]/40 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#D3B574]/20 pb-3">
            <h3 className="font-black text-[#002279] text-base flex items-center gap-2">
              <Search className="w-5 h-5 text-[#D3B574]" />
              <span>ورود اطلاعات شناسه ملک (کد جام سند تک‌برگ)</span>
            </h3>
            <span className="text-[11px] bg-[#F5F0E6] text-[#A88640] px-2 py-0.5 rounded-full font-bold">
              استعلام مالیاتی ملک
            </span>
          </div>

          {inputMode === 'jam' ? (
            <div className="space-y-3">
              <label className="text-xs font-bold text-[#002279] block">
                شناسه ملی جغرافیایی املاک (جام - ۲۳ یا ۲۴ رقم):
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={jamInput}
                  onChange={(e) => setJamInput(e.target.value)}
                  placeholder="مثال: 5384123950123390001234"
                  className="w-full bg-[#F5F0E6]/50 border-2 border-[#D3B574] rounded-2xl py-3 px-4 font-mono font-black text-center text-lg text-[#002279] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D3B574]"
                  dir="ltr"
                />
              </div>

              {/* Format Guide */}
              <div className="bg-[#F5F0E6]/60 p-3 rounded-2xl border border-[#D3B574]/30 text-[11px] text-slate-700 space-y-1">
                <p className="font-bold text-[#002279]">راهنمای ساختار شناسه ۲۴ رقمی جام:</p>
                <div className="grid grid-cols-3 gap-1 text-center font-mono text-[10px]">
                  <div className="bg-white p-1 rounded border border-[#D3B574]/40">
                    <span className="block text-slate-400">۶ رقم اول</span>
                    <span className="font-black text-[#002279]">X-Easting</span>
                  </div>
                  <div className="bg-white p-1 rounded border border-[#D3B574]/40">
                    <span className="block text-slate-400">۷ رقم بعدی</span>
                    <span className="font-black text-[#002279]">Y-Northing</span>
                  </div>
                  <div className="bg-white p-1 rounded border border-[#D3B574]/40">
                    <span className="block text-slate-400">۲ رقم بعدی</span>
                    <span className="font-black text-[#002279]">Zone (زون)</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#002279]">X (۶ رقم Easting):</label>
                  <input
                    type="number"
                    value={customX}
                    onChange={(e) => setCustomX(Number(e.target.value))}
                    className="w-full bg-[#F5F0E6]/50 border border-[#D3B574] rounded-xl py-2 px-2 text-center font-bold text-[#002279]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#002279]">Y (۷ رقم Northing):</label>
                  <input
                    type="number"
                    value={customY}
                    onChange={(e) => setCustomY(Number(e.target.value))}
                    className="w-full bg-[#F5F0E6]/50 border border-[#D3B574] rounded-xl py-2 px-2 text-center font-bold text-[#002279]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#002279]">Zone (زون UTM):</label>
                  <input
                    type="number"
                    value={customZone}
                    onChange={(e) => setCustomZone(Number(e.target.value))}
                    className="w-full bg-[#F5F0E6]/50 border border-[#D3B574] rounded-xl py-2 px-2 text-center font-bold text-[#002279]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Extracted Location Details Box */}
          <div className="bg-gradient-to-br from-[#001755] to-[#002279] text-white p-5 rounded-2xl border border-[#D3B574]/40 space-y-3">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <span className="text-xs font-bold text-slate-300">موقعیت استان شناسایی شده:</span>
              <span className="text-xs font-black text-[#D3B574] bg-white/10 px-2.5 py-1 rounded-full border border-[#D3B574]/30">
                {activeProvince}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs dir-ltr">
              <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 text-center">
                <span className="text-[10px] text-slate-300 block mb-0.5">Latitude (عرض جغرافیایی)</span>
                <span className="font-mono font-black text-white text-sm">
                  {activeLat.toFixed(6)}
                </span>
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 text-center">
                <span className="text-[10px] text-slate-300 block mb-0.5">Longitude (طول جغرافیایی)</span>
                <span className="font-mono font-black text-white text-sm">
                  {activeLng.toFixed(6)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyCoords}
              className="w-full bg-[#D3B574] hover:bg-[#A88640] text-[#001755] font-black text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'مختصات کپی شد!' : 'کپی مختصات و اطلاعات موقعیت'}</span>
            </button>
          </div>
        </div>

        {/* Output Direct Action Links */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-[#D3B574]/40 shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#D3B574]/20 pb-3 mb-4">
              <h3 className="font-black text-[#002279] text-base flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#D3B574]" />
                <span>دکمه‌های نمایش موقیت ملک در سامانه‌ها و نقشه‌ها</span>
              </h3>
              <span className="text-[10px] bg-[#D3B574]/20 text-[#A88640] px-2 py-0.5 rounded-full font-bold">
                لینک‌های مستقیم
              </span>
            </div>

            <div className="space-y-3">

              {/* 1. Tax Portal Link (سامانه امور مالیاتی) - Highlighted */}
              <a
                href={taxGovLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-gradient-to-r from-[#001755] via-[#002279] to-[#001755] text-white p-3.5 rounded-2xl border-2 border-[#D3B574] shadow-md hover:scale-[1.01] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#D3B574] text-[#001755] rounded-xl font-black">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-black text-sm text-white block">
                      سامانه امور مالیاتی کشور (tax.gov.ir)
                    </span>
                    <span className="text-[11px] text-[#D3B574] font-medium">
                      مشاهده مستقیم موقعیت استعلام مالیاتی ملک
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-[#D3B574] group-hover:translate-x-1 transition-transform" />
              </a>

              {/* 2. Balad (بلد) */}
              <a
                href={baladLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-[#F5F0E6]/80 hover:bg-[#F5F0E6] text-[#002279] p-3 rounded-2xl border border-[#D3B574]/40 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#002279] text-white rounded-xl">
                    <Navigation className="w-4 h-4 text-[#D3B574]" />
                  </div>
                  <span className="font-extrabold text-xs">نمایش در نقشه بلد (Balad)</span>
                </div>
                <ExternalLink className="w-4 h-4 text-[#002279]" />
              </a>

              {/* 3. Neshan (نشان) */}
              <a
                href={neshanLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-[#F5F0E6]/80 hover:bg-[#F5F0E6] text-[#002279] p-3 rounded-2xl border border-[#D3B574]/40 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#002279] text-white rounded-xl">
                    <MapPin className="w-4 h-4 text-[#D3B574]" />
                  </div>
                  <span className="font-extrabold text-xs">نمایش در نقشه نشان (Neshan)</span>
                </div>
                <ExternalLink className="w-4 h-4 text-[#002279]" />
              </a>

              {/* 4. Google Maps */}
              <a
                href={googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-[#F5F0E6]/80 hover:bg-[#F5F0E6] text-[#002279] p-3 rounded-2xl border border-[#D3B574]/40 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#002279] text-white rounded-xl">
                    <Globe className="w-4 h-4 text-[#D3B574]" />
                  </div>
                  <span className="font-extrabold text-xs">نمایش در گوگل مپ (Google Maps)</span>
                </div>
                <ExternalLink className="w-4 h-4 text-[#002279]" />
              </a>

              {/* 5. OpenStreetMap */}
              <a
                href={osmLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-[#F5F0E6]/80 hover:bg-[#F5F0E6] text-[#002279] p-3 rounded-2xl border border-[#D3B574]/40 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#002279] text-white rounded-xl">
                    <FileText className="w-4 h-4 text-[#D3B574]" />
                  </div>
                  <span className="font-extrabold text-xs">نمایش در اپن‌استریت‌مپ (OpenStreetMap)</span>
                </div>
                <ExternalLink className="w-4 h-4 text-[#002279]" />
              </a>

            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
            💡 <span className="font-bold text-[#002279]">توجه:</span> تمامی لینک‌های فوق مختصات جغرافیایی این سند را به صورت دقیق و مستقیم در سامانه‌ها باز می‌کنند.
          </div>
        </div>

      </div>

      {/* SEO & Legal FAQ Section */}
      <SeoContentSection {...SEO_DATA_MAP.property_map} />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { RealEstateCalc } from './components/RealEstateCalc';
import { FinancialCalc } from './components/FinancialCalc';
import { RentCalc } from './components/RentCalc';
import { InheritanceCalc } from './components/InheritanceCalc';
import { ProportionCalc } from './components/ProportionCalc';
import { PropertyMapCalc } from './components/PropertyMapCalc';
import { FormulasGuide } from './components/FormulasGuide';
import { OfficeInfoModal } from './components/OfficeInfoModal';
import { SavedCalcModal } from './components/SavedCalcModal';
import { TestRunnerModal } from './components/TestRunnerModal';
import { ReceiptPrintModal } from './components/ReceiptPrintModal';
import { PwaExportModal } from './components/PwaExportModal';
import { CalculatorTab, CurrencyUnit, SavedCalculation } from './types';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeTab, setActiveTab] = useState<CalculatorTab | 'dashboard'>('dashboard');
  const [currency, setCurrency] = useState<CurrencyUnit>('RIAL'); // Default Rial

  // Modals state
  const [isOfficeInfoOpen, setIsOfficeInfoOpen] = useState<boolean>(false);
  const [isSavedHistoryOpen, setIsSavedHistoryOpen] = useState<boolean>(false);
  const [isTestRunnerOpen, setIsTestRunnerOpen] = useState<boolean>(false);
  const [isPwaExportOpen, setIsPwaExportOpen] = useState<boolean>(false);

  // Print modal state
  const [printData, setPrintData] = useState<{
    title: string;
    items: Array<{ label: string; amountRial: number; note?: string }>;
    totalRial: number;
    details: Array<{ key: string; value: string }>;
  } | null>(null);

  // Saved calculations state (persisted in localStorage)
  const [savedList, setSavedList] = useState<SavedCalculation[]>(() => {
    try {
      const stored = localStorage.getItem('notary_saved_calcs_662');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('notary_saved_calcs_662', JSON.stringify(savedList));
    } catch (e) {
      // Ignore quota errors
    }
  }, [savedList]);

  // Dynamic SEO metadata update based on active calculator tab
  useEffect(() => {
    const metaTitles: Record<string, { title: string; desc: string }> = {
      dashboard: {
        title: 'سامانه جامع محاسبه هزینه اسناد رسمی و سهم‌الارث | دفتر اسناد رسمی ۶۶۲ تهران',
        desc: 'سامانه آنلاین محاسبه تعرفه حق‌التحریر اسناد غیرمنقول، اسناد مالی و رهنی، اجاره‌نامه، سهم‌الارث قانونی و تبدیل دانگ دفتر اسناد رسمی ۶۶۲ تهران.',
      },
      real_estate: {
        title: 'محاسبه هزینه سند قطعی غیرمنقول و پیش‌فروش | دفتر اسناد رسمی ۶۶۲ تهران',
        desc: 'محاسبه آنلاین تعرفه حق‌التحریر سند قطعی ملک، کاداستر، حق‌الثبت و استعلامات ثبتی بر اساس بخشنامه رسمی در دفترخانه ۶۶۲ تهران.',
      },
      financial: {
        title: 'محاسبه هزینه سند مالی، تسهیلات بانکی و رهنی | دفتر اسناد رسمی ۶۶۲ تهران',
        desc: 'محاسبه دقیق حق‌التحریر و حق‌الثبت ۱ درصدی اسناد رهنی، تعهدآور و تسهیلات بانکی در دفتر اسناد رسمی ۶۶۲ تهران.',
      },
      rent: {
        title: 'محاسبه تعرفه سند رسمی اجاره املاک | دفتر اسناد رسمی ۶۶۲ تهران',
        desc: 'محاسبه آنلاین هزینه ثبت سند رسمی اجاره‌نامه مسکونی و تجاری بر مبنای ودیعه و اجاره‌بها در دفتر اسناد رسمی ۶۶۲ تهران.',
      },
      inheritance: {
        title: 'محاسبه آنلاین سهم‌الارث و تقسیم ترکه قانونی | دفتر اسناد رسمی ۶۶۲ تهران',
        desc: 'برآورد دقیق سهم‌الارث طبقه اول وراث (زوجه، شوهر، فرزندان و والدین) مطابق قانون مدنی و اصلاحیه ۱۳۸۹ در دفتر اسناد رسمی ۶۶۲ تهران.',
      },
      proportions: {
        title: 'محاسبه تناسب سهام، تبدیل دانگ به مترمربع و قدرالسهم | دفتر اسناد رسمی ۶۶۲ تهران',
        desc: 'ابزار هوشمند تبدیل سهم مشاع به دانگ رسمی از ۶ دانگ، محاسبه متراژ سهم و قدرالسهم آپارتمان از عرصه زمین.',
      },
      property_map: {
        title: 'استعلام کد جام، نقشه کاداستر و مختصات UTM ملک | دفتر اسناد رسمی ۶۶۲ تهران',
        desc: 'تبدیل شناسه ۲۴ رقمی جام سند تک‌برگ به موقعیت جغرافیایی، استعلام در سامانه امور مالیاتی و مشاهده پلاک روی نقشه.',
      },
      formulas_guide: {
        title: 'جدول تعرفه‌ها و فرمول‌های قانونی حق‌التحریر | دفتر اسناد رسمی ۶۶۲ تهران',
        desc: 'راهنمای کامل جدول پلکانی تعرفه حق‌التحریر و ضوابط قانونی ثبت اسناد رسمی مصوب سازمان ثبت اسناد و املاک کشور.',
      },
    };

    const currentMeta = metaTitles[activeTab] || metaTitles.dashboard;
    document.title = currentMeta.title;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', currentMeta.desc);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', currentMeta.title);
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', currentMeta.desc);
    }
  }, [activeTab]);

  const handleSaveResult = (
    title: string,
    description: string,
    totalRial: number,
    inputs: Record<string, unknown>
  ) => {
    const newItem: SavedCalculation = {
      id: Date.now().toString(),
      dateStr: new Date().toLocaleDateString('fa-IR'),
      timestamp: Date.now(),
      tab: activeTab === 'dashboard' ? 'real_estate' : activeTab,
      title,
      description,
      totalRial,
      inputs,
    };

    setSavedList((prev) => [newItem, ...prev]);

    // Confetti celebration
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 },
      });
    } catch (e) {
      // Ignore
    }
  };

  const handleDeleteSaved = (id: string) => {
    setSavedList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllSaved = () => {
    if (window.confirm('آیا از پاک‌سازی تمام سوابق ذخیره‌شده اطمینان دارید؟')) {
      setSavedList([]);
    }
  };

  const handlePrintSavedItem = (item: SavedCalculation) => {
    setPrintData({
      title: item.title,
      details: [
        { key: 'شرح معامله', value: item.description },
        { key: 'تاریخ ثبت', value: item.dateStr },
      ],
      items: [
        { label: item.description, amountRial: item.totalRial },
      ],
      totalRial: item.totalRial,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FAF8F6] to-[#F5F0E6] text-[#002279] pb-20 md:pb-8">
      
      {/* Header */}
      <Header
        currency={currency}
        onCurrencyChange={setCurrency}
        onOpenOfficeInfo={() => setIsOfficeInfoOpen(true)}
        onOpenSavedHistory={() => setIsSavedHistoryOpen(true)}
        savedCount={savedList.length}
      />

      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <Dashboard
                onSelectTab={setActiveTab}
                onOpenOfficeInfo={() => setIsOfficeInfoOpen(true)}
              />
            </motion.div>
          )}

          {activeTab === 'real_estate' && (
            <motion.div
              key="real_estate"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <RealEstateCalc
                currency={currency}
                onSaveResult={handleSaveResult}
                onPrintResult={setPrintData}
              />
            </motion.div>
          )}

          {activeTab === 'financial' && (
            <motion.div
              key="financial"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <FinancialCalc
                currency={currency}
                onSaveResult={handleSaveResult}
                onPrintResult={setPrintData}
              />
            </motion.div>
          )}

          {activeTab === 'rent' && (
            <motion.div
              key="rent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <RentCalc
                currency={currency}
                onSaveResult={handleSaveResult}
                onPrintResult={setPrintData}
              />
            </motion.div>
          )}

          {activeTab === 'inheritance' && (
            <motion.div
              key="inheritance"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <InheritanceCalc
                currency={currency}
                onSaveResult={handleSaveResult}
                onPrintResult={setPrintData}
              />
            </motion.div>
          )}

          {activeTab === 'proportions' && (
            <motion.div
              key="proportions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <ProportionCalc currency={currency} />
            </motion.div>
          )}

          {activeTab === 'property_map' && (
            <motion.div
              key="property_map"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <PropertyMapCalc />
            </motion.div>
          )}

          {activeTab === 'formulas_guide' && (
            <motion.div
              key="formulas_guide"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <FormulasGuide />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-[#D3B574]/30 bg-white/70 backdrop-blur-md text-xs text-[#002279]/80 no-print space-y-4">
        <div className="max-w-6xl mx-auto px-4">
          
          {/* Quick Tabs Footer Bar */}
          <div className="pb-4 mb-4 border-b border-[#D3B574]/20 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-bold text-[#002279]">
            <span className="text-slate-400 font-normal">دسترسی سریع به بخش‌ها:</span>
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#002279] text-white'
                  : 'hover:bg-[#F5F0E6] text-[#002279]'
              }`}
            >
              صفحه اصلی
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('real_estate')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeTab === 'real_estate'
                  ? 'bg-[#002279] text-white'
                  : 'hover:bg-[#F5F0E6] text-[#002279]'
              }`}
            >
              املاک و پیش‌فروش
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('financial')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeTab === 'financial'
                  ? 'bg-[#002279] text-white'
                  : 'hover:bg-[#F5F0E6] text-[#002279]'
              }`}
            >
              اسناد مالی و رهن
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('rent')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeTab === 'rent'
                  ? 'bg-[#002279] text-white'
                  : 'hover:bg-[#F5F0E6] text-[#002279]'
              }`}
            >
              اجاره‌نامه
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('inheritance')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeTab === 'inheritance'
                  ? 'bg-[#002279] text-white'
                  : 'hover:bg-[#F5F0E6] text-[#002279]'
              }`}
            >
              سهم‌الارث
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('proportions')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeTab === 'proportions'
                  ? 'bg-[#002279] text-white'
                  : 'hover:bg-[#F5F0E6] text-[#002279]'
              }`}
            >
              تناسب سهم و قدرالسهم
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('property_map')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeTab === 'property_map'
                  ? 'bg-[#002279] text-white'
                  : 'hover:bg-[#F5F0E6] text-[#002279]'
              }`}
            >
              استعلام لوکیشن (جام)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('formulas_guide')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeTab === 'formulas_guide'
                  ? 'bg-[#002279] text-white'
                  : 'hover:bg-[#F5F0E6] text-[#002279]'
              }`}
            >
              راهنمای فرمول‌ها
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
            <div className="space-y-0.5">
              <div>
                <span>کلیه حقوق این سامانه متعلق به </span>
                <strong className="text-[#002279] font-black">دفتر اسناد رسمی ۶۶۲ تهران (سردفتر: خانم لیلا فرج زاده)</strong>
                <span> است.</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                تهران، چهارراه جهان کودک، بلوار حقانی، نرسیده به گاندی شمالی، پلاک ۶۷ | تلفن: ۰۲۱۸۸۱۹۵۲۱۷ - ۰۹۱۹۶۶۲۵۶۶۲
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-bold">
              <a
                href="https://www.notary662th.ir/"
                target="_blank"
                rel="noreferrer"
                className="hover:underline text-[#002279] hover:text-[#D3B574] flex items-center gap-1"
              >
                <span>وب‌سایت رسمی (notary662th.ir)</span>
              </a>
              <span className="text-[#D3B574]">•</span>
              <button
                type="button"
                onClick={() => setIsPwaExportOpen(true)}
                className="hover:underline text-[#002279] font-extrabold hover:text-[#A88640]"
              >
                دانلود نسخه اپلیکیشن (PWA / ویندوز / اندروید)
              </button>
              <span className="text-[#D3B574]">•</span>
              <button
                type="button"
                onClick={() => setIsOfficeInfoOpen(true)}
                className="hover:underline text-[#002279] hover:text-[#001755]"
              >
                اطلاعات دفترخانه
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Dialog Modals */}
      <OfficeInfoModal
        isOpen={isOfficeInfoOpen}
        onClose={() => setIsOfficeInfoOpen(false)}
      />

      <SavedCalcModal
        isOpen={isSavedHistoryOpen}
        onClose={() => setIsSavedHistoryOpen(false)}
        savedList={savedList}
        onDeleteSaved={handleDeleteSaved}
        onClearAll={handleClearAllSaved}
        currency={currency}
        onPrintSavedItem={handlePrintSavedItem}
      />

      <TestRunnerModal
        isOpen={isTestRunnerOpen}
        onClose={() => setIsTestRunnerOpen(false)}
        currency={currency}
      />

      <PwaExportModal
        isOpen={isPwaExportOpen}
        onClose={() => setIsPwaExportOpen(false)}
      />

      <ReceiptPrintModal
        isOpen={printData !== null}
        onClose={() => setPrintData(null)}
        data={printData}
        currency={currency}
      />

    </div>
  );
}

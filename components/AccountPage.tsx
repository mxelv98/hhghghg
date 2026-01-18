
import React, { useState } from 'react';
import { User } from '../types';

interface AccountPageProps {
  user: User;
  onBack: () => void;
  onUpgradeV3: () => void;
  onUpgradeV6: () => void;
  onOpenAbout: () => void;
  onLogout: () => void;
  onLanguageChange: (lang: string) => void;
}

const LANGUAGES = [
  'English', 'Français', 'Español', 'Deutsch', 'Italiano', 
  'Português', 'Русский', '简体中文', '日本語', '한국어', 
  'Türkçe', 'Tiếng Việt', 'ไทย', 'हिندي', 'العربية'
];

const CONTENT = {
  English: {
    header: "Operator Profile",
    license: "Active License",
    authorized: "Authorized",
    free: "Free Tier",
    v3btn: "PRO $56",
    v6btn: "ELITE $66",
    localization: "Localization",
    sysLang: "System Language",
    aboutLink: "About Systems",
    logout: "Disconnect Terminal"
  },
  'العربية': {
    header: "ملف المشغل",
    license: "الترخيص النشط",
    authorized: "مرخص",
    free: "الفئة المجانية",
    v3btn: "احترافي 56$",
    v6btn: "نخبة 66$",
    localization: "اللغة والموقع",
    sysLang: "لغة النظام",
    aboutLink: "عن الأنظمة",
    logout: "قطع اتصال المحطة"
  }
};

// Fix: Define a proper interface and use React.FC for SettingsModule to fix 'children' prop type errors at lines 88 and 123
interface SettingsModuleProps {
  title: string;
  children: React.ReactNode;
}

const SettingsModule: React.FC<SettingsModuleProps> = ({ title, children }) => (
  <div>
    <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4 ml-1">{title}</h3>
    {children}
  </div>
);

const AccountPage: React.FC<AccountPageProps> = ({ user, onBack, onUpgradeV3, onUpgradeV6, onOpenAbout, onLogout, onLanguageChange }) => {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const isArabic = user.language === 'العربية';
  const lang = isArabic ? CONTENT['العربية'] : CONTENT['English'];

  return (
    <div className="flex flex-col h-full bg-[#02050A] text-slate-200">
      <header className="px-6 py-6 flex items-center gap-4 border-b border-white/5 sticky top-0 bg-[#02050A]/80 backdrop-blur-md z-10">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
          <svg className={isArabic ? 'rotate-180' : ''} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <span className="font-black text-sm uppercase tracking-[0.2em]">{lang.header}</span>
      </header>

      <div className="p-6 space-y-8 overflow-y-auto hide-scrollbar pb-10">
        {/* User Identity Section */}
        <section className={`flex items-center gap-5 p-6 border rounded-[32px] ${user.isVip ? 'bg-brand-elite/5 border-brand-elite/20' : 'bg-slate-950 border-white/5'}`}>
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-xl ${user.isVip ? 'bg-brand-elite shadow-brand-elite/20' : 'bg-brand-primary shadow-brand-primary/20'}`}>
            {user.username.charAt(0)}
          </div>
          <div>
            <h2 className="font-black text-xl text-white italic">{user.username}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-[0.2em] uppercase ${user.isVip ? 'bg-brand-elite/10 text-brand-elite border border-brand-elite/20' : 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'}`}>
                {user.version}
              </span>
              <span className="text-[9px] text-slate-600 font-bold uppercase tracking-tight">ID: {user.id}</span>
            </div>
          </div>
        </section>

        {/* License Details */}
        <SettingsModule title={lang.license}>
           <div className="space-y-3">
              <div className="p-5 bg-slate-950 rounded-[24px] border border-white/5 flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-white uppercase tracking-widest">{user.version} Protocol</span>
                  {user.isVip || user.isV3Paid ? (
                    <span className="text-[9px] font-black text-brand-success uppercase italic">{lang.authorized}</span>
                  ) : (
                    <span className="text-[9px] font-black text-slate-600 uppercase italic">{lang.free}</span>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-2">
                  {user.isVip 
                    ? (isArabic ? 'وصول النخبة: مدة 30 دقيقة' : 'Elite Access: 30m Duration (Paid)') 
                    : user.isV3Paid 
                      ? (isArabic ? 'ترخيص احترافي: مدة 3 أيام' : 'Pro License: 3-Day Duration (Paid)') 
                      : (isArabic ? `الفرص المستهلكة: ${user.scansCount}/2` : `Chances Consumed: ${user.scansCount}/2`)
                  }
                </p>
                
                {(!user.isVip && !user.isV3Paid) && (
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button onClick={onUpgradeV3} className="py-3 rounded-xl bg-brand-primary text-white text-[9px] font-black uppercase tracking-widest">
                       {lang.v3btn}
                    </button>
                    <button onClick={onUpgradeV6} className="py-3 rounded-xl bg-brand-elite text-black text-[9px] font-black uppercase tracking-widest">
                       {lang.v6btn}
                    </button>
                  </div>
                )}
              </div>
           </div>
        </SettingsModule>

        {/* Localization */}
        <SettingsModule title={lang.localization}>
          <button 
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="w-full flex items-center justify-between p-5 bg-slate-950 rounded-[24px] border border-white/5 hover:border-brand-primary/30 transition-all group"
          >
            <div className={`flex flex-col ${isArabic ? 'items-end' : 'items-start'} text-left`}>
              <span className="text-xs font-bold text-white uppercase tracking-widest">{lang.sysLang}</span>
              <span className="text-[10px] text-brand-primary mt-1 font-black">{user.language}</span>
            </div>
            <svg className={`text-slate-600 transition-transform ${showLangMenu ? 'rotate-180' : ''}`} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9l6 6 6-6"/></svg>
          </button>

          {showLangMenu && (
            <div className="mt-3 bg-slate-950 border border-white/5 rounded-[24px] overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 grid grid-cols-2 gap-1 p-2">
              {LANGUAGES.map((langItem) => (
                <button
                  key={langItem}
                  onClick={() => {
                    onLanguageChange(langItem);
                    setShowLangMenu(false);
                  }}
                  className={`px-4 py-3 text-[10px] font-bold text-left rounded-xl transition-all ${user.language === langItem ? 'bg-brand-primary/10 text-brand-primary' : 'text-slate-500 hover:bg-white/5'}`}
                >
                  {langItem}
                </button>
              ))}
            </div>
          )}
        </SettingsModule>

        {/* About Link */}
        <button 
          onClick={onOpenAbout}
          className="w-full flex items-center justify-between p-5 bg-slate-950 rounded-[24px] border border-white/5 hover:border-brand-primary/30 transition-all group"
        >
          <span className="text-xs font-bold text-white uppercase tracking-widest">{lang.aboutLink}</span>
          <svg className={isArabic ? 'rotate-180' : ''} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M9 18l6-6-6-6"/></svg>
        </button>

        <button 
          onClick={onLogout}
          className="w-full py-5 text-center text-red-500 font-black text-[10px] uppercase tracking-[0.4em] bg-red-500/5 rounded-[24px] border border-red-500/10 hover:bg-red-500/10 transition-colors mt-4"
        >
          {lang.logout}
        </button>
      </div>
    </div>
  );
};

export default AccountPage;

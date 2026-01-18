
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface PaymentPageProps {
  user: User;
  tier: 'v3' | 'v6';
  onBack: () => void;
  onSuccess: () => void;
}

const CONTENT = {
  English: {
    title: "License Authorization",
    summary: "Terminal Version",
    v3: "Pluxo v3 Standard",
    v6: "Pluxo v6 ELITE",
    v3Price: "$56.00",
    v6Price: "$66.00",
    durationV3: "72-Hour Operational Access",
    durationV6: "Unlimited High-Precision Access",
    method: "Select Gateway",
    crypto: "Secure Crypto Node",
    card: "Card Payment (Offline)",
    payBtn: "Authorize Access",
    verify: "Authenticating License...",
    successTitle: "License Verified",
    successMsg: "Signal hub unlocked. Terminal fully operational.",
    redirecting: "Syncing Hub...",
    address: "Transfer {price} exactly to:",
    scarcity: "SYSTEM ALERT: Processing slots limited. {time} remaining.",
    trust: "AES-256 Encrypted SSL Authorization",
    copy: "Copy Address",
    copied: "Copied!"
  },
  'العربية': {
    title: "تخويل الترخيص",
    summary: "إصدار المحطة",
    v3: "Pluxo v3 القياسي",
    v6: "Pluxo v6 النخبة",
    v3Price: "56.00 دولار",
    v6Price: "66.00 دولار",
    durationV3: "وصول تشغيلي لمدة 72 ساعة",
    durationV6: "وصول غير محدود عالي الدقة",
    method: "اختر البوابة",
    crypto: "عقدة مشفرة آمنة",
    card: "الدفع بالبطاقة (غير متوفر)",
    payBtn: "تخويل الوصول",
    verify: "جارٍ التحقق من الترخيص...",
    successTitle: "تم التحقق من الترخيص",
    successMsg: "تم فتح مركز الإشارة. المحطة تعمل بكامل طاقتها.",
    redirecting: "مزامنة المركز...",
    address: "حول {price} بالضبط إلى:",
    scarcity: "تنبيه النظام: معالجة الفتحات محدودة. تبقى {time}.",
    trust: "تخويل SSL مشفر بمعيار AES-256",
    copy: "نسخ العنوان",
    copied: "تم النسخ!"
  }
};

const PaymentPage: React.FC<PaymentPageProps> = ({ user, tier, onBack, onSuccess }) => {
  const [method, setMethod] = useState<'crypto' | 'card'>('crypto');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(599);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(prev => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const isArabic = user.language === 'العربية';
  const t = isArabic ? CONTENT['العربية'] : CONTENT['English'];
  const price = tier === 'v3' ? t.v3Price : t.v6Price;

  const handleCopy = () => {
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 2500));
    setIsProcessing(false);
    setIsSuccess(true);
    await new Promise(r => setTimeout(r, 1500));
    onSuccess();
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col h-full bg-brand-bg items-center justify-center p-10 text-center animate-in zoom-in duration-700 grid-bg">
        <div className="w-24 h-24 rounded-3xl bg-brand-success/10 border-2 border-brand-success flex items-center justify-center mb-10 shadow-[0_0_60px_rgba(16,185,129,0.3)] rotate-3">
          <svg className="text-brand-success" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <h2 className="text-3xl font-black text-white italic tracking-tighter mb-4 uppercase">{t.successTitle}</h2>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed mb-12">{t.successMsg}</p>
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-ping"></div>
          <span className="text-[11px] font-black text-brand-primary uppercase tracking-[0.4em]">{t.redirecting}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-brand-bg text-slate-200 grid-bg overflow-y-auto hide-scrollbar pb-32">
      <header className="px-6 py-6 flex items-center justify-between border-b border-white/5 sticky top-0 bg-brand-bg/95 backdrop-blur-xl z-50">
        <button onClick={onBack} disabled={isProcessing} className="p-2 hover:bg-white/5 rounded-xl transition-all disabled:opacity-30">
          <svg className={isArabic ? 'rotate-180' : ''} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <span className="font-black text-xs uppercase tracking-[0.2em]">{t.title}</span>
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-brand-error animate-pulse"></span>
           <span className="text-[10px] font-black text-brand-error font-mono">{formatTime(timeLeft)}</span>
        </div>
      </header>

      <div className="p-8 space-y-10">
        <div className="bg-brand-error/10 border border-brand-error/20 p-5 rounded-3xl text-center">
           <p className="text-[10px] font-black text-brand-error uppercase tracking-widest animate-pulse">
             {t.scarcity.replace('{time}', formatTime(timeLeft))}
           </p>
        </div>

        <section className="animate-in fade-in slide-in-from-top-4 duration-700">
          <div className={`p-8 rounded-[40px] border glass relative overflow-hidden ${tier === 'v6' ? 'border-brand-primary/40 shadow-[0_20px_60px_rgba(225,29,72,0.1)]' : 'border-white/10'}`}>
            <h3 className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-3">{t.summary}</h3>
            <div className="flex justify-between items-end">
               <div>
                  <h2 className="text-2xl font-black text-white italic uppercase leading-none">{tier === 'v3' ? t.v3 : t.v6}</h2>
                  <p className="text-[11px] text-slate-500 font-bold uppercase mt-3">{tier === 'v3' ? t.durationV3 : t.durationV6}</p>
               </div>
               <span className="text-4xl font-black text-white italic leading-none">{price}</span>
            </div>
          </div>
        </section>

        <section className="space-y-4">
           <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => setMethod('crypto')}
                className={`flex items-center justify-between p-7 rounded-[32px] border transition-all ${method === 'crypto' ? 'bg-brand-primary/10 border-brand-primary shadow-xl shadow-brand-primary/10' : 'bg-slate-900/50 border-white/5'}`}
              >
                 <div className="flex items-center gap-5 text-left">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${method === 'crypto' ? 'bg-brand-primary text-white' : 'bg-slate-800 text-slate-600'}`}>
                       <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    </div>
                    <div>
                       <span className="text-sm font-black text-white uppercase tracking-widest">{t.crypto}</span>
                       <p className="text-[9px] text-slate-600 font-bold uppercase mt-1">Immediate Hub Sync</p>
                    </div>
                 </div>
              </button>

              <button disabled className="flex items-center justify-between p-7 rounded-[32px] border bg-slate-950 border-white/5 opacity-30 cursor-not-allowed">
                 <div className="flex items-center gap-5 text-left">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 text-slate-700 flex items-center justify-center">
                       <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
                    </div>
                    <div>
                       <span className="text-sm font-black text-slate-700 uppercase tracking-widest">{t.card}</span>
                       <p className="text-[9px] text-slate-800 font-bold uppercase mt-1">Manual Processing Required</p>
                    </div>
                 </div>
              </button>
           </div>
        </section>

        <section className="animate-in fade-in duration-1000">
          <div className="glass rounded-[40px] p-8 space-y-8 text-center border-white/10">
             <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{t.address.replace('{price}', price)}</p>
             <div className="space-y-4">
               <div className="bg-black/60 p-6 rounded-2xl border border-brand-primary/20 font-mono text-[11px] text-white break-all shadow-inner">
                  TQt5gM8FqX9zE4bY1m2N3k4P5R6S7T8U9V
               </div>
               <button 
                  onClick={handleCopy}
                  className="w-full py-5 rounded-2xl bg-brand-primary/10 border border-brand-primary/30 text-brand-primary text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary transition-all hover:text-white flex items-center justify-center gap-3"
               >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  {copyFeedback ? t.copied : t.copy}
               </button>
             </div>
             <div className="flex justify-center py-4">
                <div className="w-48 h-48 bg-white p-5 rounded-[48px] shadow-2xl relative">
                   <div className="absolute inset-0 bg-brand-primary/5 blur-3xl rounded-full"></div>
                   <img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TQt5gM8FqX9zE4bY1m2N3k4P5R6S7T8U9V`} alt="QR" className="w-full h-full relative z-10" />
                </div>
             </div>
          </div>
        </section>

        <div className="flex flex-col items-center gap-4 opacity-40 text-center pb-10">
           <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <span className="text-[10px] font-black uppercase tracking-widest">{t.trust}</span>
           </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-8 z-[100] pointer-events-none">
         <button 
            onClick={handlePayment}
            disabled={isProcessing}
            className={`w-full py-8 rounded-[48px] font-black text-sm uppercase tracking-[0.6em] transition-all relative overflow-hidden flex items-center justify-center gap-4 group pointer-events-auto shadow-2xl active:scale-95
               ${isProcessing ? 'bg-slate-900 text-slate-700' : 'bg-brand-primary text-white'}
            `}
         >
            {isProcessing ? (
               <div className="flex items-center gap-4">
                  <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>{t.verify}</span>
               </div>
            ) : (
               <>
                  {t.payBtn}
                  <svg className="group-hover:translate-x-3 transition-transform" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
               </>
            )}
         </button>
      </div>
    </div>
  );
};

export default PaymentPage;

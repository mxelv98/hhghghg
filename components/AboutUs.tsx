
import React from 'react';
import { User } from '../types';

interface AboutUsProps {
  user: User;
  onBack: () => void;
}

const CONTENT = {
  English: {
    title: "The Pluxo Vision",
    mission: "Defying Market Friction",
    missionText: "Pluxo was founded on the principle that market friction can be predicted and neutralized. We bridge the gap between high-frequency chaos and zero-gravity precision.",
    core: "Neural Mapping Protocol",
    coreText: "Our proprietary Pluxo core utilizes asynchronous neural clusters to map market trajectories before they manifest. Sub-0.1ms latency ensures you are always ahead of the collapse.",
    security: "Atmospheric Hub Security",
    securityText: "Unbound by standard encryption limits, our terminal uses quantum-sealed handshakes to protect operator identity and liquidity streams.",
    stats: "Operational Metrics",
    stat1: "99.4% Signal Accuracy",
    stat2: "12k+ Global Nodes",
    stat3: "<0.1ms Execution"
  },
  'العربية': {
    title: "رؤية Pluxo",
    mission: "تحدي التقلبات",
    missionText: "تأسست 'Pluxo' على مبدأ أنه يمكن التنبؤ باحتكاك السوق وتحييده. نحن نسد الفجوة بين الفوضى ودقة انعدام الجاذبية.",
    core: "بروتوكول رسم الخرائط العصبية",
    coreText: "تستخدم نواة 'Pluxo' الحصرية تجمعات عصبية لرسم مسارات السوق قبل ظهورها. يضمن زمن الوصول الأقل من 0.1 مللي ثانية أنك دائمًا في المقدمة.",
    security: "أمن المركز",
    securityText: "غير مقيدة بحدود التشفير القياسية، تستخدم محطتنا مصافحات مختومة لحماية هوية المشغل وتدفقات السيولة.",
    stats: "مقاييس تشغيلية",
    stat1: "دقة إشارة 99.4٪",
    stat2: "12 ألف+ عقدة عالمية",
    stat3: "تنفيذ <0.1 مللي ثانية"
  }
};

const AboutUs: React.FC<AboutUsProps> = ({ user, onBack }) => {
  const isArabic = user.language === 'العربية';
  const lang = isArabic ? CONTENT['العربية'] : CONTENT['English'];

  return (
    <div className="flex flex-col h-full bg-brand-bg text-slate-200 overflow-y-auto hide-scrollbar nebula-bg">
      <header className="px-6 py-6 flex items-center gap-4 border-b border-white/5 sticky top-0 bg-brand-bg/80 backdrop-blur-md z-10">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-xl transition-all active:scale-90">
          <svg className={isArabic ? 'rotate-180' : ''} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <span className="font-black text-sm uppercase tracking-[0.2em]">{lang.title}</span>
      </header>

      <div className="p-8 space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-[32px] bg-brand-primary flex items-center justify-center font-black text-white text-5xl shadow-2xl shadow-brand-primary/20 italic mb-8 animate-float">
              P
            </div>
            <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.8em] text-center">Pluxo Core v5.1</p>
        </div>

        <section className="space-y-4">
          <h3 className="text-brand-primary font-black text-xs uppercase tracking-widest">{lang.mission}</h3>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">{lang.missionText}</p>
        </section>

        {/* Persuasive Stats */}
        <div className="grid grid-cols-3 gap-2">
           {[lang.stat1, lang.stat2, lang.stat3].map((s, i) => (
             <div key={i} className="p-3 glass rounded-2xl flex flex-col items-center text-center">
                <span className="text-[9px] font-black text-brand-primary uppercase tracking-tight">{s.split(' ')[0]}</span>
                <span className="text-[7px] text-slate-500 font-bold uppercase mt-1 leading-none">{s.split(' ').slice(1).join(' ')}</span>
             </div>
           ))}
        </div>

        <section className="space-y-4">
          <h3 className="text-brand-primary font-black text-xs uppercase tracking-widest">{lang.core}</h3>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">{lang.coreText}</p>
        </section>

        <section className="space-y-4">
          <h3 className="text-brand-primary font-black text-xs uppercase tracking-widest">{lang.security}</h3>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">{lang.securityText}</p>
        </section>

        <footer className="pt-10 border-t border-white/5 text-center">
          <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em]">© 2025 PLUXO NEURAL HUB SYSTEMS LTD.</p>
        </footer>
      </div>
    </div>
  );
};

export default AboutUs;

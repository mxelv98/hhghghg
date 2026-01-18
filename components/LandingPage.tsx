
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface LandingPageProps {
  user: User;
  onUpgradeV3: () => void;
  onUpgradeV6: () => void;
  onOpenChat: () => void;
  onOpenAccount: () => void;
  onOpenAbout: () => void;
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ user, onUpgradeV3, onUpgradeV6, onOpenChat, onOpenAccount, onOpenAbout, onStart }) => {
  const isArabic = user.language === 'العربية';
  
  const [liveResults, setLiveResults] = useState<{val: string, time: string}[]>([]);
  const [activeNodes, setActiveNodes] = useState(0);

  useEffect(() => {
    setActiveNodes(Math.floor(Math.random() * 500) + 8000);
    const results = [
      { val: '2.10x', time: '1s ago' },
      { val: '5.84x', time: '10s ago' },
      { val: '1.92x', time: '20s ago' },
      { val: '14.05x', time: '55s ago' },
    ];
    setLiveResults(results);
    
    const interval = setInterval(() => {
      const newVal = (Math.random() * 8 + 1.2).toFixed(2) + 'x';
      setLiveResults(prev => [{ val: newVal, time: 'NOW' }, ...prev.slice(0, 3)]);
      setActiveNodes(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-brand-bg text-slate-200 grid-bg overflow-y-auto hide-scrollbar">
      {/* Top Meta Stream */}
      <div className="w-full py-1.5 px-6 border-b border-white/5 bg-slate-950 font-mono text-[7px] text-slate-700 flex justify-between overflow-hidden whitespace-nowrap italic">
         <div className="flex gap-8 animate-marquee">
            <span>UPLINK_STABLE: 99.4%</span>
            <span>NODE_CLUSTER: 0x77AF2</span>
            <span>SYNC_LATENCY: 0.08ms</span>
            <span>NEURAL_ENGINE: ACTIVE</span>
            <span>UPLINK_STABLE: 99.4%</span>
            <span>NODE_CLUSTER: 0x77AF2</span>
            <span>SYNC_LATENCY: 0.08ms</span>
            <span>NEURAL_ENGINE: ACTIVE</span>
         </div>
      </div>

      <main className="flex-1 px-8 py-10 flex flex-col justify-center relative">
        {/* Radar Node Visualization */}
        <div className="absolute top-10 right-8 w-32 h-32 opacity-20 pointer-events-none">
           <div className="w-full h-full rounded-full border border-brand-primary/30 relative flex items-center justify-center">
              <div className="absolute inset-0 border border-brand-primary/10 rounded-full animate-ping"></div>
              <div className="w-1/2 h-0.5 bg-brand-primary absolute left-1/2 origin-left animate-radar"></div>
              <div className="w-1 h-1 bg-brand-primary rounded-full absolute top-4 left-10"></div>
              <div className="w-1 h-1 bg-brand-primary rounded-full absolute bottom-10 right-4 animate-pulse"></div>
           </div>
           <div className="text-center mt-2">
              <span className="text-[6px] font-black text-brand-primary uppercase tracking-widest">{activeNodes} NODES ONLINE</span>
           </div>
        </div>

        {/* Visual Header */}
        <div className="mb-10 flex items-center gap-4 animate-in fade-in duration-700">
          <div className="w-14 h-14 rounded-2xl bg-brand-primary flex items-center justify-center shadow-[0_0_30px_rgba(225,29,72,0.3)] rotate-12">
             <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
          <div className={isArabic ? 'text-right' : 'text-left'}>
            <h2 className="text-2xl font-black italic tracking-tighter text-white leading-none">PLUXO <span className="text-brand-primary">SIGNAL</span></h2>
            <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em] mt-1 italic">Authorized: Operator_{user.username}</p>
          </div>
        </div>

        {/* Hero Section */}
        <div className="mb-10 space-y-4">
          <h1 className="text-6xl font-black tracking-tighter text-white leading-[0.8] uppercase italic">
            PREDICT <br/><span className="text-brand-primary">DOMINATE</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed max-w-[280px]">
            The ultimate neural cluster processor. Harness the power of 12,000+ synchronized high-frequency nodes.
          </p>
        </div>

        {/* Live Feed */}
        <div className="mb-8 p-6 rounded-[32px] glass border-brand-primary/20 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-1 h-full bg-brand-primary"></div>
           <div className="flex justify-between items-center mb-4">
             <span className="text-[9px] font-black text-brand-primary uppercase tracking-[0.3em]">Neural Extraction History</span>
             <span className="text-[8px] font-black text-brand-success animate-pulse">LIVE SYNC</span>
           </div>
           <div className="grid grid-cols-4 gap-3">
              {liveResults.map((res, i) => (
                <div key={i} className="bg-slate-900/80 rounded-2xl p-3 border border-white/5 text-center group hover:border-brand-primary/40 transition-all">
                   <div className="text-xs font-black text-white italic group-hover:scale-110 transition-transform">{res.val}</div>
                   <div className="text-[6px] text-slate-600 font-bold uppercase mt-1 tracking-tighter">{res.time}</div>
                </div>
              ))}
           </div>
        </div>

        {/* Version Selection */}
        <div className="space-y-4 mb-10">
          <button 
            onClick={onUpgradeV3}
            className={`w-full group p-6 rounded-[32px] border text-left transition-all glass border-white/10 hover:border-brand-primary/40`}
          >
            <div className="flex justify-between items-center mb-1">
               <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Protocol v3.0</span>
               <span className="text-[7px] font-black bg-brand-primary text-white px-2 py-0.5 rounded">OPEN</span>
            </div>
            <h3 className="text-xl font-black text-white uppercase italic">Standard Node</h3>
            <p className="text-[10px] text-slate-600 font-bold uppercase mt-1">Limited extraction bandwith • $56.00</p>
          </button>

          <button 
            onClick={onUpgradeV6}
            className={`w-full group p-7 rounded-[40px] border text-left transition-all relative overflow-hidden glass border-brand-primary/30 hover:border-brand-primary`}
          >
            <div className="flex justify-between items-center mb-1">
               <span className="text-[8px] font-black text-brand-primary uppercase tracking-[0.3em]">Protocol v6.4 ELITE</span>
               <span className="text-[7px] font-black bg-white text-black px-2 py-0.5 rounded uppercase">UPLINK</span>
            </div>
            <h3 className="text-2xl font-black text-white uppercase italic">Elite Cluster</h3>
            <p className="text-[11px] text-brand-primary font-black uppercase tracking-widest mt-1">Priority Zero-Lag Channel • $66.00</p>
          </button>
        </div>

        <button 
          onClick={onStart}
          className="w-full py-8 rounded-[48px] bg-white text-black font-black text-sm uppercase tracking-[0.6em] transition-all hover:bg-brand-primary hover:text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] active:scale-95 flex items-center justify-center gap-4 group"
        >
          INITIALIZE HUB
          <svg className="group-hover:translate-x-3 transition-transform" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </main>

      <footer className="px-8 py-10 glass border-t-0 rounded-t-[48px] flex flex-col gap-6">
        <div className="flex justify-between items-center">
           <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-brand-success animate-pulse shadow-[0_0_10px_#10b981]"></span>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Atmosphere: Stable</p>
           </div>
           <div className="flex gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
           </div>
        </div>
        <div className="flex gap-10">
           <button onClick={onOpenAccount} className="text-[10px] font-black text-slate-600 hover:text-brand-primary uppercase tracking-widest transition-all">KERNEL</button>
           <button onClick={onOpenAbout} className="text-[10px] font-black text-slate-600 hover:text-brand-primary uppercase tracking-widest transition-all">LEGACY</button>
           <button onClick={onOpenChat} className="text-[10px] font-black text-brand-primary uppercase tracking-widest transition-all">AI_CORE</button>
        </div>
      </footer>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;

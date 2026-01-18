
import React, { useState, useEffect, useRef } from 'react';
import { User, Prediction, AiSignal, Strategy } from '../types';
import { getVipPrediction } from '../services/geminiService';
import { 
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, 
  Tooltip, CartesianGrid 
} from 'recharts';

interface VipDashboardProps {
  user: User;
  onScanPerformed: () => void;
  onUpgradeV3: () => void;
  onUpgradeV6: () => void;
  onBack: () => void;
  onOpenChat: () => void;
  onOpenAccount: () => void;
}

const VipDashboard: React.FC<VipDashboardProps> = ({ user, onScanPerformed, onUpgradeV3, onUpgradeV6, onBack, onOpenChat, onOpenAccount }) => {
  const [activeTab, setActiveTab] = useState<'scan' | 'market'>('scan');
  const [strategy, setStrategy] = useState<Strategy>('BALANCED');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentSignal, setCurrentSignal] = useState<AiSignal | null>(null);
  const [graphData, setGraphData] = useState<any[]>([]);
  const [logs, setLogs] = useState<string[]>(["SYSTEM: ONLINE", "SIGNAL_CORE: READY"]);
  const [freqHeights, setFreqHeights] = useState<number[]>(new Array(10).fill(10));
  
  const isElite = true; // DEV MODE: ALWAYS ELITE
  const isFreeLimit = false; // DEV MODE: NO LIMITS

  // Real-time frequency analyzer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setFreqHeights(new Array(10).fill(0).map(() => Math.floor(Math.random() * 20) + 10));
    }, 150);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const data = Array.from({ length: 15 }, (_, i) => ({
      time: i,
      val: Math.pow(1.2, i) + Math.random() * 0.5
    }));
    setGraphData(data);
  }, []);

  const runAnalysis = async () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    setCurrentSignal(null);
    
    const analysisSteps = [
      "ESTABLISHING_HANDSHAKE",
      "NODE_CLUSTER_SYNC",
      "SYNTHESIZING_TRAJECTORY",
      "SIGNAL_LOCKED"
    ];
    let stepIndex = 0;

    const interval = setInterval(() => {
      setGraphData(prev => {
        const lastVal = prev[prev.length - 1].val;
        return [...prev.slice(1), { time: Date.now(), val: lastVal + Math.random() * 3 }];
      });
      
      if (stepIndex < analysisSteps.length) {
        setLogs(prev => [`>> ${analysisSteps[stepIndex]}`, ...prev].slice(0, 5));
        stepIndex++;
      }
    }, 600);

    const signal = await getVipPrediction();
    
    setTimeout(() => {
      clearInterval(interval);
      setCurrentSignal(signal);
      onScanPerformed();
      setIsAnalyzing(false);
      setLogs(prev => ["SUCCESS: HUB_EXTRACTED_DATA_" + signal.predictedMultiplier + "X", ...prev]);
    }, 3000);
  };

  return (
    <div className="flex flex-col h-full grid-bg bg-brand-bg relative overflow-hidden">
      <header className="px-6 py-5 flex items-center justify-between glass z-50 border-t-0 border-x-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 glass rounded-xl text-slate-400 hover:text-brand-primary transition-all">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter text-white uppercase leading-none">PLUXO <span className="text-brand-primary">ELITE</span></h1>
            <div className="flex items-center gap-1.5 mt-1.5">
               <span className="w-1 h-1 rounded-full bg-brand-success animate-pulse"></span>
               <span className="text-[7px] font-black text-slate-600 uppercase tracking-[0.4em]">SYNC: UNRESTRICTED</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
           {/* Freq Analyzer Visual */}
           <div className="flex items-end h-4 gap-0.5 px-2">
              {freqHeights.map((h, i) => (
                <div key={i} className="w-0.5 bg-brand-primary/40 rounded-full transition-all duration-150" style={{ height: `${h}px` }}></div>
              ))}
           </div>
           <button onClick={onOpenChat} className="w-10 h-10 glass flex items-center justify-center rounded-xl border-white/5 hover:border-brand-primary transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
           </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto hide-scrollbar p-5 space-y-5 pb-24">
        {activeTab === 'scan' ? (
          <>
            {/* Main Graphical Display */}
            <section className="glass rounded-[40px] p-6 border-white/5 relative overflow-hidden h-[260px] shadow-2xl shadow-black/50">
               <div className="absolute top-6 left-8 z-10 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-primary animate-flicker"></div>
                  <span className="text-[8px] font-black text-brand-primary uppercase tracking-[0.5em]">Neural Signal Probability</span>
               </div>
               <div className="absolute inset-0 pt-16 pb-4">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={graphData}>
                      <defs>
                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#e11d48" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} strokeOpacity={0.2} />
                      <XAxis dataKey="time" hide />
                      <YAxis domain={[0, 'auto']} hide />
                      <Area 
                        type="monotone" 
                        dataKey="val" 
                        stroke="#e11d48" 
                        strokeWidth={4} 
                        fillOpacity={1} 
                        fill="url(#colorVal)" 
                        animationDuration={500}
                      />
                    </AreaChart>
                 </ResponsiveContainer>
               </div>
               {/* Extraction Risk Indicator */}
               <div className="absolute bottom-6 right-8 text-right">
                  <p className="text-[7px] font-black text-slate-700 uppercase tracking-widest mb-1">Risk Factor</p>
                  <div className="flex gap-1">
                     <div className={`w-3 h-1 rounded-full ${strategy === 'SAFE' ? 'bg-brand-success' : 'bg-slate-800'}`}></div>
                     <div className={`w-3 h-1 rounded-full ${strategy === 'BALANCED' ? 'bg-brand-primary' : 'bg-slate-800'}`}></div>
                     <div className={`w-3 h-1 rounded-full ${strategy === 'AGGRESSIVE' ? 'bg-brand-error animate-pulse' : 'bg-slate-800'}`}></div>
                  </div>
               </div>
            </section>

            {/* Neural Extraction Hub */}
            <section className={`min-h-[400px] rounded-[48px] glass border transition-all duration-700 flex flex-col items-center justify-center relative overflow-hidden border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.8)]`}>
                 <div className="w-full flex flex-col items-center px-8">
                    {/* Strategy Engine Selector */}
                    <div className="flex bg-slate-950/80 p-1.5 rounded-[24px] border border-white/5 mb-10 w-full relative">
                       <div className="absolute -top-3 left-6 px-2 bg-slate-950 text-[6px] font-black text-slate-600 uppercase tracking-widest border border-white/5">Neural Engine Preset</div>
                       {(['SAFE', 'BALANCED', 'AGGRESSIVE'] as Strategy[]).map(s => (
                         <button 
                            key={s} 
                            onClick={() => setStrategy(s)}
                            className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${strategy === s ? 'bg-brand-primary text-white shadow-lg' : 'text-slate-700 hover:text-slate-400'}`}
                         >
                           {s}
                         </button>
                       ))}
                    </div>

                    {isAnalyzing ? (
                      <div className="flex flex-col items-center py-10 relative">
                         <div className="absolute inset-0 blur-3xl bg-brand-primary/10 rounded-full animate-pulse"></div>
                         <div className="relative">
                            <div className="w-28 h-28 border-4 border-slate-900 rounded-full"></div>
                            <div className="absolute inset-0 w-28 h-28 border-t-4 border-brand-primary rounded-full animate-spin"></div>
                            <div className="absolute inset-4 border border-brand-primary/20 rounded-full animate-ping"></div>
                         </div>
                         <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.6em] mt-10 animate-pulse italic">Synthesizing Hub Data</span>
                      </div>
                    ) : currentSignal ? (
                      <div className="animate-in zoom-in duration-500 flex flex-col items-center w-full">
                         <div className="w-full flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-brand-success animate-pulse"></div>
                               <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Locked: {currentSignal.confidence}%</span>
                            </div>
                            <span className="text-[8px] font-black text-brand-primary uppercase tracking-widest italic">{currentSignal.reasoning}</span>
                         </div>
                         <div className="relative flex items-center justify-center">
                            <div className="absolute inset-0 blur-[60px] bg-brand-primary/30 rounded-full animate-pulse"></div>
                            <div className="flex items-baseline relative z-10">
                                <span className="text-[130px] font-black italic tracking-tighter text-white leading-none drop-shadow-[0_0_30px_rgba(225,29,72,0.4)]">
                                  {currentSignal.predictedMultiplier.toFixed(2)}
                                </span>
                                <span className="text-4xl font-black italic text-brand-primary -ml-2 drop-shadow-lg">x</span>
                            </div>
                         </div>
                         <div className="w-full bg-slate-950 h-1.5 rounded-full mt-12 overflow-hidden border border-white/5">
                            <div className="h-full bg-brand-primary transition-all duration-1000 shadow-[0_0_15px_#e11d48]" style={{ width: `${currentSignal.confidence}%` }}></div>
                         </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-24 h-24 bg-slate-900/40 rounded-[40px] border border-white/10 flex items-center justify-center mx-auto mb-8 shadow-inner relative group">
                           <div className="absolute inset-0 border-2 border-brand-primary/10 rounded-[40px] group-hover:scale-110 transition-transform"></div>
                           <svg className="text-slate-800 group-hover:text-brand-primary transition-colors" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>
                        </div>
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] italic">Neural Engine Standby<br/>Select Engine Preset to Start</p>
                      </div>
                    )}
                    
                    <button 
                      onClick={runAnalysis}
                      disabled={isAnalyzing}
                      className={`mt-10 w-full py-8 rounded-[48px] font-black text-sm uppercase tracking-[0.8em] transition-all relative overflow-hidden shadow-2xl active:scale-95 flex items-center justify-center gap-4 group
                        ${isAnalyzing ? 'bg-slate-950 text-slate-800' : 'bg-white text-black hover:bg-brand-primary hover:text-white'}
                      `}
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="w-5 h-5 border-3 border-slate-800 border-t-slate-400 rounded-full animate-spin"></div>
                          SYNCING...
                        </>
                      ) : (
                        <>
                          DEPLOY SIGNAL
                          <svg className="group-hover:translate-x-3 transition-transform" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </>
                      )}
                    </button>
                 </div>
            </section>
          </>
        ) : (
          /* High-Fidelity Marketplace */
          <section className="space-y-4 animate-in fade-in duration-500">
             <div className="flex justify-between items-center ml-2">
                <h3 className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Global Node Clusters</h3>
                <span className="text-[8px] font-bold text-slate-700 uppercase italic">Refreshed 1s ago</span>
             </div>
             {[1, 2, 3, 4, 5, 6].map(i => (
               <div key={i} className="glass p-6 rounded-[32px] flex justify-between items-center border-white/5 hover:border-brand-primary/20 transition-all cursor-pointer group">
                  <div className="flex items-center gap-5">
                     <div className="w-14 h-14 rounded-2xl bg-slate-950 flex items-center justify-center border border-white/5 relative">
                        <span className="text-brand-primary font-black text-xs relative z-10 italic">#{i}</span>
                        <div className="absolute inset-0 bg-brand-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     </div>
                     <div>
                        <div className="text-[12px] font-black text-white uppercase italic group-hover:text-brand-primary transition-colors">CLUSTER_ALPHA_{i}</div>
                        <div className="flex items-center gap-2 mt-1.5">
                           <div className="w-1 h-1 bg-brand-success rounded-full shadow-[0_0_5px_#10b981]"></div>
                           <span className="text-[8px] text-slate-600 uppercase font-black">Success Rate: 99.{(99-i)}%</span>
                        </div>
                     </div>
                  </div>
                  <div className="text-right">
                     <div className="text-sm font-black text-brand-success italic group-hover:scale-110 transition-transform">{(Math.random()*12 + 1.5).toFixed(2)}x</div>
                     <div className="text-[8px] text-slate-800 uppercase font-black mt-1">Extraction</div>
                  </div>
               </div>
             ))}
          </section>
        )}

        {/* Real-time Diagnostic Terminal */}
        <div className="glass p-6 rounded-[32px] font-mono text-[9px] text-slate-600 border-white/5 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-3 opacity-20">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
           </div>
           {logs.map((log, i) => (
             <div key={i} className={i === 0 ? "text-brand-primary font-bold opacity-100" : "opacity-40"}>
                <span className="mr-4">{i === 0 ? ">>" : "::"}</span> {log}
             </div>
           ))}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 p-8 z-[60] flex justify-center pointer-events-none">
        <div className="w-full max-w-[360px] h-20 glass rounded-[40px] p-2 flex justify-around items-center pointer-events-auto shadow-[0_40px_80px_rgba(0,0,0,1)] border-white/10">
           <button onClick={() => setActiveTab('scan')} className={`flex-1 flex flex-col items-center transition-all ${activeTab === 'scan' ? 'text-brand-primary scale-110' : 'text-slate-700 hover:text-slate-400'}`}>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">SIGNAL</span>
              {activeTab === 'scan' && <div className="w-6 h-[2px] bg-brand-primary rounded-full mt-2 shadow-[0_0_12px_#e11d48]"></div>}
           </button>
           <button onClick={() => setActiveTab('market')} className={`flex-1 flex flex-col items-center transition-all ${activeTab === 'market' ? 'text-white scale-110' : 'text-slate-700 hover:text-slate-400'}`}>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">CLUSTERS</span>
              {activeTab === 'market' && <div className="w-6 h-[2px] bg-white rounded-full mt-2 shadow-[0_0_12px_#fff]"></div>}
           </button>
           <button onClick={onOpenAccount} className="flex-1 flex flex-col items-center text-slate-700 hover:text-white transition-all">
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">TERMINAL</span>
           </button>
        </div>
      </nav>
    </div>
  );
};

export default VipDashboard;

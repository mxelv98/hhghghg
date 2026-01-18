
import React, { useState, useEffect } from 'react';

interface LoginPageProps {
  onLogin: (email: string, method: 'email' | 'google') => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);

  const steps = [
    "Initializing Pluxo...",
    "Neural Handshake...",
    "Securing Hub...",
    "Terminal Ready."
  ];

  const verifySequence = [
    "RETINAL SCAN ACTIVE",
    "NEURAL ID VERIFIED",
    "OPERATOR_AUTH_SYNCED",
    "ACCESS GRANTED"
  ];

  const simulateLogin = async (type: 'email' | 'google') => {
    setIsLoading(true);
    for (let i = 0; i < steps.length; i++) {
      setStep(i);
      await new Promise(r => setTimeout(r, 400));
    }
    onLogin(type === 'google' ? 'pluxo_g_auth@terminal.io' : email || 'operator@pluxo.io', type);
  };

  const handleStartLogin = () => {
    setIsVerifying(true);
  };

  useEffect(() => {
    if (isVerifying && verificationStep < verifySequence.length) {
      const timer = setTimeout(() => {
        setVerificationStep(prev => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isVerifying, verificationStep]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) simulateLogin('email');
  };

  if (!isVerifying) {
    return (
      <div className="flex flex-col h-full bg-brand-bg text-slate-200 p-10 items-center justify-center relative overflow-hidden grid-bg">
        <div className="absolute inset-0 bg-brand-primary/5 blur-[120px]"></div>
        <div className="relative z-10 text-center space-y-12">
           <div className="w-32 h-32 rounded-full border-2 border-brand-primary/30 flex items-center justify-center relative group cursor-pointer" onClick={handleStartLogin}>
              <div className="absolute inset-0 border-t-2 border-brand-primary rounded-full animate-spin"></div>
              <div className="w-24 h-24 rounded-full bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-primary/20 transition-all">
                 <svg className="text-brand-primary animate-pulse" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
           </div>
           <div>
              <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase">PLUXO <span className="text-brand-primary">HUB</span></h1>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.6em] mt-4">Touch to Initialize Handshake</p>
           </div>
        </div>
      </div>
    );
  }

  if (isVerifying && verificationStep < verifySequence.length) {
    return (
      <div className="flex flex-col h-full bg-brand-bg text-slate-200 p-10 items-center justify-center relative overflow-hidden grid-bg">
        <div className="w-full max-w-[280px] space-y-8 text-center">
           <div className="relative h-48 flex items-center justify-center">
              <div className="absolute w-full h-1 bg-brand-primary/20 top-1/2 -translate-y-1/2 animate-scan"></div>
              <svg className="text-brand-primary opacity-40" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7zm10-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg>
              {/* Biometric Scan Line */}
              <div className="absolute top-0 left-0 w-full h-full border border-brand-primary/10 rounded-xl overflow-hidden">
                 <div className="h-1 w-full bg-brand-primary shadow-[0_0_15px_#e11d48] animate-[scan_2s_infinite]"></div>
              </div>
           </div>
           <p className="text-[10px] font-mono font-black text-brand-primary tracking-[0.4em] uppercase animate-pulse">
             {verifySequence[verificationStep]}
           </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-brand-bg text-slate-200 p-10 justify-center relative overflow-hidden grid-bg">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10">
        <div className="mb-14 text-center">
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
            PLUXO <span className="text-brand-primary">SIGNAL</span>
          </h1>
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.6em] mt-2">Neural Prediction Hub</p>
        </div>

        {isLoading ? (
          <div className="space-y-8 py-10">
            <div className="flex flex-col items-center">
              <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden mb-6">
                <div 
                  className="h-full bg-brand-primary transition-all duration-300 shadow-[0_0_10px_rgba(225,29,72,1)]" 
                  style={{ width: `${(step + 1) * 25}%` }}
                ></div>
              </div>
              <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em] animate-pulse">{steps[step]}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-700">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Operator ID"
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-6 py-5 text-sm font-bold focus:border-brand-primary focus:ring-0 transition-all placeholder:text-slate-700 text-white font-mono"
                required
              />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Access Key"
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-6 py-5 text-sm font-bold focus:border-brand-primary focus:ring-0 transition-all placeholder:text-slate-700 text-white font-mono"
                required
              />
              <button 
                type="submit"
                className="w-full bg-brand-primary text-white font-black py-6 rounded-2xl text-xs uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all shadow-[0_20px_40px_rgba(225,29,72,0.2)] active:scale-95"
              >
                Establish Uplink
              </button>
            </form>

            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-white/5"></div>
              <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">G-NODE SYNC</span>
              <div className="flex-1 h-px bg-white/5"></div>
            </div>

            <button 
              onClick={() => simulateLogin('google')}
              className="w-full glass bg-white/5 border border-white/10 text-white font-black py-5 rounded-2xl text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-white hover:text-black transition-all group active:scale-95"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white group-hover:text-black transition-colors">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              </svg>
              Biometric Google Auth
            </button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;

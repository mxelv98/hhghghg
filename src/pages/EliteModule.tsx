import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AreaChart, Area, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Shield, Settings, Target, Activity, Rocket, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { useIsMobile } from '@/hooks/useIsMobile';

// Types
type RiskLevel = 'low' | 'medium' | 'high';
interface DataPoint {
    time: number;
    value: number;
    risk: RiskLevel;
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

// Custom Dot Component with enhanced glow
const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (!cx || !cy) return null;

    const color = payload.risk === 'high' ? '#ff2d95' : payload.risk === 'medium' ? '#f97316' : '#22c55e';
    const isLast = props.index === props.dataLength - 1;

    return (
        <svg x={cx - 15} y={cy - 15} width={30} height={30} className="overflow-visible pointer-events-none">
            {isLast && (
                <>
                    <circle cx="15" cy="15" r="12" fill={color} opacity="0.3">
                        <animate attributeName="r" values="12;20;12" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="15" cy="15" r="5" fill="white" className="animate-pulse" />
                </>
            )}
            <circle cx="15" cy="15" r="4" fill={color} stroke="white" strokeWidth="2" />
        </svg>
    );
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <GlassCard className="p-3 min-w-[150px] bg-black/90 border-white/10" hoverGlow={false}>
                <div className="text-gray-500 text-[9px] font-mono tracking-widest mb-1 uppercase">Node_{100 + data.time}</div>
                <div className="text-2xl font-black text-white font-mono mb-1">{data.value.toFixed(2)}x</div>
                <div className={cn(
                    "text-[8px] font-bold uppercase flex items-center gap-1.5 px-1.5 py-0.5 rounded-lg border w-fit",
                    data.risk === 'high' ? 'text-red-500 border-red-500/20 bg-red-500/5' :
                        data.risk === 'medium' ? 'text-orange-500 border-orange-500/20 bg-orange-500/5' :
                            'text-green-500 border-green-500/20 bg-green-500/5'
                )}>
                    <div className={cn("w-1 h-1 rounded-full",
                        data.risk === 'high' ? 'bg-red-500' :
                            data.risk === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                    )} />
                    {data.risk}
                </div>
            </GlassCard>
        );
    }
    return null;
};

export default function EliteModule() {
    const isMobile = useIsMobile();
    const [data, setData] = useState<DataPoint[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [riskSetting, setRiskSetting] = useState<RiskLevel>('medium');
    const [showSettings, setShowSettings] = useState(!isMobile);

    useEffect(() => {
        const initial = Array.from({ length: 20 }, (_, i) => ({
            time: i,
            value: 1 + Math.random() * 3,
            risk: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low' as RiskLevel
        }));
        setData(initial);
    }, []);

    const generatePrediction = () => {
        setIsGenerating(true);
        setTimeout(() => {
            const lastTime = data.length > 0 ? data[data.length - 1].time : 0;
            let base = 1.0;
            let volatility = 1.0;
            if (riskSetting === 'low') { base = 1.5; volatility = 0.5; }
            if (riskSetting === 'high') { base = 2.5; volatility = 3.0; }
            const val = Math.max(1.00, base + (Math.random() - 0.4) * volatility * 2);
            let risk: RiskLevel = 'low';
            if (val > 2) risk = 'medium';
            if (val > 5) risk = 'high';
            const newPoint: DataPoint = { time: lastTime + 1, value: val, risk };
            const newData = [...data, newPoint];
            if (newData.length > 50) newData.shift();
            setData(newData);
            setIsGenerating(false);
        }, 800);
    };

    const currentRiskColor = riskSetting === 'high' ? '#ff2d95' : riskSetting === 'medium' ? '#f97316' : '#22c55e';

    const Background = () => (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-[-20%] left-[10%] w-[80vw] h-[80vw] bg-purple-900/10 rounded-full blur-[150px] animate-pulse-fast" />
            <div className="absolute bottom-[-20%] right-[10%] w-[80vw] h-[80vw] bg-blue-900/10 rounded-full blur-[150px]" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay" />
        </div>
    );

    const RiskSelector = ({ vertical = false }: { vertical?: boolean }) => (
        <div className={cn("grid gap-3", vertical ? "grid-cols-1" : "grid-cols-3")}>
            {(['low', 'medium', 'high'] as RiskLevel[]).map(r => (
                <button
                    key={r}
                    onClick={() => setRiskSetting(r)}
                    className={cn(
                        "p-4 rounded-xl border text-left transition-all relative overflow-hidden group",
                        riskSetting === r
                            ? "bg-white/10 border-white/20 text-white shadow-xl"
                            : "bg-black/40 border-white/5 text-gray-500 hover:bg-white/5"
                    )}
                >
                    <div className="relative z-10 flex justify-between items-center">
                        <span className="capitalize font-black tracking-widest text-[10px] italic">{r}</span>
                        {riskSetting === r && (
                            <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse",
                                r === 'high' ? 'bg-red-500' : r === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                            )} />
                        )}
                    </div>
                </button>
            ))}
        </div>
    );

    if (isMobile) {
        return (
            <div className="min-h-screen bg-[#030712] text-white font-sans selection:bg-pluxo-pink/30 flex flex-col pt-24">
                <Background />

                <header className="px-6 mb-6 flex items-center justify-between relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-pluxo-pink animate-pulse" />
                            <span className="text-pluxo-pink text-[8px] font-mono tracking-[0.3em] uppercase font-bold">Priority Link</span>
                        </div>
                        <h1 className="text-3xl font-black italic tracking-tight uppercase">
                            ELITE <span className="text-gradient">MOBILE</span>
                        </h1>
                    </div>
                    <button
                        onClick={() => setShowSettings(true)}
                        className="p-3 rounded-xl bg-white/5 border border-white/10 text-white"
                    >
                        <Settings className="h-5 w-5" />
                    </button>
                </header>

                <div className="flex-1 px-4 mb-6 relative z-10 flex flex-col">
                    <GlassCard className="flex-1 p-0 flex flex-col overflow-hidden bg-black/40 border-white/5 h-full" hoverGlow={false}>
                        <div className="p-4 border-b border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-500 tracking-widest italic">
                            <span className="flex items-center gap-2"><Rocket className="h-3 w-3 text-pluxo-pink" /> QUANTUM_STREAM</span>
                            <span className="text-white font-black">{data.length > 0 ? data[data.length - 1].value.toFixed(2) : "0.00"}x</span>
                        </div>

                        <div className="flex-1 relative p-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="eliteMobileFill" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={currentRiskColor} stopOpacity={0.4} />
                                            <stop offset="100%" stopColor={currentRiskColor} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke={currentRiskColor}
                                        strokeWidth={3}
                                        fill="url(#eliteMobileFill)"
                                        dot={(props) => <CustomDot {...props} dataLength={data.length} />}
                                        animationDuration={500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
                            <div className={cn(
                                "text-[9px] font-black uppercase tracking-widest flex items-center gap-2",
                                data.length > 0 && data[data.length - 1].risk === 'high' ? 'text-red-500' :
                                    data.length > 0 && data[data.length - 1].risk === 'medium' ? 'text-orange-500' : 'text-green-500'
                            )}>
                                <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                                {data.length > 0 ? data[data.length - 1].risk : 'LINKED'}
                            </div>
                            <span className="text-[10px] font-mono text-gray-600">AES-256</span>
                        </div>
                    </GlassCard>
                </div>

                <div className="px-4 pb-8 relative z-10">
                    <Button
                        size="xl"
                        variant="premium"
                        disabled={isGenerating}
                        onClick={generatePrediction}
                        className="w-full h-16 text-xl font-black tracking-widest uppercase rounded-2xl shadow-pluxo-pink/20 shadow-xl italic"
                    >
                        {isGenerating ? "SYNCING..." : "EXECUTE"}
                    </Button>
                </div>

                {/* Mobile Settings Drawer */}
                <AnimatePresence>
                    {showSettings && isMobile && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowSettings(false)}
                                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                            />
                            <motion.div
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="fixed bottom-0 left-0 right-0 z-[101] p-6 pt-10"
                            >
                                <GlassCard className="rounded-t-[2.5rem] p-8 border-white/10 bg-pluxo-dark/95 shadow-2xl" hoverGlow={false}>
                                    <button
                                        onClick={() => setShowSettings(false)}
                                        className="absolute top-6 right-6 p-2 text-gray-500"
                                    >
                                        <X />
                                    </button>
                                    <h3 className="text-white text-xs font-black font-mono uppercase tracking-[0.3em] mb-8 flex items-center gap-3 italic">
                                        <Shield className="h-4 w-4 text-pluxo-pink" /> Neural Config
                                    </h3>
                                    <div className="space-y-6 mb-8">
                                        <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Target Volatility</p>
                                        <RiskSelector />
                                    </div>
                                    <Link to="/dashboard" className="block w-full">
                                        <Button variant="outline" className="w-full h-14 border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest">
                                            Disconnect Session
                                        </Button>
                                    </Link>
                                </GlassCard>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#030712] text-white font-sans selection:bg-pluxo-pink/30 pb-12 relative overflow-x-hidden">
            <Background />

            {/* Main Layout Grid */}
            <div className="relative z-10 w-full min-h-screen grid grid-rows-[auto_1fr_auto] p-6 md:p-12 box-border gap-8 max-w-7xl mx-auto">

                {/* 1. Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-4">
                    <div className="text-center md:text-left">
                        <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
                            <div className="h-2 w-2 rounded-full bg-pluxo-pink shadow-[0_0_10px_#ff2d95] animate-pulse" />
                            <span className="text-pluxo-pink text-[10px] font-mono tracking-[0.4em] uppercase font-bold">Priority Link Established</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase italic text-gradient">
                            ELITE <span className="text-white">NODE</span>
                        </h1>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className={cn(
                                "p-4 rounded-2xl border transition-all duration-500 group",
                                showSettings ? "bg-white text-black border-white shadow-white/20 shadow-xl" : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                            )}
                        >
                            <Settings className={cn("h-6 w-6 group-hover:rotate-90 transition-transform duration-500", showSettings ? "animate-spin-slow" : "")} />
                        </button>
                        <Link to="/dashboard">
                            <Button variant="outline" className="rounded-2xl h-14 px-8 border-red-500/30 text-red-500 hover:bg-red-500/10 hover:border-red-500/50 uppercase font-bold tracking-widest text-xs">
                                Disconnect
                            </Button>
                        </Link>
                    </div>
                </header>

                {/* 2. Main Content: Chart + Sidebar */}
                <div className="flex flex-col lg:flex-row gap-8 min-h-0">

                    {/* The Chart Area */}
                    <GlassCard className="flex-1 p-0 overflow-hidden bg-black/40 border-white/5 flex flex-col group min-h-[400px]" hoverGlow={false}>
                        {/* Status Bar */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 tracking-widest uppercase italic">
                                <Rocket className="h-4 w-4 text-pluxo-pink animate-pulse" />
                                Quantum Prediction Matrix
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-4xl font-mono font-black text-white group-hover:text-pluxo-pink transition-colors">
                                    {data.length > 0 ? data[data.length - 1].value.toFixed(2) : '0.00'}
                                    <span className="text-xl text-gray-600 ml-1 font-normal opacity-50">x</span>
                                </div>
                            </div>
                        </div>

                        {/* Chart Component */}
                        <div className="flex-1 relative p-8">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="eliteFill" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={currentRiskColor} stopOpacity={0.4} />
                                            <stop offset="100%" stopColor={currentRiskColor} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="6 6" stroke="#ffffff03" vertical={false} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff10', strokeWidth: 1 }} />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke={currentRiskColor}
                                        strokeWidth={5}
                                        fill="url(#eliteFill)"
                                        dot={(props) => <CustomDot {...props} dataLength={data.length} />}
                                        isAnimationActive={true}
                                        animationDuration={500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Subheader */}
                        <div className="px-8 py-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
                            <div className={cn(
                                "text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3",
                                data.length > 0 && data[data.length - 1].risk === 'high' ? 'text-red-500' :
                                    data.length > 0 && data[data.length - 1].risk === 'medium' ? 'text-orange-500' : 'text-green-500'
                            )}>
                                <span className="flex h-2 w-2 relative">
                                    <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                                        data.length > 0 && data[data.length - 1].risk === 'high' ? 'bg-red-500' :
                                            data.length > 0 && data[data.length - 1].risk === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                                    )}></span>
                                    <span className={cn("relative inline-flex rounded-full h-2 w-2",
                                        data.length > 0 && data[data.length - 1].risk === 'high' ? 'bg-red-500' :
                                            data.length > 0 && data[data.length - 1].risk === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                                    )}></span>
                                </span>
                                Risk Status: {data.length > 0 ? data[data.length - 1].risk : 'Calibrating'}
                            </div>
                            <div className="text-[10px] font-mono text-gray-600 tracking-widest">ENCRYPTED STREAM // ISO-8601</div>
                        </div>
                    </GlassCard>

                    {/* Desktop Sidebar */}
                    <AnimatePresence>
                        {showSettings && !isMobile && (
                            <motion.div
                                initial={{ width: 0, opacity: 0, x: 20 }}
                                animate={{ width: 380, opacity: 1, x: 0 }}
                                exit={{ width: 0, opacity: 0, x: 20 }}
                                className="flex-shrink-0"
                            >
                                <GlassCard className="h-full bg-white/[0.02] border-white/5 p-8 flex flex-col gap-8 rounded-[2.5rem]" hoverGlow={false}>
                                    <div>
                                        <h3 className="text-white text-xs font-black font-mono uppercase tracking-[0.3em] mb-8 flex items-center gap-3 italic">
                                            <Shield className="h-4 w-4 text-pluxo-pink" /> Neural Config
                                        </h3>

                                        <div className="space-y-6">
                                            <div className="space-y-3">
                                                <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase text-center pb-2 border-b border-white/5">Target Volatility</p>
                                                <RiskSelector vertical />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-hidden bg-black/40 rounded-3xl border border-white/5 p-6 flex flex-col">
                                        <h3 className="text-gray-600 text-[10px] font-mono uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Analysis Feed</h3>
                                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                                            {[...data].reverse().slice(0, 10).map((pt, i) => (
                                                <div key={i} className="flex justify-between items-center py-2 border-b border-white/[0.03] last:border-0 text-[10px] font-mono group/item">
                                                    <span className="text-gray-600 group-hover/item:text-gray-400 transition-colors">#{100 + pt.time}</span>
                                                    <span className={cn("font-bold",
                                                        pt.risk === 'high' ? 'text-red-500/80' : pt.risk === 'medium' ? 'text-orange-500/80' : 'text-green-500/80'
                                                    )}>
                                                        {pt.value.toFixed(2)}x
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 3. Footer / Action Area */}
                <div className="mt-8 flex justify-center items-center relative">
                    {/* Background glow for button */}
                    <motion.div
                        animate={{
                            backgroundColor: isGenerating ? 'rgba(255, 255, 255, 0.1)' : currentRiskColor + '33',
                            scale: isGenerating ? 0.9 : 1.1
                        }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-40 blur-[80px] transition-colors duration-700 z-0"
                    />

                    <Button
                        size="xl"
                        variant="premium"
                        disabled={isGenerating}
                        onClick={generatePrediction}
                        className="relative h-28 w-full md:w-[700px] text-3xl font-black tracking-[0.2em] uppercase rounded-[2rem] border-2 border-white/20 shadow-2xl z-20 overflow-hidden transform hover:scale-[1.02] active:scale-[0.98] transition-all italic"
                    >
                        {isGenerating ? (
                            <span className="flex items-center gap-6 animate-pulse">
                                <Activity className="h-10 w-10 animate-spin" />
                                SYNCHRONIZING...
                            </span>
                        ) : (
                            <span className="flex items-center gap-6">
                                <Target className="h-10 w-10" />
                                EXECUTE PREDICTION
                            </span>
                        )}
                        {!isGenerating && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />}
                    </Button>
                </div>
            </div>
        </div>
    );
}


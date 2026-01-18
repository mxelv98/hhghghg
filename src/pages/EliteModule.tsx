import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';
import { Shield, Settings, Target, Activity } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Types
type RiskLevel = 'low' | 'medium' | 'high';
interface DataPoint {
    time: number;
    value: number;
    risk: RiskLevel;
}

// Custom Dot Component with enhanced glow
const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (!cx || !cy) return null;

    const color = payload.risk === 'high' ? '#ef4444' : payload.risk === 'medium' ? '#f97316' : '#22c55e';

    // Only animate the last dot strictly
    const isLast = props.index === props.dataLength - 1;

    return (
        <svg x={cx - 10} y={cy - 10} width={20} height={20} className="overflow-visible pointer-events-none">
            {isLast && (
                <>
                    <circle cx="10" cy="10" r="12" fill={color} opacity="0.2">
                        <animate attributeName="r" values="12;20;12" dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.2;0;0.2" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="10" cy="10" r="6" fill="white" fillOpacity="0.8" className="animate-pulse" />
                </>
            )}
            <circle cx="10" cy="10" r="4" fill={color} stroke="white" strokeWidth="2" />
        </svg>
    );
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-black/90 border border-white/20 p-4 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl min-w-[200px]">
                <div className="text-gray-400 text-xs font-mono mb-2 tracking-widest">ROUND #{1000 + data.time}</div>
                <div className="flex items-baseline gap-2 mb-2">
                    <div className="text-4xl font-bold text-white font-mono">{data.value.toFixed(2)}x</div>
                </div>
                <div className={`text-xs font-bold uppercase flex items-center gap-2 px-2 py-1.5 rounded bg-white/5 border border-white/5 w-fit ${data.risk === 'high' ? 'text-red-500 border-red-500/30' : data.risk === 'medium' ? 'text-orange-500 border-orange-500/30' : 'text-green-500 border-green-500/30'
                    }`}>
                    <div className={`w-2 h-2 rounded-full ${data.risk === 'high' ? 'bg-red-500' : data.risk === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                        }`} />
                    {data.risk.toUpperCase()} RISK
                </div>
            </div>
        );
    }
    return null;
};

export default function EliteModule() {
    // State
    const [data, setData] = useState<DataPoint[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [riskSetting, setRiskSetting] = useState<RiskLevel>('medium');
    const [showSettings, setShowSettings] = useState(false);

    // Initial Data
    useEffect(() => {
        const initial = Array.from({ length: 20 }, (_, i) => ({
            time: i,
            value: 1 + Math.random() * 3,
            risk: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low' as RiskLevel
        }));
        setData(initial);
    }, []);

    // Generate Single Prediction
    const generatePrediction = () => {
        setIsGenerating(true);
        // Instant feedback animation
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

            const newPoint: DataPoint = {
                time: lastTime + 1,
                value: val,
                risk
            };

            const newData = [...data, newPoint];
            if (newData.length > 50) newData.shift(); // Keep max 50 points

            setData(newData);
            setIsGenerating(false);
        }, 400); // 400ms "calculation" delay
    };

    const currentRiskColor = riskSetting === 'high' ? '#ef4444' : riskSetting === 'medium' ? '#f97316' : '#22c55e';

    return (
        <div className="fixed inset-0 w-screen h-screen bg-[#030712] text-white overflow-hidden font-sans selection:bg-pluxo-pink/30">
            {/* Cinematic Background */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[10%] w-[80vw] h-[80vw] bg-purple-900/10 rounded-full blur-[150px] animate-pulse-fast" />
                <div className="absolute bottom-[-20%] right-[10%] w-[80vw] h-[80vw] bg-blue-900/10 rounded-full blur-[150px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay" />

                {/* Floating Particles (CSS Animation simulated) */}
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white/20 blur-[1px] animate-float"
                        style={{
                            width: Math.random() * 4 + 1 + 'px',
                            height: Math.random() * 4 + 1 + 'px',
                            left: Math.random() * 100 + 'vw',
                            top: Math.random() * 100 + 'vh',
                            animationDuration: Math.random() * 10 + 10 + 's',
                            animationDelay: Math.random() * 5 + 's'
                        }}
                    />
                ))}
            </div>

            {/* Main Layout Grid */}
            <div className="relative z-10 w-full h-full grid grid-rows-[auto_1fr_auto] p-4 md:p-8 lg:p-12 box-border">

                {/* 1. Header Section */}
                <header className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-pulse" />
                            <span className="text-cyan-400 text-xs font-mono tracking-[0.3em] uppercase">System Online</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                            ELITE MODULE
                        </h1>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className={`p-4 rounded-full border transition-all duration-300 ${showSettings ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                                }`}
                        >
                            <Settings className={`h-6 w-6 ${showSettings ? 'animate-spin-slow' : ''}`} />
                        </button>
                        <button
                            onClick={() => window.location.href = '/dashboard'}
                            className="px-6 py-3 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-mono tracking-widest uppercase transition-colors"
                        >
                            Log Off
                        </button>
                    </div>
                </header>

                {/* 2. Main Content: Chart + Sidebar */}
                <div className="flex gap-8 min-h-0">

                    {/* The Chart - Taking max space */}
                    <div className="flex-1 relative bg-black/40 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm shadow-2xl flex flex-col">
                        {/* Status Overlay */}
                        <div className="absolute top-6 right-6 z-20 flex flex-col items-end gap-1 pointer-events-none">
                            <div className="text-5xl font-mono font-bold text-white drop-shadow-lg">
                                {data.length > 0 ? data[data.length - 1].value.toFixed(2) : '0.00'}
                                <span className="text-2xl text-gray-500 ml-1">x</span>
                            </div>
                            <div className={`text-xs font-bold px-2 py-1 rounded bg-black/50 border border-white/10 backdrop-blur-md uppercase tracking-widest ${data.length > 0 && data[data.length - 1].risk === 'high' ? 'text-red-500' :
                                data.length > 0 && data[data.length - 1].risk === 'medium' ? 'text-orange-500' : 'text-green-500'
                                }`}>
                                Current Risk: {data.length > 0 ? data[data.length - 1].risk : 'CALIBRATING'}
                            </div>
                        </div>

                        {/* Chart Component */}
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={currentRiskColor} stopOpacity={0.2} />
                                        <stop offset="100%" stopColor={currentRiskColor} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="time" hide />
                                <YAxis domain={['auto', 'auto']} hide />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff20', strokeWidth: 1 }} />
                                {/* Previous ghost line logic could go here if we tracked history differently, for now just main line */}
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={currentRiskColor}
                                    strokeWidth={4}
                                    fill="url(#chartFill)"
                                    dot={(props) => <CustomDot {...props} dataLength={data.length} />}
                                    isAnimationActive={true}
                                    animationDuration={300}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Collapsible/Optional Sidebar */}
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: showSettings ? 350 : 0, opacity: showSettings ? 1 : 0 }}
                        className="overflow-hidden flex-shrink-0"
                    >
                        <div className="w-[350px] h-full bg-[#0a0f18] border border-white/10 rounded-3xl p-6 flex flex-col gap-6">
                            <div>
                                <h3 className="text-gray-400 text-xs font-bold font-mono uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Shield className="h-4 w-4" /> Neural Configuration
                                </h3>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500 font-mono">RISK MODE</label>
                                        <div className="grid grid-cols-1 gap-2">
                                            {['low', 'medium', 'high'].map(r => (
                                                <button
                                                    key={r}
                                                    onClick={() => setRiskSetting(r as RiskLevel)}
                                                    className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group ${riskSetting === r
                                                        ? 'bg-white/10 border-white/30 text-white shadow-lg'
                                                        : 'bg-black/20 border-white/5 text-gray-500 hover:bg-white/5'
                                                        }`}
                                                >
                                                    <div className="relative z-10 flex justify-between items-center">
                                                        <span className="capitalize font-bold text-sm">{r} Risk</span>
                                                        {riskSetting === r && <div className="h-2 w-2 rounded-full bg-white animate-pulse" />}
                                                    </div>
                                                    {riskSetting === r && <div className={`absolute inset-0 opacity-10 ${r === 'high' ? 'bg-red-500' : r === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                                                        }`} />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-hidden bg-black/20 rounded-xl border border-white/5 p-4 flex flex-col">
                                <h3 className="text-gray-500 text-[10px] font-mono uppercase mb-3">Live Log</h3>
                                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
                                    {[...data].reverse().slice(0, 8).map((pt, i) => (
                                        <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0 text-xs font-mono">
                                            <span className="text-gray-600">T-{data.length - pt.time}</span>
                                            <span className={pt.risk === 'high' ? 'text-red-500' : pt.risk === 'medium' ? 'text-orange-500' : 'text-green-500'}>
                                                {pt.value.toFixed(2)}x
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* 3. Footer / Action Area */}
                <div className="mt-8 flex justify-center items-center relative">
                    {/* Background glow for button */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 blur-[60px] transition-colors duration-500 ${isGenerating ? 'bg-white/20' :
                        riskSetting === 'high' ? 'bg-red-500/30' :
                            riskSetting === 'medium' ? 'bg-orange-500/30' : 'bg-green-500/30'
                        }`} />

                    <Button
                        size="lg"
                        disabled={isGenerating}
                        onClick={generatePrediction}
                        className={`
                            relative h-24 w-full md:w-[600px] text-2xl md:text-3xl font-black tracking-widest uppercase rounded-2xl
                            border-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                            shadow-[0_0_40px_rgba(0,0,0,0.5)] z-20 overflow-hidden
                            ${isGenerating
                                ? 'bg-gray-900 border-gray-800 text-gray-600 cursor-not-allowed'
                                : 'bg-white border-white text-black hover:bg-gray-100 hover:shadow-[0_0_60px_rgba(255,255,255,0.3)]'
                            }
                        `}
                    >
                        {isGenerating ? (
                            <span className="flex items-center gap-4 animate-pulse">
                                <Activity className="h-8 w-8 animate-spin" />
                                PROCESSING
                            </span>
                        ) : (
                            <span className="flex items-center gap-4">
                                <Target className="h-8 w-8" />
                                GENERATE PREDICTION
                            </span>
                        )}

                        {/* Shimmer effect */}
                        {!isGenerating && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />}
                    </Button>
                </div>
            </div>
        </div>
    );
}

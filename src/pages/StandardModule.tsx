import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import { Lock, Zap, ArrowRight, CheckCircle, TrendingUp, Activity } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface DataPoint {
    time: number;
    value: number;
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-black/90 border border-white/10 p-3 rounded-lg shadow-2xl backdrop-blur-md">
                <div className="text-gray-400 text-xs mb-1">Round #{1000 + data.time}</div>
                <div className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pluxo-pink animate-pulse" />
                    {data.value.toFixed(2)}x
                </div>
            </div>
        );
    }
    return null;
};

export default function StandardModule() {
    const { user } = useAuth();
    const [data, setData] = useState<DataPoint[]>([]);
    const [hasUsed, setHasUsed] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

    // Determine if user has unlimited access (VUP or VIP)
    const hasUnlimitedAccess = user?.vip_status === 'active' && (user?.plan_type === 'vup' || user?.plan_type === 'vip');

    // Check localStorage for previous use (Only relevant for non-subscribers)
    useEffect(() => {
        if (hasUnlimitedAccess) return; // Don't enforce limits for subscribers

        const used = localStorage.getItem('standard_module_used');
        if (used === 'true') {
            setHasUsed(true);
            const savedData = localStorage.getItem('standard_module_data');
            if (savedData) {
                setData(JSON.parse(savedData));
            }
        }
    }, [hasUnlimitedAccess]);

    const generatePrediction = () => {
        // If not unlimited and already used, stop
        if (!hasUnlimitedAccess && hasUsed) return;

        setIsGenerating(true);
        setShowUpgradePrompt(false);

        // Simulated highly complex calculation delay
        setTimeout(() => {
            const prediction: DataPoint[] = Array.from({ length: 40 }, (_, i) => ({
                time: i,
                value: Math.max(1.00, 1.2 + Math.random() * 3 + Math.sin(i / 4) * 0.8)
            }));

            setData(prediction);
            setIsGenerating(false);

            // Only lock if NOT unlimited
            if (!hasUnlimitedAccess) {
                setHasUsed(true);
                localStorage.setItem('standard_module_used', 'true');
                localStorage.setItem('standard_module_data', JSON.stringify(prediction));
                setTimeout(() => setShowUpgradePrompt(true), 1500);
            }
        }, 1200);
    };

    return (
        <div className="min-h-screen w-full bg-[#050b14] text-white overflow-hidden relative font-sans selection:bg-pluxo-pink/30">

            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-pluxo-pink/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-pluxo-blue/5 rounded-full blur-[150px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            </div>

            <div className="relative z-10 container mx-auto px-4 h-screen flex flex-col pt-24 pb-8">

                {/* Header */}
                <header className="flex flex-col items-center justify-center mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        div className="flex items-center gap-3 mb-4"
                    >
                        <div className={`px-4 py-1.5 rounded-full border bg-opacity-10 backdrop-blur-md flex items-center gap-2 ${hasUnlimitedAccess
                                ? 'bg-green-500 border-green-500/30 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                                : 'bg-pluxo-blue border-pluxo-blue/30 text-pluxo-blue'
                            }`}>
                            {hasUnlimitedAccess ? <Zap className="h-3 w-3" /> : <Activity className="h-3 w-3" />}
                            <span className="text-xs font-bold tracking-widest uppercase">
                                {hasUnlimitedAccess ? 'VUP ENGINE ACTIVE' : 'STANDARD MODULE'}
                            </span>
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-center bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500"
                    >
                        Market Pattern Analysis
                    </motion.h1>
                </header>

                {/* Main HUD */}
                <div className="flex-1 flex flex-col items-center justify-center max-h-[600px]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-full max-w-5xl h-full bg-[#0b101a]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col p-1"
                    >
                        {/* Glass Overlay/Reflection */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none rounded-3xl" />

                        {/* Chart Area */}
                        <div className="flex-1 relative p-6 md:p-10">
                            {data.length > 0 ? (
                                <div className="w-full h-full relative z-10">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="chartStroke" x1="0" y1="0" x2="1" y2="0">
                                                    <stop offset="0%" stopColor="#ec4899" />
                                                    <stop offset="100%" stopColor="#3b82f6" />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                            <XAxis dataKey="time" hide />
                                            <YAxis hide domain={['auto', 'auto']} />
                                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }} />
                                            <Area
                                                type="monotone"
                                                dataKey="value"
                                                stroke="url(#chartStroke)"
                                                strokeWidth={3}
                                                fill="url(#chartFill)"
                                                animationDuration={2000}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                                    <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 animate-pulse-slow">
                                        <TrendingUp className="h-10 w-10 text-gray-500" />
                                    </div>
                                    <h3 className="text-xl font-medium text-gray-300 mb-2">Awaiting Input</h3>
                                    <p className="text-gray-500 max-w-sm">
                                        {hasUnlimitedAccess ? "System ready for unlimited VUP analysis cycles." : "Initialize one-time standard prediction sequence."}
                                    </p>
                                </div>
                            )}

                            {/* Locked Overlay */}
                            {!hasUnlimitedAccess && hasUsed && (
                                <div className="absolute inset-0 bg-[#050b14]/90 backdrop-blur-md flex flex-col items-center justify-center z-20 transition-all duration-500">
                                    <div className="p-8 rounded-2xl bg-[#0b101a] border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)] text-center max-w-md mx-4">
                                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
                                            <Lock className="h-8 w-8 text-red-500" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Trial Expired</h3>
                                        <p className="text-gray-400 mb-8">
                                            Standard protocol complete. Upgrade to VUP or Elite for continuous market access.
                                        </p>
                                        <Link to="/elite" className="block w-full">
                                            <Button className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 border-none text-white h-12 text-lg font-bold shadow-lg shadow-red-900/20">
                                                Unlock Full Access
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Controls Toolbar */}
                        <div className="h-24 border-t border-white/10 bg-black/40 px-8 flex items-center justify-between backdrop-blur-md">
                            <div className="hidden md:flex flex-col">
                                <span className="text-xs text-gray-500 uppercase tracking-wider font-mono">System Status</span>
                                <span className="text-sm text-green-500 font-mono flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    ONLINE • LOW LATENCY
                                </span>
                            </div>

                            <Button
                                size="lg"
                                disabled={(!hasUnlimitedAccess && hasUsed) || isGenerating}
                                onClick={generatePrediction}
                                className={`
                                    h-14 px-12 text-lg font-bold rounded-xl transition-all duration-300 min-w-[240px] shadow-lg
                                    ${(!hasUnlimitedAccess && hasUsed)
                                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                                        : 'bg-white text-black hover:bg-gray-200 hover:scale-[1.02] shadow-white/10'
                                    }
                                `}
                            >
                                {isGenerating ? (
                                    <span className="flex items-center gap-3">
                                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                        ANALYZING...
                                    </span>
                                ) : (!hasUnlimitedAccess && hasUsed) ? (
                                    <span className="flex items-center gap-2">LOCKED</span>
                                ) : (
                                    <span>{hasUnlimitedAccess ? 'RUN VUP ANALYSIS' : 'INITIATE PREDICTION'}</span>
                                )}
                            </Button>

                            <div className="hidden md:block w-32" /> {/* Spacer for balance */}
                        </div>
                    </motion.div>
                </div>

                {/* Footer Upsell for non-subs */}
                {!hasUnlimitedAccess && !hasUsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="text-center mt-6"
                    >
                        <p className="text-sm text-gray-500">
                            <span className="text-gray-400">Trial Mode Active</span> • Upgrade to VUP for unlimited access
                        </p>
                    </motion.div>
                )}
            </div>

            {/* Upgrade Toast Animation */}
            <AnimatePresence>
                {!hasUnlimitedAccess && showUpgradePrompt && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: 50 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-8 right-8 z-50"
                    >
                        <div className="bg-[#0b101a] border border-pluxo-pink/30 rounded-2xl shadow-[0_0_30px_rgba(236,72,153,0.2)] p-6 max-w-sm backdrop-blur-xl">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pluxo-pink to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <Zap className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white mb-1">Results Ready</h4>
                                    <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                                        Upgrade to VUP to unlock detailed probability breakdowns and unlimited daily predictions.
                                    </p>
                                    <div className="flex gap-2">
                                        <Link to="/elite" className="flex-1">
                                            <Button size="sm" className="w-full bg-white text-black hover:bg-gray-200">
                                                Upgrade Now
                                            </Button>
                                        </Link>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setShowUpgradePrompt(false)}
                                            className="text-gray-400 hover:text-white"
                                        >
                                            Dismiss
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

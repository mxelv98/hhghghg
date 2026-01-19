import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import { Lock, Zap, TrendingUp, Activity, Terminal, Shield, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/useIsMobile';

interface DataPoint {
    time: number;
    value: number;
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-black/90 border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-xl">
                <div className="text-gray-500 text-[9px] font-mono tracking-widest mb-1">NODE_{1000 + data.time}</div>
                <div className="text-xl font-bold text-white flex items-center gap-2 font-mono">
                    {data.value.toFixed(2)}x
                </div>
            </div>
        );
    }
    return null;
};

export default function StandardModule() {
    const { user } = useAuth();
    const isMobile = useIsMobile();
    const [data, setData] = useState<DataPoint[]>([]);
    const [hasUsed, setHasUsed] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

    const hasUnlimitedAccess = user?.vip_status === 'active' && (user?.plan_type === 'vup' || user?.plan_type === 'vip');

    useEffect(() => {
        if (hasUnlimitedAccess) return;

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
        if (!hasUnlimitedAccess && hasUsed) return;

        setIsGenerating(true);
        setShowUpgradePrompt(false);

        setTimeout(() => {
            const prediction: DataPoint[] = Array.from({ length: 40 }, (_, i) => ({
                time: i,
                value: Math.max(1.00, 1.2 + Math.random() * 3 + Math.sin(i / 4) * 0.8)
            }));

            setData(prediction);
            setIsGenerating(false);

            if (!hasUnlimitedAccess) {
                setHasUsed(true);
                localStorage.setItem('standard_module_used', 'true');
                localStorage.setItem('standard_module_data', JSON.stringify(prediction));
                setTimeout(() => setShowUpgradePrompt(true), 1500);
            }
        }, 1500);
    };

    // Shared Components
    const Background = () => (
        <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-pluxo-blue/5 rounded-full blur-[160px] animate-pulse-slow" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-pluxo-pink/5 rounded-full blur-[160px] animate-pulse-slow delay-700" />
        </div>
    );

    const UpgradeToast = () => (
        <AnimatePresence>
            {!hasUnlimitedAccess && showUpgradePrompt && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    className={cn(
                        "fixed z-50 w-full max-w-sm",
                        isMobile ? "bottom-4 left-4 right-4 max-w-none px-4" : "bottom-12 right-12"
                    )}
                >
                    <GlassCard className="p-6 md:p-8 border-pluxo-pink/30 shadow-[0_0_50px_rgba(236,72,153,0.3)] bg-pluxo-dark/95 rounded-[2rem] md:rounded-[2.5rem]">
                        <div className="flex flex-col">
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-pluxo-pink to-purple-600 flex items-center justify-center mb-4 md:mb-6 shadow-xl">
                                <Zap className="h-6 w-6 md:h-8 md:w-8 text-white fill-white" />
                            </div>
                            <h4 className="text-xl md:text-2xl font-black italic uppercase mb-2">Scan Finished</h4>
                            <p className="text-xs md:text-sm text-gray-400 mb-6 md:mb-8 leading-relaxed">
                                Pattern identified. Detailed neural breakdown and next 50 predictive nodes are restricted to VUP members.
                            </p>
                            <div className="flex gap-4">
                                <Link to="/elite" className="flex-1">
                                    <Button variant="premium" className="w-full text-sm md:text-base font-bold italic">
                                        Unlock Now
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    onClick={() => setShowUpgradePrompt(false)}
                                    className="text-gray-500 hover:text-white"
                                >
                                    Later
                                </Button>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>
            )}
        </AnimatePresence>
    );

    if (isMobile) {
        return (
            <div className="min-h-screen w-full bg-pluxo-dark text-white overflow-hidden relative font-sans selection:bg-pluxo-pink/30 flex flex-col">
                <Background />

                <div className="relative z-10 flex-1 flex flex-col pt-24 px-4 pb-8 h-full">
                    <header className="mb-6">
                        <div className={cn(
                            "inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-bold tracking-widest uppercase mb-4",
                            hasUnlimitedAccess ? "border-green-500/30 text-green-400 bg-green-500/5" : "border-pluxo-blue/30 text-pluxo-blue bg-pluxo-blue/5"
                        )}>
                            <span className="flex h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                            {hasUnlimitedAccess ? "Unlimited Access" : "Trial Mode"}
                        </div>
                        <h1 className="text-3xl font-black italic tracking-tight uppercase">
                            VUP <span className="text-gradient">MOBILE</span>
                        </h1>
                    </header>

                    {/* Mobile Chart Card */}
                    <GlassCard className="flex-1 min-h-[300px] p-0 mb-6 flex flex-col bg-black/40 border-white/5 relative overflow-hidden" hoverGlow={false}>
                        <div className="p-4 border-b border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-500">
                            <span className="flex items-center gap-2"><Activity className="h-3 w-3 text-pluxo-blue" /> LIVE_STREAM</span>
                            <span>CPU: 42%</span>
                        </div>

                        <div className="flex-1 relative">
                            {data.length > 0 ? (
                                <div className="absolute inset-0 p-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={data}>
                                            <defs>
                                                <linearGradient id="mobileFill" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#ff2d95" stopOpacity={0.4} />
                                                    <stop offset="100%" stopColor="#ff2d95" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <Area
                                                type="monotone"
                                                dataKey="value"
                                                stroke="#ff2d95"
                                                strokeWidth={3}
                                                fill="url(#mobileFill)"
                                                animationDuration={1000}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 px-6 text-center">
                                    <TrendingUp className="h-10 w-10 mb-4" />
                                    <p className="text-[10px] font-mono uppercase tracking-[0.2em]">Ready for initialization</p>
                                </div>
                            )}

                            {!hasUnlimitedAccess && hasUsed && (
                                <div className="absolute inset-0 bg-black/95 backdrop-blur-md z-20 flex flex-col items-center justify-center p-6 text-center">
                                    <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                                        <Lock className="h-6 w-6 text-red-500" />
                                    </div>
                                    <h3 className="text-xl font-bold uppercase italic mb-2">Protocol Locked</h3>
                                    <p className="text-xs text-gray-400 mb-6">Your trial has ended. Subscribe to continue.</p>
                                    <Link to="/elite" className="w-full">
                                        <Button variant="premium" className="w-full h-12 text-sm italic">Upgrade Now</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </GlassCard>

                    {/* Mobile Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <GlassCard className="p-4 py-3 flex items-center gap-3 border-white/5">
                            <Terminal className="h-4 w-4 text-gray-500" />
                            <div>
                                <p className="text-[8px] text-gray-600 font-mono tracking-widest uppercase">Ping</p>
                                <p className="text-xs font-mono font-bold text-green-500">14ms</p>
                            </div>
                        </GlassCard>
                        <GlassCard className="p-4 py-3 flex items-center gap-3 border-white/5">
                            <Shield className="h-4 w-4 text-gray-500" />
                            <div>
                                <p className="text-[8px] text-gray-600 font-mono tracking-widest uppercase">Safe</p>
                                <p className="text-xs font-mono font-bold text-pluxo-pink">YES</p>
                            </div>
                        </GlassCard>
                    </div>

                    <Button
                        variant={(!hasUnlimitedAccess && hasUsed) ? "outline" : "premium"}
                        disabled={(!hasUnlimitedAccess && hasUsed) || isGenerating}
                        onClick={generatePrediction}
                        className="w-full h-16 rounded-2xl text-lg font-black tracking-widest uppercase italic shadow-2xl"
                        size="xl"
                    >
                        {isGenerating ? "PROCESSING..." : (hasUnlimitedAccess ? "START SCAN" : "INITIALIZE")}
                    </Button>
                </div>

                <UpgradeToast />
            </div>
        );
    }

    // DESKTOP VIEW
    return (
        <div className="min-h-screen w-full bg-pluxo-dark text-white overflow-hidden relative font-sans selection:bg-pluxo-pink/30 transition-all duration-500">
            <Background />

            <div className="relative z-10 container mx-auto px-6 pt-32 pb-20 max-w-7xl min-h-screen flex flex-col">
                {/* Dashboard Header */}
                <header className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                    <div className="text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 mb-4 justify-center md:justify-start"
                        >
                            <div className={cn(
                                "px-4 py-1 rounded-full border text-[10px] font-bold tracking-[0.2em] uppercase backdrop-blur-md flex items-center gap-2",
                                hasUnlimitedAccess ? "border-green-500/30 text-green-400 bg-green-500/5" : "border-pluxo-blue/30 text-pluxo-blue bg-pluxo-blue/5"
                            )}>
                                <span className="relative flex h-2 w-2">
                                    <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", hasUnlimitedAccess ? "bg-green-400" : "bg-pluxo-blue")}></span>
                                    <span className={cn("relative inline-flex rounded-full h-2 w-2", hasUnlimitedAccess ? "bg-green-500" : "bg-pluxo-blue")}></span>
                                </span>
                                {hasUnlimitedAccess ? "UNLIMITED ACCESS" : "STANDARD MODE"}
                            </div>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-black tracking-tight mb-2"
                        >
                            VUP <span className="text-gradient">WORKSTATION</span>
                        </motion.h1>
                        <p className="text-gray-500 font-mono text-sm tracking-widest">STATION_ID: {user?.id?.slice(0, 8).toUpperCase() || "ANON-NODE"} // PATTERN ENGINE V2</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <GlassCard className="p-4 px-6 rounded-2xl flex items-center gap-4 border-white/5">
                            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-gray-400">
                                <Terminal className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Latency</span>
                                <span className="font-mono text-xl font-bold text-green-500">12ms</span>
                            </div>
                        </GlassCard>
                        <GlassCard className="p-4 px-6 rounded-2xl flex items-center gap-4 border-white/5">
                            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-gray-400">
                                <Shield className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Security</span>
                                <span className="font-mono text-xl font-bold text-pluxo-pink">SAFE</span>
                            </div>
                        </GlassCard>
                    </div>
                </header>

                {/* Main Visualization */}
                <div className="flex-1 min-h-[500px] mb-12">
                    <GlassCard className="w-full h-full p-0 overflow-hidden bg-black/40 border-white/5 flex flex-col group" hoverGlow={false}>
                        {/* Status Bar */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <div className="flex items-center gap-2 text-xs font-mono text-gray-500 tracking-widest uppercase">
                                <Activity className="h-4 w-4 text-pluxo-blue animate-pulse" />
                                Interactive Heatmap Matrix
                            </div>
                            <div className="flex gap-4 items-center">
                                <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-[10px] font-mono text-gray-400">
                                    REFRESH: 1.5s
                                </div>
                                <div className="flex gap-2">
                                    <div className="h-2 w-2 rounded-full bg-red-500/50" />
                                    <div className="h-2 w-2 rounded-full bg-yellow-500/50" />
                                    <div className="h-2 w-2 rounded-full bg-green-500/50" />
                                </div>
                            </div>
                        </div>

                        {/* Chart Area */}
                        <div className="flex-1 relative p-8">
                            {data.length > 0 ? (
                                <div className="w-full h-full relative z-10 animate-fade-in">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#ff2d95" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#ff2d95" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="chartStroke" x1="0" y1="0" x2="1" y2="0">
                                                    <stop offset="0%" stopColor="#ff2d95" />
                                                    <stop offset="100%" stopColor="#3b82f6" />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 2 }} />
                                            <Area
                                                type="monotone"
                                                dataKey="value"
                                                stroke="url(#chartStroke)"
                                                strokeWidth={4}
                                                fill="url(#chartFill)"
                                                animationDuration={1500}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 opacity-40">
                                    <div className="w-32 h-32 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center mb-8 animate-pulse-slow">
                                        <TrendingUp className="h-12 w-12 text-gray-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-400 mb-2">NEURAL ENGINE IDLE</h3>
                                    <p className="text-gray-500 font-mono tracking-widest text-xs">AWAITING INITIALIZATION SEQUENCE</p>
                                </div>
                            )}

                            {/* Locked Overlay */}
                            {!hasUnlimitedAccess && hasUsed && (
                                <div className="absolute inset-0 bg-[#020617]/98 backdrop-blur-xl flex flex-col items-center justify-center z-20 animate-fade-in">
                                    <div className="p-12 glass-panel rounded-[3rem] text-center max-w-lg mx-6 border-red-500/20 shadow-red-900/20 shadow-2xl">
                                        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                                            <Lock className="h-10 w-10 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                                        </div>
                                        <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase italic">Protocol Locked</h2>
                                        <p className="text-gray-400 mb-10 leading-relaxed">
                                            The trial analysis cycle has completed. Continuous neural monitoring requires an active VUP link.
                                        </p>
                                        <Link to="/elite" className="block w-full">
                                            <Button variant="premium" className="w-full h-16 text-xl" size="xl">
                                                Upgrade to VUP Access
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Module Controller */}
                        <div className="p-8 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
                            <div className="flex flex-col items-start gap-1">
                                <span className="text-[10px] text-gray-500 font-mono tracking-[0.3em] uppercase">Control System</span>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-xs font-bold text-gray-400">STATION_ONLINE</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-1.5 w-1.5 rounded-full bg-pluxo-blue" />
                                        <span className="text-xs font-bold text-gray-400">DATA_SYNC_READY</span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                size="xl"
                                variant={(!hasUnlimitedAccess && hasUsed) ? "outline" : "premium"}
                                disabled={(!hasUnlimitedAccess && hasUsed) || isGenerating}
                                onClick={generatePrediction}
                                className="min-w-[400px] font-black tracking-[0.2em] h-20 text-xl uppercase italic shadow-pluxo-pink/20 shadow-2xl"
                            >
                                {isGenerating ? (
                                    <span className="flex items-center gap-4">
                                        <Activity className="h-6 w-6 animate-spin" />
                                        SYNCHRONIZING...
                                    </span>
                                ) : (!hasUnlimitedAccess && hasUsed) ? (
                                    <span className="flex items-center gap-2 font-mono"><Lock className="h-6 w-6" /> ACCESS_DENIED</span>
                                ) : (
                                    <span className="flex items-center gap-4">
                                        <ChevronRight className="h-6 w-6" />
                                        {hasUnlimitedAccess ? "INITIATE MASTER SCAN" : "ESTABLISH LINK"}
                                    </span>
                                )}
                            </Button>

                            <div className="w-40" />
                        </div>
                    </GlassCard>
                </div>

                {/* Status Indicator */}
                {!hasUnlimitedAccess && !hasUsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="flex items-center justify-center gap-2 text-gray-600 font-mono text-[10px] tracking-widest uppercase italic"
                    >
                        <Zap className="h-3 w-3" /> Secure guest tunnel established // trial: 1/1
                    </motion.div>
                )}
            </div>

            <UpgradeToast />
        </div>
    );
}


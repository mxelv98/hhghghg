import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, TrendingUp, Activity, Clock, HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

export default function Modules() {
    const { user } = useAuth();

    // Determine access levels
    const isVupOrVip = user?.vip_status === 'active' && (user?.plan_type === 'vup' || user?.plan_type === 'vip');
    const isVip = user?.vip_status === 'active' && user?.plan_type === 'vip';

    const userName = user?.email?.split('@')[0] || 'Trader';

    return (
        <div className="min-h-screen bg-[#050b14] text-white selection:bg-pluxo-pink/30 pb-20">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-[-10%] w-[800px] h-[800px] bg-pluxo-blue/5 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-0 left-[-10%] w-[800px] h-[800px] bg-pluxo-pink/5 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
            </div>

            <div className="relative z-10 container mx-auto px-4 pt-8">

                {/* 1. Simplified Header/Welcome (Layout handles main nav, this is page-level) */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-center mb-12 border-b border-white/5 pb-6"
                >
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            Welcome, {userName}
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">System operational. Market latency: <span className="text-green-500 font-mono">12ms</span></p>
                    </div>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        {!isVip && !isVupOrVip && (
                            <Link to="/elite">
                                <Button size="sm" className="bg-gradient-to-r from-pluxo-pink to-pluxo-blue text-white border-0 shadow-[0_0_15px_rgba(236,72,153,0.3)] animate-pulse-slow">
                                    Upgrade Plan
                                </Button>
                            </Link>
                        )}
                    </div>
                </motion.div>

                {/* 2. Hero Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-center mb-16 max-w-4xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-mono text-gray-300 tracking-widest uppercase">Live Analysis Active</span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                        <span className="block text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-100 to-gray-500">
                            Elite Crash Predictions
                        </span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
                        Experience real-time probability curves and VIP analytics. Choose your engine below to begin your session.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <Link to="/standard">
                            <Button size="lg" className="rounded-full px-8 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/10 transition-all">
                                Try Standard Module
                            </Button>
                        </Link>
                        <Link to="/elite">
                            <Button size="lg" className={`rounded-full px-8 border-none text-white transition-all font-bold ${isVip
                                ? 'bg-green-600 hover:bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                                : 'bg-gradient-to-r from-pluxo-pink to-pluxo-blue hover:scale-105 shadow-[0_0_30px_rgba(236,72,153,0.4)]'
                                }`}>
                                {isVip ? (
                                    <>Launch Elite <Zap className="ml-2 h-5 w-5" /></>
                                ) : (
                                    <>Upgrade to Elite <ArrowRight className="ml-2 h-5 w-5" /></>
                                )}
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* 3. Modules Overview */}
                <div className="grid md:grid-cols-2 gap-8 mb-20 max-w-5xl mx-auto">

                    {/* Standard Module Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="group relative"
                    >
                        <Card className="h-full bg-[#0b101a] border-white/10 hover:border-pluxo-blue/50 transition-all duration-300 overflow-hidden flex flex-col">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-pluxo-blue/10 rounded-bl-full -mr-8 -mt-8" />

                            <div className="p-8 flex-1">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                                        <Activity className="h-8 w-8" />
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${isVupOrVip ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white/5 text-gray-400 border border-white/10'}`}>
                                        {isVupOrVip ? 'UNLOCKED' : 'TRIAL'}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-2">Standard Module</h3>
                                <p className="text-gray-400 text-sm mb-6">One-time free prediction for casual validation.</p>

                                {/* Mini Preview Chart */}
                                <div className="h-24 w-full bg-black/40 rounded-lg border border-white/5 mb-6 relative overflow-hidden flex items-end p-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                        <path d="M0,80 C50,60 100,70 150,30 S250,15 300,5" fill="none" stroke="#3b82f6" strokeWidth="2" />
                                    </svg>
                                </div>
                            </div>

                            <div className="p-6 border-t border-white/5 bg-white/vr">
                                <Link to="/standard">
                                    <Button className="w-full bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30">
                                        {isVupOrVip ? 'Enter Standard Engine' : 'Try Now'}
                                    </Button>
                                </Link>
                                {!isVupOrVip && <p className="text-xs text-center text-gray-500 mt-3">Visualizes 1 prediction cycle</p>}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Elite Module Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="group relative"
                    >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-pluxo-pink to-pluxo-blue rounded-2xl blur opacity-20 group-hover:opacity-50 transition duration-500" />
                        <Card className="h-full bg-[#0b101a] border-white/10 relative overflow-hidden flex flex-col">
                            <div className="p-8 flex-1">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 rounded-xl bg-pluxo-pink/10 text-pluxo-pink shadow-[0_0_20px_rgba(236,72,153,0.2)]">
                                        <Shield className="h-8 w-8" />
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${isVip
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                                        : 'bg-gradient-to-r from-pluxo-pink to-pluxo-blue text-white'
                                        }`}>
                                        {isVip ? 'ACTIVE' : 'ELITE'}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-2">Elite Module</h3>
                                <p className="text-gray-400 text-sm mb-6">Real-time neural engine with advanced probability curves.</p>

                                {/* Mini Preview Chart */}
                                <div className="h-24 w-full bg-black/40 rounded-lg border border-pluxo-pink/20 mb-6 relative overflow-hidden flex items-end p-2 group-hover:bg-pluxo-pink/5 transition-colors">
                                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                        <path d="M0,90 C80,80 120,40 200,20 S320,10 400,0" fill="none" stroke="url(#eliteGrad)" strokeWidth="3" className="drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]" />
                                        <defs>
                                            <linearGradient id="eliteGrad" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor="#ec4899" />
                                                <stop offset="100%" stopColor="#3b82f6" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute top-2 right-2 text-[10px] font-mono text-pluxo-pink animate-pulse">LIVE DATA</div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-white/5 bg-gradient-to-t from-pluxo-pink/5 to-transparent">
                                <Link to="/elite">
                                    <Button className={`w-full text-white border-none font-bold ${isVip
                                        ? 'bg-green-600 hover:bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                                        : 'bg-gradient-to-r from-pluxo-pink to-pluxo-blue hover:shadow-[0_0_20px_rgba(236,72,153,0.4)]'
                                        }`}>
                                        {isVip ? (
                                            <>Access Elite Engine <ArrowRight className="ml-2 h-5 w-5" /></>
                                        ) : (
                                            'Upgrade to Elite'
                                        )}
                                    </Button>
                                </Link>
                                {!isVip && <p className="text-xs text-center text-gray-500 mt-3">Unlocks unlimited real-time predictions</p>}
                            </div>
                        </Card>
                    </motion.div>
                </div>

                {/* 4. Mini Stats Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-20"
                >
                    {[
                        { label: 'Predictions', value: '0', icon: <TrendingUp className="h-4 w-4 text-green-500" /> }, // Dynamic data could go here
                        { label: 'Accuracy', value: '94.2%', icon: <Shield className="h-4 w-4 text-blue-500" /> },
                        { label: 'Latency', value: '12ms', icon: <Zap className="h-4 w-4 text-yellow-500" /> },
                        { label: 'Status', value: 'Online', icon: <Activity className="h-4 w-4 text-pluxo-pink" /> }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors">
                            <div className="mb-2 p-2 rounded-full bg-black/30">{stat.icon}</div>
                            <div className="text-lg font-bold text-white">{stat.value}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>

                {/* 5. Footer / CTA */}
                <div className="text-center border-t border-white/5 pt-12 max-w-4xl mx-auto">
                    <h3 className="text-2xl font-bold text-white mb-4">Ready to dominate the market?</h3>
                    <p className="text-gray-400 mb-8">Unlock the Elite Module for full probability visualization and animation data.</p>

                    <div className="flex justify-center gap-8 text-sm text-gray-500">
                        <Link to="#" className="hover:text-white transition-colors flex items-center gap-2"><HelpCircle className="h-4 w-4" /> FAQ</Link>
                        <Link to="#" className="hover:text-white transition-colors flex items-center gap-2"><Shield className="h-4 w-4" /> Privacy</Link>
                        <Link to="#" className="hover:text-white transition-colors flex items-center gap-2"><Clock className="h-4 w-4" /> Support</Link>
                    </div>
                    <div className="mt-8 text-xs text-gray-700">
                        &copy; 2026 Pluxo Predictor. All rights reserved.
                    </div>
                </div>

            </div>
        </div>
    );
}

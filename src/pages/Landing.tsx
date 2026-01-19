import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { ArrowRight, Zap, ShieldCheck, TrendingUp, Cpu, Globe, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function Landing() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-pluxo-dark flex items-center justify-center fixed inset-0 z-[100]">
                <div className="h-12 w-12 rounded-full border-4 border-pluxo-pink border-t-transparent animate-spin shadow-[0_0_20px_rgba(236,72,153,0.5)]" />
            </div>
        );
    }

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen relative overflow-x-hidden bg-pluxo-dark text-white selection:bg-pluxo-pink/30 selection:text-white">

            {/* 1. Cinematic Background Elements */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[1000px] h-[1000px] bg-pluxo-blue/10 rounded-full blur-[160px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[1000px] h-[1000px] bg-pluxo-pink/10 rounded-full blur-[160px] animate-pulse-slow delay-1000" />

                {/* Floating Particles (Abstract) */}
                <motion.div
                    animate={{ y: [0, -40, 0], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-1/3 w-1 h-1 bg-white rounded-full"
                />
                <motion.div
                    animate={{ y: [0, -60, 0], opacity: [0.1, 0.4, 0.1] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-pluxo-blue rounded-full blur-[2px]"
                />
            </div>

            {/* 2. Hero Section */}
            <section className="relative z-10 pt-48 pb-32 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-col items-center text-center">
                        {/* Animated Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="group flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-xl mb-12 cursor-default hover:bg-white/[0.06] transition-colors"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-gray-300 uppercase">
                                Neural Network V2.4 Online
                            </span>
                            <ArrowRight className="h-3 w-3 text-gray-500 group-hover:translate-x-1 transition-transform" />
                        </motion.div>

                        {/* Title with Advanced Typography */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="mb-8"
                        >
                            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black leading-[0.9] tracking-tighter mb-4 text-white">
                                PREDICT <br />
                                <span className="text-gradient">EVERYTHING</span>
                            </h1>
                        </motion.div>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 1 }}
                            className="text-lg md:text-2xl text-gray-400 max-w-3xl mb-16 leading-relaxed"
                        >
                            Elevate your strategy with the world's most sophisticated crash prediction engine.
                            Real-time neural analysis with <span className="text-white font-semibold">94.8% precision</span>.
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-6 items-center"
                        >
                            <Link to="/register">
                                <Button size="xl" variant="default" className="shadow-[0_0_50px_rgba(236,72,153,0.3)]">
                                    Start Analysis Now <ArrowRight className="ml-2 h-6 w-6" />
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button size="xl" variant="outline" className="px-12">
                                    Live Demo
                                </Button>
                            </Link>
                        </motion.div>

                        {/* Trusted By / Stats (Abstract) */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="mt-32 pt-12 border-t border-white/5 w-full max-w-4xl"
                        >
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                                <div className="flex items-center justify-center gap-2 font-mono text-sm tracking-widest uppercase">
                                    <Cpu className="h-5 w-5" /> NVIDIA AI
                                </div>
                                <div className="flex items-center justify-center gap-2 font-mono text-sm tracking-widest uppercase">
                                    <Globe className="h-5 w-5" /> Global
                                </div>
                                <div className="flex items-center justify-center gap-2 font-mono text-sm tracking-widest uppercase">
                                    <ShieldCheck className="h-5 w-5" /> Secure
                                </div>
                                <div className="flex items-center justify-center gap-2 font-mono text-sm tracking-widest uppercase">
                                    <Lock className="h-5 w-5" /> Private
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 3. Features Overhaul */}
            <section className="relative z-10 py-32">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-6xl font-bold mb-6">Cutting-Edge Features</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Built with enterprise-grade infrastructure to deliver lightning-fast predictions
                            and unbreakable security.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Zap className="h-10 w-10 text-yellow-500" />,
                                title: "Real-time Processing",
                                desc: "Proprietary sub-10ms processing engine for zero-lag predictions."
                            },
                            {
                                icon: <TrendingUp className="h-10 w-10 text-pluxo-blue" />,
                                title: "Adaptive Learning",
                                desc: "Algorithms that evolve with current market trends in real-time."
                            },
                            {
                                icon: <ShieldCheck className="h-10 w-10 text-pluxo-pink" />,
                                title: "Advanced Security",
                                desc: "End-to-end encrypted signals protected by military-grade protocols."
                            }
                        ].map((feature, i) => (
                            <GlassCard
                                key={i}
                                gradient
                                transition={{ delay: i * 0.1 }}
                                className="group cursor-default"
                            >
                                <div className="mb-8 p-5 rounded-2xl bg-white/5 w-fit group-hover:scale-110 transition-transform duration-500 group-hover:bg-white/10">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed text-lg">{feature.desc}</p>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Cinematic Demo Section */}
            <section className="relative z-10 py-32 px-6 overflow-hidden">
                <div className="container mx-auto max-w-7xl">
                    <GlassCard className="p-0 border-none bg-transparent">
                        <div className="grid grid-cols-1 lg:grid-cols-2 bg-[#050b14]/80 backdrop-blur-3xl rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl">
                            <div className="p-12 md:p-20 flex flex-col justify-center">
                                <div className="inline-flex items-center gap-2 text-pluxo-blue font-mono tracking-widest text-sm mb-8 uppercase">
                                    <div className="h-2 w-2 rounded-full bg-pluxo-blue" />
                                    The Interface
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                                    Designed for <br />
                                    The Next Generation.
                                </h2>
                                <p className="text-gray-400 text-lg mb-12 leading-relaxed">
                                    A professional terminal interface that provides all the data you need to make
                                    split-second decisions. Fast, clean, and intuitive.
                                </p>
                                <div className="flex flex-col gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                            <TrendingUp className="h-6 w-6 text-green-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold">Visual Analytics</h4>
                                            <p className="text-gray-500 text-sm">Dynamic charts and heatmaps.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                            <Zap className="h-6 w-6 text-yellow-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold">Auto-Mode Prediction</h4>
                                            <p className="text-gray-500 text-sm">Let the AI handle the heavy lifting.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative min-h-[400px] bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center p-12">
                                {/* Abstract UI Mock (Visual) */}
                                <div className="w-full aspect-square max-w-[400px] relative">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 rounded-full border border-dashed border-white/10"
                                    />
                                    <motion.div
                                        animate={{ rotate: -360 }}
                                        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-8 rounded-full border border-dashed border-white/5"
                                    />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <motion.div
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 4, repeat: Infinity }}
                                            className="text-7xl md:text-8xl font-black text-gradient drop-shadow-[0_0_30px_rgba(236,72,153,0.3)]"
                                        >
                                            98.2<span className="text-3xl opacity-50">.ms</span>
                                        </motion.div>
                                        <div className="text-gray-500 font-mono tracking-[1em] mt-4 uppercase text-xs">Latency</div>
                                    </div>

                                    {/* Rotating Glow Dots */}
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0"
                                    >
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-pluxo-pink shadow-[0_0_20px_rgba(236,72,153,0.8)]" />
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </section>
        </div>
    );
}


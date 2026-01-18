import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Zap, Shield, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Modules from './Modules';

export default function Landing() {
    useEffect(() => {
        if (loading) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto'; // or '' to remove style
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [loading]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050b14] flex items-center justify-center fixed inset-0 z-50">
                <div className="h-8 w-8 rounded-full border-2 border-pluxo-pink border-t-transparent animate-spin" />
            </div>
        );
    }

    if (user) {
        return <Modules />;
    }

    return (
        <div className="min-h-screen relative overflow-x-hidden bg-[#050b14] text-white selection:bg-pluxo-pink/30">
            {/* 1. Cinematic Background Layers */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-pluxo-blue/10 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-pluxo-pink/10 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            </div>

            {/* 2. Hero Section */}
            <section className="relative z-10 pt-32 pb-20 px-4">
                <div className="container mx-auto max-w-6xl text-center">

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
                    >
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-mono tracking-widest text-gray-300 uppercase">System V2.0 Online</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-500 drop-shadow-2xl"
                    >
                        PREDICT THE <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pluxo-pink to-pluxo-blue">IMPOSSIBLE</span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
                    >
                        Harness the power of advanced neural networks to analyze market volatility and crash patterns in real-time. The unfair advantage you've been looking for.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <Link to="/register">
                            <Button size="lg" className="h-16 px-10 text-lg rounded-full shadow-[0_0_40px_rgba(236,72,153,0.3)] bg-gradient-to-r from-pluxo-pink to-pluxo-blue hover:scale-105 transition-transform duration-300">
                                Get Started <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button variant="outline" size="lg" className="h-16 px-10 text-lg rounded-full border-white/10 hover:bg-white/5 backdrop-blur-md">
                                Live Demo
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* 3. Feature Grid */}
            <section className="relative z-10 py-20 bg-black/20 backdrop-blur-sm border-t border-white/5">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Zap className="h-8 w-8 text-yellow-400" />,
                                title: "Instant Analysis",
                                desc: "Micro-second latency processing for real-time round prediction."
                            },
                            {
                                icon: <Shield className="h-8 w-8 text-pluxo-blue" />,
                                title: "Pattern Guard",
                                desc: "AI filters out high-risk false positives to protect your strategy."
                            },
                            {
                                icon: <TrendingUp className="h-8 w-8 text-pluxo-pink" />,
                                title: "Trend Recognition",
                                desc: "Identifies macro sequences before they form on the chart."
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all duration-300 group"
                            >
                                <div className="mb-6 p-4 rounded-2xl bg-black/40 w-fit group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Visual Demo (Abstract) */}
            <section className="py-32 relative overflow-hidden">
                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="max-w-4xl mx-auto bg-[#0a0f18] rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-b from-pluxo-blue/5 to-transparent" />

                        {/* Mock Interface Header */}
                        <div className="flex items-center gap-2 p-4 border-b border-white/5 bg-black/20">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            </div>
                            <div className="ml-4 h-6 w-64 bg-white/5 rounded-full" />
                        </div>

                        {/* Content Area */}
                        <div className="p-12 md:p-24 flex flex-col items-center justify-center relative">
                            {/* Abstract Graph */}
                            <svg className="w-full h-48 md:h-64 overflow-visible" preserveAspectRatio="none">
                                <path
                                    d="M0,200 C150,180 300,50 600,20"
                                    fill="none"
                                    stroke="url(#gradientMain)"
                                    strokeWidth="4"
                                    className="drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                                />
                                <defs>
                                    <linearGradient id="gradientMain" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
                                        <stop offset="100%" stopColor="#22c55e" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <Link to="/register">
                                    <Button size="lg" className="rounded-full bg-white text-black hover:bg-gray-200 font-bold px-8">
                                        Launch Interface
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/ui/Navbar';
import { Rocket, Twitter, MessageSquare, ShieldCheck } from 'lucide-react';

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col font-sans text-gray-100 selection:bg-pluxo-pink/30 bg-pluxo-dark">
            <Navbar />

            {/* Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Professional Footer */}
            <footer className="relative z-10 py-20 bg-black/40 backdrop-blur-xl border-t border-white/5">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        {/* Brand Section */}
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-6 group cursor-default">
                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pluxo-pink to-pluxo-blue flex items-center justify-center p-2">
                                    <Rocket className="text-white h-5 w-5 fill-white" />
                                </div>
                                <span className="text-2xl font-bold tracking-tighter text-white">PLUXO</span>
                            </div>
                            <p className="text-gray-400 max-w-sm leading-relaxed mb-6">
                                The world's most advanced behavioral pattern recognition system for market volatility and crash prediction. Engineered for performance.
                            </p>
                            <div className="flex gap-4">
                                <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <Twitter className="h-5 w-5" />
                                </button>
                                <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <MessageSquare className="h-5 w-5" />
                                </button>
                                <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <ShieldCheck className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-white font-bold mb-6">Platform</h4>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Master Dashboard</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">AI Modules</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Elite Terminal</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">System Status</a></li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h4 className="text-white font-bold mb-6">Resources</h4>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Docs</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 gap-6 text-sm text-gray-500">
                        <p>© 2026 PLUXO AI Systems. All rights reserved.</p>
                        <p className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            Global Infrastructure V2.4.0-Final
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}


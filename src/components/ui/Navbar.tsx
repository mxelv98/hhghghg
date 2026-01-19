import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, Rocket, User } from 'lucide-react';

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 py-4 px-6 mx-auto",
                isScrolled ? "top-4 max-w-6xl" : "top-0 max-w-full"
            )}
        >
            <div
                className={cn(
                    "flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-500",
                    isScrolled ? "bg-black/60 backdrop-blur-2xl border border-white/10 shadow-2xl" : "bg-transparent"
                )}
            >
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pluxo-pink to-pluxo-blue flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                        <Rocket className="text-white h-5 w-5 fill-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tighter text-white">PLUXO</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Home</Link>
                    <Link to="/modules" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Predictions</Link>
                    <a href="https://t.me/pluxopredictor" target="_blank" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Telegram</a>
                </div>

                {/* Auth Actions */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link to="/profile">
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <User className="h-4 w-4" />
                                    Profile
                                </Button>
                            </Link>
                            <Button onClick={logout} variant="outline" size="sm">Logout</Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login">
                                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">Login</Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="premium" size="sm">Get Started</Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-4 right-4 mt-4 p-8 glass-panel rounded-3xl animate-fade-in">
                    <div className="flex flex-col gap-6 items-center text-center">
                        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium">Home</Link>
                        <Link to="/modules" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium">Predictions</Link>
                        <a href="https://t.me/pluxopredictor" target="_blank" className="text-xl font-medium">Telegram</a>
                        <div className="w-full h-px bg-white/10" />
                        {user ? (
                            <Button onClick={logout} variant="outline" className="w-full">Logout</Button>
                        ) : (
                            <>
                                <Link to="/login" className="w-full">
                                    <Button variant="outline" className="w-full">Login</Button>
                                </Link>
                                <Link to="/register" className="w-full">
                                    <Button variant="default" className="w-full">Get Started</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

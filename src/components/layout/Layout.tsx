import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Zap, Menu, X, User as UserIcon } from 'lucide-react';

export default function Layout() {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <div className="min-h-screen flex flex-col font-sans text-gray-100 selection:bg-pluxo-pink/30">
            {/* Navbar */}
            <nav className="border-b border-white/5 bg-pluxo-dark/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <Zap className="h-6 w-6 text-pluxo-pink group-hover:text-pluxo-blue transition-colors" />
                        <span className="text-xl font-bold tracking-tight">PLUXO</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Home</Link>
                        <a href="https://t.me" target="_blank" rel="noreferrer" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Telegram</a>

                        {user ? (
                            <div className="flex items-center gap-4">
                                {user.role === 'admin' && (
                                    <Link to="/admin">
                                        <Button variant="ghost" size="sm">Admin</Button>
                                    </Link>
                                )}
                                <Link to="/dashboard">
                                    <Button variant="ghost" size="sm">Dashboard</Button>
                                </Link>
                                <Link to="/profile">
                                    <Button variant="ghost" size="sm"><UserIcon className="h-4 w-4" /></Button>
                                </Link>
                                <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login">
                                    <Button variant="ghost" size="sm">Login</Button>
                                </Link>
                                <Link to="/register">
                                    <Button size="sm">Get Started</Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button className="md:hidden p-2 text-gray-400 hover:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Nav */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-white/5 bg-pluxo-dark p-4 space-y-4">
                        <Link to="/" className="block text-sm font-medium text-gray-400 hover:text-white" onClick={() => setIsMenuOpen(false)}>Home</Link>
                        <a href="https://t.me" className="block text-sm font-medium text-gray-400 hover:text-white" onClick={() => setIsMenuOpen(false)}>Telegram</a>
                        {user ? (
                            <div className="space-y-2 pt-2 border-t border-white/5">
                                {user.role === 'admin' && (
                                    <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                                        <Button variant="ghost" className="w-full justify-start">Admin</Button>
                                    </Link>
                                )}
                                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                                    <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
                                </Link>
                                <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                                    <Button variant="ghost" className="w-full justify-start">Profile</Button>
                                </Link>
                                <Button variant="outline" className="w-full" onClick={() => { logout(); setIsMenuOpen(false); }}>Logout</Button>
                            </div>
                        ) : (
                            <div className="space-y-4 pt-2 border-t border-white/5">
                                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                                    <Button variant="ghost" className="w-full">Login</Button>
                                </Link>
                                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                                    <Button className="w-full">Get Started</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </nav>

            {/* Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 bg-pluxo-dark py-8">
                <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                    <p>© 2026 Pluxo AI. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LogIn, ChevronDown, Menu, X, CheckCircle2, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

import { createBrowserClient } from '@supabase/ssr';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [resiNumber, setResiNumber] = useState('');
    const [user, setUser] = useState<User | null>(null);
    const [trackingResult, setTrackingResult] = useState<any | null>(undefined); // undefined = initial, null = not found, obj = found
    const pathname = usePathname();
    const router = useRouter();

    const handleTrackingSearch = async () => {
        if (!resiNumber) return;

        const { data, error } = await supabase
            .from('ptsp_submissions')
            .select('*')
            .eq('resi_number', resiNumber)
            .single();

        if (error || !data) {
            setTrackingResult(null);
            return;
        }

        setTrackingResult(data);

        // Subscribe to changes for this specific resi
        const channel = supabase
            .channel(`tracking-${resiNumber}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'ptsp_submissions',
                    filter: `resi_number=eq.${resiNumber}`
                },
                (payload) => {
                    setTrackingResult(payload.new);
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    };

    // Create Supabase client for browser
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Hide Navbar on Admin pages (except login, though login usually has its own layout, but to be safe)
    if (pathname.startsWith('/admin') && !pathname.includes('/login')) return null;

    const isHeroPage = ['/', '/ptsp', '/ppdb', '/statistik', '/alumni', '/prestasi', '/zi'].includes(pathname);
    const useWhiteText = isHeroPage || isScrolled;

    const menuItems = [
        { label: 'Beranda', href: '/' },
        { label: 'Layanan PTSP', href: '/ptsp' },
        { label: 'PPDB', href: '/ppdb' },
        { label: 'Statistik', href: '/statistik' },
        { label: 'Alumni', href: '/alumni' },
        { label: 'Prestasi', href: '/prestasi' },
        { label: 'Zona Integritas', href: '/zi' },
    ];

    return (
        <nav
            className={cn(
                'fixed top-0 left-0 right-0 z-[100] transition-all duration-300',
                isScrolled ? 'py-4' : 'py-8'
            )}
        >
            <div className="max-w-[1400px] mx-auto px-4 md:px-12">
                <div className={cn(
                    "flex items-center justify-between transition-all duration-500 px-8 py-3",
                    isScrolled
                        ? "bg-[#0ea5e9]/90 backdrop-blur-xl border border-white/20 shadow-2xl shadow-sky-900/20 rounded-full"
                        : "bg-transparent"
                )}>
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm transition-all",
                            useWhiteText ? "bg-white text-blue-950" : "bg-blue-600 text-white shadow-blue-200 shadow-lg",
                            "group-hover:scale-110"
                        )}>
                            M
                        </div>
                        <span className={cn(
                            "font-black tracking-tight text-sm transition-colors uppercase",
                            useWhiteText ? "text-white" : "text-zinc-950"
                        )}>AL AMANAH</span>
                    </Link>

                    {/* Desktop Menu - Minimalist Style at Top */}
                    <div className="hidden lg:block">
                        <div className={cn(
                            "flex items-center gap-1 transition-all duration-300",
                            !useWhiteText && "nav-tabs bg-white/50 border border-zinc-200 shadow-sm"
                        )}>
                            {menuItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "nav-tab transition-colors duration-300 px-6 relative",
                                            // Active styling
                                            isActive && (useWhiteText ? "text-white font-black" : "text-blue-700 font-black"),
                                            // Inactive styling
                                            !isActive && (useWhiteText ? "text-white" : "text-zinc-500 hover:text-blue-600")
                                        )}
                                    >
                                        {item.label}
                                        {item.label === 'Beranda' && (
                                            <span className={cn(
                                                "nav-notification",
                                                useWhiteText ? "bg-white/20 text-white" : ""
                                            )}>2</span>
                                        )}

                                        {isActive && (
                                            <motion.div
                                                layoutId="nav-glider"
                                                className="absolute inset-0 z-[-1] rounded-full"
                                                style={{
                                                    backgroundColor: useWhiteText ? 'rgba(255,255,255,0.1)' : '#eff6ff',
                                                }}
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="hidden lg:flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Search className={cn("w-4 h-4 cursor-pointer", useWhiteText ? "text-white" : "text-zinc-500")} onClick={() => setIsSearchOpen(!isSearchOpen)} />
                        </div>

                        {user ? (
                            <div className="flex gap-2">
                                <Link
                                    href="/ptsp"
                                    className={cn(
                                        "px-6 py-2.5 rounded-full text-[10px] font-black tracking-widest transition-all",
                                        useWhiteText
                                            ? "bg-white text-blue-950 border border-white hover:bg-zinc-100"
                                            : "bg-zinc-950 text-white hover:bg-zinc-800"
                                    )}
                                >
                                    DASHBOARD
                                </Link>
                                <button
                                    onClick={async () => {
                                        await supabase.auth.signOut();
                                        router.push('/');
                                    }}
                                    className={cn(
                                        "p-2.5 rounded-full transition-all",
                                        useWhiteText
                                            ? "bg-white/20 text-white hover:bg-white/30 backdrop-blur-md"
                                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                                    )}
                                    title="Logout"
                                >
                                    <LogOut size={16} />
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/auth/login"
                                className={cn(
                                    "px-6 py-2.5 rounded-full text-[10px] font-black tracking-widest transition-all",
                                    useWhiteText
                                        ? "bg-white text-blue-950 border border-white hover:bg-zinc-100"
                                        : "bg-zinc-950 text-white hover:bg-zinc-800"
                                )}
                            >
                                LOGIN
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className={cn(
                            "lg:hidden p-2 transition-colors",
                            useWhiteText ? "text-white" : "text-zinc-900"
                        )}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-12 mt-3 w-80 p-6 bg-white rounded-3xl shadow-2xl border border-zinc-100 z-50 overflow-hidden"
                    >
                        <div className="flex flex-col gap-4">
                            <span className="text-xs font-black text-zinc-950 uppercase tracking-widest">Lacak Permohonan</span>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Masukkan nomor resi..."
                                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-zinc-950 placeholder:text-zinc-400 font-medium"
                                    value={resiNumber}
                                    onChange={(e) => setResiNumber(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleTrackingSearch()}
                                />
                                <button
                                    onClick={handleTrackingSearch}
                                    className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Search className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-[10px] text-zinc-400 font-medium">Contoh: PTSP-2024-XXXX</p>

                            {/* Tracking Result */}
                            {trackingResult && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-4 pt-4 border-t border-zinc-100 flex flex-col gap-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">STATUS SAAT INI</span>
                                        <div className="flex items-center gap-1.5">
                                            <span className={cn(
                                                "w-2 h-2 rounded-full animate-pulse",
                                                trackingResult.status === 'Pending' ? "bg-amber-500" :
                                                    trackingResult.status === 'Diproses' ? "bg-blue-500" :
                                                        trackingResult.status === 'Selesai' ? "bg-emerald-500" :
                                                            "bg-red-500"
                                            )} />
                                            <span className={cn(
                                                "text-xs font-black",
                                                trackingResult.status === 'Pending' ? "text-amber-600" :
                                                    trackingResult.status === 'Diproses' ? "text-blue-600" :
                                                        trackingResult.status === 'Selesai' ? "text-emerald-600" :
                                                            "text-red-600"
                                            )}>{trackingResult.status}</span>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-zinc-50 rounded-xl space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-xs text-zinc-500">Pemohon</span>
                                            <span className="text-xs font-bold text-zinc-900 line-clamp-1 max-w-[120px]">{trackingResult.full_name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-xs text-zinc-500">Layanan</span>
                                            <span className="text-xs font-bold text-zinc-900 uppercase">{trackingResult.service_type?.replace('_', ' ')}</span>
                                        </div>
                                    </div>

                                    <div className="text-[10px] text-center text-zinc-400 mt-2">
                                        Data diperbarui secara real-time
                                    </div>
                                </motion.div>
                            )}

                            {trackingResult === null && resiNumber !== '' && (
                                <div className="mt-4 pt-4 border-t border-zinc-100 text-center text-xs text-red-500 font-medium">
                                    Resi tidak ditemukan.
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white border-t border-zinc-100 overflow-hidden"
                    >
                        <div className="p-6 flex flex-col gap-4">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-lg font-black text-zinc-900"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <hr className="border-zinc-100" />
                            {user ? (
                                <>
                                    <Link
                                        href="/ptsp"
                                        className="w-full py-4 bg-blue-600 text-white text-center font-black rounded-2xl"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        DASHBOARD
                                    </Link>
                                    <button
                                        onClick={async () => {
                                            await supabase.auth.signOut();
                                            setIsMobileMenuOpen(false);
                                            router.push('/');
                                        }}
                                        className="w-full py-4 bg-zinc-100 text-zinc-900 text-center font-black rounded-2xl"
                                    >
                                        LOGOUT
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/auth/login"
                                    className="w-full py-4 bg-blue-600 text-white text-center font-black rounded-2xl"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    LOGIN / REGISTER
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;

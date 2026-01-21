'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    FileText,
    Users,
    GraduationCap,
    Award,
    ShieldCheck,
    LogOut,
    Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createBrowserClient } from '@supabase/ssr';

const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Permohonan PTSP', href: '/admin/ptsp', icon: FileText },
    { label: 'Pendaftar PPDB', href: '/admin/ppdb', icon: Users },
    { label: 'Data Alumni', href: '/admin/alumni', icon: GraduationCap },
    { label: 'Prestasi', href: '/admin/prestasi', icon: Award },
    { label: 'Konten Website', href: '/admin/konten', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
    };

    return (
        <aside className="w-72 p-6 flex flex-col fixed left-0 top-0 h-screen z-50">
            {/* Main Sidebar Container with Deep Purple Background */}
            <div className="flex-1 flex flex-col bg-[#6200EA] rounded-[40px] text-white shadow-2xl overflow-hidden relative">
                {/* Visual texture/gradient overlay */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

                {/* Logo Area */}
                <div className="p-8 flex items-center gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-full border-[3px] border-white/30 flex items-center justify-center">
                        <div className="w-5 h-5 bg-white rounded-full" />
                    </div>
                    <span className="font-bold text-2xl tracking-tight">Circle</span>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 px-6 space-y-2 overflow-y-auto relative z-10 flex flex-col justify-center">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group text-base",
                                    isActive
                                        ? "bg-white/10 text-white font-bold backdrop-blur-sm shadow-inner"
                                        : "text-white/60 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <Icon strokeWidth={isActive ? 2.5 : 2} size={22} className={cn("transition-transform group-hover:scale-110", isActive ? "text-white" : "text-white/60 group-hover:text-white")} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="p-8 space-y-2 relative z-10">
                    <button className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all">
                        <Settings size={22} />
                        <span className="font-medium">Settings</span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-white/60 hover:text-white hover:bg-white/5 hover:text-red-300 transition-all"
                    >
                        <LogOut size={22} />
                        <span className="font-medium">Log Out</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}

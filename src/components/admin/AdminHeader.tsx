'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { User } from '@supabase/supabase-js';
import { Bell, Search, User as UserIcon } from 'lucide-react';

export default function AdminHeader() {
    const [user, setUser] = useState<User | null>(null);
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, [supabase]);

    return (
        <header className="h-20 flex items-center justify-between px-10 sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm/50">
            {/* Sort / Filter Dropdown mimic */}
            <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-800">Sort :</span>
                <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-600 flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-colors">
                    Last Week
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-8">
                <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
                    <Bell size={24} />
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#F8F7FA] translate-x-1/2 -translate-y-1/2" />
                </button>

                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 p-0.5 shadow-lg shadow-blue-200/50">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                            {/* Placeholder Avatar */}
                            <UserIcon size={24} className="text-slate-400" />
                        </div>
                    </div>
                    <div className="text-left hidden md:block">
                        <p className="text-sm font-black text-slate-800 leading-tight">
                            {user?.user_metadata?.full_name || 'Administrator'}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {user?.email || 'admin@sekolah.sch.id'}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}

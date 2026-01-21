'use client';

import { Bell, Search, User } from 'lucide-react';

export function AdminTopBar() {
    return (
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-8 flex items-center justify-between shadow-sm">
            {/* Search Bar */}
            <div className="flex items-center w-96 bg-slate-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                <Search className="w-4 h-4 text-slate-400 mr-2" />
                <input
                    type="text"
                    placeholder="Search students, teachers, or documents..."
                    className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder-slate-400"
                />
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
                <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                </button>

                <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

                <div className="flex items-center gap-3 pl-2 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors">
                    <div className="bg-emerald-100 text-emerald-700 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                        AD
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-semibold text-slate-700">Admin Utama</p>
                        <p className="text-xs text-slate-500">Super Administrator</p>
                    </div>
                </div>
            </div>
        </header>
    );
}

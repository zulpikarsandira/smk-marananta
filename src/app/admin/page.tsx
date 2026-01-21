'use client';

import Link from 'next/link';

import {
    FileText,
    Users,
    Award,
    Briefcase,
    TrendingUp,
    MoreHorizontal,
    ArrowRight,
    Clock
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend
} from 'recharts';
import { createBrowserClient } from '@supabase/ssr';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Mock Data
const ppdbTrendData = [
    { name: 'Minggu 1', pendaftar: 45 },
    { name: 'Minggu 2', pendaftar: 120 },
    { name: 'Minggu 3', pendaftar: 340 },
    { name: 'Minggu 4', pendaftar: 560 },
    { name: 'Minggu 5', pendaftar: 780 },
    { name: 'Minggu 6', pendaftar: 845 },
];

const jobData = [
    { name: 'PNS/TNI/Polri', count: 320 },
    { name: 'Wirausaha', count: 210 },
    { name: 'Karyawan Swasta', count: 180 },
    { name: 'Petani/Nelayan', count: 90 },
    { name: 'Lainnya', count: 45 },
];

export default function AdminDashboard() {
    const [stats, setStats] = useState([
        { title: 'Permohonan PTSP Pending', value: '0', change: 'Update real-time', icon: Clock, color: 'bg-orange-500', trend: 'neutral' },
        { title: 'Total Pendaftar PPDB', value: '845', change: '+15% dari tahun lalu', icon: Users, color: 'bg-blue-600', trend: 'up' },
        { title: 'Guru Tersertifikasi', value: '85%', change: 'Target: 90%', icon: Award, color: 'bg-emerald-500', trend: 'neutral' },
        { title: 'Alumni Terdata', value: '1,240', change: '+45 bulan ini', icon: Briefcase, color: 'bg-indigo-500', trend: 'up' }
    ]);
    const [recentPtsp, setRecentPtsp] = useState<any[]>([]);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const fetchData = async () => {
            // Fetch Pending PTSP Count
            const { count: pendingCount } = await supabase
                .from('ptsp_submissions')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'Pending');

            // Fetch Recent PTSP Submissions
            const { data: recentData } = await supabase
                .from('ptsp_submissions')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            setStats(prev => [
                { ...prev[0], value: pendingCount?.toString() || '0' },
                prev[1], prev[2], prev[3]
            ]);

            if (recentData) setRecentPtsp(recentData);
        };

        fetchData();

        // Realtime Subscription
        const channel = supabase
            .channel('dashboard-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'ptsp_submissions' }, fetchData)
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h2>
                    <p className="text-slate-500 mt-1">Selamat datang kembali, berikut ringkasan statistik sekolah hari ini.</p>
                </div>
                <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                    Download Report
                </button>
            </div>

            {/* Stats Grid - Redesigned */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Card 1: Revenue (PTSP Pending) */}
                <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-purple-500/5 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-2">Permohonan Pending</p>
                            <h3 className="text-3xl font-black text-slate-800">{stats[0].value}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-slate-400 border border-slate-100">
                            <Clock size={20} />
                        </div>
                    </div>
                    {/* Fake Bar Chart Visual */}
                    <div className="flex items-end gap-2 h-16 mt-4">
                        {[40, 70, 45, 90, 60, 80, 50, 75, 40].map((h, i) => (
                            <div
                                key={i}
                                className="flex-1 rounded-t-sm bg-gradient-to-t from-blue-600 to-blue-400 opacity-90 group-hover:opacity-100 transition-all"
                                style={{ height: `${h}%` }}
                            />
                        ))}
                    </div>
                </div>

                {/* Card 2: Expenses (PPDB Total) */}
                <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-purple-500/5 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-2">Total PPDB</p>
                            <h3 className="text-3xl font-black text-slate-800">{stats[1].value}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-slate-400 border border-slate-100">
                            <Users size={20} />
                        </div>
                    </div>
                    {/* Fake Bar Chart Visual (Pink) */}
                    <div className="flex items-end gap-2 h-16 mt-4">
                        {[60, 50, 75, 55, 80, 70, 90, 65, 85].map((h, i) => (
                            <div
                                key={i}
                                className="flex-1 rounded-t-sm bg-gradient-to-t from-pink-500 to-rose-400 opacity-90 group-hover:opacity-100 transition-all"
                                style={{ height: `${h}%` }}
                            />
                        ))}
                    </div>
                </div>

                {/* Card 3: Sales (Alumni) */}
                <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-purple-500/5 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-2">Alumni Terdata</p>
                            <h3 className="text-3xl font-black text-slate-800">{stats[3].value}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-slate-400 border border-slate-100">
                            <Briefcase size={20} />
                        </div>
                    </div>
                    {/* Fake Line Chart Visual */}
                    <div className="h-16 mt-4 relative">
                        <svg className="w-full h-full" preserveAspectRatio="none">
                            <path
                                d="M0,50 Q20,20 40,50 T80,30 T120,60 T160,20 T200,50 T240,10 V64 H0 Z"
                                fill="url(#grad1)"
                                className="opacity-20"
                            />
                            <path
                                d="M0,50 Q20,20 40,50 T80,30 T120,60 T160,20 T200,50 T240,10"
                                fill="none"
                                stroke="#6200EA"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                            <defs>
                                <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: '#6200EA', stopOpacity: 1 }} />
                                    <stop offset="100%" style={{ stopColor: '#6200EA', stopOpacity: 0 }} />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 text-lg">Tren Pendaftaran PPDB</h3>
                        <select className="text-sm border-slate-200 rounded-md text-slate-500 bg-slate-50 border p-1">
                            <option>Mingguan</option>
                            <option>Bulanan</option>
                        </select>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={ppdbTrendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="pendaftar"
                                    stroke="#2563eb"
                                    strokeWidth={4}
                                    dot={{ fill: '#2563eb', strokeWidth: 2, r: 4, stroke: '#fff' }}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Secondary Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 text-lg">Pekerjaan Wali Murid</h3>
                        <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="w-5 h-5" /></button>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={jobData} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6x -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="count" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Activity / Pending Tasks */}
            {/* Recent Messages / Activity List */}
            <div className="bg-white rounded-[32px] shadow-xl shadow-purple-500/5 overflow-hidden p-8">
                <h3 className="font-bold text-slate-800 text-xl mb-6">Permohonan Terbaru</h3>
                <div className="flex flex-col gap-4">
                    {recentPtsp.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 font-medium">Belum ada permohonan masuk</div>
                    ) : (
                        recentPtsp.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200 group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md ${item.status === 'Pending' ? 'bg-orange-400 shadow-orange-200' :
                                            item.status === 'Selesai' ? 'bg-emerald-400 shadow-emerald-200' :
                                                'bg-blue-500 shadow-blue-200'
                                        }`}>
                                        {item.full_name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">{item.full_name}</h4>
                                        <p className="text-sm text-slate-500 font-medium line-clamp-1">{item.service_type.replace('_', ' ')} • <span className="text-slate-400">{item.resi_number}</span></p>
                                    </div>
                                </div>

                                <div className="text-right flex items-center gap-6">
                                    <span className={cn(
                                        "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider",
                                        item.status === 'Pending' ? "bg-orange-100 text-orange-600" :
                                            item.status === 'Diproses' ? "bg-blue-100 text-blue-600" :
                                                item.status === 'Selesai' ? "bg-emerald-100 text-emerald-600" :
                                                    "bg-red-100 text-red-600"
                                    )}>
                                        {item.status}
                                    </span>
                                    <span className="text-sm text-slate-400 font-bold w-16 text-right">
                                        {new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <Link href={`/admin/ptsp`} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors">
                                        <ArrowRight size={18} />
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

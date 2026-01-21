"use client";

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    PieChart as PieChartIcon,
    BarChart as BarChartIcon,
    Users,
    TrendingUp,
    Award,
    Briefcase
} from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';
import ShinyText from '@/components/ShinyText';

// --- Mock Data ---

const GURU_STATS = [
    { name: 'Sertifikasi', value: 85, color: '#2563eb' },
    { name: 'Belum Sertifikasi', value: 15, color: '#e4e4e7' },
];

const WALI_STATS = [
    { category: 'PNS', total: 120 },
    { category: 'Swasta', total: 450 },
    { category: 'Wiraswasta', total: 280 },
    { category: 'TNI/Polri', total: 45 },
    { category: 'Lainnya', total: 160 },
];

// --- Components ---

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-zinc-950 px-4 py-2 rounded-xl shadow-2xl border border-zinc-800">
                <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-1">{payload[0].name || 'Jumlah'}</p>
                <p className="text-white font-black text-lg">{payload[0].value} <span className="text-xs text-zinc-500">{payload[0].name === 'Sertifikasi' ? '%' : 'Orang'}</span></p>
            </div>
        );
    }
    return null;
};

export default function StatistikPage() {
    // Parallax Logic
    const { scrollY } = useScroll();
    const bgY = useTransform(scrollY, [0, 500], [0, 100]);
    const textY = useTransform(scrollY, [0, 500], [0, -50]);

    return (
        <div className="bg-white min-h-screen pb-32">
            {/* Page Header */}
            {/* Page Header - Updated */}
            <section className="relative bg-white -mt-24 mb-12">
                <div className="relative min-h-[60vh] flex flex-col items-center justify-center bg-emerald-hero lg:rounded-b-[64px] overflow-hidden pt-40 pb-24 text-center px-6">

                    <motion.div
                        style={{ y: textY }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative z-10 flex flex-col items-center gap-6 max-w-4xl mx-auto"
                    >
                        <span className="text-xs font-black text-white/80 uppercase tracking-[0.5em] border border-white/20 px-6 py-2.5 rounded-full backdrop-blur-md bg-white/5 shadow-xl">
                            DATA VISUALIZATION
                        </span>

                        <h1 className="font-heading font-black text-5xl md:text-7xl text-white leading-[0.9] tracking-tighter shadow-lg shadow-blue-900/0">
                            Statistik <br /> <span className="text-white">Pendidikan.</span>
                        </h1>

                        <p className="text-blue-50 text-lg md:text-xl font-medium max-w-2xl leading-relaxed opacity-90">
                            Transparansi data tenaga pendidik dan demografi wali murid sebagai bentuk keterbukaan informasi publik (KIP).
                        </p>

                        {/* Real-time Status Card in Hero */}
                        <div className="p-6 bg-white/10 backdrop-blur-md rounded-[40px] border border-white/10 shadow-xl w-full md:w-80 space-y-4 mt-4">
                            <div className="flex items-center gap-3 justify-center">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-[10px] font-black text-emerald-300 uppercase tracking-widest">Update: Jan 2024</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-black text-white tracking-tighter">98.5%</span>
                                <span className="text-xs font-bold text-white/60">Akurasi Validasi Data</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Decorative ShinyText in Background */}
                    <motion.div
                        style={{ y: bgY }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 opacity-40 scale-150 top-10"
                    >
                        <ShinyText
                            text="STATISTIK"
                            disabled={false}
                            speed={5}
                            className="font-heading text-[12vw] font-black tracking-tighter"
                            color="rgba(255, 255, 255, 0.1)"
                            shineColor="rgba(255, 255, 255, 0.5)"
                        />
                    </motion.div>

                    {/* Fog */}
                    <div className="absolute inset-x-0 bottom-0 h-[50%] hero-fog z-20 pointer-events-none" />
                </div>
            </section>

            <section className="pt-20">
                <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* GURU STATS (PIE/DONUT) */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-zinc-50 rounded-[64px] p-12 md:p-16 border border-zinc-100 flex flex-col"
                    >
                        <div className="flex items-center gap-4 mb-20">
                            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-100">
                                <Award className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-xl font-black text-zinc-950 tracking-tight">Tenaga Pendidik</h3>
                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Profil Sertifikasi Guru</span>
                            </div>
                        </div>

                        <div className="h-80 w-full relative mb-12">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={GURU_STATS}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={8}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {GURU_STATS.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>

                            {/* Center Text */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                <span className="text-4xl font-black text-zinc-950 block tracking-tighter">85%</span>
                                <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Sertifikasi</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {GURU_STATS.map((item) => (
                                <div key={item.name} className="p-4 bg-white rounded-2xl border border-zinc-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">{item.name}</span>
                                    </div>
                                    <span className="text-xl font-black">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* WALI MURID STATS (BAR) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-zinc-50 rounded-[64px] p-12 md:p-16 border border-zinc-100 flex flex-col"
                    >
                        <div className="flex items-center gap-4 mb-20">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-100">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-xl font-black text-zinc-950 tracking-tight">Wali Murid</h3>
                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Kategori Pekerjaan</span>
                            </div>
                        </div>

                        <div className="h-80 w-full mb-12">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={WALI_STATS} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                                    <XAxis
                                        dataKey="category"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fontWeight: 900, fill: '#71717a' }}
                                    />
                                    <YAxis hide />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f4f4f5' }} />
                                    <Bar
                                        dataKey="total"
                                        fill="#10b981"
                                        radius={[12, 12, 0, 0]}
                                        barSize={40}
                                        animationDuration={2000}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="space-y-4">
                            <div className="p-8 bg-zinc-950 rounded-[32px] text-white flex items-center justify-between overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <TrendingUp className="w-16 h-16" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Mayoritas Pekerjaan</span>
                                    <span className="text-2xl font-black text-emerald-400">Pegawai Swasta</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-3xl font-black">450</span>
                                    <span className="text-xs font-bold text-zinc-500 block uppercase">Orang</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </section>

            {/* Detailed Table Section (Placeholder) */}
            <section className="py-32">
                <div className="max-w-7xl mx-auto px-6 md:px-12 bg-zinc-50 rounded-[64px] p-12 md:p-20 border border-zinc-100">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
                        <div className="space-y-2">
                            <h3 className="text-3xl font-black text-zinc-950 tracking-tight">Rincian Data Guru.</h3>
                            <p className="text-subtle text-sm">Berikut adalah persebaran jabatan fungsional tenaga pendidik di lingkungan SMK Marantaa.</p>
                        </div>
                        <button className="px-8 py-3 bg-white border border-zinc-200 rounded-full text-xs font-black uppercase tracking-widest hover:bg-zinc-50 transition-all">Download Info Grafis</button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b-2 border-zinc-200">
                                    <th className="py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">GURU MAPEL</th>
                                    <th className="py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">ASN</th>
                                    <th className="py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">PPPK</th>
                                    <th className="py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">GTY/HONORER</th>
                                    <th className="py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">TOTAL</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {[
                                    { mapel: 'Normatif & Adaptif', asn: 12, pppk: 8, gty: 5, total: 25 },
                                    { mapel: 'Produktif TKR', asn: 4, pppk: 12, gty: 10, total: 26 },
                                    { mapel: 'Produktif TKJ', asn: 6, pppk: 10, gty: 8, total: 24 },
                                    { mapel: 'Produktif Akuntansi', asn: 8, pppk: 5, gty: 4, total: 17 },
                                ].map((row, i) => (
                                    <tr key={i} className="group hover:bg-white transition-colors">
                                        <td className="py-6 font-black text-zinc-950 text-sm">{row.mapel}</td>
                                        <td className="py-6 text-zinc-500 font-bold text-sm">{row.asn}</td>
                                        <td className="py-6 text-zinc-500 font-bold text-sm">{row.pppk}</td>
                                        <td className="py-6 text-zinc-500 font-bold text-sm">{row.gty}</td>
                                        <td className="py-6">
                                            <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-black">{row.total}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
}

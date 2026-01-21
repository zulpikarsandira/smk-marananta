"use client";

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    ShieldCheck,
    FileText,
    Download,
    Eye,
    CheckCircle2,
    Info,
    ShieldAlert,
    Gavel,
    History
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ShinyText from '@/components/ShinyText';

// --- Mock Data ---

const DOCUMENTS = [
    { id: 1, title: 'Standar Operasional Prosedur (SOP) PTSP', size: '1.2 MB', date: 'Jan 2024' },
    { id: 2, title: 'Maklumat Pelayanan SMK Marantaa', size: '0.8 MB', date: 'Des 2023' },
    { id: 3, title: 'Laporan Keuangan Tahunan (Publik)', size: '4.5 MB', date: 'Jan 2024' },
    { id: 4, title: 'Pakta Integritas Tenaga Pendidik', size: '1.1 MB', date: 'Feb 2024' },
    { id: 5, title: 'Rencana Strategis (Renstra) 2024-2029', size: '3.2 MB', date: 'Jan 2024' },
    { id: 6, title: 'Laporan Kepuasan Masyarakat (SKM)', size: '2.4 MB', date: 'Jan 2024' },
];

const COMPLIANCE_ITEMS = [
    { icon: Gavel, title: 'Anti Gratifikasi', desc: 'Seluruh layanan tanpa biaya tambahan di luar ketentuan resmi.' },
    { icon: ShieldAlert, title: 'Whistleblowing', desc: 'Laporkan segala bentuk pelanggaran melalui kanal pengaduan kami.' },
    { icon: History, title: 'Audit Publik', desc: 'Laporan kegiatan diaudit secara berkala oleh pihak berwenang.' },
];

export default function ZIPage() {
    // Parallax Logic
    const { scrollY } = useScroll();
    const bgY = useTransform(scrollY, [0, 500], [0, 100]);
    const textY = useTransform(scrollY, [0, 500], [0, -50]);

    return (
        <div className="bg-white min-h-screen pb-32">
            {/* Hero Section */}
            {/* Hero Section - Updated */}
            <section className="relative bg-white -mt-24 mb-12">
                <div className="relative min-h-[60vh] flex flex-col items-center justify-center bg-emerald-hero lg:rounded-b-[64px] overflow-hidden pt-40 pb-24 text-center px-6">

                    <motion.div
                        style={{ y: textY }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative z-10 flex flex-col items-center gap-6 max-w-4xl mx-auto"
                    >
                        <span className="text-xs font-black text-white/80 uppercase tracking-[0.5em] border border-white/20 px-6 py-2.5 rounded-full backdrop-blur-md bg-white/5 shadow-xl">
                            <ShieldCheck className="w-3 h-3 inline mr-2 -mt-0.5" />
                            WILAYAH BEBAS KORUPSI (WBK)
                        </span>

                        <h1 className="font-heading font-black text-5xl md:text-7xl text-white leading-[0.9] tracking-tighter shadow-lg shadow-blue-900/0">
                            Zona Integritas <br /> <span className="text-white">& Transparansi.</span>
                        </h1>

                        <p className="text-blue-50 text-lg md:text-xl font-medium max-w-2xl leading-relaxed opacity-90">
                            Komitmen penuh kami dalam memberikan pelayanan publik yang bersih, melayani, dan bebas dari segala bentuk korupsi.
                        </p>

                        <div className="w-full md:w-auto flex-none mt-6">
                            <div className="p-6 bg-white/10 backdrop-blur-xl rounded-[40px] border border-white/20 text-center space-y-4 max-w-xs mx-auto">
                                <div className="flex items-center gap-4 justify-center">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-xl">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-2xl font-black text-white">PREDIKAT A</span>
                                        <span className="text-[10px] font-black text-blue-100 uppercase tracking-widest">Akuntabilitas Layanan</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Decorative ShinyText in Background */}
                    <motion.div
                        style={{ y: bgY }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 opacity-40 scale-150 top-10"
                    >
                        <ShinyText
                            text="INTEGRITAS"
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

            {/* Repository Section */}
            <section className="py-32">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="flex flex-col md:flex-row gap-20">

                        {/* File List */}
                        <div className="flex-[2] space-y-8">
                            <div className="space-y-4 mb-12">
                                <span className="text-xs font-black text-blue-600 uppercase tracking-[0.5em]">DOCUMENT REPOSITORY</span>
                                <h2 className="heading-xl text-3xl md:text-5xl">Arsip Publik Terbuka.</h2>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {DOCUMENTS.map((doc) => (
                                    <div key={doc.id} className="p-6 md:p-8 rounded-[32px] bg-zinc-50 border border-zinc-100 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white hover:shadow-xl hover:shadow-zinc-200/50 transition-all group">
                                        <div className="flex items-center gap-6 text-center md:text-left">
                                            <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div className="flex flex-col">
                                                <h4 className="font-black text-zinc-950 text-base md:text-lg tracking-tight mb-1">{doc.title}</h4>
                                                <div className="flex items-center gap-4 justify-center md:justify-start">
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{doc.date}</span>
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{doc.size}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 w-full md:w-auto">
                                            <button className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-white border border-zinc-200 text-[10px] font-black uppercase text-zinc-400 hover:text-blue-600 hover:border-blue-600 transition-all flex items-center justify-center gap-2">
                                                <Eye className="w-4 h-4" /> Pratinjau
                                            </button>
                                            <button className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-zinc-950 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100 group-hover:shadow-blue-200">
                                                <Download className="w-4 h-4" /> UNDUH PDF
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="flex-1 space-y-12">
                            <div className="p-10 bg-zinc-950 rounded-[48px] text-white space-y-8 sticky top-32">
                                <div className="w-16 h-16 rounded-3xl bg-blue-600 flex items-center justify-center">
                                    <Info className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black italic">"Keterbukaan informasi adalah hak masyarakat, memberikan data akurat adalah kewajiban kami."</h3>

                                <div className="space-y-6 pt-6 border-t border-zinc-800">
                                    {COMPLIANCE_ITEMS.map((item, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 shrink-0">
                                                <item.icon className="w-4 h-4" />
                                            </div>
                                            <div className="space-y-1">
                                                <h5 className="text-xs font-black uppercase tracking-widest">{item.title}</h5>
                                                <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Banner Anti-Gratifikasi */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-[48px] p-12 md:p-20 flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full text-emerald-700 font-black text-[10px] uppercase tracking-widest">
                                Zero Tolerance
                            </div>
                            <h2 className="heading-xl text-3xl md:text-5xl text-emerald-950">Layanan Tanpa Pungli.</h2>
                            <p className="text-emerald-800/70 font-medium text-lg">Masyarakat dilarang memberikan pemberian dalam bentuk apapun (uang, hadiah, barang) kepada petugas pelayanan di lingkungan SMK Marantaa.</p>
                        </div>
                        <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-xl shadow-emerald-200/50 border-8 border-emerald-100 shrink-0">
                            <CheckCircle2 className="w-20 h-20 text-emerald-500" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

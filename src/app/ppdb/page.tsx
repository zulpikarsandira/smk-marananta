"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
    ClipboardList,
    MapPin,
    School,
    Trophy,
    Search,
    CheckCircle2,
    Calendar,
    ChevronRight,
    ChevronLeft,
    GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ShinyText from '@/components/ShinyText';

// --- Components ---

const InfoCard = ({ icon: Icon, title, date, description }: { icon: any, title: string, date: string, description: string }) => (
    <div className="p-8 rounded-[32px] bg-zinc-50 border border-zinc-100 relative group overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Icon className="w-24 h-24" />
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-6">
            <Icon className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-2">{date}</span>
        <h3 className="text-xl font-black text-zinc-950 mb-3 tracking-tight">{title}</h3>
        <p className="text-xs text-zinc-500 font-medium leading-relaxed">{description}</p>
    </div>
);

export default function PPDBPage() {
    const [activeTab, setActiveTab] = useState<'info' | 'daftar' | 'hasil'>('info');
    const [searchQuery, setSearchQuery] = useState('');
    const [enrollmentStep, setEnrollmentStep] = useState(1);

    // Parallax Logic
    const { scrollY } = useScroll();
    const bgY = useTransform(scrollY, [0, 500], [0, 100]);
    const textY = useTransform(scrollY, [0, 500], [0, -50]);

    // Mock Result Data
    const results = [
        { id: 'PPDB-001', name: 'Ahmad Faisal', status: 'Lolos', score: 88.5 },
        { id: 'PPDB-002', name: 'Siti Aminah', status: 'Tidak Lolos', score: 72.0 },
        { id: 'PPDB-003', name: 'Budi Santoso', status: 'Lolos', score: 91.2 },
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            {/* Header - Updated to Match Dashboard */}
            <section className="relative bg-white -mt-24 mb-12">
                <div className="relative min-h-[60vh] flex flex-col items-center justify-center bg-emerald-hero lg:rounded-b-[64px] overflow-hidden pt-40 pb-24 text-center px-6">

                    <motion.div
                        style={{ y: textY }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative z-10 flex flex-col items-center gap-6 max-w-4xl mx-auto"
                    >
                        <span className="text-xs font-black text-white/80 uppercase tracking-[0.5em] border border-white/20 px-6 py-2.5 rounded-full backdrop-blur-md bg-white/5 shadow-xl">
                            TAHUN AJARAN 2024/2025
                        </span>

                        <h1 className="font-heading font-black text-5xl md:text-7xl text-white leading-[0.9] tracking-tighter shadow-lg shadow-blue-900/0">
                            PPDB Online <br /> <span className="text-white">SMK Marantaa.</span>
                        </h1>

                        <p className="text-blue-50 text-lg md:text-xl font-medium max-w-2xl leading-relaxed opacity-90">
                            Platform resmi penerimaan peserta didik baru. Transparan, akuntabel, dan bebas biaya pendaftaran.
                        </p>

                        {/* Quick Stats in Hero */}
                        <div className="grid grid-cols-2 gap-4 w-full md:w-auto mt-4">
                            <div className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 text-center">
                                <span className="text-2xl text-white font-black block">1,240</span>
                                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-100">Pendaftar</span>
                            </div>
                            <div className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 text-center">
                                <span className="text-2xl text-white font-black block">320</span>
                                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-100">Kuota Siswa</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Decorative ShinyText in Background */}
                    <motion.div
                        style={{ y: bgY }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 opacity-40 scale-150 top-10"
                    >
                        <ShinyText
                            text="PPDB ONLINE"
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

            {/* Navigation Tabs */}
            <section className="sticky top-[88px] bg-white border-b border-zinc-100 z-50">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="flex items-center gap-12">
                        {[
                            { id: 'info', label: 'Info & Jadwal', icon: Calendar },
                            { id: 'daftar', label: 'Form Pendaftaran', icon: ClipboardList },
                            { id: 'hasil', label: 'Hasil Seleksi', icon: Trophy },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "py-6 flex items-center gap-2 text-sm font-black uppercase tracking-widest border-b-2 transition-all",
                                    activeTab === tab.id ? "text-blue-600 border-blue-600" : "text-zinc-400 border-transparent hover:text-zinc-600"
                                )}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <AnimatePresence mode="wait">

                        {/* TAB: INFO & JADWAL */}
                        {activeTab === 'info' && (
                            <motion.div
                                key="info"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-20"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <InfoCard icon={Calendar} title="Pendaftaran" date="01 Mei - 15 Juni" description="Pengisian formulir online dan unggah dokumen persyaratan awal." />
                                    <InfoCard icon={ClipboardList} title="Seleksi Berkas" date="16 Juni - 20 Juni" description="Verifikasi keaslian dokumen dan nilai raport oleh tim panitia." />
                                    <InfoCard icon={School} title="Tes Kompetensi" date="22 Juni - 24 Juni" description="Uji minat bakat dan kompetensi dasar calon peserta didik." />
                                    <InfoCard icon={Trophy} title="Pengumuman" date="28 Juni 2024" description="Hasil seleksi final diumumkan melalui dashboard website." />
                                </div>

                                <div className="bg-zinc-950 p-12 md:p-20 rounded-[64px] text-white">
                                    <div className="flex flex-col md:flex-row items-center gap-20">
                                        <div className="flex-1 space-y-8">
                                            <h2 className="heading-xl text-3xl md:text-5xl">Persyaratan Khusus.</h2>
                                            <ul className="space-y-4">
                                                {[
                                                    "Lulusan SMP/MTs/Sederajat tahun 2023 atau 2024.",
                                                    "Tinggi badan minimal (L) 160cm & (P) 155cm.",
                                                    "Tidak buta warna dan tidak bertato/bertindik.",
                                                    "Rata-rata nilai raport minimal 75.00."
                                                ].map((req, i) => (
                                                    <li key={i} className="flex items-center gap-4 text-zinc-400 font-medium">
                                                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                        {req}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="flex-1 w-full bg-blue-600 p-12 rounded-[48px] rotate-2">
                                            <h3 className="text-2xl font-black mb-6 italic">Alur Pendaftaran Digital</h3>
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center font-black">1</div>
                                                    <span className="font-bold">Buat Akun & Verifikasi Email</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center font-black">2</div>
                                                    <span className="font-bold">Unggah Raport & Piagam</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center font-black">3</div>
                                                    <span className="font-bold">Tes Minat Bakat (CBT)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* TAB: FORM PENDAFTARAN */}
                        {activeTab === 'daftar' && (
                            <motion.div
                                key="daftar"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="max-w-4xl mx-auto"
                            >
                                <div className="mb-12 flex items-center justify-between">
                                    <h2 className="text-3xl font-black text-zinc-950 tracking-tight">Formulir Pendaftaran</h2>
                                    <span className="text-xs font-black text-zinc-400">LANGKAH {enrollmentStep} DARI 3</span>
                                </div>

                                <div className="bg-zinc-50 rounded-[48px] p-8 md:p-12 border border-zinc-100">
                                    {enrollmentStep === 1 && (
                                        <div className="space-y-8 animate-in fade-in duration-500">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Nama Lengkap</label>
                                                    <input type="text" className="w-full px-6 py-4 rounded-2xl bg-white border border-zinc-200 outline-none focus:border-blue-600 transition-all text-sm" placeholder="Nama sesuai akta lahir" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">NISN</label>
                                                    <input type="text" className="w-full px-6 py-4 rounded-2xl bg-white border border-zinc-200 outline-none focus:border-blue-600 transition-all text-sm" placeholder="10 Digit nomor induk siswa nasional" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Tempat Lahir</label>
                                                    <input type="text" className="w-full px-6 py-4 rounded-2xl bg-white border border-zinc-200 outline-none focus:border-blue-600 transition-all text-sm" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Tanggal Lahir</label>
                                                    <input type="date" className="w-full px-6 py-4 rounded-2xl bg-white border border-zinc-200 outline-none focus:border-blue-600 transition-all text-sm" />
                                                </div>
                                            </div>
                                            <button onClick={() => setEnrollmentStep(2)} className="w-full py-5 bg-zinc-950 text-white font-black rounded-2xl flex items-center justify-center gap-3">
                                                LANJUT KE DATA SEKOLAH <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}

                                    {enrollmentStep === 2 && (
                                        <div className="space-y-8 animate-in fade-in duration-500">
                                            <div className="grid grid-cols-1 gap-8">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Sekolah Asal</label>
                                                    <input type="text" className="w-full px-6 py-4 rounded-2xl bg-white border border-zinc-200 outline-none focus:border-blue-600 transition-all text-sm" placeholder="Contoh: SMP Negeri 1 Jakarta" />
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                                    {[7, 8, 9].map(grade => (
                                                        <div key={grade} className="space-y-2">
                                                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1 text-center block">Nilai Kls {grade}</label>
                                                            <input type="number" className="w-full px-4 py-4 rounded-xl bg-white border border-zinc-200 outline-none focus:border-blue-600 transition-all text-sm text-center" placeholder="00" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <button onClick={() => setEnrollmentStep(1)} className="flex-1 py-5 bg-white border border-zinc-200 text-zinc-950 font-black rounded-2xl flex items-center justify-center gap-3">
                                                    <ChevronLeft className="w-4 h-4" /> KEMBALI
                                                </button>
                                                <button onClick={() => setEnrollmentStep(3)} className="flex-[2] py-5 bg-blue-600 text-white font-black rounded-2xl flex items-center justify-center gap-3">
                                                    REVIEW & SIMPAN <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Placeholder for Final Step */}
                                    {enrollmentStep === 3 && (
                                        <div className="text-center space-y-6">
                                            <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto" />
                                            <h3 className="text-2xl font-black">Siap untuk Mengirim?</h3>
                                            <p className="text-zinc-500 text-sm">Pastikan seluruh data diri dan nilai raport sudah sesuai dengan dokumen asli.</p>
                                            <button className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200">KIRIM PENDAFTARAN SEKARANG</button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* TAB: HASIL SELEKSI */}
                        {activeTab === 'hasil' && (
                            <motion.div
                                key="hasil"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="max-w-5xl mx-auto"
                            >
                                <div className="bg-blue-50/50 p-8 md:p-12 rounded-[48px] border border-blue-100 mb-12">
                                    <div className="flex flex-col md:flex-row items-center gap-8">
                                        <div className="flex-1 space-y-4">
                                            <h3 className="text-2xl font-black text-zinc-950 tracking-tight">Cek Status Lulus</h3>
                                            <p className="text-sm text-zinc-500 font-medium">Masukkan Nama atau Nomor Pendaftaran untuk melihat hasil seleksi Anda.</p>
                                        </div>
                                        <div className="flex-[2] w-full relative">
                                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                            <input
                                                type="text"
                                                className="w-full pl-16 pr-8 py-5 rounded-3xl bg-white border border-zinc-200 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all font-bold"
                                                placeholder="Cari Nama / No. Pendaftaran..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {results
                                        .filter(res => res.name.toLowerCase().includes(searchQuery.toLowerCase()) || res.id.includes(searchQuery))
                                        .map(res => (
                                            <div key={res.id} className="p-8 rounded-[32px] bg-white border border-zinc-100 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-xl hover:shadow-zinc-200/40 transition-shadow">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 font-black italic">
                                                        {res.id.split('-')[1]}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">{res.id}</span>
                                                        <span className="text-xl font-black text-zinc-950">{res.name}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-12">
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Skor Akhir</span>
                                                        <span className="font-black text-lg">{res.score}</span>
                                                    </div>
                                                    <div className={cn(
                                                        "px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest",
                                                        res.status === 'Lolos' ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                                                    )}>
                                                        {res.status}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                    {searchQuery && results.filter(res => res.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                                        <div className="text-center py-20 bg-zinc-50 rounded-[48px] border-2 border-dashed border-zinc-200">
                                            <span className="text-zinc-400 font-bold">Data tidak ditemukan. Silakan periksa kembali kata kunci Anda.</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </section>
        </div>
    );
}



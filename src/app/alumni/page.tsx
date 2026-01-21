"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
    Users,
    Search,
    MapPin,
    GraduationCap,
    School,
    Building2,
    Filter,
    ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ShinyText from '@/components/ShinyText';

// --- Mock Data ---

const ALUMNI_DATA = [
    { id: 1, name: 'Bagas Pratama', year: '2022', university: 'Politeknik Negeri Bandung', logo: 'POLBAN', status: 'Lolos SBMPTN' },
    { id: 2, name: 'Siti Kholifah', year: '2023', university: 'Universitas Indonesia', logo: 'UI', status: 'Lolos SNBT' },
    { id: 3, name: 'Rendy Kurnia', year: '2022', university: 'Telkom University', logo: 'TEL-U', status: 'Beasiswa Penuh' },
    { id: 4, name: 'Maya Rahayu', year: '2021', university: 'Astra Honda Motor', logo: 'AHM', status: 'Bekerja' },
    { id: 5, name: 'Diki Chandra', year: '2023', university: 'Universitas Padjadjaran', logo: 'UNPAD', status: 'Lolos SNBT' },
    { id: 6, name: 'Anisa Fitri', year: '2022', university: 'Institut Teknologi Bandung', logo: 'ITB', status: 'Beasiswa Unggulan' },
];

const YEARS = ['Semua', '2023', '2022', '2021', '2020'];

// --- Components ---

const AlumniCard = ({ alumni }: { alumni: typeof ALUMNI_DATA[0] }) => (
    <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bento-card group h-full flex flex-col pt-12"
    >
        <div className="absolute top-0 right-0 p-6">
            <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center font-black text-[10px] text-zinc-400 border border-zinc-100 italic">
                {alumni.year}
            </div>
        </div>

        <div className="mb-8">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-extrabold text-2xl mb-6 ring-4 ring-blue-50">
                {alumni.name.charAt(0)}
            </div>
            <h3 className="text-xl font-black text-zinc-950 mb-1 tracking-tight">{alumni.name}</h3>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">{alumni.status}</span>
        </div>

        <div className="mt-auto space-y-4">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400">
                    <School className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-zinc-500 leading-tight">{alumni.university}</span>
            </div>

            <button className="w-full py-4 bg-white border border-zinc-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-950 hover:text-white hover:border-zinc-950 transition-all flex items-center justify-center gap-2 group/btn">
                Lihat Profil <ArrowUpRight className="w-3 h-3 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
            </button>
        </div>
    </motion.div>
);

export default function AlumniPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedYear, setSelectedYear] = useState('Semua');

    // Parallax Logic
    const { scrollY } = useScroll();
    const bgY = useTransform(scrollY, [0, 500], [0, 100]);
    const textY = useTransform(scrollY, [0, 500], [0, -50]);

    const filteredAlumni = ALUMNI_DATA.filter(alumni => {
        const matchesSearch = alumni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            alumni.university.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesYear = selectedYear === 'Semua' || alumni.year === selectedYear;
        return matchesSearch && matchesYear;
    });

    return (
        <div className="bg-white min-h-screen pb-32">
            {/* Hero */}
            {/* Hero - Updated */}
            <section className="relative bg-white -mt-24 mb-12">
                <div className="relative min-h-[60vh] flex flex-col items-center justify-center bg-emerald-hero lg:rounded-b-[64px] overflow-hidden pt-40 pb-24 text-center px-6">

                    <motion.div
                        style={{ y: textY }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative z-10 flex flex-col items-center gap-6 max-w-4xl mx-auto"
                    >
                        <span className="text-xs font-black text-white/80 uppercase tracking-[0.5em] border border-white/20 px-6 py-2.5 rounded-full backdrop-blur-md bg-white/5 shadow-xl">
                            ALUMNI SUCCESS STORY
                        </span>

                        <h1 className="font-heading font-black text-5xl md:text-7xl text-white leading-[0.9] tracking-tighter shadow-lg shadow-blue-900/0">
                            Wall of <br /> <span className="text-white">Career Glory.</span>
                        </h1>

                        <p className="text-blue-50 text-lg md:text-xl font-medium max-w-2xl leading-relaxed opacity-90">
                            Database lulusan SMK Marantaa yang telah mendunia. Dari kampus unggulan hingga industri multinasional.
                        </p>
                    </motion.div>

                    {/* Decorative ShinyText in Background */}
                    <motion.div
                        style={{ y: bgY }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 opacity-40 scale-150 top-10"
                    >
                        <ShinyText
                            text="ALUMNI"
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

            {/* Filter & Search Bar */}
            <section className="sticky top-[88px] bg-white border-b border-zinc-100 z-50 py-6">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="flex flex-col lg:flex-row items-center gap-8 justify-between">

                        {/* Year Filter */}
                        <div className="flex items-center gap-3 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 no-scrollbar">
                            <div className="p-2 bg-zinc-50 rounded-xl mr-2">
                                <Filter className="w-4 h-4 text-zinc-400" />
                            </div>
                            {YEARS.map(year => (
                                <button
                                    key={year}
                                    onClick={() => setSelectedYear(year)}
                                    className={cn(
                                        "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                                        selectedYear === year ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-white border border-zinc-200 text-zinc-400 hover:border-zinc-300"
                                    )}
                                >
                                    {year}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative w-full lg:w-96">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Cari Nama atau Instansi..."
                                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section >

            {/* Grid Wall */}
            < section className="py-20" >
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredAlumni.map((alumni) => (
                                <AlumniCard key={alumni.id} alumni={alumni} />
                            ))}
                        </AnimatePresence>
                    </div>

                    {filteredAlumni.length === 0 && (
                        <div className="py-40 text-center space-y-4">
                            <div className="w-20 h-20 bg-zinc-100 rounded-[40px] flex items-center justify-center mx-auto text-zinc-300">
                                <Search className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-black text-zinc-900 tracking-tight">Tidak Ada Data</h3>
                            <p className="text-zinc-500 font-medium">Coba sesuaikan filter atau kata kunci pencarian Anda.</p>
                        </div>
                    )}
                </div>
            </section >

            {/* Industrial Partners (Bonus Branding) */}
            < section className="py-32 bg-zinc-950 text-white overflow-hidden relative" >
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="flex flex-col items-center text-center space-y-8 mb-20">
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.5em]">INDUSTRIAL PARTNERS</span>
                        <h2 className="heading-xl text-3xl md:text-5xl">Mencetak SDM yang Siap Kerja <br /> dan Berdaya Saing Global.</h2>
                    </div>

                    <div className="flex flex-wrap justify-center gap-20 opacity-30 grayscale hover:grayscale-0 transition-all">
                        {['HONDA', 'PERTAMINA', 'PLN', 'TOYOTA', 'GOJEK'].map(logo => (
                            <span key={logo} className="text-3xl font-black tracking-tighter text-white/50">{logo}</span>
                        ))}
                    </div>
                </div>
            </section >
        </div >
    );
}

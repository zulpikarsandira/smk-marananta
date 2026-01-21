"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
    Trophy,
    MapPin,
    Calendar,
    X,
    Search,
    ChevronRight,
    Maximize2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ShinyText from '@/components/ShinyText';

// --- Mock Data ---

const PRESTASI_DATA = [
    {
        id: 1,
        title: 'Juara 1 LKS Nasional Bidang IT Network Systems',
        category: 'Siswa',
        year: '2023',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070',
        description: 'Pencapaian luar biasa di tingkat nasional mengalahkan perwakilan dari 34 provinsi.'
    },
    {
        id: 2,
        title: 'Guru Inovatif Terbaik Tingkat Provinsi',
        category: 'Guru',
        year: '2023',
        image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070',
        description: 'Penghargaan atas dedikasi pengembangan media pembelajaran berbasis AI.'
    },
    {
        id: 3,
        title: 'Juara 3 Kompetisi Otomotif Astra Honda',
        category: 'Siswa',
        year: '2022',
        image: 'https://images.unsplash.com/photo-1530124560676-5ef66436665c?q=80&w=2160',
        description: 'Membuktikan kualitas skill teknis siswa dalam industri otomotif skala besar.'
    },
    {
        id: 4,
        title: 'Sekolah Adiwiyata Mandiri 2023',
        category: 'Institusi',
        year: '2023',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070',
        description: 'Komitmen berkelanjutan dalam menjaga ekosistem lingkungan sekolah yang asri.'
    },
    {
        id: 5,
        title: 'Peringkat 5 Nasional Kelulusan SBMPTN terbanyak',
        category: 'Institusi',
        year: '2022',
        image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070',
        description: 'Menjadikan SMK Marantaa sebagai SMK rujukan untuk persiapan kuliah.'
    },
    {
        id: 6,
        title: 'Juara 1 Lomba Cipta Puisi Digital',
        category: 'Siswa',
        year: '2023',
        image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070',
        description: 'Memadukan sastra dan teknologi dalam karya seni modern.'
    },
];

const CATEGORIES = ['Semua', 'Siswa', 'Guru', 'Institusi'];

export default function PrestasiPage() {
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [selectedImage, setSelectedImage] = useState<typeof PRESTASI_DATA[0] | null>(null);

    // Parallax Logic
    const { scrollY } = useScroll();
    const bgY = useTransform(scrollY, [0, 500], [0, 100]);
    const textY = useTransform(scrollY, [0, 500], [0, -50]);

    const filteredData = PRESTASI_DATA.filter(item =>
        selectedCategory === 'Semua' || item.category === selectedCategory
    );

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
                            GALLERY OF EXCELLENCE
                        </span>

                        <h1 className="font-heading font-black text-5xl md:text-7xl text-white leading-[0.9] tracking-tighter shadow-lg shadow-blue-900/0">
                            Puncak <br /> <span className="text-white">Pencapaian.</span>
                        </h1>

                        <p className="text-blue-50 text-lg md:text-xl font-medium max-w-2xl leading-relaxed opacity-90">
                            Setiap dedikasi berbuah penghargaan. Mari lihat perjalanan inspiratif seluruh civitas akademika SMK Marantaa.
                        </p>

                        {/* Dynamic Filter in Hero */}
                        <div className="flex flex-wrap items-center gap-3 justify-center mt-8">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={cn(
                                        "px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                                        selectedCategory === cat ? "bg-white text-blue-600 shadow-lg" : "bg-white/10 backdrop-blur-md border border-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Decorative ShinyText in Background */}
                    <motion.div
                        style={{ y: bgY }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 opacity-40 scale-150 top-10"
                    >
                        <ShinyText
                            text="PRESTASI"
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

            {/* Masonry-ish Gallery */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                        <AnimatePresence mode="popLayout">
                            {filteredData.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="break-inside-avoid relative rounded-[40px] overflow-hidden bg-zinc-100 group cursor-pointer border border-zinc-200 shadow-sm hover:shadow-2xl transition-all duration-500"
                                    onClick={() => setSelectedImage(item)}
                                >
                                    <img
                                        src={item.image}
                                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                        alt={item.title}
                                    />

                                    {/* Content Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end">
                                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 block">{item.year} | {item.category}</span>
                                        <h3 className="text-xl font-bold text-white leading-tight mb-4">{item.title}</h3>
                                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white self-center">
                                            <Maximize2 className="w-5 h-5" />
                                        </div>
                                    </div>

                                    {/* Default Info (Mobile/Idle) */}
                                    <div className="p-8 bg-white md:bg-transparent md:bg-gradient-to-t md:from-white md:p-10 group-hover:opacity-0 transition-opacity">
                                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1 block">{item.category}</span>
                                        <h4 className="font-black text-zinc-950 leading-tight">{item.title}</h4>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </section >

            {/* Lightbox Modal */}
            <AnimatePresence>
                {
                    selectedImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-6 md:p-20 backdrop-blur-xl"
                        >
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-8 right-8 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center gap-12">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="flex-1 w-full relative aspect-video rounded-[32px] overflow-hidden shadow-2xl"
                                >
                                    <img
                                        src={selectedImage.image}
                                        className="w-full h-full object-cover"
                                        alt={selectedImage.title}
                                    />
                                </motion.div>

                                <div className="flex-1 space-y-8 text-white text-center lg:text-left">
                                    <div className="space-y-4">
                                        <div className="inline-flex items-center gap-4 px-4 py-2 bg-blue-600 rounded-full">
                                            <Trophy className="w-4 h-4" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{selectedImage.year} Excellence Award</span>
                                        </div>
                                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-none">{selectedImage.title}</h2>
                                        <p className="text-zinc-500 text-lg leading-relaxed">{selectedImage.description}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Kategori</span>
                                            <span className="font-bold">{selectedImage.category}</span>
                                        </div>
                                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Pencapaian</span>
                                            <span className="font-bold">Terverifikasi</span>
                                        </div>
                                    </div>

                                    <button className="px-10 py-4 bg-white text-zinc-950 font-black rounded-2xl hover:bg-zinc-200 transition-all flex items-center gap-2 group w-full lg:w-auto justify-center">
                                        BAGIKAN PRESTASI <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )
                }
            </AnimatePresence >
        </div >
    );
}

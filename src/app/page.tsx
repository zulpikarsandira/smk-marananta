"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  FileText,
  Users,
  GraduationCap,
  Trophy,
  Zap,
  Instagram,
  ShieldCheck,
  HeartHandshake,
  TrendingUp,
  Award,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ShinyText from '@/components/ShinyText';
import MagicBento from '@/components/MagicBento';

// --- Types ---

interface ServiceType {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: any;
  colorClass: string;
}

// --- Components ---

const BentoCard = ({
  icon: Icon,
  title,
  description,
  href,
  colorClass,
  className
}: {
  icon: any,
  title: string,
  description: string,
  href: string,
  colorClass: string,
  className?: string
}) => (
  <Link href={href} className={cn("bento-card group", className)}>
    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", colorClass)}>
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-xl font-black text-zinc-950 mb-2 tracking-tight">{title}</h3>
    <p className="text-sm text-zinc-500 font-medium leading-relaxed">{description}</p>
    <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
      <ArrowRight className="w-5 h-5 text-zinc-400" />
    </div>
  </Link>
);

const AnimatedStats = ({ value, label, suffix = "" }: { value: number, label: string, suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 2000;
    const stepTime = Math.abs(Math.floor(duration / end));

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="flex flex-col items-center md:items-start">
      <div className="flex items-baseline gap-1">
        <span className="text-4xl md:text-6xl font-black text-zinc-950 tracking-tighter">{count}</span>
        <span className="text-2xl font-black text-blue-600">{suffix}</span>
      </div>
      <span className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em] mt-2">{label}</span>
    </div>
  );
};

const PixelBubble = ({ text, className }: { text: string, className?: string }) => (
  <div className={cn("relative group", className)}>
    <div className="bg-yellow-400 px-6 py-3 border-[4px] border-white shadow-[8px_8px_0px_rgba(0,0,0,0.1)] relative z-10">
      <span className="text-zinc-900 font-pixel text-[10px] md:text-xs font-black uppercase tracking-widest">{text}</span>
    </div>
    {/* Pixel Tail */}
    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-white clip-path-pixel-tail" />
  </div>
);

const HeroCarousel = () => {
  const items = [
    { title: 'ALUMNI', path: '/school-1.png' },
    { title: 'DATA GURU', path: '/school-2.png' },
    { title: 'PRESTASI', path: '/school-3.png' },
  ];
  return (
    <div className="flex items-center gap-4 mt-20">
      {items.map((item, i) => (
        <div key={i} className={cn(
          "relative h-24 md:h-32 transition-all duration-500 rounded-2xl overflow-hidden group border-2 border-white/20",
          i === 1 ? "w-40 md:w-56" : "w-16 md:w-24 opacity-50 grayscale hover:grayscale-0 hover:opacity-100"
        )}>
          <img src={item.path} alt={item.title} className="w-full h-full object-cover" />
          {i === 1 && (
            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
              <span className="text-[8px] font-black text-white uppercase tracking-widest">{item.title}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const HeroStudent = () => {
  const [imageIndex, setImageIndex] = useState(0);
  const images = ['/1.png', '/2.png'];

  // Parallax logic
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 100]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.1]);

  useEffect(() => {
    const timer = setInterval(() => {
      setImageIndex((prev) => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative z-10 flex flex-col items-center select-none w-full max-w-7xl px-6">
      <motion.div
        style={{ y, scale }}
        className="relative flex justify-center w-full"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={imageIndex}
            src={images[imageIndex]}
            alt="Student Focus"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="h-[50vh] md:h-[65vh] w-auto object-contain z-10 brightness-110 contrast-[1.05]"
          />
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 500], [0, -50]);
  const titleScale = useTransform(scrollY, [0, 500], [1, 0.95]);

  useEffect(() => {
    // Desktop App Redirect Logic
    // @ts-ignore
    if (typeof window !== 'undefined' && window.__TAURI__) {
      router.push('/admin/ptsp'); // Redirect directly to Admin Dashboard (or login)
    }
  }, [router]);

  return (
    <div className="relative">

      {/* Hero Section - Full Screen Edge-to-Edge Container */}
      <section className="relative bg-white -mt-24">
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-emerald-hero lg:rounded-b-[64px] overflow-hidden pt-12">

          {/* Centered ESKALASI with ShinyText & Parallax */}
          <motion.div
            style={{ y: titleY, scale: titleScale }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
          >
            <ShinyText
              text="ESKALASI"
              disabled={false}
              speed={3}
              className="font-heading text-[15vw] font-black tracking-tighter"
              color="rgba(255, 255, 255, 0.2)"
              shineColor="rgba(255, 255, 255, 0.7)"
            />
          </motion.div>

          <HeroStudent />

          {/* Bottom Indicators */}
          <div className="absolute bottom-16 left-12 z-20 hidden lg:block">
            <div className="flex flex-col items-start gap-2">
              <span className="text-[10px] font-black text-white uppercase tracking-widest">SEE PORTAL SERVICES</span>
              <ArrowRight className="w-5 h-5 text-white -rotate-45" />
            </div>
          </div>

          <div className="absolute bottom-16 right-12 z-20 hidden lg:block">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-white uppercase tracking-widest">SCROLL DOWN</span>
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group cursor-pointer hover:bg-white transition-all">
                <ChevronLeft className="w-4 h-4 text-white group-hover:text-blue-900 rotate-[270deg]" />
              </div>
            </div>
          </div>

          {/* Extreme Smooth Fog Transition */}
          <div className="absolute inset-x-0 bottom-0 h-[50%] hero-fog z-20 pointer-events-none" />
        </div>
      </section>

      {/* Quick Access Portal (New elements current version) */}
      <section className="relative z-20 py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <div className="space-y-4">
              <span className="text-xs font-black text-sky-400 uppercase tracking-[0.5em]">OPERATIONAL PORTAL</span>
              <h2 className="heading-xl text-4xl md:text-6xl">Layanan <span className="text-sky-400">Terpadu.</span></h2>
            </div>
            <p className="max-w-md text-subtle text-right font-medium">
              Transformasi digital SMK Marantaa memudahkan akses administrasi dan pemantauan akademik dalam satu dashboard.
            </p>
          </div>

          <div className="w-full">
            <MagicBento
              items={[
                {
                  title: "Layanan PTSP",
                  description: "Legalisir, surat keterangan, dan administrasi surat-menyurat secara digital.",
                  href: "/ptsp",
                  icon: (props: any) => <img src="/ptsp-icon.png" alt="PTSP Icon" {...props} />,
                  color: "bg-blue-50 text-blue-600",
                  label: "Administrasi"
                },
                {
                  title: "Portal Guru",
                  description: "Dashboard khusus tenaga pendidik untuk manajemen KBM.",
                  href: "/guru",
                  icon: (props: any) => <img src="/guru-icon.png" alt="Guru Icon" {...props} />,
                  color: "bg-purple-50 text-purple-600",
                  label: "KBM"
                },
                {
                  title: "Wali Murid",
                  description: "Pantau perkembangan akademik dan kehadiran siswa secara real-time.",
                  href: "/wali-murid",
                  icon: (props: any) => <img src="/wali-murid-icon.png" alt="Wali Murid Icon" {...props} />,
                  color: "bg-pink-50 text-pink-600",
                  label: "Monitoring"
                },
                {
                  title: "Alumni & Karir",
                  description: "Database lulusan dan info lowongan kerja industri mitra.",
                  href: "/alumni",
                  icon: (props: any) => <img src="/alumni-karir-icon.png" alt="Alumni Icon" {...props} />,
                  color: "bg-amber-50 text-amber-600",
                  label: "BKK"
                },
                {
                  title: "PPDB Online",
                  description: "Pendaftaran siswa baru tahun ajaran 2024/2025 telah dibuka.",
                  href: "/ppdb",
                  icon: (props: any) => <img src="/ppdb-icon.png" alt="PPDB Icon" {...props} />,
                  color: "bg-emerald-50 text-emerald-600",
                  label: "New Student"
                },
                {
                  title: "Pusat Prestasi",
                  description: "Etalase pencapaian siswa dan guru di level nasional.",
                  href: "/prestasi",
                  icon: (props: any) => <img src="/prestasi-icon.png" alt="Prestasi Icon" {...props} />,
                  color: "bg-indigo-50 text-indigo-600",
                  label: "Achievements"
                },
                {
                  title: "Zona Integritas",
                  description: "Laporan transparansi dan maklumat pelayanan publik.",
                  href: "/zi",
                  icon: (props: any) => <img src="/zi-icon.png" alt="Zona Integritas Icon" {...props} />,
                  color: "bg-zinc-100 text-zinc-950",
                  label: "WBK"
                },
                {
                  title: "Media Sosial",
                  description: "Ikuti keseharian kami di Instagram dan Youtube.",
                  href: "/medsos",
                  icon: (props: any) => <img src="/medsos-icon.png" alt="Medsos Icon" {...props} />,
                  color: "bg-rose-50 text-rose-600",
                  label: "Updates"
                }
              ]}
              enableStars={true}
              enableSpotlight={true}
              enableBorderGlow={true}
              enableTilt={true}
              spotlightRadius={300}
              particleCount={10}
            />
          </div>
        </div>
      </section>

      {/* Live Stats Section */}
      <section className="py-32 bg-zinc-50 border-y border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">
            <AnimatedStats value={85} label="Guru Tersertifikasi" suffix="%" />
            <AnimatedStats value={120} label="Mitra Industri" suffix="+" />
            <AnimatedStats value={950} label="Alumni Lolos PTN" suffix="" />
            <AnimatedStats value={15} label="Ekstrakurikuler" suffix="" />
          </div>
        </div>
      </section>

      {/* Integrity & Vision */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-20">
          <div className="flex-1 space-y-8">
            <h2 className="heading-xl text-3xl md:text-5xl">Membangun Transparansi dengan Zona Integritas.</h2>
            <p className="text-subtle text-base md:text-lg">
              Kami berkomitmen memberikan pelayanan terbaik tanpa pungli dan gratifikasi. Seluruh laporan keuangan dan standar operasional dapat diakses secara terbuka oleh publik.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <Award className="w-8 h-8 text-blue-600" />
                <h4 className="font-black text-zinc-950 uppercase text-xs tracking-widest">Wilayah Bebas Korupsi</h4>
              </div>
              <div className="space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                <h4 className="font-black text-zinc-950 uppercase text-xs tracking-widest">Pelayanan Prima</h4>
              </div>
            </div>
            <Link href="/zi" className="inline-flex items-center gap-2 text-sm font-black text-blue-600 border-b-2 border-blue-600 pb-1 hover:gap-4 transition-all uppercase tracking-widest">
              BACA MAKLUMAT PELAYANAN
            </Link>
          </div>
          <div className="flex-1 w-full flex justify-center">
            <div className="relative group max-w-sm w-full">
              <div className="absolute inset-0 bg-blue-600 rounded-[48px] rotate-3 -z-10 group-hover:rotate-6 transition-transform" />
              <div className="bg-zinc-950 p-12 rounded-[48px] text-white space-y-8 shadow-2xl">
                <ShieldCheck className="w-16 h-16 text-blue-400" />
                <h3 className="text-3xl font-black tracking-tight leading-tight italic">"Kualitas adalah prioritas, Integritas adalah fondasi kami."</h3>
                <div className="flex flex-col">
                  <span className="font-bold text-lg">Hj. Siti Marantaa, M.Pd</span>
                  <span className="text-zinc-500 text-xs uppercase tracking-widest mt-1">Kepala Sekolah</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

// Local Icons
const CheckCircle2 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>
);

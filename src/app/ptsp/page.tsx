"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
    FileCheck,
    Upload,
    User,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    Info,
    Clock,
    ArrowRight,
    ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ShinyText from '@/components/ShinyText';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { Loader2 } from 'lucide-react';

// --- Types ---

type Step = 'SelectType' | 'Biodata' | 'Upload' | 'Review' | 'Success';

interface ServiceType {
    id: string;
    title: string;
    description: string;
    requirements: string[];
}

const SERVICES: ServiceType[] = [
    {
        id: 'legalisir',
        title: 'Legalisir Ijazah/SHUN',
        description: 'Pengesahan dokumen fotokopi ijazah untuk keperluan administrasi.',
        requirements: ['Ijazah Asli', 'SHUN Asli', 'KTP']
    },
    {
        id: 'keterangan_aktif',
        title: 'Surat Keterangan Siswa Aktif',
        description: 'Surat resmi menyatakan siswa masih terdaftar di SMK Marantaa.',
        requirements: ['Buku Raport Terakhir', 'Kartu Pelajar']
    },
    {
        id: 'keterangan_pindah',
        title: 'Surat Keterangan Pindah Sekolah',
        description: 'Permohonan untuk pindah ke institusi pendidikan lain.',
        requirements: ['Surat Rekomendasi Sekolah Tujuan', 'Buku Raport Original']
    }
];

// --- Sub-components ---

const StepIndicator = ({ currentStep }: { currentStep: number }) => {
    const steps = ['Layanan', 'Identitas', 'Berkas', 'Review'];
    return (
        <div className="flex items-center justify-between max-w-2xl mx-auto mb-16">
            {steps.map((label, idx) => (
                <div key={label} className="flex items-center group">
                    <div className="flex flex-col items-center">
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center text-xs font-black transition-all",
                            currentStep > idx ? "bg-emerald-500 text-white" :
                                currentStep === idx ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110" :
                                    "bg-zinc-100 text-zinc-400"
                        )}>
                            {currentStep > idx ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                        </div>
                        <span className={cn(
                            "text-[10px] uppercase tracking-widest mt-2 font-bold",
                            currentStep === idx ? "text-blue-600" : "text-zinc-400"
                        )}>{label}</span>
                    </div>
                    {idx < steps.length - 1 && (
                        <div className={cn(
                            "w-12 md:w-24 h-[2px] mx-4 mb-6 transition-colors",
                            currentStep > idx ? "bg-emerald-500" : "bg-zinc-100"
                        )} />
                    )}
                </div>
            ))}
        </div>
    );
};

export default function PTSPPage() {
    const [step, setStep] = useState<Step>('SelectType');
    const [currentStepIdx, setCurrentStepIdx] = useState(0);
    const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        nis: '',
        purpose: '',
        resi: '',
        file: null as File | null,
    });

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Parallax Logic
    const { scrollY } = useScroll();
    const bgY = useTransform(scrollY, [0, 500], [0, 100]); // Moves down slower (background)
    const textY = useTransform(scrollY, [0, 500], [0, -50]); // Moves up slightly (foreground)

    const [isSubmitting, setIsSubmitting] = useState(false);

    const nextStep = async () => {
        if (step === 'SelectType') { setStep('Biodata'); setCurrentStepIdx(1); }
        else if (step === 'Biodata') { setStep('Upload'); setCurrentStepIdx(2); }
        else if (step === 'Upload') {
            if (!formData.file) {
                alert("Mohon upload berkas persyaratan terlebih dahulu.");
                return;
            }
            setStep('Review');
            setCurrentStepIdx(3);
        }
        else if (step === 'Review') {
            // Submit Data
            setIsSubmitting(true);
            try {
                // Get current user
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    alert('Sesi anda berakhir. Silakan login kembali.');
                    return;
                }

                const payload = new FormData();
                payload.append('nama_pemohon', formData.name);
                payload.append('email', formData.email);
                payload.append('no_telepon', formData.phone);
                payload.append('jenis_layanan', selectedService?.id || '');
                payload.append('keterangan', formData.purpose);
                if (formData.file) {
                    payload.append('dokumen', formData.file);
                }
                payload.append('user_id', user.id); // Add User ID

                // Use the new service
                const { ptspService } = await import('@/lib/api');
                const response = await ptspService.submitPermohonan(payload);

                if (response.success) {
                    // Update resi logic if needed, or just use ID from response
                    // const resi = response.data?.id || 'RES-000'; 
                    // Keeping random resi for UI effect or use actual ID
                    const resi = `PTSP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
                    setFormData(prev => ({ ...prev, resi }));
                    setStep('Success');
                } else {
                    throw new Error(response.message || 'Gagal mengirim data');
                }

            } catch (err: any) {
                alert('Gagal mengirim pengajuan: ' + err.message);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const prevStep = () => {
        if (step === 'Biodata') { setStep('SelectType'); setCurrentStepIdx(0); }
        else if (step === 'Upload') { setStep('Biodata'); setCurrentStepIdx(1); }
        else if (step === 'Review') { setStep('Upload'); setCurrentStepIdx(2); }
    };

    return (
        <div className="bg-white min-h-screen pb-32">
            {/* Hero/Page Header */}
            {/* Hero/Page Header - Updated to Match Home */}
            <section className="relative bg-white -mt-24 mb-12">
                <div className="relative min-h-[60vh] flex flex-col items-center justify-center bg-emerald-hero lg:rounded-b-[64px] overflow-hidden pt-40 pb-24 text-center px-6">

                    <motion.div
                        style={{ y: textY }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative z-10 flex flex-col items-center gap-6 max-w-4xl mx-auto"
                    >
                        <span className="text-xs font-black text-white/80 uppercase tracking-[0.5em] border border-white/20 px-6 py-2.5 rounded-full backdrop-blur-md bg-white/5 shadow-xl">
                            PELAYANAN TERPADU SATU PINTU
                        </span>

                        <h1 className="font-heading font-black text-5xl md:text-7xl text-white leading-[0.9] tracking-tighter shadow-lg shadow-blue-900/0">
                            Layanan Administrasi <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-50 to-white">Tanpa Tatap Muka.</span>
                        </h1>

                        <p className="text-blue-50 text-lg md:text-xl font-medium max-w-2xl leading-relaxed opacity-90 mb-8">
                            Ajukan permohonan surat-menyurat dan legalisir dokumen sekolah secara online. Pantau progresnya menggunakan sistem pelacakan resi kami.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                            <button onClick={() => {
                                const el = document.getElementById('layanan-section');
                                el?.scrollIntoView({ behavior: 'smooth' });
                            }} className="px-8 py-4 bg-white text-blue-600 font-black rounded-2xl hover:bg-blue-50 transition-all shadow-lg shadow-blue-900/20">
                                BUAT PENGA JUAN BARU
                            </button>
                            <Link href="/ptsp/history" className="px-8 py-4 bg-blue-600/30 backdrop-blur-md border border-white/20 text-white font-black rounded-2xl hover:bg-blue-600/50 transition-all shadow-lg">
                                CEK RIWAYAT & STATUS
                            </Link>
                        </div>
                    </motion.div>

                    {/* Decorative ShinyText in Background */}
                    <motion.div
                        style={{ y: bgY }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 opacity-40 scale-150 top-10"
                    >
                        <ShinyText
                            text="PTSP ONLINE"
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

            <section id="layanan-section" className="pt-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {step !== 'Success' && <StepIndicator currentStep={currentStepIdx} />}

                    <div className="max-w-5xl mx-auto">
                        <AnimatePresence mode="wait">

                            {/* STEP 1: SELECT SERVICE */}
                            {step === 'SelectType' && (
                                <motion.div
                                    key="step-1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                                >
                                    {SERVICES.map((service) => (
                                        <div
                                            key={service.id}
                                            onClick={() => { setSelectedService(service); nextStep(); }}
                                            className={cn(
                                                "group p-8 rounded-[32px] border-2 transition-all cursor-pointer hover:-translate-y-2",
                                                selectedService?.id === service.id ? "border-blue-600 bg-blue-50/50" : "border-zinc-100 bg-white hover:border-zinc-200"
                                            )}
                                        >
                                            <div className="w-12 h-12 rounded-2xl bg-zinc-50 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center mb-6 transition-colors">
                                                <FileCheck className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-lg font-black text-zinc-950 mb-3">{service.title}</h3>
                                            <p className="text-xs text-zinc-500 font-medium leading-relaxed mb-6">{service.description}</p>
                                            <div className="flex flex-wrap gap-2 mb-8">
                                                {service.requirements.map(req => (
                                                    <span key={req} className="text-[10px] px-2 py-1 bg-zinc-100 rounded-md font-bold text-zinc-600">{req}</span>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 tracking-widest uppercase">
                                                PILIH LAYANAN <ChevronRight className="w-3 h-3" />
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {/* STEP 2: BIODATA */}
                            {step === 'Biodata' && (
                                <motion.div
                                    key="step-2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-zinc-50/50 p-8 md:p-12 rounded-[48px] border border-zinc-100"
                                >
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <h2 className="text-2xl font-black text-zinc-950 tracking-tight">Data Diri Pemohon</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Nama Lengkap Sesuai Ijazah</label>
                                            <input
                                                type="text"
                                                placeholder="Contoh: Siti Aminah"
                                                className="w-full px-6 py-4 rounded-2xl bg-white border border-zinc-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">NIS / NISN</label>
                                            <input
                                                type="text"
                                                placeholder="Masukkan nomor induk siswa"
                                                className="w-full px-6 py-4 rounded-2xl bg-white border border-zinc-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all"
                                                value={formData.nis}
                                                onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Email Aktif</label>
                                            <input
                                                type="email"
                                                placeholder="nama@email.com"
                                                className="w-full px-6 py-4 rounded-2xl bg-white border border-zinc-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Nomor WhatsApp</label>
                                            <input
                                                type="tel"
                                                placeholder="0812xxxx"
                                                className="w-full px-6 py-4 rounded-2xl bg-white border border-zinc-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Keperluan Pengajuan</label>
                                            <textarea
                                                rows={4}
                                                placeholder="Jelaskan alasan pengajuan dokumen ini..."
                                                className="w-full px-6 py-4 rounded-2xl bg-white border border-zinc-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all resize-none"
                                                value={formData.purpose}
                                                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-12 flex items-center justify-between">
                                        <button onClick={prevStep} className="flex items-center gap-2 text-sm font-black text-zinc-400 hover:text-zinc-600 transition-colors">
                                            <ChevronLeft className="w-4 h-4" /> KEMBALI
                                        </button>
                                        <button onClick={nextStep} className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center gap-3">
                                            LANJUTKAN
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 3: UPLOAD */}
                            {step === 'Upload' && (
                                <motion.div
                                    key="step-3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl flex items-start gap-4">
                                        <Info className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-black text-zinc-950 uppercase tracking-widest">Informasi Berkas</h4>
                                            <p className="text-xs text-blue-700 font-medium">Pastikan dokumen yang diunggah terbaca dengan jelas. Format yang didukung: PDF, JPG, PNG (Maks. 5MB per file).</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                        <div className="space-y-4">
                                            <h5 className="font-bold text-zinc-800 text-sm uppercase tracking-wider">Persyaratan Dokumen</h5>
                                            <ul className="space-y-3">
                                                {selectedService?.requirements.map((req, idx) => (
                                                    <li key={idx} className="flex items-center gap-3 p-4 bg-zinc-50 border border-zinc-100 rounded-2xl">
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                                                            {idx + 1}
                                                        </div>
                                                        <span className="text-sm font-medium text-zinc-700">{req}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-xs text-amber-800 leading-relaxed">
                                                <strong>PENTING:</strong> Jika persyaratan lebih dari satu file, mohon gabungkan menjadi <strong>satu file PDF</strong> sebelum diupload.
                                            </div>
                                        </div>

                                        <div className="p-8 rounded-[32px] border-2 border-zinc-200 border-dashed hover:border-blue-500 hover:bg-blue-50/10 transition-all group relative min-h-[300px] flex flex-col items-center justify-center text-center">
                                            <input
                                                type="file"
                                                id="unified-upload"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) setFormData({ ...formData, file });
                                                }}
                                                accept=".pdf,.zip,.rar"
                                            />

                                            <div className={cn(
                                                "w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-transform shadow-lg",
                                                formData.file ? "bg-emerald-500 text-white shadow-emerald-200 scale-110" : "bg-white text-blue-600 shadow-blue-100 group-hover:scale-110"
                                            )}>
                                                {formData.file ? <FileCheck className="w-10 h-10" /> : <Upload className="w-10 h-10" />}
                                            </div>

                                            {formData.file ? (
                                                <div className="space-y-2">
                                                    <span className="text-lg font-black text-zinc-900 block">{formData.file.name}</span>
                                                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full inline-block">
                                                        {(formData.file.size / 1024 / 1024).toFixed(2)} MB • Siap Diupload
                                                    </span>
                                                    <p className="text-xs text-zinc-400 mt-4">Klik untuk ganti file</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <span className="text-lg font-black text-zinc-900 block">Upload Berkas Persyaratan</span>
                                                    <p className="text-sm text-zinc-500 max-w-[200px] mx-auto leading-relaxed">
                                                        Klik atau seret file PDF/ZIP yang berisi semua persyaratan di sini.
                                                    </p>
                                                    <div className="mt-6 px-6 py-3 bg-zinc-900 text-white rounded-xl text-xs font-bold inline-block">
                                                        PILIH FILE
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-12 flex items-center justify-between">
                                        <button onClick={prevStep} className="flex items-center gap-2 text-sm font-black text-zinc-400 hover:text-zinc-600 transition-colors">
                                            <ChevronLeft className="w-4 h-4" /> KEMBALI
                                        </button>
                                        <button onClick={nextStep} className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center gap-3">
                                            REVIEW PENGAJUAN
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 4: REVIEW */}
                            {step === 'Review' && (
                                <motion.div
                                    key="step-4"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-zinc-950 p-8 md:p-16 rounded-[48px] text-white overflow-hidden relative"
                                >
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px]" />

                                    <div className="relative z-10 space-y-12">
                                        <div className="flex flex-col items-center text-center">
                                            <div className="w-16 h-16 rounded-3xl bg-blue-600 flex items-center justify-center mb-6">
                                                <ShieldCheck className="w-8 h-8 text-white" />
                                            </div>
                                            <h2 className="text-3xl font-black tracking-tight mb-2">Review Terakhir</h2>
                                            <p className="text-zinc-500 text-sm max-w-md">Harap pastikan semua data sudah benar sebelum mengirimkan permohonan Anda ke sistem kami.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-y border-zinc-800 py-12">
                                            <div className="space-y-6">
                                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block">IDENTITAS PEMOHON</span>
                                                <div className="space-y-4">
                                                    <div className="flex justify-between border-b border-zinc-800 pb-2">
                                                        <span className="text-xs text-zinc-500">Nama</span>
                                                        <span className="text-xs font-black">{formData.name}</span>
                                                    </div>
                                                    <div className="flex justify-between border-b border-zinc-800 pb-2">
                                                        <span className="text-xs text-zinc-500">Email</span>
                                                        <span className="text-xs font-black">{formData.email}</span>
                                                    </div>
                                                    <div className="flex justify-between border-b border-zinc-800 pb-2">
                                                        <span className="text-xs text-zinc-500">WhatsApp</span>
                                                        <span className="text-xs font-black">{formData.phone}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block">RINCIAN LAYANAN</span>
                                                <div className="space-y-4">
                                                    <div className="flex justify-between border-b border-zinc-800 pb-2">
                                                        <span className="text-xs text-zinc-500">Jenis</span>
                                                        <span className="text-xs font-black uppercase text-emerald-400">{selectedService?.title}</span>
                                                    </div>
                                                    <div className="flex justify-between border-b border-zinc-800 pb-2">
                                                        <span className="text-xs text-zinc-500">Waktu Estimasi</span>
                                                        <span className="text-xs font-black">2 - 3 Hari Kerja</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-12 flex items-center justify-between">
                                            <button onClick={prevStep} className="flex items-center gap-2 text-sm font-black text-zinc-500 hover:text-white transition-colors">
                                                <ChevronLeft className="w-4 h-4" /> KEMBALI
                                            </button>
                                            <button onClick={nextStep} disabled={isSubmitting} className="px-12 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-2xl shadow-blue-500/20 transition-all flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed">
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        MENGIRIM...
                                                    </>
                                                ) : (
                                                    <>
                                                        KIRIM SEKARANG
                                                        <ArrowRight className="w-4 h-4" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 5: SUCCESS */}
                            {step === 'Success' && (
                                <motion.div
                                    key="step-5"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="max-w-xl mx-auto text-center py-20"
                                >
                                    <div className="w-24 h-24 rounded-[40px] bg-emerald-500 flex items-center justify-center text-white mx-auto mb-10 shadow-2xl shadow-emerald-200">
                                        <CheckCircle2 className="w-12 h-12" />
                                    </div>
                                    <h2 className="heading-xl text-4xl mb-4">Pengajuan Terkirim!</h2>
                                    <p className="text-subtle text-base mb-12">Terima kasih, permohonan Anda sudah masuk ke sistem kami. Silakan catat nomor resi di bawah ini.</p>

                                    <div className="p-8 bg-zinc-50 rounded-[32px] border border-zinc-100 mb-12 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-bl-2xl">Verified</div>
                                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] block mb-2">NOMOR RESI ANDA</span>
                                        <span className="text-4xl font-black text-zinc-950 tracking-tighter select-all">{formData.resi}</span>
                                        <div className="mt-8 flex items-center gap-2 justify-center">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-xs font-bold text-emerald-600">Tersimpan di Database</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <Link href="/ptsp/history" className="w-full py-5 bg-zinc-900 text-white font-black rounded-2xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-2">
                                            CEK PROGRES PENGAJUAN ANDA <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* FAQ or Info Section */}
            <section className="py-32 border-t border-zinc-100 mt-32">
                <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-20">
                    <div className="space-y-6">
                        <h3 className="heading-xl text-3xl">Punya Pertanyaan?</h3>
                        <p className="text-subtle">Tim admin kami siap membantu Anda setiap hari kerja pukul 08:00 - 15:00 WIB.</p>
                        <div className="p-8 bg-zinc-50 rounded-[40px] space-y-4">
                            <div className="flex items-center gap-4">
                                <Clock className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-bold text-zinc-900">Respons Cepat: &lt; 24 Jam</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                <span className="text-sm font-bold text-zinc-900">Resmi & Terakreditasi</span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-8">
                        {[
                            { q: "Berapa lama proses legalisir?", a: "Sesuai SOP, proses legalisir memakan waktu 1-2 hari kerja sejak berkas dinyatakan lengkap." },
                            { q: "Apakah berkas fisik perlu dibawa?", a: "Hanya untuk beberapa layanan tertentu, namun untuk pengecekan awal cukup upload di portal ini." },
                        ].map((item, i) => (
                            <div key={i} className="space-y-3">
                                <h4 className="font-black text-zinc-950 tracking-tight">{item.q}</h4>
                                <p className="text-sm text-zinc-500 leading-relaxed font-medium">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

"use client";

import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

import { usePathname } from 'next/navigation';

const Footer = () => {
    const pathname = usePathname();
    if (pathname.startsWith('/admin')) return null;

    return (
        <footer className="bg-zinc-50 border-t border-zinc-200">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
                    {/* Brand Section */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl">
                                M
                            </div>
                            <div className="flex flex-col">
                                <span className="text-zinc-950 font-black tracking-tighter leading-none text-lg">SMK AL AMANAH SINDULANG</span>
                                <span className="text-zinc-500 font-bold text-[10px] tracking-widest uppercase">Integrated Modern Education</span>
                            </div>
                        </div>
                        <p className="text-zinc-500 text-sm leading-relaxed">
                            Membangun generasi unggul dengan integritas dan inovasi teknologi. Portal layanan terpadu untuk masa depan pendidikan Indonesia.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link href="#" className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-blue-600 hover:border-blue-600 transition-all shadow-sm">
                                <Instagram className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-blue-600 hover:border-blue-600 transition-all shadow-sm">
                                <Facebook className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-blue-600 hover:border-blue-600 transition-all shadow-sm">
                                <Twitter className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div className="space-y-8">
                        <h4 className="text-xs font-black text-zinc-950 uppercase tracking-[0.2em]">Layanan Cepat</h4>
                        <ul className="space-y-4">
                            {['Pendaftaran PPDB', 'Layanan PTSP', 'Statistik Sekolah', 'Portal Alumni', 'Zona Integritas'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-sm text-zinc-500 font-medium hover:text-blue-600 hover:translate-x-1 transition-all flex items-center gap-2 group">
                                        <ArrowRight className="w-3 h-3 text-zinc-300 group-hover:text-blue-600" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-8">
                        <h4 className="text-xs font-black text-zinc-950 uppercase tracking-[0.2em]">Hubungi Kami</h4>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white border border-zinc-100 shadow-sm flex items-center justify-center shrink-0">
                                    <MapPin className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-black uppercase text-zinc-400 tracking-widest">Alamat</span>
                                    <span className="text-sm font-bold text-zinc-600">Jl. Sindulang No. 88, Jawa Barat</span>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white border border-zinc-100 shadow-sm flex items-center justify-center shrink-0">
                                    <Phone className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-black uppercase text-zinc-400 tracking-widest">Telepon</span>
                                    <span className="text-sm font-bold text-zinc-600">(022) 5432 1234</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Maps/Instagram Widget */}
                    <div className="space-y-8">
                        <h4 className="text-xs font-black text-zinc-950 uppercase tracking-[0.2em]">Peta Lokasi</h4>
                        <div className="w-full h-40 bg-zinc-200 rounded-2xl overflow-hidden border border-zinc-100 shadow-inner group">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126906.58330752161!2d106.816666!3d-6.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bfdf6156460!2sJakarta!5e0!3m2!1sid!2sid!4v1715456789123!5m2!1sid!2sid"
                                className="w-full h-full border-0 grayscale group-hover:grayscale-0 transition-all duration-700"
                                allowFullScreen={true}
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-20 pt-8 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                        © {new Date().getFullYear()} SMK AL AMANAH SINDULANG. SELURUH HAK CIPTA DILINDUNGI.
                    </p>
                    <div className="flex items-center gap-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                        <Link href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
                        <span className="w-1 h-1 rounded-full bg-zinc-300" />
                        <Link href="#" className="hover:text-blue-600 transition-colors">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

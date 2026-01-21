'use client';

import { Image as ImageIcon, FileText, Upload, Trash2 } from 'lucide-react';

export default function KontenPage() {
    return (
        <div className="space-y-8">
            {/* Prestasi Section */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-800">Galeri Prestasi</h2>
                    <button className="text-sm bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700">
                        + Upload Prestasi
                    </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="group relative aspect-video bg-slate-200 rounded-lg overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                <ImageIcon className="w-8 h-8" />
                            </div>
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button className="p-2 bg-white rounded-full text-red-500 hover:text-red-700">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="h-px bg-slate-200" />

            {/* ZI Section */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-800">Dokumen Zona Integritas</h2>
                    <button className="text-sm border border-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-50">
                        Manage Files
                    </button>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-blue-500" />
                                <div>
                                    <p className="text-sm font-medium text-slate-700">Laporan_Keuangan_2025.pdf</p>
                                    <p className="text-xs text-slate-500">2.4 MB • Uploaded 2 days ago</p>
                                </div>
                            </div>
                            <button className="text-slate-400 hover:text-red-500">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

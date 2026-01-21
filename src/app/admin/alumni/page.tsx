'use client';

import { Upload, FileSpreadsheet, Download, ExternalLink } from 'lucide-react';

export default function AlumniPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Tracer Study Alumni</h2>
                    <p className="text-slate-500 text-sm">Update data alumni dan kelola Wall of Fame.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">
                        <Download className="w-4 h-4" /> Template Excel
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-lg shadow-emerald-900/20">
                        <FileSpreadsheet className="w-4 h-4" /> Import Data
                    </button>
                </div>
            </div>

            {/* Import Area */}
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-100 transition-colors">
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Upload Data Alumni Massal</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto mt-2">
                    Drag & drop file Excel (.xlsx) di sini, atau klik untuk memilih file. Data akan otomatis masuk ke database publik.
                </p>
            </div>

            {/* Preview Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-4 border-b border-slate-200">
                    <h3 className="font-bold text-slate-800">Data Import Terakhir</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium">
                            <tr>
                                <th className="px-6 py-3">Nama Alumni</th>
                                <th className="px-6 py-3">Tahun Lulus</th>
                                <th className="px-6 py-3">Pekerjaan/Kampus</th>
                                <th className="px-6 py-3">Status Data</th>
                                <th className="px-6 py-3">Link</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium">Rudi Hartono</td>
                                <td className="px-6 py-4">2023</td>
                                <td className="px-6 py-4">Mahasiswa ITB</td>
                                <td className="px-6 py-4"><span className="text-emerald-600 text-xs font-bold uppercase">Published</span></td>
                                <td className="px-6 py-4"><ExternalLink className="w-4 h-4 text-slate-400" /></td>
                            </tr>
                            <tr className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium">Dina Lestari</td>
                                <td className="px-6 py-4">2022</td>
                                <td className="px-6 py-4">Bank Mandiri</td>
                                <td className="px-6 py-4"><span className="text-emerald-600 text-xs font-bold uppercase">Published</span></td>
                                <td className="px-6 py-4"><ExternalLink className="w-4 h-4 text-slate-400" /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

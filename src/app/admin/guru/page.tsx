'use client';

import { Plus, Search, Edit2, Trash2, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

const teachers = [
    { id: 1, name: 'Bpk. Ahmad Sujatmiko', nip: '19820312 201001 1 004', mapel: 'Matematika', status: 'PNS', sertifikasi: true },
    { id: 2, name: 'Ibu Rina Wati', nip: '19900515 201903 2 008', mapel: 'Bahasa Indonesia', status: 'PNS', sertifikasi: true },
    { id: 3, name: 'Bpk. Dedi Mizwar', nip: '-', mapel: 'Olahraga', status: 'Honorer', sertifikasi: false },
    { id: 4, name: 'Ibu Sarah Amelia', nip: '19950720 202202 2 001', mapel: 'Biologi', status: 'PPPK', sertifikasi: false },
];

export default function GuruPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Database Guru</h2>
                    <p className="text-slate-500 text-sm">Kelola data pengajar dan status sertifikasi.</p>
                </div>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors shadow-lg shadow-emerald-900/20">
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Guru
                </button>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="text-sm font-medium text-slate-500">
                    Total Staff: <span className="text-slate-900 font-bold">42</span>
                </div>
                <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari NIP atau Nama..."
                        className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-full md:w-72 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Nama & NIP</th>
                            <th className="px-6 py-4">Mata Pelajaran</th>
                            <th className="px-6 py-4">Status Kepegawaian</th>
                            <th className="px-6 py-4">Sertifikasi</th>
                            <th className="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {teachers.map((guru) => (
                            <tr key={guru.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-800">{guru.name}</div>
                                    <div className="text-xs text-slate-400 font-mono mt-0.5">{guru.nip}</div>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{guru.mapel}</td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "px-2 py-1 rounded text-xs border bg-slate-100 text-slate-600 border-slate-200"
                                    )}>
                                        {guru.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={guru.sertifikasi} readOnly />
                                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                                        <span className="ml-2 text-xs text-slate-500 font-medium">{guru.sertifikasi ? 'Sudah' : 'Belum'}</span>
                                    </label>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 bg-slate-50 text-slate-500 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 bg-slate-50 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { Search, ToggleLeft, ToggleRight, CheckCircle, FileText, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ppdbService, Student } from '@/lib/api';

// Initial Mock Data (Simulating Raw Data from DB)
const initialCandidates: Student[] = [
    { nama: 'Siswa Satu', jalur_pendaftaran: 'ZONASI', nilai_raport: 80.5, jarak_zonasi_km: 1.2, umur_bulan: 168 },
    { nama: 'Siswa Dua', jalur_pendaftaran: 'PRESTASI', nilai_raport: 92.0, jarak_zonasi_km: 5.4, umur_bulan: 170 },
    { nama: 'Siswa Tiga', jalur_pendaftaran: 'ZONASI', nilai_raport: 85.0, jarak_zonasi_km: 0.8, umur_bulan: 165 },
    { nama: 'Siswa Empat', jalur_pendaftaran: 'AFIRMASI', nilai_raport: 81.5, jarak_zonasi_km: 2.1, umur_bulan: 169 },
    { nama: 'Siswa Lima', jalur_pendaftaran: 'ZONASI', nilai_raport: 89.0, jarak_zonasi_km: 1.5, umur_bulan: 167 },
];

export default function PPDBPage() {
    const [candidates, setCandidates] = useState<Student[]>(initialCandidates);
    const [isPublished, setIsPublished] = useState(false);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<any>(null);

    const handleValidation = async () => {
        setLoading(true);
        try {
            // Call High-Performance Rust Backend
            const result = await ppdbService.calculateRanking(candidates);
            setCandidates(result.ranked_students);
            setStats(result.stats);
        } catch (error) {
            console.error("Failed to fetch ranking:", error);
            alert("Gagal menghubungi server Rust. Pastikan backend berjalan.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Seleksi PPDB (Powered by Rust 🦀)</h2>
                    <p className="text-slate-500 text-sm">Validasi nilai dan scoring siswa baru dengan High-Performance Engine.</p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleValidation}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200"
                    >
                        {loading ? <Activity className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
                        {loading ? 'Processing...' : 'Run Scoring Algorithm'}
                    </button>

                    <div className="flex items-center gap-2 bg-white p-2 pr-4 rounded-xl border border-slate-200 shadow-sm">
                        <button
                            onClick={() => setIsPublished(!isPublished)}
                            className={cn("flex items-center gap-2 font-medium transition-colors", isPublished ? "text-emerald-600" : "text-slate-400")}
                        >
                            {isPublished ? <ToggleRight className="w-8 h-8 fill-emerald-100" /> : <ToggleLeft className="w-8 h-8" />}
                            {isPublished ? 'Published' : 'Draft'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Widget (From Rust) */}
            {stats && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                        <p className="text-xs text-indigo-600 font-bold uppercase">Total Processed</p>
                        <p className="text-2xl font-bold text-indigo-900">{stats.total_processed} Data</p>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                        <p className="text-xs text-emerald-600 font-bold uppercase">Average Score</p>
                        <p className="text-2xl font-bold text-emerald-900">{stats.average_score.toFixed(2)}</p>
                    </div>
                </div>
            )}

            {/* Main Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Ranking</th>
                            <th className="px-6 py-4">Nama Calon Siswa</th>
                            <th className="px-6 py-4">Jalur</th>
                            <th className="px-6 py-4">Nilai Akhir (Rust)</th>
                            <th className="px-6 py-4">Jarak</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {candidates.map((siswa, index) => (
                            <tr key={index} className="hover:bg-slate-50 group transition-colors">
                                <td className="px-6 py-4 font-mono text-slate-400">#{index + 1}</td>
                                <td className="px-6 py-4 font-medium text-slate-800">{siswa.nama}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs border border-slate-200">{siswa.jalur_pendaftaran}</span>
                                </td>
                                <td className="px-6 py-4 font-mono font-bold text-indigo-600">
                                    {siswa.skor_akhir ? siswa.skor_akhir.toFixed(2) : '-'}
                                </td>
                                <td className="px-6 py-4 font-mono text-slate-500">{siswa.jarak_zonasi_km} km</td>
                                <td className="px-6 py-4">
                                    {siswa.status ? (
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-xs font-bold",
                                            siswa.status === 'Lolos' ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"
                                        )}>
                                            {siswa.status}
                                        </span>
                                    ) : (
                                        <span className="text-slate-400 text-xs italic">Belum dinilai</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

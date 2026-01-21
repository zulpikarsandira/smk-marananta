'use client';

import { useState } from 'react';
import { Upload, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { ptspService } from '@/lib/api';

export default function PublicPtspPage() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) return alert("Pilih file dulu!");

        setLoading(true);
        const formData = new FormData();
        formData.append('nama_pemohon', (e.currentTarget.elements.namedItem('nama') as HTMLInputElement).value);
        formData.append('jenis_layanan', (e.currentTarget.elements.namedItem('jenis') as HTMLSelectElement).value);
        formData.append('file', file);

        try {
            await ptspService.submitPermohonan(formData);
            setSuccess(true);
            setFile(null);
            (e.target as HTMLFormElement).reset();
        } catch (err) {
            console.error(err);
            alert('Gagal upload. Pastikan server nyala.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl p-8 border border-slate-100">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">Layanan PTSP Online</h1>
                    <p className="text-slate-500 text-sm">Upload berkas permohonan Anda di sini.</p>
                </div>

                {success ? (
                    <div className="text-center py-10 animate-in zoom-in">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Permohonan Terkirim!</h3>
                        <p className="text-slate-500 mb-6">Admin kami akan memverifikasi berkas Anda.</p>
                        <button
                            onClick={() => setSuccess(false)}
                            className="text-emerald-600 font-medium hover:underline"
                        >
                            Kirim permohonan lain
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                            <input name="nama" type="text" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Layanan</label>
                            <select name="jenis" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                <option>Legalisir Ijazah</option>
                                <option>Surat Keterangan Lulus</option>
                                <option>Mutasi Siswa</option>
                            </select>
                        </div>

                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                accept=".pdf,.jpg,.png"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center">
                                {file ? (
                                    <>
                                        <FileText className="w-8 h-8 text-blue-500 mb-2" />
                                        <span className="text-sm font-medium text-slate-800">{file.name}</span>
                                        <span className="text-xs text-slate-400">{(file.size / 1024).toFixed(0)} KB</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                        <span className="text-sm font-medium text-slate-600">Klik untuk upload berkas</span>
                                        <span className="text-xs text-slate-400">PDF, JPG, atau PNG (Max 5MB)</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {loading ? 'Mengirim...' : 'Kirim Permohonan'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

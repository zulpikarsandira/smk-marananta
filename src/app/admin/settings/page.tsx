'use client';

export default function SettingsPage() {
    return (
        <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Pengaturan Sistem</h2>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <div>
                    <h3 className="font-semibold text-slate-800 mb-4">API & Integrasi Sosial Media</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Instagram Access Token</label>
                            <input
                                type="password"
                                value="IGQVJ..."
                                readOnly
                                className="w-full bg-slate-50 border border-slate-300 text-slate-500 rounded-lg px-4 py-2 text-sm font-mono"
                            />
                            <p className="text-xs text-slate-500 mt-1">Token ini digunakan untuk menampilkan feed terbaru di halaman depan.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Google Analytics ID</label>
                            <input
                                type="text"
                                placeholder="UA-XXXX-Y"
                                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                    <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800">
                        Simpan Perubahan
                    </button>
                </div>
            </div>
        </div>
    );
}

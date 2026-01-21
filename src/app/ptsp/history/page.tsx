"use client";

import React, { useEffect, useState } from "react";
import { ptspService, PtspSubmission } from "@/lib/api";
import { createBrowserClient } from "@supabase/ssr";
import {
    FileText,
    Clock,
    CheckCircle2,
    XCircle,
    Download,
    AlertCircle,
    ChevronRight
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function PTSPHistoryPage() {
    const [history, setHistory] = useState<PtspSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        let channel: ReturnType<typeof supabase.channel>;

        const fetchUserAndHistory = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    setUserId(user.id);

                    // 1. Fetch Initial Data
                    const res = await ptspService.getHistory(user.id);
                    if (res.success) {
                        setHistory(res.data);
                    }

                    // 2. Setup Realtime Subscription
                    channel = supabase
                        .channel('history-realtime')
                        .on(
                            'postgres_changes',
                            {
                                event: '*',
                                schema: 'public',
                                table: 'ptsp_permohonan',
                                filter: `user_id=eq.${user.id}`
                            },
                            async (payload) => {
                                console.log("🔔 Realtime update:", payload);
                                // Fetch fresh data to ensure consistency
                                const freshRes = await ptspService.getHistory(user.id);
                                if (freshRes.success) {
                                    setHistory(freshRes.data);
                                }
                            }
                        )
                        .subscribe();
                }
            } catch (err) {
                console.error("Failed to load history", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndHistory();

        return () => {
            if (channel) supabase.removeChannel(channel);
        };
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Selesai": return "bg-emerald-500 shadow-emerald-200";
            case "Diproses": return "bg-blue-500 shadow-blue-200";
            case "Ditolak": return "bg-red-500 shadow-red-200";
            default: return "bg-amber-400 shadow-amber-200";
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto space-y-8">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Riwayat Pengajuan</h1>
                        <p className="text-slate-500 mt-1">Pantau status permohonan surat dan dokumen anda.</p>
                    </div>
                    <Link href="/ptsp" className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all text-sm">
                        + Buat Baru
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
                    </div>
                ) : history.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-6">
                            <FileText className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Belum Ada Pengajuan</h3>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto">Anda belum pernah mengajukan permohonan dokumen apapun melalui PTSP Online.</p>
                        <Link href="/ptsp" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all inline-flex items-center gap-2">
                            Mulai Pengajuan <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {history.map((item) => (
                            <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                                {/* Status Indicator Strip */}
                                <div className={cn("absolute left-0 top-0 bottom-0 w-2", getStatusColor(item.status))} />

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pl-4">
                                    <div className="space-y-4 flex-1">
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider rounded-lg">
                                                {item.jenis_layanan.replace(/_/g, " ")}
                                            </span>
                                            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">{item.nama_pemohon}</h3>
                                            <p className="text-sm text-slate-500">ID: <span className="font-mono text-slate-400">{item.id.slice(0, 8)}...</span></p>
                                        </div>

                                        {/* Admin Notes */}
                                        {item.catatan_admin && (
                                            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex gap-3 items-start">
                                                <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                                <div className="space-y-1">
                                                    <span className="text-xs font-bold text-blue-700 block">Catatan Admin:</span>
                                                    <p className="text-sm text-slate-600 leading-relaxed">{item.catatan_admin}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col items-end gap-3 min-w-[140px]">
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "text-sm font-bold",
                                                item.status === "Selesai" ? "text-emerald-600" :
                                                    item.status === "Ditolak" ? "text-red-500" :
                                                        "text-amber-500"
                                            )}>
                                                {item.status}
                                            </span>
                                            {item.status === "Selesai" && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                                            {item.status === "Ditolak" && <XCircle className="w-5 h-5 text-red-500" />}
                                            {item.status === "Pending" && <Clock className="w-5 h-5 text-amber-500" />}
                                        </div>

                                        {/* Download Button if Completed */}
                                        {item.status === "Selesai" && item.respon_admin_url && (
                                            <a
                                                href={item.respon_admin_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full py-3 px-4 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
                                            >
                                                <Download className="w-4 h-4" />
                                                Unduh Dokumen
                                            </a>
                                        )}

                                        {item.status === "Selesai" && !item.respon_admin_url && (
                                            <span className="text-xs text-slate-400 italic">Dokumen fisik tersedia di TU</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}

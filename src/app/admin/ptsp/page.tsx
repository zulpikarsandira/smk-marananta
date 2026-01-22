"use client";

import React, { useEffect, useState } from "react";
import { ptspService, PtspSubmission } from "@/lib/api";
import { createBrowserClient } from "@supabase/ssr";
import { cn } from "@/lib/utils";
import {
    FileText,
    CheckCircle2,
    XCircle,
    Clock,
    Eye,
    Download,
    Search,
    Send
} from "lucide-react";
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/plugin-notification';
// @ts-ignore
import { isTauri } from '@tauri-apps/api/core';

export default function AdminPTSPPage() {
    const [submissions, setSubmissions] = useState<PtspSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");

    // Modal State
    const [selectedItem, setSelectedItem] = useState<PtspSubmission | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    // Form State
    const [status, setStatus] = useState("");
    const [notes, setNotes] = useState("");
    const [responseFile, setResponseFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Connection Status State
    const [connectionStatus, setConnectionStatus] = useState<'CONNECTING' | 'SUBSCRIBED' | 'CLOSED' | 'ERROR'>('CONNECTING');
    const [lastEvent, setLastEvent] = useState<string | null>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Refs for polling comparison
    const previousIds = React.useRef<Set<string>>(new Set<string>());
    const isFirstLoad = React.useRef(true);
    const audioCtxRef = React.useRef<AudioContext | null>(null);

    const fetchSubmissions = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const res = await ptspService.getAdminRequests();
            if (res.success) {
                const currentData = res.data as PtspSubmission[];
                const currentIds = new Set<string>(currentData.map((item) => item.id));

                // Notification Logic for Polling
                if (!isFirstLoad.current) {
                    const newItems = currentData.filter((item) => !previousIds.current.has(item.id));

                    newItems.forEach((item: PtspSubmission) => {
                        console.log("🔔 New Item Detected via Polling:", item);
                        sendDesktopNotification(
                            "Permohonan Baru Masuk!",
                            `${item.nama_pemohon} mengajukan ${item.jenis_layanan}`
                        );
                    });
                }

                // Update Ref
                previousIds.current = currentIds;
                isFirstLoad.current = false;

                setSubmissions(currentData);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
        }
        if (!silent) setLoading(false);
    };

    // Base64 Notification Sound (Simple Ding)
    const NOTIFICATION_SOUND = "data:audio/mp3;base64,SUQzBAAAAAABAFRYWFgAAAASAAADbWFqb3JfYnJhbmQAbXA0MgBUWFhYAAAAEQAAA21pbm9yX3ZlcnNpb24AMABUWFhYAAAAHAAAA2NvbXBhdGlibGVfYnJhbmRzAGlzb21tcDQyAFRERU4AAAAVAAADMjAxMi0wOS0xMiAxMjo1NDoxNwBUU1NFAAAADwAAA0xhdmY1NC4yOS4xMDQAAAAAAAAAAAAAAP/7UAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAInfoAAAAjAAAADQAAMuCAgICAgICAgICAgICAgICAgICAgICAgICA//////////////////////////////////////////////////////////////////8AAABMYXZjNTQuMjkuMTA0AAAAAAAAAAAAAAAAAAAAAP/7UMQAAhIAAh8AAACAABWAAAEAEAIAGgEAAAAAAAAAAAAAAAAAAABmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7UMQAAhIAAh8AAACAABWAAAEAEAIAGgEAAAAAAAAAAAAAAAAAAABmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7UMQAAhIAAh8AAACAABWAAAEAEAIAGgEAAAAAAAAAAAAAAAAAAABmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
    // ^ Note: This is an abbreviated placeholder. A real base64 mp3 is needed. 
    // Since I cannot easy generate a real mp3 base64 here without it being huge, 
    // I will use a standard browser "beep" approach if possible or just assume the user might want to provide a file.
    // However, to solve the user request "immediately", I will try to use a very short online URL fallback if base64 is too long,
    // OR just use a simple `new (window.AudioContext || window.webkitAudioContext)` beep.

    const playNotificationSound = () => {
        try {
            // Use the persistent context if available
            const ctx = audioCtxRef.current;
            if (ctx) {
                // Ensure context is running (sometimes it suspends automatically)
                if (ctx.state === 'suspended') {
                    ctx.resume();
                }

                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.type = 'sine';
                osc.frequency.setValueAtTime(500, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.1);

                gain.gain.setValueAtTime(0.5, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.5);
            }
        } catch (e) {
            console.error("Audio Error:", e);
        }
    };

    // Helper for notification
    const sendDesktopNotification = async (title: string, body: string) => {
        console.log("🔔 Attempting to send notification:", title, body);

        // Play Sound
        playNotificationSound();

        try {
            if (isTauri()) {
                let permissionGranted = await isPermissionGranted();
                if (!permissionGranted) {
                    const permission = await requestPermission();
                    permissionGranted = permission === 'granted';
                }

                if (permissionGranted) {
                    await sendNotification({
                        title,
                        body,
                        sound: 'default' // Request system default sound
                    });
                    console.log("✅ Tauri Notification Sent");
                } else {
                    console.warn("❌ Tauri Notification Permission Denied");
                }
            } else {
                // Browser fallback (Web Notification API)
                if (Notification.permission === "granted") {
                    new Notification(title, { body });
                } else if (Notification.permission !== "denied") {
                    Notification.requestPermission().then(permission => {
                        if (permission === "granted") {
                            new Notification(title, { body });
                        }
                    });
                }
            }
        } catch (e) {
            console.error("Notification error:", e);
        }
    };

    useEffect(() => {
        let channel: ReturnType<typeof supabase.channel>;

        // Initialize Persistent Audio Context on Mount
        if (typeof window !== 'undefined' && !audioCtxRef.current) {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContext) {
                audioCtxRef.current = new AudioContext();
            }
        }

        // UNLOCK AUDIO CONTEXT
        // We need to resume the AudioContext on the first user interaction (click, keypress)
        const unlockAudio = () => {
            const ctx = audioCtxRef.current;
            if (ctx && ctx.state === 'suspended') {
                ctx.resume().then(() => {
                    console.log("🔊 Persistent Audio Context Resumed/Unlocked");
                });
            }
            // Remove listener after first interaction
            document.removeEventListener('click', unlockAudio);
            document.removeEventListener('keydown', unlockAudio);
        };

        if (typeof window !== 'undefined') {
            document.addEventListener('click', unlockAudio);
            document.addEventListener('keydown', unlockAudio);
        }

        const init = async () => {
            await fetchSubmissions(false);

            // Realtime Subscription (Backup)
            channel = supabase
                .channel('admin-ptsp-realtime')
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'ptsp_permohonan' },
                    (payload) => {
                        console.log("🔔 Admin Realtime Update (WS):", payload);
                        setLastEvent(`Event: ${payload.eventType} at ${new Date().toLocaleTimeString()}`);
                        // Force fetch on WS event too
                        fetchSubmissions(true);
                    }
                )
                .subscribe((status, err) => {
                    console.log("Derived Connection Status:", status, err);
                    setConnectionStatus(status as any);
                });
        };

        // Polling Interval (Every 5 seconds)
        // This guarantees updates even if WS fails due to RLS/Network
        const intervalId = setInterval(() => {
            fetchSubmissions(true);
        }, 5000);

        // Request permission on load
        if (typeof window !== 'undefined') {
            if (isTauri()) {
                isPermissionGranted().then(granted => {
                    if (!granted) requestPermission();
                });
            } else if ("Notification" in window && Notification.permission !== "granted") {
                Notification.requestPermission();
            }
        }

        init();

        return () => {
            if (channel) supabase.removeChannel(channel);
            clearInterval(intervalId);
            document.removeEventListener('click', unlockAudio);
            document.removeEventListener('keydown', unlockAudio);
        };
    }, []);

    const openModal = (item: PtspSubmission) => {
        setSelectedItem(item);
        setStatus(item.status);
        setNotes(item.catatan_admin || "");
        setResponseFile(null);
        setModalOpen(true);
    };

    const handleUpdate = async () => {
        if (!selectedItem) return;
        setSubmitting(true);

        const formData = new FormData();
        formData.append("status", status);
        formData.append("catatan", notes);
        if (responseFile) {
            formData.append("dokumen_balasan", responseFile);
        }

        try {
            await ptspService.updateStatus(selectedItem.id, formData);
            alert("Status berhasil diperbarui!");
            setModalOpen(false);
            fetchSubmissions(); // Refresh data
        } catch (error: any) {
            alert("Gagal update status: " + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const filteredItems = submissions.filter(item =>
        filter === "All" ? true : item.status === filter
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Manajemen PTSP</h2>
                        <div className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-widest",
                            connectionStatus === 'SUBSCRIBED' ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                                connectionStatus === 'CONNECTING' ? "bg-amber-100 text-amber-700 border-amber-200" :
                                    "bg-red-100 text-red-700 border-red-200"
                        )}>
                            {connectionStatus}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-slate-500 mt-1">Konsol Verifikasi & Balasan Dokumen</p>
                        <button
                            onClick={() => sendDesktopNotification("Test Notification", "Ini adalah notifikasi test dari aplikasi admin.")}
                            className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] hover:bg-slate-200"
                        >
                            Test Notif
                        </button>
                        {lastEvent && <span className="text-[10px] text-slate-400 ml-2">Last: {lastEvent}</span>}
                    </div>
                </div>
                <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                    {["All", "Pending", "Diproses", "Selesai", "Ditolak"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={cn(
                                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                filter === s
                                    ? "bg-slate-800 text-white shadow-md"
                                    : "text-slate-600 hover:bg-slate-50"
                            )}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="w-full h-64 flex items-center justify-center">
                        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4">Pemohon</th>
                                    <th className="px-6 py-4">Layanan</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Berkas User</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-12">
                                            <div className="flex flex-col items-center gap-3 text-slate-400">
                                                <FileText size={48} className="opacity-20" />
                                                <p>Tidak ada data permohonan</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredItems.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-medium">
                                                <div className="text-slate-900 font-bold">{item.nama_pemohon}</div>
                                                <div className="text-xs text-slate-400 font-mono mt-1">{item.id.slice(0, 8)}...</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-600">
                                                    {item.jenis_layanan.replace(/_/g, " ")}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold",
                                                    item.status === "Pending" ? "bg-amber-100 text-amber-700" :
                                                        item.status === "Diproses" ? "bg-blue-100 text-blue-700" :
                                                            item.status === "Selesai" ? "bg-emerald-100 text-emerald-700" :
                                                                "bg-red-100 text-red-700"
                                                )}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.dokumen_url ? (
                                                    <a href={item.dokumen_url} target="_blank" className="text-blue-600 hover:underline flex items-center gap-1 font-medium">
                                                        <FileText size={14} /> Lihat
                                                    </a>
                                                ) : <span className="text-slate-400">-</span>}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => openModal(item)}
                                                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-all shadow-lg shadow-slate-200"
                                                >
                                                    Proses
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ACTION MODAL */}
            {
                modalOpen && selectedItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-8 animate-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-slate-900">Update Status Permohonan</h3>
                                <button onClick={() => setModalOpen(false)}><XCircle className="text-slate-400 hover:text-slate-600" /></button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status Baru</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Diproses">Diproses</option>
                                        <option value="Selesai">Selesai (Setujui)</option>
                                        <option value="Ditolak">Ditolak</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Catatan Admin</label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={3}
                                        placeholder="Berikan catatan atau alasan..."
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        Upload Balasan (Opsional)
                                    </label>
                                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx,.jpg,.png"
                                            onChange={(e) => setResponseFile(e.target.files?.[0] || null)}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                        <div className="flex flex-col items-center gap-2">
                                            <Download className="w-8 h-8 text-slate-300" />
                                            {responseFile ? (
                                                <span className="text-sm font-bold text-blue-600 break-all">{responseFile.name}</span>
                                            ) : (
                                                <span className="text-xs text-slate-400">Klik untuk upload surat balasan/legalisir</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleUpdate}
                                    disabled={submitting}
                                    className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-200"
                                >
                                    {submitting ? "Menyimpan..." : (
                                        <>
                                            <Send className="w-4 h-4" /> Simpan & Kirim Notifikasi
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

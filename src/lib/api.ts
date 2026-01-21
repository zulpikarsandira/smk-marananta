export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function fetchFromRust(endpoint: string, options: RequestInit = {}) {
    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!res.ok) {
        throw new Error(`Rust API Error: ${res.statusText}`);
    }

    return res.json();
}

// PPDB Specific Types
export interface Student {
    id?: string;
    nama: string;
    nilai_raport: number;
    jarak_zonasi_km: number;
    umur_bulan: number;
    jalur_pendaftaran: 'ZONASI' | 'PRESTASI' | 'AFIRMASI';
    skor_akhir?: number;
    status?: string;
    verified?: boolean; // Frontend specific
}

export const ppdbService = {
    calculateRanking: async (students: Student[]) => {
        return fetchFromRust('/api/ppdb/ranking', {
            method: 'POST',
            body: JSON.stringify({ students }),
        });
    },

    getStats: async () => {
        return fetchFromRust('/api/ppdb/stats');
    }
};

export const ptspService = {
    submitPermohonan: async (formData: FormData) => {
        // Note: Do NOT set Content-Type header manually for FormData, 
        // fetch will set it with the correct boundary automatically.
        const res = await fetch(`${API_URL}/api/ptsp/submit`, {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            throw new Error(`Upload Failed: ${res.statusText}`);
        }
        return res.json();
    },

    getHistory: async (userId: string) => {
        return fetchFromRust(`/api/ptsp/history?user_id=${userId}`);
    },

    getAdminRequests: async () => {
        return fetchFromRust('/api/ptsp/admin/list');
    },

    updateStatus: async (id: string, formData: FormData) => {
        const res = await fetch(`${API_URL}/api/ptsp/admin/update/${id}`, {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            throw new Error(`Update Failed: ${res.statusText}`);
        }
        return res.json();
    }
};

export interface PtspSubmission {
    id: string;
    user_id: string;
    nama_pemohon: string;
    jenis_layanan: string;
    status: string;
    dokumen_url?: string;
    respon_admin_url?: string;
    catatan_admin?: string;
    created_at: string;
    updated_at?: string;
}

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const signupSchema = z.object({
    fullName: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
    email: z.string().email('Format email tidak valid'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupFormData) => {
        setLoading(true);
        setError(null);

        try {
            const { error: signUpError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        full_name: data.fullName,
                    },
                },
            });

            if (signUpError) throw signUpError;

            setSuccess(true);

        } catch (err: any) {
            setError(err.message || 'Terjadi kesalahan saat mendaftar');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center space-y-4 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                    <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900">Pendaftaran Berhasil!</h3>
                <p className="text-zinc-500 text-sm">
                    Silakan cek email Anda untuk memverifikasi akun sebelum login.
                </p>
                <Link
                    href="/auth/login"
                    className="inline-block w-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-3 rounded-xl transition-all shadow-lg hover:shadow-xl mt-4"
                >
                    Kembali ke Login
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">
                    Nama Lengkap
                </label>
                <div className="relative group">
                    <input
                        {...register('fullName')}
                        type="text"
                        className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all p-3.5 outline-none placeholder:text-zinc-400 group-hover:bg-white"
                        placeholder="John Doe"
                    />
                </div>
                {errors.fullName && (
                    <p className="text-red-500 text-xs ml-1">{errors.fullName.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">
                    Email Address
                </label>
                <div className="relative group">
                    <input
                        {...register('email')}
                        type="email"
                        className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all p-3.5 outline-none placeholder:text-zinc-400 group-hover:bg-white"
                        placeholder="nama@sekolah.id"
                    />
                </div>
                {errors.email && (
                    <p className="text-red-500 text-xs ml-1">{errors.email.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">
                    Password
                </label>
                <div className="relative group">
                    <input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all p-3.5 pr-12 outline-none placeholder:text-zinc-400 group-hover:bg-white"
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-red-500 text-xs ml-1">{errors.password.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">
                    Konfirmasi Password
                </label>
                <div className="relative group">
                    <input
                        {...register('confirmPassword')}
                        type={showPassword ? 'text' : 'password'}
                        className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all p-3.5 outline-none placeholder:text-zinc-400 group-hover:bg-white"
                        placeholder="••••••••"
                    />
                </div>
                {errors.confirmPassword && (
                    <p className="text-red-500 text-xs ml-1">{errors.confirmPassword.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-3.5 rounded-xl transition-all shadow-lg shadow-zinc-900/10 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:bg-zinc-900 flex items-center justify-center gap-2 mt-2"
            >
                {loading ? (
                    <>
                        <Loader2 size={18} className="animate-spin" />
                        Mendaftar...
                    </>
                ) : (
                    'Daftar Sekarang'
                )}
            </button>

            <p className="text-center text-sm text-zinc-500">
                Sudah punya akun?{' '}
                <Link href="/auth/login" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline">
                    Login disini
                </Link>
            </p>
        </form>
    );
}

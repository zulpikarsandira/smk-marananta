'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';

const loginSchema = z.object({
    email: z.string().email('Format email tidak valid'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm({ admin = false }: { admin?: boolean }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        setError(null);

        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });

            if (signInError) throw signInError;

            // Check if user is admin if on admin login
            if (admin) {
                // Here we would check for admin role, for now just redirect to admin
                // In a real app, query the profiles table for role
                const { data: { user } } = await supabase.auth.getUser();
                // Assume we have a way to check role, for now simple redirect
                router.push('/admin');
            } else {
                router.push('/ptsp'); // Redirect to PTSP or Dashboard
            }

            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Terjadi kesalahan saat login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                    {error}
                </div>
            )}

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
                <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                        Password
                    </label>
                    <Link
                        href="/auth/forgot-password"
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                        Lupa password?
                    </Link>
                </div>
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

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-3.5 rounded-xl transition-all shadow-lg shadow-zinc-900/10 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:bg-zinc-900 flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <Loader2 size={18} className="animate-spin" />
                        Sign in...
                    </>
                ) : (
                    'Sign In'
                )}
            </button>

            {!admin && (
                <p className="text-center text-sm text-zinc-500">
                    Belum punya akun?{' '}
                    <Link href="/auth/signup" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline">
                        Daftar Sekarang
                    </Link>
                </p>
            )}
        </form>
    );
}

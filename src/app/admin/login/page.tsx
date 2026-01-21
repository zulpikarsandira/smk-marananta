import AuthCard from '@/components/auth/AuthCard';
import LoginForm from '@/components/auth/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin Login - Sekolah Marantaa',
    description: 'Portal Login Administrator',
};

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-zinc-900 relative overflow-hidden">
            {/* Darker Background gradients for Admin */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="relative z-10 w-full flex flex-col items-center">
                <div className="mb-8 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-zinc-700 to-zinc-900 border border-zinc-700 rounded-xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        A
                    </div>
                    <h1 className="font-heading font-bold text-lg text-white tracking-tight">
                        Admin Portal
                    </h1>
                </div>

                <AuthCard
                    title="Admin Access"
                    subtitle="Silakan login dengan kredensial administrator"
                >
                    <LoginForm admin={true} />
                </AuthCard>
            </div>
        </div>
    );
}

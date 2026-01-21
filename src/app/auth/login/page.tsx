import AuthCard from '@/components/auth/AuthCard';
import LoginForm from '@/components/auth/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login - Sekolah Marantaa',
    description: 'Masuk ke akun Sekolah Marantaa Anda',
};

export default function LoginPage() {
    return (
        <AuthCard
            title="Welcome Back!"
            subtitle="Masuk untuk mengakses layanan sekolah"
        >
            <LoginForm />
        </AuthCard>
    );
}

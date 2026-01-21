import AuthCard from '@/components/auth/AuthCard';
import SignupForm from '@/components/auth/SignupForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Daftar - Sekolah Marantaa',
    description: 'Buat akun baru di Sekolah Marantaa',
};

export default function SignupPage() {
    return (
        <AuthCard
            title="Create Account"
            subtitle="Bergabung dengan komunitas Sekolah Marantaa"
        >
            <SignupForm />
        </AuthCard>
    );
}

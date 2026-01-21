import React from 'react';

interface AuthCardProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
}

export default function AuthCard({ children, title, subtitle }: AuthCardProps) {
    return (
        <div className="w-full max-w-md mx-auto">
            <div className="glass-panel p-8 sm:p-10 rounded-3xl relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative text-center mb-8">
                    <h2 className="heading-xl text-3xl mb-2 bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-subtle text-sm">
                            {subtitle}
                        </p>
                    )}
                </div>

                {children}
            </div>
        </div>
    );
}

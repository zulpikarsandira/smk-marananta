"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
// @ts-ignore
import { isTauri } from '@tauri-apps/api/core';

export default function DesktopRedirector() {
    const router = useRouter();
    const pathname = usePathname();
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkTauri = async () => {
            try {
                // If isTauri() is true, we are in the desktop app
                // Or fallback to window.__TAURI__ check
                const isTauriApp = isTauri() || (typeof window !== 'undefined' && (window as any).__TAURI__);

                if (isTauriApp) {
                    setIsDesktop(true);

                    // IF we are in desktop AND on the home page (or not in admin)
                    // Redirect to Admin Dashboard
                    if (!pathname.startsWith('/admin')) {
                        console.log("Desktop Environment Detected: Redirecting to Admin Dashboard...");
                        router.replace('/admin/ptsp');
                    }
                }
            } catch (e) {
                console.error("Tauri check failed", e);
            }
        };

        checkTauri();
    }, [pathname, router]);

    // Simplified: Just redirect without blocking UI rendering with conditional returns
    // This avoids potential hydration mismatches or tree structure changes that might confuse React
    return null;
}

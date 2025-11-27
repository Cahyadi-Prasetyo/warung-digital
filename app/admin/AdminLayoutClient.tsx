'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, Users, Star, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Toaster } from 'sonner';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const closeSidebar = () => setSidebarOpen(false);

    const navLinks = [
        { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/admin/products', icon: Package, label: 'Products' },
        { href: '/admin/umkm', icon: Users, label: 'UMKM' },
        { href: '/admin/reviews', icon: Star, label: 'Reviews' },
    ];

    return (
        <>
            {/* Toast Notifications */}
            <Toaster position="top-right" richColors closeButton />

            <div className="min-h-screen bg-gray-100 text-gray-900 flex">
                {/* Mobile Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                        onClick={closeSidebar}
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                        }`}
                >
                    {/* Sidebar Header */}
                    <div className="h-16 flex items-center justify-between px-6 border-b">
                        <span className="text-xl font-bold text-blue-600">Wardig Admin</span>
                        <button
                            onClick={closeSidebar}
                            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="p-4 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={closeSidebar}
                                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <link.icon className="w-5 h-5 mr-3" />
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Sign Out Button */}
                    <div className="absolute bottom-0 w-64 p-4 border-t">
                        <button
                            onClick={handleSignOut}
                            className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors"
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Sign Out
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto">
                    {/* Top Navbar with Hamburger */}
                    <div className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-10">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <Menu className="w-5 h-5 text-gray-600" />
                            </button>
                            <span className="font-bold text-gray-900 md:hidden">Wardig Admin</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-sm text-gray-600 hidden sm:block">Admin Dashboard</div>
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-xs font-medium text-blue-600">A</span>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-6">{children}</div>
                </main>
            </div>
        </>
    );
}

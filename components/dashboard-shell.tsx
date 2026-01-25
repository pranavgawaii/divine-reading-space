"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Home, Armchair, Receipt, BookOpen, User, Menu, X, LogOut } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DashboardShellProps {
    children: React.ReactNode;
    userProfile: {
        fullName: string | null;
        email: string;
    };
}

function SidebarLink({ href, icon: Icon, children }: { href: string, icon: any, children: React.ReactNode }) {
    return (
        <Link href={href} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group">
            <Icon className="h-5 w-5 group-hover:scale-110 transition-transform text-slate-500 group-hover:text-blue-400" />
            <span className="font-medium">{children}</span>
        </Link>
    );
}

export function DashboardShell({ children, userProfile }: DashboardShellProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="dark flex bg-zinc-950 min-h-screen font-sans text-white">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-72 bg-zinc-950 border-r border-zinc-800 fixed h-full z-10 transition-all text-white">
                <div className="h-20 flex items-center px-8 border-b border-zinc-800">
                    <div className="flex items-center gap-2">
                        <div className="p-2 border border-zinc-800 rounded-sm bg-zinc-900">
                            <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-display font-medium text-lg tracking-tight">Student Portal</span>
                    </div>
                </div>

                <div className="flex-1 p-6 space-y-2 overflow-y-auto">
                    <div className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-widest mb-4 px-4">Menu</div>
                    <SidebarLink href="/dashboard" icon={Home}>Dashboard</SidebarLink>
                    <SidebarLink href="/dashboard/book-seat" icon={Armchair}>Book a Seat</SidebarLink>
                    <SidebarLink href="/dashboard/my-bookings" icon={Receipt}>My Bookings</SidebarLink>
                    <SidebarLink href="/dashboard/profile" icon={User}>My Profile</SidebarLink>
                </div>

                <div className="p-6 border-t border-zinc-800 bg-zinc-950">
                    <div className="flex items-center gap-3 p-3 rounded-sm bg-zinc-900 border border-zinc-800">
                        <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "h-9 w-9" } }} />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white line-clamp-1">{userProfile.fullName}</p>
                            <p className="text-xs font-mono text-zinc-500 line-clamp-1 break-all">{userProfile.email}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                            className="fixed inset-y-0 left-0 w-[80%] max-w-[300px] bg-zinc-950 border-r border-zinc-800 z-50 flex flex-col md:hidden"
                        >
                            <div className="h-20 flex items-center justify-between px-6 border-b border-zinc-800">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 border border-zinc-800 rounded-sm bg-zinc-900">
                                        <BookOpen className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="font-display font-medium text-lg tracking-tight">Portal</span>
                                </div>
                                <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-zinc-400 hover:text-white">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="flex-1 p-6 space-y-2 overflow-y-auto">
                                <div className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-widest mb-4 px-4">Menu</div>
                                <div onClick={() => setIsSidebarOpen(false)}>
                                    <SidebarLink href="/dashboard" icon={Home}>Dashboard</SidebarLink>
                                </div>
                                <div onClick={() => setIsSidebarOpen(false)}>
                                    <SidebarLink href="/dashboard/book-seat" icon={Armchair}>Book a Seat</SidebarLink>
                                </div>
                                <div onClick={() => setIsSidebarOpen(false)}>
                                    <SidebarLink href="/dashboard/my-bookings" icon={Receipt}>My Bookings</SidebarLink>
                                </div>
                                <div onClick={() => setIsSidebarOpen(false)}>
                                    <SidebarLink href="/dashboard/profile" icon={User}>My Profile</SidebarLink>
                                </div>
                            </div>

                            <div className="p-6 border-t border-zinc-800 bg-zinc-950">
                                <div className="flex items-center gap-3 p-3 rounded-sm bg-zinc-900 border border-zinc-800">
                                    <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "h-9 w-9" } }} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white line-clamp-1">{userProfile.fullName}</p>
                                        <p className="text-xs font-mono text-zinc-500 line-clamp-1 break-all">{userProfile.email}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 md:ml-72 min-h-screen flex flex-col bg-zinc-950 text-white transition-all">
                {/* Mobile Header */}
                <header className="md:hidden h-16 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-4 sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-zinc-400 hover:text-white">
                            <Menu className="h-6 w-6" />
                        </button>
                        <span className="font-display font-bold text-white">Divine Space</span>
                    </div>
                </header>

                <div className="flex-1 p-6 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}

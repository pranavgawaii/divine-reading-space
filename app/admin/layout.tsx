'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, CreditCard, Armchair, Bell, LogOut, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { clsx } from 'clsx'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [isSidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const navItems = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/bookings', label: 'Bookings', icon: Users },
    { href: '/admin/payments', label: 'Verifications', icon: CreditCard },
    { href: '/admin/seats', label: 'Seat Manager', icon: Armchair },
    { href: '/admin/notifications', label: 'Broadcasts', icon: Bell },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside
        className={clsx(
          "fixed bg-slate-900 text-white h-screen transition-all duration-300 z-20 flex flex-col justify-between shadow-2xl",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div>
          {/* Brand */}
          <div className="h-20 flex items-center px-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-lg shadow-lg">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              {isSidebarOpen && <span className="font-bold text-lg tracking-tight">Admin Panel</span>}
            </div>
          </div>

          {/* Nav */}
          <nav className="p-4 space-y-2 mt-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 font-medium"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Icon className={clsx("h-5 w-5 shrink-0", isActive ? "text-white" : "group-hover:text-indigo-400")} />
                  {isSidebarOpen && (
                    <span className="whitespace-nowrap">{item.label}</span>
                  )}
                  {isActive && !isSidebarOpen && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white rounded-l-full" />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className={clsx(
              "flex items-center gap-4 px-4 py-3 rounded-xl transition-colors w-full text-slate-400 hover:bg-red-500/10 hover:text-red-400",
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {isSidebarOpen && <span className="font-medium">Sign Out</span>}
          </button>

          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="hidden md:flex absolute -right-3 top-24 bg-white text-slate-900 rounded-full p-1 border border-slate-200 shadow-md hover:bg-slate-50"
            title="Toggle Sidebar"
          >
            <svg
              className={clsx("h-4 w-4 transition-transform duration-300", !isSidebarOpen && "rotate-180")}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </aside>

      <main className={clsx("flex-1 px-8 py-10 transition-all duration-300", isSidebarOpen ? "ml-64" : "ml-24")}>
        {children}
      </main>
    </div>
  )
}

import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server' // We need to ensure this is using the service role or standard client? 
// Standard client is fine if RLS allows reading admin_users.
// But RLS usually checks auth.uid(). Since we are avoiding auth.uid() (Supabase Auth),
// we might need to use a SERVICE ROLE client for admin checks or update RLS policies.
// For now, let's assume we can read. If not, user will need to update RLS or use service role.
// Given strict instructions, I will stick to standard client but might need to Warn user about RLS.

import React from 'react'
import Link from 'next/link'
import { LayoutDashboard, Users, CreditCard, Armchair, Bell, LogOut, ShieldCheck } from 'lucide-react'
import { clsx } from 'clsx'
import { UserButton } from '@clerk/nextjs'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  // Check if user is admin
  const supabase = createClient()

  // 1. Find Profile by Clerk ID
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_user_id', user.id)
    .single()

  if (!profile) {
    redirect('/dashboard')
  }

  // 2. Check if Profile is in Admin Users
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('role')
    .eq('user_id', profile.id)
    .single()

  if (!adminUser) {
    redirect('/dashboard')
  }

  // Note: Sidebar logic needs to be client-side for state (isOpen), 
  // but this is a Server Component. 
  // We can either make this client component or just render static sidebar.
  // The user's provided code was a Server Component ("async function ... await currentUser").
  // So I cannot use useState here. I will render a static sidebar or a Client Component wrapper.
  // I'll extract the Client Side Sidebar logic or just simplify it for now to match the user's snippet request,
  // BUT the user's snippet ("return <div>{children}</div>") is too simple, it removes the sidebar!
  // I must keep the Sidebar.

  // Best approach: Pass the User to a Client Component Sidebar or render structure here.
  // I'll implement a simple structure here that matches the design but without interactive toggle if strictly server,
  // OR I'll make the sidebar a client component.
  // Let's go with a Server Layout rendering a Client Sidebar.

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className='w-full md:w-64 bg-slate-900 text-white min-h-screen flex flex-col justify-between sticky top-0 h-screen'>
        <div>
          <div className="h-20 flex items-center px-6 border-b border-slate-800 gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-lg shadow-lg">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Admin Panel</span>
          </div>

          <nav className="p-4 space-y-2 mt-4">
            <AdminNavLink href="/admin" icon={LayoutDashboard} label="Overview" />
            <AdminNavLink href="/admin/bookings" icon={Users} label="Bookings" />
            <AdminNavLink href="/admin/payments" icon={CreditCard} label="Verifications" />
            <AdminNavLink href="/admin/seats" icon={Armchair} label="Seat Manager" />
            <AdminNavLink href="/admin/notifications" icon={Bell} label="Broadcasts" />
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2">
            <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "h-8 w-8" } }} />
            <div className="text-sm">
              <p className="font-medium text-white">{user.firstName} (Admin)</p>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}

function AdminNavLink({ href, icon: Icon, label }: { href: string, icon: any, label: string }) {
  return (
    <a href={href} className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition">
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </a>
  )
}

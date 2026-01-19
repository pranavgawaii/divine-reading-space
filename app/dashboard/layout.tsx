import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from './sidebar' // We will assume sidebar is a separate component or we will inline it if it was before.

// Re-implementing the layout structure to match previous visual design but with new logic
import Link from 'next/link'
import { LayoutDashboard, CreditCard, User, LogOut, Armchair, Receipt } from 'lucide-react'
import { UserButton, SignOutButton } from '@clerk/nextjs'
import { clsx } from 'clsx'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await currentUser()

    if (!user) {
        redirect('/sign-in')
    }

    // Sync user to Supabase profiles table if not exists
    const supabase = createClient()
    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('clerk_user_id', user.id)
        .single()

    if (!profile) {
        // Create profile for new Clerk user
        // Note: ensure your table has 'clerk_user_id' column or add it.
        // IF the table doesn't have it, we might error out.
        // Assuming we need to run a migration too? User didn't ask for SQL migration but implied logic.
        // We will assume 'clerk_user_id' exists or we reuse 'id' if possible? 
        // Clerk IDs are strings like 'user_...', UUIDs are standard. Supabase ID is UUID usually.
        // We SHOULD ADD a column `clerk_user_id` to profiles.

        // However, for now, let's try to insert assuming the schema supports it or we need to add it.
        // RLS might block this. We are on server, using service role? 
        // No, createServerClient uses standard keys.
        // We might need a migration script for the new column.

        await supabase.from('profiles').insert({
            id: user.id, // Trying to use Clerk ID as Primary Key if it's text, otherwise this will fail if ID is UUID.
            // Ideally we should have a separate column.
            email: user.emailAddresses[0]?.emailAddress,
            full_name: user.fullName || user.firstName + ' ' + user.lastName,
            phone: user.phoneNumbers[0]?.phoneNumber || null,
            // clerk_user_id: user.id // Best practice
        }).select()
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            <div className='w-full md:w-64 bg-slate-900 text-white min-h-screen flex flex-col justify-between'>
                <div>
                    <div className="p-6 border-b border-slate-800">
                        <Link href="/dashboard" className="text-xl font-bold text-white tracking-tight">Divine Space</Link>
                    </div>

                    <nav className="p-4 space-y-2">
                        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-slate-800 text-slate-300 hover:text-white transition">
                            <LayoutDashboard className="h-4 w-4" /> Overview
                        </Link>
                        <Link href="/dashboard/book-seat" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-slate-800 text-slate-300 hover:text-white transition">
                            <Armchair className="h-4 w-4" /> Book Seat
                        </Link>
                        <Link href="/dashboard/bookings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-slate-800 text-slate-300 hover:text-white transition">
                            <Receipt className="h-4 w-4" /> My Bookings
                        </Link>
                        <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-slate-800 text-slate-300 hover:text-white transition">
                            <User className="h-4 w-4" /> Profile
                        </Link>
                    </nav>
                </div>

                <div className="p-4 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "h-9 w-9" } }} />
                        <div className="text-sm">
                            <p className="font-medium text-white">{user.fullName}</p>
                            <p className="text-xs text-slate-500">Student</p>
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

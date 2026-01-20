import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Home, Armchair, Receipt, BookOpen, User } from 'lucide-react'

// Simple Sidebar Link Component
function SidebarLink({ href, icon: Icon, children }: { href: string, icon: any, children: React.ReactNode }) {
    return (
        <a href={href} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group">
            <Icon className="h-5 w-5 group-hover:scale-110 transition-transform text-slate-500 group-hover:text-blue-400" />
            <span className="font-medium">{children}</span>
        </a>
    )
}

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await currentUser()

    if (!user) {
        redirect('/sign-in')
    }

    // Sync user to Supabase (simple, no complex auth checks)
    const supabase = createClient()
    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('clerk_user_id', user.id)
        .single()

    if (!profile) {
        await supabase.from('profiles').insert({
            clerk_user_id: user.id,
            email: user.emailAddresses[0]?.emailAddress,
            full_name: user.fullName || `${user.firstName} ${user.lastName}`,
            phone: user.phoneNumbers[0]?.phoneNumber || null,
        })
    }

    return (
        <div className="flex bg-background min-h-screen font-sans">
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-72 bg-background border-r border-border fixed h-full z-10 transition-all text-foreground">
                <div className="h-20 flex items-center px-8 border-b border-border">
                    <div className="flex items-center gap-2">
                        <div className="p-2 border border-border rounded-sm bg-secondary/10">
                            <BookOpen className="h-5 w-5 text-foreground" />
                        </div>
                        <span className="font-display font-medium text-lg tracking-tight">Student Portal</span>
                    </div>
                </div>

                <div className="flex-1 p-6 space-y-2 overflow-y-auto">
                    <div className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-widest mb-4 px-4">Menu</div>
                    <SidebarLink href="/dashboard" icon={Home}>Dashboard</SidebarLink>
                    <SidebarLink href="/dashboard/book-seat" icon={Armchair}>Book a Seat</SidebarLink>
                    <SidebarLink href="/dashboard/my-bookings" icon={Receipt}>My Bookings</SidebarLink>
                    <SidebarLink href="/dashboard/profile" icon={User}>My Profile</SidebarLink>
                </div>

                <div className="p-6 border-t border-border bg-background">
                    <div className="flex items-center gap-3 p-3 rounded-sm bg-secondary/10 border border-border">
                        <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "h-9 w-9" } }} />
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-foreground truncate">{user.fullName}</p>
                            <p className="text-xs font-mono text-muted-foreground truncate">{user.emailAddresses[0].emailAddress}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-72 min-h-screen flex flex-col bg-background">
                {/* Mobile Header */}
                <header className="md:hidden h-16 bg-background border-b border-border flex items-center justify-between px-4 sticky top-0 z-20">
                    <span className="font-display font-bold text-foreground">Divine Space</span>
                    <UserButton afterSignOutUrl="/" />
                </header>

                <div className="flex-1 p-6 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    )
}

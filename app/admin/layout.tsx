import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { ShieldCheck, LayoutDashboard, Users, CreditCard, Armchair, Bell } from 'lucide-react'

function AdminNavLink({ href, icon: Icon, label }: { href: string, icon: any, label: string }) {
  return (
    <a href={href} className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all group">
      <Icon className="h-5 w-5 group-hover:scale-110 transition-transform text-slate-400 group-hover:text-indigo-600" />
      <span className="font-medium">{label}</span>
    </a>
  )
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  const isAdmin = (user.publicMetadata as any)?.role === 'admin'

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-slate-50">
        <div className="p-4 bg-red-100 rounded-full mb-4">
          <ShieldCheck className="h-10 w-10 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
        <p className="text-slate-600 max-w-md mb-8">
          You do not have administrative privileges.
        </p>
        <div className="flex gap-4">
          <a href="/dashboard" className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition">
            Go to Student Dashboard
          </a>
          <div className="flex flex-col items-center">
            <UserButton afterSignOutUrl="/admin" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-900">
      {/* Sidebar - Light Mode */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 fixed h-full z-10 transition-all">
        <div className="h-20 flex items-center px-8 border-b border-slate-100 gap-3">
          <div className="p-2 bg-slate-900 rounded-lg shadow-lg shadow-slate-900/10">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">Admin Panel</span>
        </div>

        <div className="flex-1 p-6 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-4">Management</div>
          <AdminNavLink href="/admin" icon={LayoutDashboard} label="Overview" />
          <AdminNavLink href="/admin/bookings" icon={Users} label="Bookings" />
          <AdminNavLink href="/admin/payments" icon={CreditCard} label="Verifications" />
          <AdminNavLink href="/admin/seats" icon={Armchair} label="Seat Manager" />
        </div>

        <div className="p-6 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "h-9 w-9" } }} />
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-slate-900 truncate">{user.firstName} (Admin)</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-72 min-h-screen flex flex-col bg-slate-50">
        <div className="flex-1 p-6 md:p-8 lg:p-12 w-full">
          {children}
        </div>
      </main>
    </div>
  )
}

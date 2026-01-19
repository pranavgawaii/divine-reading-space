import { Users, CreditCard, AlertCircle, IndianRupee, TrendingUp, Calendar, Zap, Bell, Armchair } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

// Server Component
export default async function AdminDashboardPage() {
    const supabase = createClient()

    // 1. Pending Payments
    const { count: pending } = await supabase
        .from('payments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

    // 2. Active Bookings
    const { count: active } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

    // 3. Revenue
    const { data: payments } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'approved')

    const revenue = payments?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0

    const stats = {
        activeBookings: active || 0,
        pendingPayments: pending || 0,
        monthlyRevenue: revenue
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Command Center</h1>
                    <p className="text-slate-500">Real-time overview of your library space.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm text-sm font-medium text-slate-600">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard
                    title="Active Bookings"
                    value={stats.activeBookings.toString()}
                    icon={<Users className="h-6 w-6 text-white" />}
                    color="bg-blue-500"
                    trend="+12% this week"
                    desc="Current Occupancy"
                />

                <Link href="/admin/payments" className="block transform transition hover:scale-[1.02]">
                    <StatCard
                        title="Pending Approvals"
                        value={stats.pendingPayments.toString()}
                        icon={<AlertCircle className="h-6 w-6 text-white" />}
                        color="bg-orange-500"
                        trend="Action Required"
                        desc="Awaiting Verification"
                        highlight={stats.pendingPayments > 0}
                    />
                </Link>

                <StatCard
                    title="Total Revenue"
                    value={`₹${stats.monthlyRevenue.toLocaleString()}`}
                    icon={<IndianRupee className="h-6 w-6 text-white" />}
                    color="bg-green-500"
                    trend="+5% vs last month"
                    desc="Gross Income"
                />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Activity Placeholder */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg text-slate-900">Recent Activity</h3>
                        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</button>
                    </div>
                    <div className="space-y-6">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex gap-4 items-start pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                                    <Zap className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">New Booking Confirmed</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Seat A-12 • John Doe</p>
                                </div>
                                <span className="ml-auto text-xs text-slate-400">2m ago</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-lg text-slate-900 mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/admin/notifications" className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition text-left group">
                            <Bell className="h-6 w-6 text-indigo-500 mb-3 group-hover:scale-110 transition-transform" />
                            <div className="font-bold text-slate-900">Send Broadcast</div>
                            <div className="text-xs text-slate-500 mt-1">Notify all students</div>
                        </Link>
                        <Link href="/admin/seats" className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition text-left group">
                            <Armchair className="h-6 w-6 text-indigo-500 mb-3 group-hover:scale-110 transition-transform" />
                            <div className="font-bold text-slate-900">Manage Seats</div>
                            <div className="text-xs text-slate-500 mt-1">Block/Unblock seats</div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, value, icon, color, trend, desc, highlight }: any) {
    return (
        <div className={`relative overflow-hidden bg-white p-8 rounded-3xl border transition shadow-sm hover:shadow-lg ${highlight ? 'border-orange-400 ring-4 ring-orange-50' : 'border-slate-200'}`}>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                    <h3 className="text-4xl font-bold text-slate-900 tracking-tight">{value}</h3>
                </div>
                <div className={`h-12 w-12 rounded-2xl ${color} flex items-center justify-center shadow-lg shadow-black/5`}>
                    {icon}
                </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
                <span className={`font-medium ${highlight ? 'text-orange-600' : 'text-green-600'} bg-opacity-10 px-2 py-0.5 rounded-full ${highlight ? 'bg-orange-100' : 'bg-green-100'}`}>
                    {trend}
                </span>
                <span className="text-slate-400">{desc}</span>
            </div>
        </div>
    )
}

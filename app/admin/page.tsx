import { Users, CreditCard, AlertCircle, IndianRupee, TrendingUp, Calendar, Zap, Bell, Armchair, BarChart3 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

// Server Component
function StatCard({ title, value, subtext, icon: Icon, trend, color, bgColor }: any) {
    return (
        <div className="bg-white border border-slate-200 p-6 rounded-2xl relative overflow-hidden group hover:shadow-lg transition-all">
            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${color}`}>
                <Icon className="h-24 w-24 -mr-8 -mt-8" />
            </div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${bgColor} ${color}`}>
                        <Icon className="h-6 w-6" />
                    </div>
                    {trend && (
                        <span className="flex items-center text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <TrendingUp className="h-3 w-3 mr-1" /> {trend}
                        </span>
                    )}
                </div>
                <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
                <div className="text-3xl font-bold text-slate-900 tracking-tight">{value}</div>
                {subtext && <p className="text-slate-400 text-xs mt-2">{subtext}</p>}
            </div>
        </div>
    )
}

export default async function AdminDashboardPage() {
    const supabase = createClient()

    // 1. Pending Payments
    const { count: pending } = await supabase
        .from('payments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

    // 2. Active Bookings
    const { count: activeBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

    // 3. Monthly Revenue
    const { data: payments } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'approved')
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())

    const monthlyRevenue = payments?.reduce((acc, curr) => acc + curr.amount, 0) || 0

    // 4. Total Seats
    const { count: totalSeats } = await supabase
        .from('seats')
        .select('*', { count: 'exact', head: true })

    // 5. Occupancy Rate
    const occupancyRate = totalSeats ? Math.round((activeBookings || 0) / totalSeats * 100) : 0

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard Overview</h1>
                <p className="text-slate-500">Welcome back, Admin. Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Pending Verifications"
                    value={pending || 0}
                    subtext="Requires immediate attention"
                    icon={AlertCircle}
                    color="text-amber-600"
                    bgColor="bg-amber-100"
                    trend={pending && pending > 0 ? "Action Needed" : null}
                />

                <StatCard
                    title="Active Students"
                    value={activeBookings || 0}
                    subtext="Currently holding a seat"
                    icon={Users}
                    color="text-indigo-600"
                    bgColor="bg-indigo-100"
                    trend="+12%"
                />

                <StatCard
                    title="Monthly Revenue"
                    value={`₹${monthlyRevenue.toLocaleString()}`}
                    subtext="Revenue for current month"
                    icon={IndianRupee}
                    color="text-emerald-600"
                    bgColor="bg-emerald-100"
                    trend="+5%"
                />

                <StatCard
                    title="Occupancy Rate"
                    value={`${occupancyRate}%`}
                    subtext={`${activeBookings || 0} of ${totalSeats || 0} seats`}
                    icon={BarChart3}
                    color="text-blue-600"
                    bgColor="bg-blue-100"
                    trend={occupancyRate > 70 ? "High" : "Normal"}
                />
            </div>

            {/* Revenue Insight */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900 mb-1">Revenue Insights</h2>
                        <p className="text-slate-600 text-sm">Monthly performance at a glance</p>
                    </div>
                    <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-indigo-600" />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                        <p className="text-xs text-slate-500 mb-1">This Month</p>
                        <p className="text-2xl font-bold text-slate-900">₹{monthlyRevenue.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                        <p className="text-xs text-slate-500 mb-1">Avg per Student</p>
                        <p className="text-2xl font-bold text-slate-900">
                            ₹{activeBookings ? Math.round(monthlyRevenue / activeBookings).toLocaleString() : 0}
                        </p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                        <p className="text-xs text-slate-500 mb-1">Pending</p>
                        <p className="text-2xl font-bold text-amber-600">{pending || 0}</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/admin/payments" className="p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md transition flex items-center gap-3 group">
                    <div className="h-10 w-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                        <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="font-semibold text-slate-900">Verify Payments</div>
                        <div className="text-xs text-slate-500">Check pending screenshots</div>
                    </div>
                </Link>
                <Link href="/admin/seats" className="p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md transition flex items-center gap-3 group">
                    <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                        <Armchair className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="font-semibold text-slate-900">Manage Seats</div>
                        <div className="text-xs text-slate-500">View grid map</div>
                    </div>
                </Link>
                <Link href="/admin/bookings" className="p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md transition flex items-center gap-3 group">
                    <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                        <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="font-semibold text-slate-900">All Bookings</div>
                        <div className="text-xs text-slate-500">View history</div>
                    </div>
                </Link>
            </div>
        </div>
    )
}

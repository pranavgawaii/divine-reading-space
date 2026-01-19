'use client'

import { Users, CreditCard, AlertCircle, IndianRupee } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        activeBookings: 0,
        pendingPayments: 0,
        monthlyRevenue: 0
    })

    useEffect(() => {
        async function fetchStats() {
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

            // 3. Revenue (This month) - simplified
            const { data: payments } = await supabase
                .from('payments')
                .select('amount')
                .eq('status', 'approved') // or Verified

            const revenue = payments?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0

            setStats({
                activeBookings: active || 0,
                pendingPayments: pending || 0,
                monthlyRevenue: revenue
            })
        }
        fetchStats()
    }, [])

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6 mb-8">
                <StatCard
                    title="Active Bookings"
                    value={stats.activeBookings.toString()}
                    icon={<Users className="h-6 w-6 text-blue-600" />}
                    trend="Current Occupancy"
                />
                <Link href="/admin/payments">
                    <StatCard
                        title="Pending Verifications"
                        value={stats.pendingPayments.toString()}
                        icon={<AlertCircle className="h-6 w-6 text-orange-500" />}
                        trend="Click to review"
                        highlight={stats.pendingPayments > 0}
                    />
                </Link>
                <StatCard
                    title="Total Revenue"
                    value={`₹${stats.monthlyRevenue.toLocaleString()}`}
                    icon={<IndianRupee className="h-6 w-6 text-green-600" />}
                    trend="Lifetime"
                />
            </div>
        </div>
    )
}

function StatCard({ title, value, icon, trend, highlight }: any) {
    return (
        <div className={`bg-white p-6 rounded-xl shadow-sm border ${highlight ? 'border-orange-300 ring-2 ring-orange-100' : 'border-gray-200'} cursor-pointer hover:shadow-md transition`}>
            <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
                <span className="text-xs font-medium text-gray-500">{trend}</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
            <p className="text-sm text-gray-500">{title}</p>
        </div>
    )
}

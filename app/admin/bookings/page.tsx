'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Search, Filter, Ban, Eye } from 'lucide-react'
import { clsx } from 'clsx'

type Booking = {
    id: string
    created_at: string
    start_date: string
    end_date: string
    status: string
    seat: { seat_number: string } | null
    user: { full_name: string; email?: string } | null
    profile?: { full_name: string }
    // We'll flatten this in fetching
}

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')

    useEffect(() => {
        fetchBookings()
    }, [])

    const fetchBookings = async () => {
        setLoading(true)
        const supabase = createClient()

        // We fetch bookings joined with seats and profiles via user_id
        // Note: 'profiles' is linked to 'bookings.user_id' via the 'user_id' FK logic? 
        // Supabase needs explicit FK or we do manual fetch.
        // Schema says: bookings.user_id -> profiles.id. So we can join.

        const { data, error } = await supabase
            .from('bookings')
            .select(`
        *,
        seat:seats(seat_number),
        profile:profiles(full_name, phone)
      `)
            .order('created_at', { ascending: false })

        if (data) setBookings(data)
        if (error) console.error(error)
        setLoading(false)
    }

    const filteredBookings = bookings.filter(b => {
        if (filter === 'all') return true
        return b.status === filter
    })

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">All Bookings</h1>
                <div className="flex gap-2">
                    {['all', 'active', 'pending', 'expired', 'cancelled'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={clsx(
                                "px-3 py-1.5 rounded-lg text-sm font-medium capitalize border transition",
                                filter === f
                                    ? "bg-blue-50 border-blue-200 text-blue-700"
                                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Student</th>
                                <th className="px-6 py-4">Seat</th>
                                <th className="px-6 py-4">Dates</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-12 text-center"><Loader2 className="animate-spin inline text-gray-400" /></td></tr>
                            ) : filteredBookings.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No bookings found.</td></tr>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{booking.profile?.full_name || 'Unknown'}</div>
                                            <div className="text-xs text-gray-500">{booking.profile?.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 font-mono font-medium text-gray-700">
                                            {booking.seat?.seat_number || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            <div>{new Date(booking.start_date).toLocaleDateString()}</div>
                                            <div className="text-xs">to {new Date(booking.end_date).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={clsx(
                                                "px-2 py-1 rounded-full text-xs font-semibold",
                                                booking.status === 'active' && "bg-green-100 text-green-700",
                                                booking.status === 'pending' && "bg-orange-100 text-orange-700",
                                                booking.status === 'expired' && "bg-gray-100 text-gray-600",
                                                booking.status === 'cancelled' && "bg-red-100 text-red-700",
                                            )}>
                                                {booking.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">View</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

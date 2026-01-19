'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Loader2, Calendar, Clock, AlertCircle } from 'lucide-react'

type Booking = {
    id: string
    start_date: string
    end_date: string
    status: string
    amount: number
    seat: {
        seat_number: string
    } | null
}

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBookings = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                const { data } = await supabase
                    .from('bookings')
                    .select('*, seat:seats(seat_number)')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })

                if (data) setBookings(data as any)
            }
            setLoading(false)
        }
        fetchBookings()
    }, [])

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>

            {bookings.length === 0 ? (
                <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
                    <p className="text-gray-500 mb-4">You have no booking history.</p>
                    <a href="/dashboard/book-seat" className="text-blue-600 font-medium hover:underline">Book a seat now</a>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="font-bold text-lg text-gray-800">Seat {booking.seat?.seat_number || 'Unknown'}</span>
                                    <StatusBadge status={booking.status} />
                                </div>
                                <div className="flex gap-6 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="font-semibold text-gray-700">₹{booking.amount}</span>
                                    </div>
                                </div>
                            </div>
                            {booking.status === 'active' && (
                                <div className="text-sm text-green-600 font-medium flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    Active Subscription
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        active: 'bg-green-100 text-green-700 border-green-200',
        pending: 'bg-orange-100 text-orange-700 border-orange-200',
        expired: 'bg-gray-100 text-gray-600 border-gray-200',
        cancelled: 'bg-red-100 text-red-700 border-red-200',
    }
    const label = status.charAt(0).toUpperCase() + status.slice(1)
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles] || styles.expired}`}>
            {label}
        </span>
    )
}

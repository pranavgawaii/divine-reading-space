'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Armchair } from 'lucide-react'
import { clsx } from 'clsx'

export default function AdminSeatsPage() {
    const [seats, setSeats] = useState<any[]>([])
    const [activeBookings, setActiveBookings] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        const supabase = createClient()
        const { data: s } = await supabase.from('seats').select('*').order('seat_number')
        const { data: b } = await supabase.from('bookings')
            .select('seat_id, profile:profiles(full_name)')
            .eq('status', 'active')
            .gte('end_date', new Date().toISOString().split('T')[0])

        if (s) setSeats(s)
        if (b) setActiveBookings(b)
        setLoading(false)
    }

    const getSeatInfo = (seatId: string) => {
        const booking = activeBookings.find(b => b.seat_id === seatId)
        if (booking) return { status: 'occupied', user: booking.profile?.full_name }
        return { status: 'available', user: null }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Seat Management</h1>

            {loading ? <Loader2 className="animate-spin" /> : (
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                    {seats.map(seat => {
                        const info = getSeatInfo(seat.id)
                        return (
                            <div
                                key={seat.id}
                                className={clsx(
                                    "p-3 rounded-xl border flex flex-col items-center text-center justify-center aspect-square transition",
                                    info.status === 'occupied'
                                        ? "bg-red-50 border-red-200 text-red-800"
                                        : "bg-green-50 border-green-200 text-green-800"
                                )}
                            >
                                <span className="font-bold text-lg mb-1">{seat.seat_number}</span>
                                <div className="text-[10px] uppercase font-bold opacity-70">
                                    {info.status}
                                </div>
                                {info.user && (
                                    <div className="text-[10px] truncate w-full mt-1 bg-white/50 px-1 rounded">
                                        {info.user}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

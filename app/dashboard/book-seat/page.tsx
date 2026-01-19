'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Armchair, X, Check, ShieldCheck, Zap } from 'lucide-react'
import { clsx } from 'clsx'
import { useRouter } from 'next/navigation'

type Seat = {
    id: string
    seat_number: string
    floor: string
    section: string
    is_available: boolean
}

type Booking = {
    seat_id: string
    start_date: string
    end_date: string
}

export default function BookSeatPage() {
    const [seats, setSeats] = useState<Seat[]>([])
    const [activeBookings, setActiveBookings] = useState<Booking[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        fetchSeatsData()
    }, [])

    const fetchSeatsData = async () => {
        try {
            const { data: seatsData } = await supabase
                .from('seats')
                .select('*')
                .order('seat_number', { ascending: true })

            const today = new Date().toISOString().split('T')[0]
            const { data: bookingsData } = await supabase
                .from('bookings')
                .select('seat_id, start_date, end_date')
                .in('status', ['active', 'pending'])
                .gte('end_date', today)

            if (seatsData) setSeats(seatsData)
            if (bookingsData) setActiveBookings(bookingsData)
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const getSeatStatus = (seat: Seat) => {
        const isBooked = activeBookings.some(b => b.seat_id === seat.id)
        if (isBooked) return 'occupied'
        if (!seat.is_available) return 'maintenance'
        return 'available'
    }

    const handleSeatClick = (seat: Seat) => {
        const status = getSeatStatus(seat)
        if (status === 'occupied') return
        if (status === 'maintenance') return
        setSelectedSeat(seat)
    }

    const handleProceedToPayment = () => {
        if (!selectedSeat) return
        router.push(`/dashboard/payment?seatId=${selectedSeat.id}&seatNum=${selectedSeat.seat_number}`)
    }

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
                <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
                <p className="text-slate-500 font-medium">Loading layout...</p>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Select Your Seat</h1>
                    <p className="text-slate-500">Choose your perfect spot for deep work.</p>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-green-500 shadow-sm"></div>
                        <span className="text-slate-600 font-medium">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-slate-200 border border-slate-300"></div>
                        <span className="text-slate-400">Occupied</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-yellow-400 border border-yellow-500 shadow-sm"></div>
                        <span className="text-slate-900 font-medium">Selected</span>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden">
                {/* Decorative backdrop */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                    {seats.map((seat) => {
                        const status = getSeatStatus(seat)
                        const isSelected = selectedSeat?.id === seat.id

                        return (
                            <button
                                key={seat.id}
                                onClick={() => handleSeatClick(seat)}
                                disabled={status !== 'available'}
                                className={clsx(
                                    "aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300 relative group border-2",

                                    status === 'occupied' && "bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed",

                                    status === 'available' && !isSelected && "bg-white border-slate-200 hover:border-green-400 hover:shadow-lg hover:shadow-green-100 hover:-translate-y-1 cursor-pointer",

                                    isSelected && "bg-yellow-50 border-yellow-400 shadow-lg shadow-yellow-100 scale-105 z-10",

                                    status === 'maintenance' && "bg-gray-100 border-gray-200 cursor-not-allowed opacity-50"
                                )}
                            >
                                <Armchair className={clsx("h-6 w-6 mb-2 transition-colors",
                                    status === 'occupied' ? "text-slate-300" :
                                        isSelected ? "text-yellow-600" : "text-green-500 group-hover:text-green-600"
                                )} />
                                <span className={clsx("font-bold text-sm",
                                    status === 'occupied' ? "text-slate-300" :
                                        isSelected ? "text-yellow-900" : "text-slate-700"
                                )}>
                                    {seat.seat_number}
                                </span>

                                {status === 'available' && !isSelected && (
                                    <div className="absolute inset-0 rounded-2xl ring-2 ring-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Selection Modal */}
            {selectedSeat && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-300 border border-slate-100">
                        <button
                            onClick={() => setSelectedSeat(null)}
                            className="absolute top-4 right-4 p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="text-center mb-6">
                            <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-yellow-50 border-2 border-yellow-100 mb-4 shadow-sm">
                                <Armchair className="h-10 w-10 text-yellow-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900">Seat {selectedSeat.seat_number}</h3>
                            <p className="text-slate-500 font-medium">Window Section • 1st Floor</p>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                <ShieldCheck className="h-5 w-5 text-blue-500" />
                                <span className="text-sm font-medium text-slate-700">Reserved for 30 days</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                <Zap className="h-5 w-5 text-orange-500" />
                                <span className="text-sm font-medium text-slate-700">Includes AC & WiFi</span>
                            </div>
                        </div>

                        <div className="space-y-3 border-t border-slate-100 pt-6 mb-8">
                            <div className="flex justify-between items-center text-slate-600">
                                <span>Monthly Fee</span>
                                <span className="font-semibold">₹800</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-600">
                                <span>Registration</span>
                                <span className="font-semibold">₹200</span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-bold text-slate-900 pt-2 border-t border-slate-100">
                                <span>Total</span>
                                <span>₹1,000</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setSelectedSeat(null)}
                                className="px-4 py-3.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleProceedToPayment}
                                className="px-4 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition flex items-center justify-center gap-2"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

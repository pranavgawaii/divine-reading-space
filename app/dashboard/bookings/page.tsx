import { createClient } from '@/lib/supabase/server'
import { auth } from '@clerk/nextjs/server'
import { Calendar, Receipt, Clock } from 'lucide-react'
import Link from 'next/link'
import { clsx } from 'clsx'

export default async function MyBookingsPage() {
    const { userId: clerkUserId } = auth()
    if (!clerkUserId) return <div>Please sign in</div>

    const supabase = createClient()

    // 1. Get Profile ID
    const { data: profile } = await supabase.from('profiles').select('id').eq('clerk_user_id', clerkUserId).single()

    let bookings: any[] = []

    if (profile) {
        const { data } = await supabase
            .from('bookings')
            .select('*, seat:seats(seat_number)')
            .eq('user_id', profile.id)
            .order('created_at', { ascending: false })

        if (data) bookings = data
    }

    // -- Helper Components (Inline for Server Component simplicity) --
    function StatusBadge({ status }: { status: string }) {
        const styles = {
            active: 'bg-green-100 text-green-700 ring-1 ring-green-500/20',
            pending: 'bg-orange-100 text-orange-700 ring-1 ring-orange-500/20',
            expired: 'bg-slate-100 text-slate-600 ring-1 ring-slate-500/20',
            cancelled: 'bg-red-100 text-red-700 ring-1 ring-red-500/20',
        }
        const label = status.charAt(0).toUpperCase() + status.slice(1)
        return (
            <span className={clsx("px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1", styles[status as keyof typeof styles] || styles.expired)}>
                {status === 'active' && <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />}
                {label}
            </span>
        )
    }

    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Booking History</h1>
                    <p className="text-slate-500">Manage your past and current subscriptions.</p>
                </div>
            </div>

            {bookings.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-slate-200 text-center flex flex-col items-center">
                    <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Calendar className="h-8 w-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">No Bookings Yet</h3>
                    <p className="text-slate-500 mb-6 max-w-xs">You haven't made any seat reservations yet. Start your journey today.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {bookings.map((booking) => (
                        <div
                            key={booking.id}
                            className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                        >
                            <div className="flex items-start gap-4">
                                <div className={clsx(
                                    "h-14 w-14 rounded-2xl flex items-center justify-center text-xl font-bold border-2",
                                    booking.status === 'active' ? "bg-green-50 border-green-100 text-green-600" :
                                        booking.status === 'pending' ? "bg-orange-50 border-orange-100 text-orange-600" :
                                            "bg-slate-50 border-slate-100 text-slate-400"
                                )}>
                                    {booking.seat?.seat_number}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-slate-900">Monthly Subscription</h3>
                                        <StatusBadge status={booking.status} />
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                                <div className="flex flex-col items-end">
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Total</span>
                                    <span className="text-xl font-bold text-slate-900">₹{booking.amount}</span>
                                </div>
                                <button className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 transition ml-auto md:ml-0">
                                    <Receipt className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

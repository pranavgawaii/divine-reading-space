import { createClient } from '@/lib/supabase/server'
import { Calendar } from 'lucide-react'

export default async function AdminBookingsPage() {
    const supabase = createClient()

    const { data: bookings } = await supabase
        .from('bookings')
        .select('*, profile:profiles(full_name, phone, email), seat:seats(seat_number)')
        .order('created_at', { ascending: false })

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">All Bookings</h1>
                <p className="text-slate-500">Master record of all seat reservations.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs">
                        <tr>
                            <th className="p-4">Student</th>
                            <th className="p-4">Seat</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Duration</th>
                            <th className="p-4">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {bookings?.map((booking: any) => (
                            <tr key={booking.id} className="hover:bg-slate-50">
                                <td className="p-4">
                                    <div className="font-semibold text-slate-900">{booking.profile?.full_name || 'Unknown'}</div>
                                    <div className="text-slate-400 text-xs">{booking.profile?.phone}</div>
                                </td>
                                <td className="p-4">
                                    <div className="font-bold text-lg text-slate-700">{booking.seat?.seat_number}</div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${booking.status === 'active' ? 'bg-green-100 text-green-700' :
                                            booking.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-500">
                                    {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-slate-400 text-xs">
                                    {new Date(booking.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

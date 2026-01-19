import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Armchair, Clock, CheckCircle, AlertCircle, ArrowRight, Calendar, Info } from 'lucide-react'

export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: bookings } = await supabase
        .from('bookings')
        .select('*, seat:seats(seat_number)')
        .eq('user_id', user.id)
        .in('status', ['active', 'pending'])
        .order('created_at', { ascending: false })
        .limit(1)

    const currentBooking = bookings?.[0]
    const userName = user.user_metadata.full_name || 'Student'
    const firstName = userName.split(' ')[0]

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 lg:p-12 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10">
                    <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                        Welcome back, {firstName}! 👋
                    </h1>
                    <p className="text-blue-100 text-lg max-w-xl leading-relaxed">
                        Your sanctuary for focus is ready. You have <strong>{currentBooking ? 'an active' : 'no active'}</strong> booking today.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Status Card */}
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Armchair className="text-blue-600" /> Current Booking
                    </h2>

                    {currentBooking ? (
                        <div className={`rounded-3xl p-8 border ${currentBooking.status === 'active' ? 'bg-white border-green-200 shadow-lg shadow-green-100/50' : 'bg-white border-orange-200 shadow-lg shadow-orange-100/50'} relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300`}>

                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div>
                                    <div className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-1">Assigned Seat</div>
                                    <div className="text-5xl font-bold text-slate-900">{currentBooking.seat?.seat_number}</div>
                                </div>
                                <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${currentBooking.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {currentBooking.status === 'active' ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                                    {currentBooking.status === 'active' ? 'Active' : 'Pending Verification'}
                                </span>
                            </div>

                            <div className="space-y-4 relative z-10">
                                <div className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-medium">Valid Until</span>
                                    <span className="font-bold text-slate-900">{new Date(currentBooking.end_date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                                </div>

                                {currentBooking.status === 'pending' && (
                                    <div className="flex gap-3 items-start p-4 bg-orange-50 rounded-2xl text-orange-800 text-sm">
                                        <Info className="h-5 w-5 shrink-0" />
                                        <p>Our admin team is verifying your payment. This usually takes 2-4 hours. You'll be notified via SMS once approved.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-3xl p-1 bg-gradient-to-r from-blue-500 to-blue-600 shadow-xl">
                            <div className="bg-white rounded-[22px] p-8 h-full flex flex-col items-center justify-center text-center">
                                <div className="h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                                    <Armchair className="h-10 w-10 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">No Seat Booked</h3>
                                <p className="text-slate-500 mb-8 max-w-sm mx-auto">Don't lose your rhythm. Secure your dedicated spot now and get back to deep work.</p>
                                <Link href="/dashboard/book-seat" className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 hover:shadow-lg transition hover:-translate-y-0.5">
                                    Book a Seat <ArrowRight className="h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Stats / Side Panel */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Calendar className="text-blue-600" /> Quick Stats
                    </h2>

                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition">
                        <div className="text-sm font-medium text-slate-500 mb-1">Next Payment Due</div>
                        <div className="text-2xl font-bold text-slate-900">
                            {currentBooking ? new Date(currentBooking.end_date).toLocaleDateString() : 'N/A'}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition">
                        <div className="text-sm font-medium text-slate-500 mb-1">Monthly Plan</div>
                        <div className="text-2xl font-bold text-slate-900">₹800<span className="text-sm text-slate-400 font-normal">/mo</span></div>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-lg overflow-hidden relative">
                        <div className="relative z-10">
                            <h3 className="font-bold mb-2">Need Help?</h3>
                            <p className="text-slate-400 text-sm mb-4">Contact admin support for any issues with your seat.</p>
                            <button className="text-sm font-bold text-blue-400 hover:text-white transition">Contact Support →</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

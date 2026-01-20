import { createClient } from '@/lib/supabase/server'
import { auth } from '@clerk/nextjs/server'
import { Calendar, Receipt, Clock, AlertTriangle, CheckCircle } from 'lucide-react'

export default async function MyBookingsPage() {
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId) return <div>Please sign in</div>

    const supabase = createClient()

    // 1. Get Profile ID
    const { data: profile } = await supabase.from('profiles').select('id').eq('clerk_user_id', clerkUserId).single()

    if (!profile) return <div>Profile not found</div>

    // 2. Fetch Bookings
    const { data: bookings } = await supabase
        .from('bookings')
        .select('*, seat:seats(*)')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })

    // 3. Fetch Payments
    const { data: payments } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-display font-medium text-foreground tracking-tight">History Protocol</h1>
                <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest mt-1">Transaction & Access Logs</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bookings List */}
                <div className="space-y-4">
                    <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2">
                        <Calendar className="h-4 w-4" /> Bookings
                    </h2>
                    {bookings && bookings.length > 0 ? (
                        bookings.map((booking) => (
                            <div key={booking.id} className="bg-background p-6 rounded-sm border border-border">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="text-3xl font-display font-medium text-foreground mb-1">{booking.seat.seat_number}</div>
                                        <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Seat Number</div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-sm text-[10px] font-mono font-bold uppercase tracking-widest ${booking.status === 'active' ? 'bg-primary text-primary-foreground' :
                                        booking.status === 'pending' ? 'bg-secondary text-foreground' : 'bg-secondary/20 text-muted-foreground'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </div>
                                <div className="border-t border-border pt-4 flex justify-between text-xs font-mono">
                                    <span className="text-muted-foreground">Start Date</span>
                                    <span className="text-foreground">{new Date(booking.start_date).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 bg-secondary/5 rounded-sm border border-border text-center text-muted-foreground text-xs font-mono uppercase tracking-widest">
                            No bookings found.
                        </div>
                    )}
                </div>

                {/* Payments List */}
                <div className="space-y-4">
                    <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2">
                        <Receipt className="h-4 w-4" /> Recent Payments
                    </h2>
                    {payments && payments.length > 0 ? (
                        payments.map((payment) => (
                            <div key={payment.id} className="bg-background p-4 rounded-sm border border-border flex items-center gap-4">
                                <div className={`h-10 w-10 rounded-sm flex items-center justify-center shrink-0 border border-border ${payment.status === 'approved' ? 'bg-background text-foreground' :
                                    payment.status === 'pending' ? 'bg-secondary/10 text-muted-foreground' : 'bg-red-900/10 text-red-500'
                                    }`}>
                                    {payment.status === 'approved' ? <CheckCircle className="h-4 w-4" /> :
                                        payment.status === 'pending' ? <Clock className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="font-mono font-medium text-foreground">₹{payment.amount}</span>
                                        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">{payment.status}</span>
                                    </div>
                                    <div className="text-[10px] text-muted-foreground font-mono">
                                        {new Date(payment.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 bg-secondary/5 rounded-sm border border-border text-center text-muted-foreground text-xs font-mono uppercase tracking-widest">
                            No payments recorded.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

import { currentUser } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Clock, Calendar, CheckCircle, AlertCircle, ArrowRight, CreditCard } from 'lucide-react'

export default async function DashboardPage() {
    const user = await currentUser()
    const supabase = createClient()

    if (!user) return <div>Loading...</div>

    // Fetch Booking Status
    const { data: profile } = await supabase.from('profiles').select('id').eq('clerk_user_id', user.id).single()

    let activeBooking = null
    let latestPayment = null

    if (profile) {
        const { data: booking } = await supabase
            .from('bookings')
            .select('*, seat:seats(*)')
            .eq('user_id', profile.id)
            .eq('status', 'active')
            .single()
        activeBooking = booking

        const { data: payment } = await supabase
            .from('payments')
            .select('*')
            .eq('user_id', profile.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()
        latestPayment = payment
    }

    // Date formatting helper
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    }

    return (
        <div className="space-y-8">
            {/* 1. Welcome Section */}
            <div className="bg-secondary/10 border border-border rounded-sm p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Clock className="h-48 w-48 -mr-12 -mt-12 text-foreground" />
                </div>
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-3xl font-display font-medium mb-2 text-foreground">Welcome back, {user.firstName || 'User'}</h1>
                    <p className="text-muted-foreground text-lg mb-6 font-light">
                        "Silence is the ultimate luxury."
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="bg-background/50 px-4 py-2 rounded-sm border border-border flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono text-sm text-foreground">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 2. Current Booking Status */}
                <div className="bg-background p-6 rounded-sm border border-border">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-display font-medium text-foreground flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-muted-foreground" />
                            Current Seat
                        </h2>
                        {activeBooking ? (
                            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-sm text-[10px] font-mono font-bold uppercase tracking-widest">Active</span>
                        ) : (
                            <span className="bg-secondary text-muted-foreground px-3 py-1 rounded-sm text-[10px] font-mono font-bold uppercase tracking-widest">Inactive</span>
                        )}
                    </div>

                    {activeBooking ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-secondary/10 rounded-sm border border-border">
                                <div>
                                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">Seat Number</p>
                                    <p className="text-4xl font-display text-foreground">{activeBooking.seat.seat_number}</p>
                                </div>
                                <div className="h-12 w-12 border border-border rounded-full flex items-center justify-center text-foreground">
                                    <Clock className="h-6 w-6" />
                                </div>
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground px-1 font-mono">
                                <span>Valid until</span>
                                <span className="text-foreground">{formatDate(activeBooking.end_date)}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="h-16 w-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-border text-muted-foreground">
                                <AlertCircle className="h-8 w-8" />
                            </div>
                            <h3 className="font-display font-medium text-foreground mb-1">No Active Plan</h3>
                            <p className="text-muted-foreground text-sm mb-6 font-mono">You don't have a reserved seat at the moment.</p>
                            <Link href="/dashboard/book-seat" className="inline-flex items-center justify-center px-6 py-3 bg-foreground text-background rounded-sm hover:bg-foreground/90 transition text-xs font-mono font-bold uppercase tracking-widest">
                                Book Now <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                    )}
                </div>

                {/* 3. Payment Status */}
                <div className="bg-background p-6 rounded-sm border border-border">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-display font-medium text-foreground flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-muted-foreground" />
                            Payment Status
                        </h2>
                    </div>

                    {latestPayment ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-secondary/10 rounded-sm border border-border">
                                <div className={`h-12 w-12 rounded-sm flex items-center justify-center shrink-0 border border-border ${latestPayment.status === 'approved' ? 'bg-transparent text-foreground' : 'text-muted-foreground'}`}>
                                    <CreditCard className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-foreground font-display">Monthly Subscription</h4>
                                    <p className="text-xs font-mono text-muted-foreground">{formatDate(latestPayment.created_at)}</p>
                                </div>
                                <div className={`px-3 py-1 rounded-sm text-[10px] font-mono font-bold uppercase tracking-widest ${latestPayment.status === 'approved' ? 'bg-foreground text-background' : 'bg-secondary text-muted-foreground'}`}>
                                    {latestPayment.status}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-muted-foreground font-mono text-sm">No payment history found.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

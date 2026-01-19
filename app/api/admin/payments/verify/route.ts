import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { paymentId, bookingId, seatId } = await request.json()

        if (!paymentId || !bookingId) {
            return NextResponse.json({ error: 'Missing Data' }, { status: 400 })
        }

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        // 1. Update Payment
        const { error: paymentError } = await supabase
            .from('payments')
            .update({
                status: 'approved', // or 'verified' based on user request, let's use 'approved'
                verified_by: user.id,
                verified_at: new Date().toISOString()
            })
            .eq('id', paymentId)

        if (paymentError) throw paymentError

        // 2. Update Booking
        const { error: bookingError } = await supabase
            .from('bookings')
            .update({
                status: 'active',
                registration_fee_paid: true
            })
            .eq('id', bookingId)

        if (bookingError) throw bookingError

        // 3. Update Seat (Mark as not available/occupied)
        // Actually, our seat grid logic uses 'active' bookings to determine occupancy.
        // But user requested: "Update seats table: is_available = false"
        // Let's do as requested, although strictly not needed if we check bookings.
        if (seatId) {
            await supabase
                .from('seats')
                .update({ is_available: false })
                .eq('id', seatId)
        }

        return NextResponse.json({ success: true })

    } catch (error: any) {
        console.error('Verify Error:', error)
        return NextResponse.json({ error: error.message || 'Verification failed' }, { status: 500 })
    }
}

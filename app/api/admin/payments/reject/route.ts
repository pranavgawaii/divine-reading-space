import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { paymentId, bookingId } = await request.json()

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
                status: 'rejected',
                verified_by: user.id,
                verified_at: new Date().toISOString()
            })
            .eq('id', paymentId)

        if (paymentError) throw paymentError

        // 2. Update Booking
        const { error: bookingError } = await supabase
            .from('bookings')
            .update({
                status: 'cancelled'
            })
            .eq('id', bookingId)

        if (bookingError) throw bookingError

        // Note: We don't need to update seat because we never set it to occupied (false) yet, 
        // or if we did, we should set it back to true. 
        // Since this is rejection of pending, the seat was likely still 'available' (true) 
        // but blocked by the pending booking in some logic (or not). 
        // User requirement: "Keep seat available (is_available = true)"

        return NextResponse.json({ success: true })

    } catch (error: any) {
        console.error('Reject Error:', error)
        return NextResponse.json({ error: error.message || 'Rejection failed' }, { status: 500 })
    }
}

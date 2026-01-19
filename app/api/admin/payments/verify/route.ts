import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'

export async function POST(request: Request) {
    try {
        const { paymentId, bookingId, seatId } = await request.json()

        if (!paymentId || !bookingId) {
            return NextResponse.json({ error: 'Missing Data' }, { status: 400 })
        }

        // 1. Check Auth & Admin (Clerk)
        const user = await currentUser()
        if (!user || user.publicMetadata?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 2. Init DB
        const supabase = createClient()

        // 3. Resolve Admin Profile ID (for "verified_by" log)
        const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('clerk_user_id', user.id)
            .single()

        if (!profile) return NextResponse.json({ error: 'Admin Profile not found' }, { status: 404 })

        // 4. Update Payment
        const { error: paymentError } = await supabase
            .from('payments')
            .update({
                status: 'approved',
                verified_by: profile.id,
                verified_at: new Date().toISOString()
            })
            .eq('id', paymentId)

        if (paymentError) throw paymentError

        // 5. Update Booking
        const { error: bookingError } = await supabase
            .from('bookings')
            .update({
                status: 'active',
                registration_fee_paid: true
            })
            .eq('id', bookingId)

        if (bookingError) throw bookingError

        // 6. Update Seat
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

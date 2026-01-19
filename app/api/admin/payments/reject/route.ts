import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: Request) {
    try {
        const { paymentId, bookingId } = await request.json()

        if (!paymentId || !bookingId) {
            return NextResponse.json({ error: 'Missing Data' }, { status: 400 })
        }

        // 1. Check Auth (Clerk)
        const { userId: clerkUserId } = auth()
        if (!clerkUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        // 2. Init Admin Client
        const supabase = await createAdminClient()

        // 3. Resolve Admin Profile ID
        const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('clerk_user_id', clerkUserId)
            .single()

        if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

        // 4. Update Payment
        const { error: paymentError } = await supabase
            .from('payments')
            .update({
                status: 'rejected',
                verified_by: profile.id,
                verified_at: new Date().toISOString()
            })
            .eq('id', paymentId)

        if (paymentError) throw paymentError

        // 5. Update Booking
        const { error: bookingError } = await supabase
            .from('bookings')
            .update({
                status: 'cancelled'
            })
            .eq('id', bookingId)

        if (bookingError) throw bookingError

        return NextResponse.json({ success: true })

    } catch (error: any) {
        console.error('Reject Error:', error)
        return NextResponse.json({ error: error.message || 'Rejection failed' }, { status: 500 })
    }
}

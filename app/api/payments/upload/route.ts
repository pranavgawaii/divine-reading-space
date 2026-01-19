import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File
        const seatId = formData.get('seatId') as string

        if (!file || !seatId) {
            return NextResponse.json({ error: 'Missing file or seatId' }, { status: 400 })
        }

        // 1. Check Auth (Clerk)
        const { userId: clerkUserId } = auth()
        if (!clerkUserId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 2. Initialize Admin DB Client
        const supabase = await createAdminClient()

        // 3. Resolve Supabase Profile ID from Clerk ID
        const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('clerk_user_id', clerkUserId)
            .single()

        if (!profile) {
            return NextResponse.json({ error: 'Profile not found. Please re-login.' }, { status: 404 })
        }
        const userUuid = profile.id

        // 4. Upload File to Storage
        // Note: Admin client bypasses RLS, so this works.
        const fileExt = file.name.split('.').pop()
        const fileName = `${userUuid}/${Date.now()}.${fileExt}`

        const { error: uploadError, data: uploadData } = await supabase.storage
            .from('payment-screenshots')
            .upload(fileName, file)

        if (uploadError) {
            console.error('Upload Error:', uploadError)
            return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
        }

        // 5. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('payment-screenshots')
            .getPublicUrl(fileName)

        // 6. Create Booking & Payment

        // A. Create Booking
        const startDate = new Date().toISOString()
        const endDate = new Date()
        endDate.setDate(endDate.getDate() + 30)

        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .insert({
                user_id: userUuid,
                seat_id: seatId,
                start_date: startDate,
                end_date: endDate.toISOString(),
                status: 'pending',
                amount: 1000,
                registration_fee_paid: false
            })
            .select()
            .single()

        if (bookingError) {
            console.error('Booking Error:', bookingError)
            return NextResponse.json({ error: 'Failed to create booking. Seat might be taken.' }, { status: 400 })
        }

        // B. Create Payment
        const { error: paymentError } = await supabase
            .from('payments')
            .insert({
                booking_id: booking.id,
                user_id: userUuid,
                amount: 1000,
                payment_type: 'registration',
                screenshot_url: publicUrl,
                status: 'pending'
            })

        if (paymentError) {
            console.error('Payment Error:', paymentError)
            // Rollback booking
            await supabase.from('bookings').delete().eq('id', booking.id)
            return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 })
        }

        return NextResponse.json({ success: true })

    } catch (error: any) {
        console.error('Server error:', error)
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
    }
}

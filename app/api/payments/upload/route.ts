import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File
        const seatId = formData.get('seatId') as string

        if (!file || !seatId) {
            return NextResponse.json({ error: 'Missing file or seatId' }, { status: 400 })
        }

        // 1. Initialize Supabase
        const supabase = await createClient()

        // 2. Get User
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 3. Upload File to Storage
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`
        const { error: uploadError, data: uploadData } = await supabase.storage
            .from('payment-screenshots')
            .upload(fileName, file)

        if (uploadError) {
            console.error('Upload Error:', uploadError)
            return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
        }

        // 4. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('payment-screenshots')
            .getPublicUrl(fileName)

        // 5. Create Booking & Payment
        // We start a "transaction" conceptually. Supabase doesn't support multi-table transaction via API easily without functions,
        // so we'll do sequential inserts.

        // A. Create Booking
        const startDate = new Date().toISOString()
        // Add 30 days
        const endDate = new Date()
        endDate.setDate(endDate.getDate() + 30)

        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .insert({
                user_id: user.id,
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
                user_id: user.id,
                amount: 1000,
                payment_type: 'registration',
                screenshot_url: publicUrl,
                status: 'pending'
            })

        if (paymentError) {
            console.error('Payment Error:', paymentError)
            // Ideally we should rollback booking here
            await supabase.from('bookings').delete().eq('id', booking.id)
            return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 })
        }

        return NextResponse.json({ success: true })

    } catch (error: any) {
        console.error('Server error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

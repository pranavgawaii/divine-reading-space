import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'

// File validation constants
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'pdf']

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File
        const seatId = formData.get('seatId') as string

        // Basic validation
        if (!file || !seatId) {
            return NextResponse.json({
                error: 'Missing required fields',
                details: !file ? 'No file uploaded' : 'No seat selected'
            }, { status: 400 })
        }

        // File size validation
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({
                error: 'File too large',
                details: `File size must be less than 5MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`
            }, { status: 400 })
        }

        // File type validation
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            return NextResponse.json({
                error: 'Invalid file type',
                details: `Only JPG, PNG, and PDF files are allowed. You uploaded: ${file.type}`
            }, { status: 400 })
        }

        // File extension validation
        const fileExt = file.name.split('.').pop()?.toLowerCase()
        if (!fileExt || !ALLOWED_EXTENSIONS.includes(fileExt)) {
            return NextResponse.json({
                error: 'Invalid file extension',
                details: `File must have .jpg, .jpeg, .png, or .pdf extension`
            }, { status: 400 })
        }

        // 1. Check Auth (Clerk)
        const user = await currentUser()
        if (!user) {
            return NextResponse.json({
                error: 'Unauthorized',
                details: 'Please sign in to upload payment proof'
            }, { status: 401 })
        }

        // 2. Initialize DB Client
        const supabase = createClient()

        // 3. Resolve Supabase Profile ID from Clerk ID
        let { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('clerk_user_id', user.id)
            .single()

        // SELF-HEALING: If profile doesn't exist, create it now
        if (!profile) {
            console.log('Profile missing for payment. Creating now...')
            const { data: newProfile, error: createError } = await supabase
                .from('profiles')
                .insert({
                    clerk_user_id: user.id,
                    email: user.emailAddresses[0]?.emailAddress,
                    full_name: user.fullName || `${user.firstName} ${user.lastName}`,
                    phone: user.phoneNumbers[0]?.phoneNumber || null,
                })
                .select('id')
                .single()

            if (createError || !newProfile) {
                console.error('Failed to auto-create profile:', createError)
                return NextResponse.json({
                    error: 'Profile creation failed',
                    details: 'Could not create user profile. Please contact support.'
                }, { status: 500 })
            }
            profile = newProfile
        }

        const userUuid = profile.id

        // 4. Upload File to Storage
        const fileName = `${userUuid}/${Date.now()}.${fileExt}`

        // Convert File to ArrayBuffer for Supabase
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const { error: uploadError, data: uploadData } = await supabase.storage
            .from('payment-screenshots')
            .upload(fileName, buffer, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: false
            })

        if (uploadError) {
            console.error('Upload Error:', uploadError)

            // Provide specific error messages
            if (uploadError.message.includes('Bucket not found')) {
                return NextResponse.json({
                    error: 'Storage not configured',
                    details: 'Payment screenshot storage is not set up. Please contact admin.'
                }, { status: 500 })
            }

            if (uploadError.message.includes('Policy')) {
                return NextResponse.json({
                    error: 'Permission denied',
                    details: 'You do not have permission to upload files. Please contact support.'
                }, { status: 403 })
            }

            return NextResponse.json({
                error: 'Upload failed',
                details: uploadError.message || 'Failed to upload screenshot'
            }, { status: 500 })
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

            // Clean up uploaded file
            await supabase.storage.from('payment-screenshots').remove([fileName])

            return NextResponse.json({
                error: 'Booking failed',
                details: bookingError.message.includes('duplicate')
                    ? 'This seat is already booked'
                    : 'Failed to create booking. Please try again.'
            }, { status: 400 })
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

            // Rollback booking and file
            await supabase.from('bookings').delete().eq('id', booking.id)
            await supabase.storage.from('payment-screenshots').remove([fileName])

            return NextResponse.json({
                error: 'Payment record failed',
                details: 'Failed to save payment information. Please try again.'
            }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            message: 'Payment screenshot uploaded successfully! Admin will verify shortly.',
            bookingId: booking.id
        })

    } catch (error: any) {
        console.error('Server error:', error)
        return NextResponse.json({
            error: 'Server error',
            details: error.message || 'An unexpected error occurred. Please try again.'
        }, { status: 500 })
    }
}

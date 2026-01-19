import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  console.log('[API] Fetching pending payments...')
  try {
    // 1. Check Auth (Clerk)
    const { userId: clerkUserId } = auth()
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Initialize Admin Client
    const supabase = await createAdminClient()

    // 3. Verify Admin Role (Use Clerk ID to find Profile -> Admin User)
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('clerk_user_id', clerkUserId)
      .single()

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    const { data: admin } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', profile.id)
      .single()

    if (!admin) {
      console.error('[API] Forbidden: User is not an admin')
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 4. Fetch Payments
    const { data: payments, error: dbError } = await supabase
      .from('payments')
      .select(`
        *,
        booking:bookings (
          id,
          seat_id,
          seat:seats (
            id,
            seat_number
          )
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (dbError) {
      console.error('[API] DB Error:', dbError)
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    console.log(`[API] Found ${payments?.length} pending payments`)

    // 5. Manual Join for Profiles
    const userIds = Array.from(new Set(payments?.map(p => p.user_id) || []))
    let profilesMap: Record<string, any> = {}

    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, phone, avatar_url')
        .in('id', userIds)

      profiles?.forEach(p => {
        profilesMap[p.id] = p
      })
    }

    // 6. Attach Profile Data
    const enrichedPayments = payments?.map(p => ({
      ...p,
      profile: profilesMap[p.user_id] || { full_name: 'Unknown', phone: 'N/A' }
    }))

    return NextResponse.json({ payments: enrichedPayments })

  } catch (error: any) {
    console.error('[API] Server Critical Error:', error)
    return NextResponse.json({ error: 'Internal server error: ' + error.message }, { status: 500 })
  }
}

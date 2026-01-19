import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  console.log('[API] Fetching pending payments...')
  try {
    // 1. Check Auth & Admin Role (Clerk Metadata)
    const user = await currentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = user.publicMetadata?.role === 'admin'
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 2. Initialize Supabase (No RLS)
    const supabase = createClient()

    // 3. Fetch Payments
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

    // 4. Manual Join for Profiles
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

    // 5. Attach Profile Data
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

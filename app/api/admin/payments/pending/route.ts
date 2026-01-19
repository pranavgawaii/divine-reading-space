import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  console.log('[API] Fetching pending payments...')
  try {
    const supabase = await createClient()

    // 1. Check User
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('[API] Auth Error:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.log('[API] User:', user.id)

    // 2. Check Admin Role (Optional but recommended)
    // const { data: admin } = await supabase.from('admin_users').select('role').eq('user_id', user.id).single()
    // if (!admin) {
    //    console.error('[API] Not an admin')
    //    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    // }

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

    console.log(`[API] Found ${payments?.length} pending payments`)

    // 4. Manual Join for Profiles (to be safe against Join issues)
    // We'll fetch profiles for all unique user_ids in the result
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

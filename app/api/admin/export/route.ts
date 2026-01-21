import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'payments' | 'bookings'

    const supabase = createClient()

    if (type === 'payments') {
        const { data } = await supabase
            .from('payments')
            .select(`
                id,
                amount,
                status,
                created_at,
                profile:profiles(full_name, email, phone),
                booking:bookings(seat:seats(seat_number))
            `)
            .order('created_at', { ascending: false })

        const csv = [
            ['ID', 'Name', 'Email', 'Phone', 'Amount', 'Seat', 'Status', 'Date'].join(','),
            ...(data || []).map((p: any) => [
                p.id,
                `"${p.profile?.full_name || ''}"`,
                p.profile?.email || '',
                p.profile?.phone || '',
                p.amount,
                p.booking?.seat?.seat_number || 'N/A',
                p.status,
                new Date(p.created_at).toISOString()
            ].join(','))
        ].join('\n')

        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="payments-${new Date().toISOString().split('T')[0]}.csv"`
            }
        })
    }

    if (type === 'bookings') {
        const { data } = await supabase
            .from('bookings')
            .select(`
                id,
                status,
                start_date,
                end_date,
                amount,
                created_at,
                profile:profiles(full_name, email, phone),
                seat:seats(seat_number)
            `)
            .order('created_at', { ascending: false })

        const csv = [
            ['ID', 'Name', 'Email', 'Phone', 'Seat', 'Status', 'Start Date', 'End Date', 'Amount', 'Created At'].join(','),
            ...(data || []).map((b: any) => [
                b.id,
                `"${b.profile?.full_name || ''}"`,
                b.profile?.email || '',
                b.profile?.phone || '',
                b.seat?.seat_number || 'N/A',
                b.status,
                b.start_date,
                b.end_date,
                b.amount,
                new Date(b.created_at).toISOString()
            ].join(','))
        ].join('\n')

        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="bookings-${new Date().toISOString().split('T')[0]}.csv"`
            }
        })
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
}

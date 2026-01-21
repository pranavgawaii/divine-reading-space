import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/dashboard-shell'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await currentUser()

    if (!user) {
        redirect('/sign-in')
    }

    // Sync user to Supabase
    const supabase = createClient()
    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('clerk_user_id', user.id)
        .single()

    if (!profile) {
        await supabase.from('profiles').insert({
            clerk_user_id: user.id,
            email: user.emailAddresses[0]?.emailAddress,
            full_name: user.fullName || `${user.firstName} ${user.lastName}`,
            phone: user.phoneNumbers[0]?.phoneNumber || null,
        })
    }

    const userProfile = {
        fullName: user.fullName || `${user.firstName} ${user.lastName}`,
        email: user.emailAddresses[0]?.emailAddress || '',
    }

    return (
        <DashboardShell userProfile={userProfile}>
            {children}
        </DashboardShell>
    )
}

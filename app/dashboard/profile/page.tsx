'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Loader2, User, Phone, Mail } from 'lucide-react'

export default function ProfilePage() {
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProfile = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                // Get profile data
                const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
                if (data) {
                    setProfile({ ...data, email: user.email })
                }
            }
            setLoading(false)
        }
        fetchProfile()
    }, [])

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">
                        {profile?.full_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{profile?.full_name || 'User'}</h2>
                        <p className="text-gray-500">Student</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                        <div className="flex items-center gap-3 text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <Mail className="h-5 w-5 text-gray-400" />
                            {profile?.email}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                        <div className="flex items-center gap-3 text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <Phone className="h-5 w-5 text-gray-400" />
                            {profile?.phone || 'Not provided'}
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                    <button className="text-blue-600 font-medium hover:underline text-sm disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                        Edit Profile (Coming Soon)
                    </button>
                </div>
            </div>
        </div>
    )
}

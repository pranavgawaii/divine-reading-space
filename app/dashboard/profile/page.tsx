import { currentUser } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'
import { User, Mail, Phone, Calendar } from 'lucide-react'

export default async function ProfilePage() {
    const user = await currentUser()
    if (!user) return null

    const supabase = createClient()
    const { data: profile } = await supabase.from('profiles').select('*').eq('clerk_user_id', user.id).single()

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">My Profile</h1>
            <p className="text-slate-500 mb-8">Manage your personal information.</p>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-6">
                        <img src={user.imageUrl} alt={user.firstName || 'User'} className="h-24 w-24 rounded-full border-4 border-white shadow-md" />
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">{user.fullName}</h2>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Student
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-medium text-slate-500 mb-1 block">Full Name</label>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-900">
                                <User className="h-4 w-4 text-slate-400" />
                                {user.fullName}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-500 mb-1 block">Email Address</label>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-900">
                                <Mail className="h-4 w-4 text-slate-400" />
                                {user.emailAddresses[0].emailAddress}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-500 mb-1 block">Phone Number</label>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-900">
                                <Phone className="h-4 w-4 text-slate-400" />
                                {profile?.phone || 'Not provided'}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-500 mb-1 block">Member Since</label>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-900">
                                <Calendar className="h-4 w-4 text-slate-400" />
                                {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

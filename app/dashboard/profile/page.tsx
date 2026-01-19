'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Loader2, User, Phone, Mail, Shield, Save, Camera } from 'lucide-react'

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        bio: ''
    })

    const supabase = createClient()

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUser(user)

                // Fetch existing profile data if you have a profiles table
                const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

                setFormData({
                    full_name: profile?.full_name || user.user_metadata.full_name || '',
                    phone: profile?.phone || user.user_metadata.phone || '',
                    bio: profile?.bio || ''
                })
            }
            setLoading(false)
        }
        fetchUser()
    }, [])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        const { error } = await supabase
            .from('profiles')
            .upsert({
                id: user.id,
                ...formData,
                updated_at: new Date().toISOString()
            })

        if (!error) {
            // Success Message
        }
        setSaving(false)
    }

    if (loading) return (
        <div className="flex h-[50vh] items-center justify-center flex-col gap-4">
            <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        </div>
    )

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Account Settings</h1>

            <div className="relative mb-12">
                <div className="h-32 w-full bg-slate-900 rounded-t-3xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-90" />
                </div>
                <div className="absolute -bottom-10 left-8">
                    <div className="relative group">
                        <div className="h-24 w-24 rounded-2xl bg-white p-1 shadow-xl">
                            <div className="h-full w-full bg-slate-100 rounded-xl flex items-center justify-center text-3xl font-bold text-slate-400">
                                {formData.full_name?.[0] || 'U'}
                            </div>
                        </div>
                        <button className="absolute -bottom-2 -right-2 p-2 bg-slate-900 text-white rounded-full shadow-lg hover:scale-110 transition">
                            <Camera className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSave} className="bg-white rounded-b-3xl rounded-t-lg border border-slate-200 shadow-sm p-8 pt-16">

                <div className="grid gap-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                        <div className="relative opacity-70">
                            <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                            <input
                                type="email"
                                disabled
                                value={user.email}
                                className="w-full pl-11 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl cursor-not-allowed text-slate-500"
                            />
                        </div>
                        <p className="text-xs text-slate-400 ml-1">Email cannot be changed directly.</p>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex items-center justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70"
                        >
                            {saving ? <Loader2 className="animate-spin h-5 w-5" /> : <><Save className="h-5 w-5" /> Save Changes</>}
                        </button>
                    </div>
                </div>
            </form>

            <div className="mt-8 bg-slate-900 text-white p-6 rounded-3xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center">
                        <Shield className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-bold">Security</h3>
                        <p className="text-slate-400 text-sm">Manage your password and security settings.</p>
                    </div>
                </div>
                <button className="text-sm font-bold text-blue-400 hover:text-white transition">Update &rarr;</button>
            </div>
        </div>
    )
}

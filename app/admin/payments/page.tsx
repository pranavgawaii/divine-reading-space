'use client'

import { useState, useEffect } from 'react'
// Card component import removed as it does not exist yet
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Check, X, ExternalLink, Loader2, Search, Download } from 'lucide-react'
import { toast } from "sonner"

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchPayments()
    }, [])

    const fetchPayments = async () => {
        const res = await fetch('/api/admin/payments/pending')
        const data = await res.json()
        if (data.payments) setPayments(data.payments)
        setLoading(false)
    }

    const handleAction = async (paymentId: string, bookingId: string, seatId: string, action: 'verify' | 'reject') => {
        setActionLoading(paymentId)
        try {
            const res = await fetch(`/api/admin/payments/${action}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId, bookingId, seatId })
            })

            if (res.ok) {
                toast.success(action === 'verify' ? 'Payment approved' : 'Payment rejected')
                setPayments(prev => prev.filter(p => p.id !== paymentId))
            } else {
                toast.error('Action failed')
            }
        } catch (e) {
            toast.error('Error performing action')
        } finally {
            setActionLoading(null)
        }
    }

    const filteredPayments = payments.filter(payment =>
        payment.profile.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.profile.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.amount.toString().includes(searchQuery)
    )

    if (loading) {
        return (
            <div>
                <div className="mb-6">
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-4 w-96" />
                </div>

                <div className="grid gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-start">
                            <Skeleton className="w-full md:w-48 h-64 rounded-xl" />
                            <div className="flex-1 w-full">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="space-y-2">
                                        <Skeleton className="h-6 w-48" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                                    <Skeleton className="h-16 rounded-lg" />
                                    <Skeleton className="h-16 rounded-lg" />
                                    <Skeleton className="h-16 rounded-lg" />
                                </div>

                                <div className="flex gap-3">
                                    <Skeleton className="h-12 flex-1 rounded-lg" />
                                    <Skeleton className="h-12 flex-1 rounded-lg" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Payment Verification</h1>
                    <p className="text-slate-500">Verify user payment screenshots to activate seats.</p>
                </div>
                <div className="w-full md:w-72 relative flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-white"
                        />
                    </div>
                    <a
                        href="/api/admin/export?type=payments"
                        className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 h-10 w-10 flex items-center justify-center rounded-lg transition-colors"
                        title="Export CSV"
                    >
                        <Download className="h-4 w-4" />
                    </a>
                </div>
            </div>

            <div className="grid gap-6">
                {filteredPayments.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                        <p className="text-slate-500">No pending payments found.</p>
                    </div>
                ) : filteredPayments.map(payment => (
                    <div key={payment.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-start">
                        {/* Screenshot Thumbnail */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <div className="w-full md:w-48 h-64 bg-slate-100 rounded-xl overflow-hidden relative group shrink-0 cursor-pointer border border-slate-100">
                                    <img src={payment.screenshot_url} alt="Proof" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                        <ExternalLink className="h-6 w-6" />
                                    </div>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto p-0 border-0 bg-transparent shadow-none">
                                <img src={payment.screenshot_url} alt="Proof Full" className="w-full h-auto rounded-lg shadow-2xl" />
                            </DialogContent>
                        </Dialog>

                        {/* Details */}
                        <div className="flex-1 w-full">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">{payment.profile.full_name}</h3>
                                    <p className="text-slate-500 text-sm">{payment.profile.phone || 'No phone'}</p>
                                </div>
                                <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Pending</div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                                <div className="p-3 bg-slate-50 rounded-lg">
                                    <p className="text-slate-500 text-xs uppercase tracking-wider">Amount</p>
                                    <p className="font-semibold text-slate-900">₹{payment.amount}</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg">
                                    <p className="text-slate-500 text-xs uppercase tracking-wider">Seat</p>
                                    <p className="font-semibold text-slate-900">{payment.booking?.seat?.seat_number || 'N/A'}</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg">
                                    <p className="text-slate-500 text-xs uppercase tracking-wider">Date</p>
                                    <p className="font-semibold text-slate-900">{new Date(payment.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleAction(payment.id, payment.booking_id, payment.booking?.seat_id, 'verify')}
                                    disabled={actionLoading === payment.id}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                >
                                    {actionLoading === payment.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleAction(payment.id, payment.booking_id, payment.booking?.seat_id, 'reject')}
                                    disabled={actionLoading === payment.id}
                                    className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                >
                                    <X className="h-4 w-4" /> Reject
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

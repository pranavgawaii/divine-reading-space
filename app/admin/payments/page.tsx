'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card' // Assuming we can verify later, for now sticking to standard divs to be safe
import { Check, X, ExternalLink, Loader2 } from 'lucide-react'

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)

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
                body: JSON.stringify({ paymentId, bookingId, seatId }) // seatId optional for reject
            })

            if (res.ok) {
                setPayments(prev => prev.filter(p => p.id !== paymentId))
            } else {
                alert('Action failed')
            }
        } catch (e) {
            alert('Error performing action')
        } finally {
            setActionLoading(null)
        }
    }

    if (loading) return <div>Loading...</div>

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Payment Verification</h1>
                <p className="text-slate-500">Verify user payment screenshots to activate seats.</p>
            </div>

            <div className="grid gap-6">
                {payments.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                        <p className="text-slate-500">No pending payments.</p>
                    </div>
                ) : payments.map(payment => (
                    <div key={payment.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-start">
                        {/* Screenshot Thumbnail */}
                        <div className="w-full md:w-48 h-64 bg-slate-100 rounded-xl overflow-hidden relative group shrink-0">
                            <img src={payment.screenshot_url} alt="Proof" className="w-full h-full object-cover" />
                            <a href={payment.screenshot_url} target="_blank" className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                <ExternalLink className="h-6 w-6" />
                            </a>
                        </div>

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
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                                >
                                    {actionLoading === payment.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleAction(payment.id, payment.booking_id, payment.booking?.seat_id, 'reject')}
                                    disabled={actionLoading === payment.id}
                                    className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
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

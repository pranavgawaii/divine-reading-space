'use client'

import { useState, useEffect } from 'react'
import { Loader2, CheckCircle, XCircle, Search, Eye } from 'lucide-react'
import { clsx } from 'clsx'
import { createClient } from '@/lib/supabase/client'

type Payment = {
    id: string
    amount: number
    created_at: string
    screenshot_url: string
    status: string
    booking: {
        id: string
        seat: {
            seat_number: string
            id: string
        } | null
    }
    profile: {
        full_name: string
        phone: string
    }
}

export default function AdminPaymentsPage() {
    const [activeTab, setActiveTab] = useState<'pending' | 'verified'>('pending')
    const [payments, setPayments] = useState<Payment[]>([])
    const [loading, setLoading] = useState(true)
    const [processingId, setProcessingId] = useState<string | null>(null)
    const [previewImage, setPreviewImage] = useState<string | null>(null)

    useEffect(() => {
        fetchPayments()
    }, [activeTab])

    const fetchPayments = async () => {
        setLoading(true)
        try {
            if (activeTab === 'pending') {
                const res = await fetch('/api/admin/payments/pending')
                const data = await res.json()
                if (data.payments) setPayments(data.payments)
            } else {
                // Placeholder for Verified (can share same API with status param)
                const supabase = createClient()
                const { data } = await supabase
                    .from('payments')
                    .select(`
            *,
            booking:bookings (id, seat:seats(seat_number)),
            profile:profiles (full_name, phone)
           `)
                    .in('status', ['approved', 'verified'])
                    .order('verified_at', { ascending: false })

                if (data) setPayments(data as any)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleApprove = async (payment: Payment) => {
        if (!confirm(`Approve payment for ${payment.profile?.full_name}?`)) return
        setProcessingId(payment.id)
        try {
            const res = await fetch('/api/admin/payments/verify', {
                method: 'POST',
                body: JSON.stringify({
                    paymentId: payment.id,
                    bookingId: payment.booking?.id,
                    seatId: payment.booking?.seat?.id // Pass seat ID to mark as occupied
                })
            })
            if (res.ok) {
                setPayments(prev => prev.filter(p => p.id !== payment.id))
                alert('Payment Approved!')
            } else {
                alert('Failed to approve')
            }
        } catch (e) {
            console.error(e)
        } finally {
            setProcessingId(null)
        }
    }

    const handleReject = async (payment: Payment) => {
        if (!confirm(`Reject payment? This will cancel the booking.`)) return
        setProcessingId(payment.id)
        try {
            const res = await fetch('/api/admin/payments/reject', {
                method: 'POST',
                body: JSON.stringify({
                    paymentId: payment.id,
                    bookingId: payment.booking?.id
                })
            })
            if (res.ok) {
                setPayments(prev => prev.filter(p => p.id !== payment.id))
                alert('Payment Rejected')
            }
        } catch (e) {
            console.error(e)
        } finally {
            setProcessingId(null)
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment Verification</h1>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200 mb-6">
                <button
                    onClick={() => setActiveTab('pending')}
                    className={clsx(
                        "pb-3 px-4 font-medium text-sm transition relative",
                        activeTab === 'pending' ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    Pending
                </button>
                <button
                    onClick={() => setActiveTab('verified')}
                    className={clsx(
                        "pb-3 px-4 font-medium text-sm transition relative",
                        activeTab === 'verified' ? "text-green-600 border-b-2 border-green-600" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    Verified History
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin text-gray-400" /></div>
            ) : payments.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                    No {activeTab} payments found.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {payments.map((payment) => (
                        <div key={payment.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center">
                            {/* Screenshot Thumbnail */}
                            <div
                                className="w-20 h-20 bg-gray-100 rounded-lg shrink-0 overflow-hidden cursor-pointer border border-gray-200"
                                onClick={() => setPreviewImage(payment.screenshot_url)}
                            >
                                {payment.screenshot_url ? (
                                    <img src={payment.screenshot_url} alt="Proof" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                                )}
                            </div>

                            {/* Details */}
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-gray-900">{payment.profile?.full_name || 'Unknown User'}</h3>
                                    <span className="text-sm font-bold text-blue-800">₹{payment.amount}</span>
                                </div>
                                <p className="text-sm text-gray-500 mb-1">
                                    Seat: <span className="font-medium text-gray-900">{payment.booking?.seat?.seat_number || 'N/A'}</span>
                                </p>
                                <p className="text-xs text-gray-400">
                                    {new Date(payment.created_at).toLocaleDateString()} at {new Date(payment.created_at).toLocaleTimeString()}
                                </p>
                            </div>

                            {/* Actions */}
                            {activeTab === 'pending' && (
                                <div className="flex gap-2 w-full md:w-auto">
                                    <button
                                        onClick={() => handleReject(payment)}
                                        disabled={!!processingId}
                                        className="flex-1 md:flex-none px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 font-medium text-sm flex items-center justify-center gap-2 transition"
                                    >
                                        <XCircle className="h-4 w-4" />
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleApprove(payment)}
                                        disabled={!!processingId}
                                        className="flex-1 md:flex-none px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 font-medium text-sm flex items-center justify-center gap-2 transition"
                                    >
                                        {processingId === payment.id ? <Loader2 className="animate-spin h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                                        Approve
                                    </button>
                                </div>
                            )}
                            {activeTab === 'verified' && (
                                <div className="flex gap-2 w-full md:w-auto">
                                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-100">
                                        Verified
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Image Modal */}
            {previewImage && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setPreviewImage(null)}>
                    <img src={previewImage} alt="Full Preview" className="max-w-full max-h-[90vh] rounded-lg shadow-2xl" />
                    <button className="absolute top-4 right-4 text-white hover:text-gray-300">
                        <XCircle className="h-8 w-8" />
                    </button>
                </div>
            )}

        </div>
    )
}

'use client'

import { useState, useEffect, type ChangeEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Upload, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PaymentPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const seatId = searchParams.get('seatId')
    const seatNum = searchParams.get('seatNum')

    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    // Redirect if no seat selected
    useEffect(() => {
        if (!seatId) {
            router.push('/dashboard/book-seat')
        }
    }, [seatId, router])

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (!selectedFile) return

        // Validate size (5MB)
        if (selectedFile.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB')
            return
        }

        // Validate type
        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(selectedFile.type)) {
            setError('Only JPG and PNG files are allowed')
            return
        }

        setFile(selectedFile)
        setPreviewUrl(URL.createObjectURL(selectedFile))
        setError(null)
    }

    const handleSubmit = async () => {
        if (!file || !seatId) return
        setUploading(true)
        setError(null)

        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('seatId', seatId)

            const response = await fetch('/api/payments/upload', {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed')
            }

            setSuccess(true)
            setTimeout(() => {
                router.push('/dashboard')
            }, 3000)

        } catch (err: any) {
            console.error(err)
            setError(err.message || 'Something went wrong')
        } finally {
            setUploading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center animate-in fade-in zoom-in duration-300">
                <div className="bg-green-100 p-4 rounded-full mb-6">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Submitted!</h2>
                <p className="text-gray-500 max-w-md mb-8">
                    Your booking for Seat {seatNum} is currently <strong>Processing</strong>.
                    We will verify your payment and approve it within 2-4 hours.
                </p>
                <p className="text-sm text-gray-400">Redirecting to dashboard...</p>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Link href="/dashboard/book-seat" className="flex items-center text-gray-500 mb-6 hover:text-blue-800 transition">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Seat Selection
            </Link>

            <h1 className="text-2xl font-bold text-gray-900 mb-8">Complete Your Booking</h1>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Order Summary</h2>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Selected Seat</span>
                        <span className="font-bold text-gray-900">{seatNum || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Subscription</span>
                        <span className="font-medium text-gray-900">₹800</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Registration Fee <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-2">One-time</span></span>
                        <span className="font-medium text-gray-900">₹200</span>
                    </div>
                    <div className="h-px bg-gray-100 my-4"></div>
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900 text-lg">Total Amount</span>
                        <span className="font-extrabold text-blue-800 text-3xl">₹1,000</span>
                    </div>
                </div>
            </div>

            {/* QR Code Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8 text-center overflow-hidden">
                <h3 className="font-bold text-gray-900 text-lg mb-6 tracking-tight">Scan & Pay via UPI</h3>

                <div className="w-56 h-56 relative overflow-hidden rounded-2xl border-2 border-slate-100 shadow-xl mx-auto mb-8 bg-black group">
                    <img
                        src="/images/payment-qr.jpg"
                        alt="Payment QR"
                        className="absolute w-[240%] max-w-none left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 transition-transform group-hover:scale-105 duration-500"
                    />
                    {/* Decorative corners */}
                    <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-white/30 rounded-tl-sm"></div>
                    <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-white/30 rounded-tr-sm"></div>
                    <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-white/30 rounded-bl-sm"></div>
                    <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-white/30 rounded-br-sm"></div>
                </div>

                <div className="space-y-3">
                    <p className="font-display font-medium text-slate-900 text-lg">Gawai Pranav Ganesh</p>
                    <div className="flex items-center justify-center gap-2">
                        <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                        <p className="text-sm text-slate-500 font-light">Verified Merchant Account</p>
                    </div>
                </div>
            </div>

            {/* Upload Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Upload Payment Proof</h3>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm flex items-start">
                        <AlertCircle className="h-5 w-5 mr-2 shrink-0" />
                        {error}
                    </div>
                )}

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition cursor-pointer relative">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {previewUrl ? (
                        <div className="relative">
                            <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-lg shadow-sm" />
                            <p className="mt-2 text-sm text-gray-500">{file?.name}</p>
                            <p className="text-blue-600 text-xs mt-1">Click to change</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center py-4">
                            <Upload className="h-8 w-8 text-gray-400 mb-3" />
                            <p className="font-medium text-gray-700">Click to upload screenshot</p>
                            <p className="text-sm text-gray-500 mt-1">JPG, PNG (Max 5MB)</p>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!file || uploading}
                    className="w-full mt-6 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition flex justify-center items-center"
                >
                    {uploading ? (
                        <>
                            <Loader2 className="animate-spin h-5 w-5 mr-2" />
                            Processing...
                        </>
                    ) : 'Submit Payment Proof'}
                </button>
            </div>
        </div>
    )
}

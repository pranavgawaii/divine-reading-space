'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Armchair, CheckCircle, X, AlertCircle, Upload, CreditCard, ScanLine, Loader2, ArrowRight } from 'lucide-react'

// Define the Seat interface
interface Seat {
    id: string
    seat_number: string
    is_available: boolean
}

export default function BookSeatPage() {
    const { user, isLoaded } = useUser()
    const router = useRouter()
    const supabase = createClient()

    const [seats, setSeats] = useState<Seat[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null)
    const [isBooking, setIsBooking] = useState(false)
    const [authError, setAuthError] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [fileLocal, setFile] = useState<File | null>(null)

    useEffect(() => {
        if (isLoaded && !user) {
            setAuthError(true)
        }
        fetchSeats()
    }, [isLoaded, user])

    const fetchSeats = async () => {
        const { data, error } = await supabase
            .from('seats')
            .select('*')
            .order('seat_number', { ascending: true })

        if (data) {
            const sorted = data.sort((a, b) => {
                const numA = parseInt(a.seat_number.replace(/\D/g, '')) || 0
                const numB = parseInt(b.seat_number.replace(/\D/g, '')) || 0
                return numA - numB
            })
            setSeats(sorted)
        }
        setLoading(false)
    }

    const handleBookClick = () => {
        if (!selectedSeat) return
        setModalOpen(true)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleFileUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedSeat || !fileLocal) return
        setIsBooking(true)

        const formData = new FormData()
        formData.append('seatId', selectedSeat.id)
        formData.append('file', fileLocal)

        try {
            const res = await fetch('/api/payments/upload', {
                method: 'POST',
                body: formData
            })

            const result = await res.json()

            if (!res.ok) {
                throw new Error(result.error || 'Upload failed')
            }

            // Success - Close Modal safely
            setModalOpen(false)
            router.push('/dashboard')

        } catch (error: any) {
            alert('Payment submission failed: ' + error.message)
        } finally {
            setIsBooking(false)
        }
    }

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-muted-foreground font-mono uppercase tracking-widest text-xs">
            <Loader2 className="h-6 w-6 animate-spin mb-4 text-foreground" />
            <p>Initializing...</p>
        </div>
    )

    if (authError) return <div className="p-8 text-center text-red-500 font-mono">Authentication Required.</div>

    return (
        <div className="space-y-8 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-display font-medium text-foreground tracking-tight">Select Workspace</h1>
                    <p className="text-muted-foreground mt-1 font-light">Designate your coordinates.</p>
                </div>
                <div className="flex gap-4 text-[10px] uppercase tracking-widest font-mono bg-secondary/10 px-4 py-2 rounded-sm border border-border">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-background border border-foreground rounded-full"></div>
                        <span className="text-foreground">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-secondary border border-border rounded-full"></div>
                        <span className="text-muted-foreground">Occupied</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary border border-primary rounded-full"></div>
                        <span className="text-primary">Selected</span>
                    </div>
                </div>
            </div>

            <div className="bg-background p-8 rounded-sm border border-border shadow-none">
                {/* Screen / Front Indicator */}
                <div className="w-full flex justify-center mb-12">
                    <div className="w-1/2 h-px bg-border relative">
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">Front Access</span>
                    </div>
                </div>

                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                    {seats.map((seat) => (
                        <button
                            key={seat.id}
                            disabled={!seat.is_available}
                            onClick={() => setSelectedSeat(seat)}
                            className={`
                                relative h-16 rounded-sm flex flex-col items-center justify-center transition-all duration-300 group border
                                ${!seat.is_available
                                    ? 'bg-secondary/20 border-border text-muted-foreground cursor-not-allowed opacity-40'
                                    : selectedSeat?.id === seat.id
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'bg-background border-border hover:border-foreground/50 hover:bg-secondary/5'
                                }
                            `}
                        >
                            <span className={`font-mono text-xs ${!seat.is_available ? 'text-muted-foreground' :
                                selectedSeat?.id === seat.id ? 'text-primary-foreground' : 'text-foreground'
                                }`}>{seat.seat_number}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Selection Bar */}
            <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-foreground text-background p-4 rounded-sm flex items-center justify-between gap-6 transition-all duration-500 z-40 transform border border-border ${selectedSeat ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0'}`}>
                <div className="flex items-center gap-6 pl-4">
                    <div>
                        <p className="text-[10px] text-background/60 font-mono font-bold uppercase tracking-widest">Selected</p>
                        <p className="text-2xl font-display font-medium text-background">{selectedSeat?.seat_number}</p>
                    </div>
                    <div className="h-8 w-px bg-background/20"></div>
                    <div>
                        <p className="text-[10px] text-background/60 font-mono font-bold uppercase tracking-widest">Fee</p>
                        <p className="text-xl font-mono text-background">₹1,000</p>
                    </div>
                </div>
                <button
                    onClick={handleBookClick}
                    className="bg-background text-foreground px-8 py-3 rounded-sm font-bold font-mono text-xs uppercase tracking-widest hover:bg-zinc-200 transition flex items-center gap-2 group"
                >
                    Book Now <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Premium Payment Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
                        onClick={() => setModalOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative bg-background border border-border/50 rounded-sm shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="absolute top-0 right-0 p-4 z-10">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="p-2 hover:bg-secondary/50 rounded-full transition text-muted-foreground"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row">
                            {/* Left: QR Section */}
                            <div className="bg-secondary/5 p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-border md:w-1/2">
                                <h3 className="font-display font-medium text-foreground mb-1">Scan to Pay</h3>
                                <p className="text-[10px] font-mono text-muted-foreground mb-6 uppercase tracking-wider">UPI: DIVINE@UPI</p>

                                <div className="bg-white p-2 rounded-sm mb-4">
                                    <img
                                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=divine@upi&pn=DivineReadingSpace&am=1000&cu=INR"
                                        alt="Payment QR"
                                        className="w-32 h-32"
                                    />
                                </div>

                                <div className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-sm text-xs font-mono">
                                    <CreditCard className="h-3 w-3" />
                                    <span>₹1,000.00</span>
                                </div>
                            </div>

                            {/* Right: Upload Section */}
                            <div className="p-8 md:w-1/2 flex flex-col justify-center">
                                <div className="mb-6">
                                    <h3 className="text-lg font-display font-medium text-foreground mb-1">Verification</h3>
                                    <p className="text-xs text-muted-foreground font-light leading-relaxed">Upload screenshot transaction proof.</p>
                                </div>

                                <form onSubmit={handleFileUpload} className="space-y-4">
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            id="file-upload"
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className={`
                                                flex flex-col items-center justify-center w-full h-32 border border-dashed rounded-sm cursor-pointer transition-all
                                                ${fileLocal ? 'border-primary bg-primary/5' : 'border-border hover:border-foreground/50 hover:bg-secondary/5'}
                                            `}
                                        >
                                            {fileLocal ? (
                                                <>
                                                    <CheckCircle className="h-6 w-6 text-primary mb-2" />
                                                    <span className="text-[10px] font-mono text-primary truncate max-w-[90%]">{fileLocal.name}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                                                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Upload Proof</span>
                                                </>
                                            )}
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isBooking || !fileLocal}
                                        className="w-full bg-foreground text-background py-3 rounded-sm font-mono text-xs font-bold uppercase tracking-widest hover:bg-foreground/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isBooking ? (
                                            <>
                                                <Loader2 className="h-3 w-3 animate-spin" /> Process
                                            </>
                                        ) : 'Confirm Now'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

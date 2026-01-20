import { createClient } from '@/lib/supabase/server'
import { Armchair } from 'lucide-react'

export default async function AdminSeatsPage() {
    const supabase = createClient()

    // Fetch seats sorted beautifully
    const { data: seats } = await supabase.from('seats').select('*')

    // Sort logic safe for Server Component
    const sortedSeats = seats?.sort((a, b) => {
        const numA = parseInt(a.seat_number.replace(/\D/g, '')) || 0
        const numB = parseInt(b.seat_number.replace(/\D/g, '')) || 0
        return numA - numB
    }) || []

    return (
        <div>
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Seat Manager</h1>
                    <p className="text-slate-500">Overview of hall layout and availability.</p>
                </div>
                <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-white border border-green-500 rounded-full"></div>
                        <span>Empty</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-100 border border-red-500 rounded-full"></div>
                        <span>Occupied</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {sortedSeats.map((seat) => (
                    <div
                        key={seat.id}
                        className={`
                            relative h-24 rounded-xl border flex flex-col items-center justify-center
                            ${seat.is_available
                                ? 'bg-white border-green-200 hover:border-green-400'
                                : 'bg-red-50 border-red-100'
                            }
                        `}
                    >
                        <Armchair className={`h-8 w-8 mb-2 ${seat.is_available ? 'text-green-500' : 'text-red-300'}`} />
                        <span className={`font-bold text-sm ${seat.is_available ? 'text-slate-700' : 'text-red-400'}`}>
                            {seat.seat_number}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

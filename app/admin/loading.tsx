import { Skeleton } from "@/components/ui/skeleton"

export default function AdminLoading() {
    return (
        <div>
            <div className="mb-8">
                <Skeleton className="h-10 w-64 mb-2" />
                <Skeleton className="h-5 w-96" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white border border-slate-200 p-6 rounded-2xl relative overflow-hidden">
                        <div className="flex justify-between items-start mb-4">
                            <Skeleton className="h-12 w-12 rounded-xl" />
                        </div>
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-8 w-24" />
                    </div>
                ))}
            </div>

            {/* Revenue Insight */}
            <Skeleton className="h-64 w-full rounded-2xl mb-8" />

            {/* Quick Actions */}
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
            </div>
        </div>
    )
}


import { CalendarDays, RefreshCw } from "lucide-react";

import { useMyAvailability } from "../availability.queries";
import AvailabilityCard from "./AvailabilityCard";

export default function AvailabilityList() {
    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useMyAvailability();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <RefreshCw className="animate-spin text-zinc-500" size={22} />
                <span className="ml-3 text-sm text-zinc-500">
                    Loading availability...
                </span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                <p className="text-sm text-red-600">
                    {error.message || "Failed to load availability slots."}
                </p>

                <button
                    type="button"
                    onClick={() => refetch()}
                    className="mt-3 text-sm font-medium text-red-700 underline"
                >
                    Try again
                </button>
            </div>
        );
    }

    const slots = data?.slots ?? [];

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-zinc-900">
                        Your availability
                    </h2>

                    <p className="mt-1 text-sm text-zinc-500">
                        Manage the time slots students can book.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="rounded-lg border border-zinc-200 p-2 text-zinc-600 hover:bg-zinc-50 disabled:opacity-50"
                    aria-label="Refresh availability"
                >
                    <RefreshCw
                        size={17}
                        className={isFetching ? "animate-spin" : ""}
                    />
                </button>
            </div>

            {slots.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 px-6 py-12 text-center">
                    <CalendarDays size={36} className="text-zinc-400" />

                    <h3 className="mt-4 font-medium text-zinc-800">
                        No availability slots yet
                    </h3>

                    <p className="mt-1 max-w-sm text-sm text-zinc-500">
                        Add your available dates and times so students can book
                        consultations with you.
                    </p>
                </div>
            ) : (
                <>
                    <p className="text-sm text-zinc-500">
                        {data?.pagination.total ?? slots.length} slot(s) available
                    </p>

                    <div className="space-y-3">
                        {slots.map((slot) => (
                            <AvailabilityCard key={slot._id} slot={slot} />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}

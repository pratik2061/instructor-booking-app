import { useState } from "react";
import { useMyBookings } from "../booking.queries";
import type { BookingStatus } from "../booking.types";
import BookingCard from "./BookingCard";

const filters: { label: string; value: BookingStatus | "all" }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending_payment" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
];

function BookingList() {
    const [status, setStatus] = useState<BookingStatus | "all">("all");
    const [page, setPage] = useState(1);

    const { data, isLoading, isError, refetch } = useMyBookings({
        page,
        limit: 10,
        ...(status !== "all" && { status }),
    });

    return (
        <section className="space-y-6">
            <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                    <button
                        key={filter.value}
                        type="button"
                        onClick={() => {
                            setStatus(filter.value);
                            setPage(1);
                        }}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${status === filter.value
                            ? "bg-slate-900 text-white"
                            : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {isLoading && (
                <p className="py-10 text-center text-slate-500">
                    Loading your consultations...
                </p>
            )}

            {isError && (
                <div className="py-10 text-center">
                    <p className="text-red-500">
                        Unable to load your consultations.
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="mt-3 text-indigo-600"
                    >
                        Try again
                    </button>
                </div>
            )}

            {!isLoading && !isError && data?.bookings.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center">
                    <h3 className="font-semibold text-slate-800">
                        No consultations found
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                        Your consultations will appear here after booking.
                    </p>
                </div>
            )}

            {!isLoading && !isError && data?.bookings && (
                <>
                    <div className="grid gap-4">
                        {data.bookings.map((booking) => (
                            <BookingCard
                                key={booking._id}
                                booking={booking}
                            />
                        ))}
                    </div>

                    {data.pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                disabled={!data.pagination.hasPreviousPage}
                                onClick={() => setPage((current) => current - 1)}
                                className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
                            >
                                Previous
                            </button>

                            <span className="text-sm text-slate-500">
                                Page {data.pagination.page} of{" "}
                                {data.pagination.totalPages}
                            </span>

                            <button
                                type="button"
                                disabled={!data.pagination.hasNextPage}
                                onClick={() => setPage((current) => current + 1)}
                                className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}

export default BookingList;
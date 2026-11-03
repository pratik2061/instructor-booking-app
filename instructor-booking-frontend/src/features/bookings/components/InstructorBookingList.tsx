import { useState } from "react";
import { useInstructorBookings } from "../booking.queries";
import type { BookingStatus } from "../booking.types";
import InstructorBookingCard from "./InstructorBookingCards";

type FilterStatus = BookingStatus | "all";

function InstructorBookingList() {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState<FilterStatus>("all");

    const { data, isLoading, isError, error, refetch } =
        useInstructorBookings({
            page,
            limit: 10,
            ...(status !== "all" ? { status } : {}),
        });

    const filters: FilterStatus[] = [
        "all",
        "pending_payment",
        "confirmed",
        "completed",
        "cancelled",
    ];

    if (isLoading) {
        return <p className="py-10 text-center text-gray-500">Loading consultations...</p>;
    }

    if (isError) {
        return (
            <div className="py-10 text-center">
                <p className="text-red-600">
                    {error instanceof Error
                        ? error.message
                        : "Unable to load consultations."}
                </p>
                <button
                    onClick={() => refetch()}
                    className="mt-3 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white"
                >
                    Try again
                </button>
            </div>
        );
    }

    return (
        <section>
            <div className="mb-6 flex flex-wrap gap-2">
                {filters.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => {
                            setStatus(filter);
                            setPage(1);
                        }}
                        className={`rounded-lg px-4 py-2 text-sm font-medium capitalize ${status === filter
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        {filter.replace("_", " ")}
                    </button>
                ))}
            </div>

            {!data?.bookings.length ? (
                <div className="rounded-xl border border-dashed border-gray-300 py-14 text-center">
                    <h3 className="font-semibold text-gray-800">
                        No consultations found
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                        Bookings from students will appear here.
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid gap-4">
                        {data.bookings.map((booking) => (
                            <InstructorBookingCard
                                key={booking._id}
                                booking={booking}
                            />
                        ))}
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                        <button
                            disabled={!data.pagination.hasPreviousPage}
                            onClick={() => setPage((current) => current - 1)}
                            className="rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Previous
                        </button>

                        <span className="text-sm text-gray-500">
                            Page {data.pagination.page} of{" "}
                            {Math.max(data.pagination.totalPages, 1)}
                        </span>

                        <button
                            disabled={!data.pagination.hasNextPage}
                            onClick={() => setPage((current) => current + 1)}
                            className="rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </section>
    );
}

export default InstructorBookingList;
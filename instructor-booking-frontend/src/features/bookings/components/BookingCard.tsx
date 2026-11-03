import { Video } from "lucide-react";
import type { Booking, BookingInstructor, BookingStatus } from "../booking.types";

interface Props {
    booking: Booking;
}

const statusStyles: Record<BookingStatus, string> = {
    pending_payment: "bg-amber-100 text-amber-700",
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-slate-100 text-slate-700",
};

function BookingCard({ booking }: Props) {
    const fee = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: booking.currency,
    }).format(booking.consultationFee / 100);

    const startDate = new Date(booking.startAt);
    const endDate = new Date(booking.endAt);

    const statusLabel = booking.status.replace("_", " ");

    const instructor =
        typeof booking.instructorId === "object"
            ? (booking.instructorId as BookingInstructor)
            : null;

    const instructorName =
        instructor && typeof instructor.userId === "object"
            ? instructor.userId.name
            : "Expert Instructor";

    const instructorIdString = instructor?._id || String(booking.instructorId);
    const meetingUrl =
        booking.meetingLink || `https://meet.jit.si/instructor-call-${booking._id}`;

    return (
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h3 className="font-semibold text-slate-900">
                        30-Minute Consultation with {instructorName}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        Booking ID: {booking._id}
                    </p>
                </div>

                <span
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyles[booking.status]}`}
                >
                    {statusLabel}
                </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                    <p className="text-xs text-slate-400">Date</p>
                    <p className="mt-1 text-sm font-medium text-slate-700">
                        {startDate.toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-slate-400">Time (30 mins)</p>
                    <p className="mt-1 text-sm font-medium text-slate-700">
                        {startDate.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                        {" – "}
                        {endDate.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-slate-400">Consultation fee</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                        {fee}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-slate-400">Instructor profile ID</p>
                    <p className="mt-1 break-all text-xs text-slate-500">
                        {instructorIdString}
                    </p>
                </div>
            </div>

            {booking.status === "confirmed" && (
                <div className="mt-5 border-t border-slate-100 pt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-emerald-600 font-medium">
                        ✓ Call confirmed and ready
                    </p>
                    <a
                        href={meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
                    >
                        <Video size={16} />
                        Join 30-min Video Call
                    </a>
                </div>
            )}
        </article>
    );
}

export default BookingCard;
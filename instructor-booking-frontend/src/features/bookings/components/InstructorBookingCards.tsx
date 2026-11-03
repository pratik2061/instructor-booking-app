import { Video } from "lucide-react";
import type { Booking, BookingStudent } from "../booking.types";

interface Props {
    booking: Booking;
}

function InstructorBookingCard({ booking }: Props) {
    const student = booking.studentId as BookingStudent;

    const statusStyles: Record<string, string> = {
        pending_payment: "bg-yellow-100 text-yellow-800",
        confirmed: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800",
        completed: "bg-blue-100 text-blue-800",
    };

    const formattedDate = new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(booking.startAt));

    const formattedEndTime = new Intl.DateTimeFormat("en-US", {
        timeStyle: "short",
    }).format(new Date(booking.endAt));

    const formattedFee = new Intl.NumberFormat("en-NP", {
        style: "currency",
        currency: booking.currency,
    }).format(booking.consultationFee / 100);

    const meetingUrl =
        booking.meetingLink || `https://meet.jit.si/instructor-call-${booking._id}`;

    return (
        <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h3 className="font-semibold text-gray-900">
                        {student?.name ?? "Student"}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                        {student?.email ?? "Email unavailable"}
                    </p>
                </div>

                <span
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyles[booking.status] ??
                        "bg-gray-100 text-gray-700"
                        }`}
                >
                    {booking.status.replace("_", " ")}
                </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div>
                    <p className="text-xs text-gray-500">Date and time (30 mins)</p>
                    <p className="mt-1 text-sm font-medium text-gray-800">
                        {formattedDate} – {formattedEndTime}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-gray-500">Consultation fee</p>
                    <p className="mt-1 text-sm font-medium text-gray-800">
                        {formattedFee}
                    </p>
                </div>
            </div>

            {booking.status === "confirmed" && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
                    <p className="text-xs font-medium text-emerald-600">
                        ✓ Student paid and confirmed
                    </p>
                    <a
                        href={meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
                    >
                        <Video size={16} />
                        Join 30-min Video Call
                    </a>
                </div>
            )}

            <p className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-400">
                Booking ID: {booking._id}
            </p>
        </article>
    );
}

export default InstructorBookingCard;
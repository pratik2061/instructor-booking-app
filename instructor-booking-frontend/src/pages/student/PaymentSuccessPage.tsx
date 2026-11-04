
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, Video, Calendar, ArrowRight } from "lucide-react";
import { paymentService, type VerifySessionResponse } from "../../features/payments/payment.service";
import { useToast } from "../../provider/toast-provider";

function PaymentSuccessPage() {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const toast = useToast();

    const [isLoading, setIsLoading] = useState(Boolean(sessionId));
    const [error, setError] = useState<string | null>(null);
    const [verificationData, setVerificationData] = useState<
        VerifySessionResponse["data"] | null
    >(null);

    useEffect(() => {
        if (!sessionId) return;

        let isMounted = true;
        setIsLoading(true);

        paymentService
            .verifyCheckoutSession(sessionId)
            .then((data) => {
                if (isMounted) {
                    setVerificationData(data);
                    setIsLoading(false);
                    toast.success("Payment verified! Your 30-minute consultation is booked.");
                }
            })
            .catch((err) => {
                if (isMounted) {
                    console.error("Verification failed:", err);
                    const message =
                        err?.response?.data?.message ||
                        "Could not verify session automatically, but your booking is being recorded.";
                    setError(message);
                    setIsLoading(false);
                    toast.error(message);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [sessionId]);

    if (isLoading) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center p-6">
                <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <Loader2 size={48} className="mx-auto animate-spin text-indigo-600" />
                    <h1 className="mt-5 text-xl font-bold text-slate-900">
                        Confirming Your Booking...
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Please wait while we verify your payment and prepare your 30-minute consultation slot.
                    </p>
                </div>
            </main>
        );
    }

    const booking = verificationData?.booking;
    const instructorName =
        booking?.instructorId?.userId?.name || "Your Instructor";
    const meetingUrl =
        booking?.meetingLink ||
        (booking?._id ? `https://meet.jit.si/instructor-call-${booking._id}` : null);

    const formattedStartDate = booking?.startAt
        ? new Date(booking.startAt).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        })
        : null;

    const formattedTime =
        booking?.startAt && booking?.endAt
            ? `${new Date(booking.startAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            })} – ${new Date(booking.endAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            })}`
            : null;

    return (
        <main className="flex min-h-[70vh] items-center justify-center p-6">
            <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <CheckCircle2 size={58} className="mx-auto text-emerald-500" />

                <h1 className="mt-4 text-2xl font-bold text-slate-900">
                    Payment Successful & Consultation Booked!
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                    Your 30-minute paid consultation with{" "}
                    <strong className="text-slate-800">{instructorName}</strong> is
                    confirmed.
                </p>

                {booking && formattedStartDate && formattedTime && (
                    <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4 text-left">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                            <Calendar size={18} className="text-indigo-600" />
                            <span>
                                {formattedStartDate} • {formattedTime} (30 mins)
                            </span>
                        </div>

                        {meetingUrl && (
                            <div className="mt-4 pt-3 border-t border-slate-200">
                                <a
                                    href={meetingUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
                                >
                                    <Video size={18} />
                                    Join 30-min Video Call Now
                                </a>
                                <p className="mt-1.5 text-center text-xs text-slate-400">
                                    You can also join at the scheduled time from your consultations page.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {error && (
                    <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
                        {error}
                    </p>
                )}

                {sessionId && (
                    <p className="mt-4 break-all text-xs text-slate-400">
                        Stripe Session ID: {sessionId}
                    </p>
                )}

                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/student/consultations"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
                    >
                        View My Consultations
                        <ArrowRight size={16} />
                    </Link>

                    <Link
                        to="/student/dashboard"
                        className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        Back to Instructors
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default PaymentSuccessPage;

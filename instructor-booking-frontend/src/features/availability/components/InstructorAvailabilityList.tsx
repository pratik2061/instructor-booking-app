import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useInstructorAvailability } from "../availability.queries";
import { useCreateCheckout } from "../../payments/payment.mutation";
import { useToast } from "../../../provider/toast-provider";

interface Props {
    instructorId: string;
}

function InstructorAvailabilityList({ instructorId }: Props) {
    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useInstructorAvailability(instructorId);
    const checkoutMutation = useCreateCheckout();
    const toast = useToast();
    const [pendingSlotId, setPendingSlotId] = useState<string | null>(null);

    if (isLoading) {
        return <p>Loading available slots...</p>;
    }

    if (isError) {
        return (
            <div>
                <p>Unable to load availability.</p>
                <button onClick={() => refetch()}>Try again</button>
            </div>
        );
    }

    const slots = data?.slots ?? [];

    if (slots.length === 0) {
        return <p>No available consultation slots at the moment.</p>;
    }

    return (
        <section>
            <h2 className="mb-4 text-xl font-semibold">
                Available Consultation Slots
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
                {slots
                    .filter((slot) => slot.status === "available")
                    .map((slot) => {
                        const start = new Date(slot.startAt || slot.startTime || "");
                        const end = new Date(slot.endAt || slot.endTime || "");
                        const formattedDate = start.toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                        });
                        const formattedStartTime = start.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        });
                        const formattedEndTime = end.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        });

                        const isThisSlotPending =
                            checkoutMutation.isPending && pendingSlotId === slot._id;

                        return (
                            <div
                                key={slot._id}
                                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-300"
                            >
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-slate-800">
                                            {formattedDate}
                                        </span>
                                        <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                                            30 mins call
                                        </span>
                                    </div>

                                    <p className="mt-2 text-base font-medium text-slate-700">
                                        {formattedStartTime} – {formattedEndTime}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    disabled={checkoutMutation.isPending}
                                    onClick={() => {
                                        setPendingSlotId(slot._id);
                                        toast.info("Preparing Stripe secure checkout...");
                                        checkoutMutation.mutate(
                                            {
                                                availabilityId: slot._id,
                                            },
                                            {
                                                onError: (err: any) => {
                                                    setPendingSlotId(null);
                                                    const message =
                                                        err?.response?.data?.message ||
                                                        err?.message ||
                                                        "Failed to initiate checkout.";
                                                    toast.error(message);
                                                },
                                            }
                                        );
                                    }}
                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isThisSlotPending ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            <span>Redirecting to Stripe...</span>
                                        </>
                                    ) : (
                                        <span>Book 30-min Call</span>
                                    )}
                                </button>
                            </div>
                        );
                    })}
            </div>
        </section>
    );
}

export default InstructorAvailabilityList;

import { CalendarDays, Clock, Trash2 } from "lucide-react";
import type { AvailabilitySlot } from "../availability.types";
import { useDeleteAvailability } from "../availability.mutation";

interface AvailabilityCardProps {
    slot: AvailabilitySlot;
}

export default function AvailabilityCard({
    slot,
}: AvailabilityCardProps) {
    const deleteAvailability = useDeleteAvailability();

    const startDate = new Date(slot.startAt || slot.startTime || "");
    const endDate = new Date(slot.endAt || slot.endTime || "");

    const formattedDate = new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
    }).format(startDate);

    const formattedStartTime = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
    }).format(startDate);

    const formattedEndTime = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
    }).format(endDate);

    const statusStyles = {
        available: "bg-green-100 text-green-700",
        held: "bg-yellow-100 text-yellow-700",
        booked: "bg-blue-100 text-blue-700",
    };

    const handleDelete = () => {
        if (slot.status !== "available") return;

        const confirmed = window.confirm(
            "Are you sure you want to delete this availability slot?",
        );

        if (confirmed) {
            deleteAvailability.mutate(slot._id);
        }
    };

    return (
        <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-800">
                    <CalendarDays size={17} className="text-zinc-500" />
                    {formattedDate}
                </div>

                <div className="flex items-center gap-2 text-sm text-zinc-600">
                    <Clock size={17} className="text-zinc-500" />
                    {formattedStartTime} - {formattedEndTime}
                </div>

                <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyles[slot.status]
                        }`}
                >
                    {slot.status}
                </span>
            </div>

            {slot.status === "available" && (
                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleteAvailability.isPending}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Trash2 size={16} />
                    {deleteAvailability.isPending ? "Deleting..." : "Delete"}
                </button>
            )}
        </div>
    );
}

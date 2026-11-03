
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateAvailability } from "../availability.mutation";

const availabilitySchema = z.object({
    date: z.string().min(1, "Please select a date"),
    startTime: z.string().min(1, "Please select a start time"),
});

type AvailabilityFormValues = z.infer<typeof availabilitySchema>;

export default function AvailabilityForm() {
    const createAvailability = useCreateAvailability();

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<AvailabilityFormValues>({
        resolver: zodResolver(availabilitySchema),
        defaultValues: {
            date: "",
            startTime: "",
        },
    });

    const selectedTime = watch("startTime");

    const calculateEndTime = (timeStr: string) => {
        if (!timeStr) return "";
        const [hours, minutes] = timeStr.split(":").map(Number);
        const totalMinutes = hours * 60 + minutes + 30;
        const endHours = Math.floor(totalMinutes / 60) % 24;
        const endMins = totalMinutes % 60;
        return `${String(endHours).padStart(2, "0")}:${String(endMins).padStart(2, "0")}`;
    };

    const onSubmit = (values: AvailabilityFormValues) => {
        const startDateTime = new Date(`${values.date}T${values.startTime}`);

        if (startDateTime.getTime() <= Date.now()) {
            alert("Please select a date and time in the future.");
            return;
        }

        createAvailability.mutate(
            {
                startAt: startDateTime.toISOString(),
                startTime: startDateTime.toISOString(),
            },
            {
                onSuccess: () => {
                    reset();
                },
            },
        );
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
            <div>
                <h2 className="text-lg font-semibold text-zinc-900">
                    Add availability
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                    Choose when students can book consultations with you.
                </p>
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                    Date
                </label>

                <input
                    type="date"
                    {...register("date")}
                    min={new Date().toLocaleDateString("en-CA")}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
                />

                {errors.date && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.date.message}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700">
                        Start time
                    </label>

                    <input
                        type="time"
                        {...register("startTime")}
                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
                    />

                    {errors.startTime && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.startTime.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700">
                        Session Duration
                    </label>

                    <div className="flex items-center h-[42px] px-3 rounded-lg border border-zinc-200 bg-zinc-50 text-sm text-zinc-600">
                        {selectedTime ? (
                            <span>30 mins (ends at {calculateEndTime(selectedTime)})</span>
                        ) : (
                            <span>30 minutes (fixed)</span>
                        )}
                    </div>
                </div>
            </div>

            {createAvailability.isError && (
                <p className="text-sm text-red-500">
                    {createAvailability.error.message ||
                        "Failed to create availability"}
                </p>
            )}

            <button
                type="submit"
                disabled={createAvailability.isPending}
                className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {createAvailability.isPending
                    ? "Creating..."
                    : "Add availability"}
            </button>
        </form>
    );
}

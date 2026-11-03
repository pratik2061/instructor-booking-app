
import AvailabilityForm from "../../features/availability/components/AvailabilityForm";
import AvailabilityList from "../../features/availability/components/AvailabilityList";

export default function InstructorAvailabilityPage() {
    return (
        <div className="mx-auto max-w-5xl space-y-8 p-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-zinc-900">
                    Manage Availability
                </h1>

                <p className="mt-2 text-sm text-zinc-500">
                    Set your consultation schedule and manage the
                    time slots students can book.
                </p>
            </div>

            {/* Create Availability */}
            <AvailabilityForm />

            {/* Existing Availability */}
            <AvailabilityList />
        </div>
    );
}

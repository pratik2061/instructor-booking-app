import { CalendarDays } from "lucide-react";
import InstructorBookingList from "../../features/bookings/components/InstructorBookingList";

function InstructorConsultationsPage() {
    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <div>
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-50 p-3">
                        <CalendarDays className="h-6 w-6 text-blue-600" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            My Consultations
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage and review consultations booked by students.
                        </p>
                    </div>
                </div>
            </div>

            <InstructorBookingList />
        </div>
    );
}

export default InstructorConsultationsPage;
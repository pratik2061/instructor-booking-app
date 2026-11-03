import BookingList from "../../features/bookings/components/BookingList";

function StudentConsultationsPage() {
    return (
        <main className="mx-auto max-w-6xl space-y-8 p-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">
                    My Consultations
                </h1>

                <p className="mt-2 text-slate-500">
                    View your consultation bookings and payment history.
                </p>
            </div>

            <BookingList />
        </main>
    );
}

export default StudentConsultationsPage;
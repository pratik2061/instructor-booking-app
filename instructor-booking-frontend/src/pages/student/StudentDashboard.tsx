import { useAuth } from "../../features/auth/auth.context";
import { useCurrentUser } from "../../features/auth/auth.queries";
import InstructorList from "../../features/instructor/components/InstructorList";

function StudentDashboard() {
    const { data: user } = useCurrentUser();
    const { logout } = useAuth();

    return (
        <main className="space-y-10">
            <section>
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium text-indigo-600">
                            Student Dashboard
                        </p>

                        <h1 className="mt-2 text-3xl font-bold text-slate-900">
                            Welcome, {user?.name || "Student"}!
                        </h1>

                        <p className="mt-2 text-slate-500">
                            Find the right instructor for your next consultation.
                        </p>
                    </div>

                    <button
                        onClick={logout}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                    >
                        Logout
                    </button>
                </div>
            </section>

            <section>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">
                        Explore Instructors
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Browse available instructors and book a personalized session.
                    </p>
                </div>

                <InstructorList />
            </section>
        </main>
    );
}

export default StudentDashboard;
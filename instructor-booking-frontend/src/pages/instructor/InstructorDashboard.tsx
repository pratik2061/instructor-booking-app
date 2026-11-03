
import { Link } from "react-router-dom";
import {
    CalendarDays,
    UserRound,
    Video,
    ArrowRight,
} from "lucide-react";

const dashboardItems = [
    {
        title: "Manage Profile",
        description: "Update your bio, expertise and consultation fee.",
        icon: UserRound,
        path: "/instructor/profile",
    },
    {
        title: "Manage Availability",
        description: "Create and manage your available consultation slots.",
        icon: CalendarDays,
        path: "/instructor/availability",
    },
    {
        title: "My Consultations",
        description: "View and manage your student consultations.",
        icon: Video,
        path: "/instructor/consultations",
    },
];

function InstructorDashboard() {
    return (
        <div className="mx-auto max-w-6xl space-y-8 p-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">
                    Instructor Dashboard
                </h1>

                <p className="mt-2 text-slate-500">
                    Manage your profile, availability and consultations.
                </p>
            </div>

            {/* Dashboard Navigation */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {dashboardItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="group rounded-xl border border-slate-200 bg-white p-6 transition hover:border-slate-400 hover:shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <div className="rounded-lg bg-slate-100 p-3">
                                    <Icon size={22} className="text-slate-700" />
                                </div>

                                <ArrowRight
                                    size={18}
                                    className="text-slate-400 transition group-hover:translate-x-1"
                                />
                            </div>

                            <h2 className="mt-5 font-semibold text-slate-900">
                                {item.title}
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                {item.description}
                            </p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default InstructorDashboard;

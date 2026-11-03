import { Link, NavLink, Outlet } from "react-router-dom";
import { useCurrentUser } from "../../features/auth/auth.queries";
import LogoutButton from "./LogoutButton";

function DashboardLayout() {
    const { data: user } = useCurrentUser();
    const isInstructor = user?.role === "instructor";

    const studentLinks = [
        { to: "/student/dashboard", label: "Find Instructors" },
        { to: "/student/consultations", label: "My Consultations" },
    ];

    const instructorLinks = [
        { to: "/instructor/dashboard", label: "Overview" },
        { to: "/instructor/availability", label: "Manage Availability" },
        { to: "/instructor/consultations", label: "My Consultations" },
        { to: "/instructor/profile", label: "My Profile" },
    ];

    const links = isInstructor ? instructorLinks : studentLinks;

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-8">
                        <Link
                            to={isInstructor ? "/instructor/dashboard" : "/student/dashboard"}
                            className="text-xl font-bold text-indigo-600"
                        >
                            InstructorBook
                        </Link>

                        <nav className="hidden md:flex items-center gap-1">
                            {links.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    className={({ isActive }) =>
                                        `rounded-lg px-3 py-2 text-sm font-medium transition ${
                                            isActive
                                                ? "bg-indigo-50 text-indigo-700"
                                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                        }`
                                    }
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        {user && (
                            <div className="hidden sm:flex flex-col text-right">
                                <span className="text-sm font-semibold text-slate-900">
                                    {user.name}
                                </span>
                                <span className="text-xs text-slate-500 capitalize">
                                    {user.role}
                                </span>
                            </div>
                        )}

                        <LogoutButton />
                    </div>
                </div>

                {/* Mobile navigation */}
                <div className="flex md:hidden border-t border-slate-100 px-6 py-2 gap-2 overflow-x-auto">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                `whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                                    isActive
                                        ? "bg-indigo-50 text-indigo-700"
                                        : "text-slate-600 hover:bg-slate-100"
                                }`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-8">
                <Outlet />
            </main>
        </div>
    );
}

export default DashboardLayout;
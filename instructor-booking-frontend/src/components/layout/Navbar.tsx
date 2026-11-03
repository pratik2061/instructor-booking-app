import { Link } from "react-router-dom";
import { CalendarDays, LayoutDashboard } from "lucide-react";
import { useAuth } from "../../features/auth/auth.context";
import { useCurrentUser } from "../../features/auth/auth.queries";

function Navbar() {
    const { accessToken } = useAuth();
    const { data: user } = useCurrentUser();

    const dashboardPath =
        user?.role === "instructor"
            ? "/instructor/dashboard"
            : "/student/dashboard";

    return (
        <header className="border-b border-slate-200 bg-white">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <Link to="/" className="flex items-center gap-2">
                    <CalendarDays className="text-indigo-600" size={26} />

                    <span className="text-xl font-bold text-slate-900">
                        InstructorBook
                    </span>
                </Link>

                <div className="flex items-center gap-6">
                    <Link
                        to="/"
                        className="text-sm font-medium text-slate-600 hover:text-indigo-600"
                    >
                        Home
                    </Link>

                    {accessToken && user ? (
                        <Link
                            to={dashboardPath}
                            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
                        >
                            <LayoutDashboard size={16} />
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-sm font-medium text-slate-600 hover:text-indigo-600"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default Navbar;
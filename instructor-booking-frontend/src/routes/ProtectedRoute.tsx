import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../features/auth/auth.context";
import { useCurrentUser } from "../features/auth/auth.queries";

import type { UserRole } from "../features/auth/auth.types";

interface ProtectedRouteProps {
    allowedRoles?: UserRole[];
}

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const { accessToken } = useAuth();
    const { data: user, isLoading, isError } = useCurrentUser();

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-slate-500">Checking authentication...</p>
            </div>
        );
    }

    if (isError || !user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
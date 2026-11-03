import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/auth.context";

function LogoutButton() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <button
            onClick={handleLogout}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
            Logout
        </button>
    );
}

export default LogoutButton;
import { Link } from "react-router-dom";

function NotFoundPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center">
            <h1 className="text-6xl font-bold text-slate-900">404</h1>

            <p className="mt-4 text-slate-500">Page not found.</p>

            <Link to="/" className="mt-6 text-indigo-600 hover:underline">
                Return Home
            </Link>
        </main>
    );
}

export default NotFoundPage;
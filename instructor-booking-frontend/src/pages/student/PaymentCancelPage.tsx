
import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

function PaymentCancelPage() {
    return (
        <main className="flex min-h-[70vh] items-center justify-center p-6">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <XCircle
                    size={56}
                    className="mx-auto text-red-500"
                />

                <h1 className="mt-5 text-2xl font-bold text-slate-900">
                    Payment Cancelled
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                    Your checkout was cancelled. No successful payment
                    was recorded through this checkout session.
                    You can select an available slot and try again.
                </p>

                <Link
                    to="/student/dashboard"
                    className="mt-6 inline-block rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700"
                >
                    Back to Dashboard
                </Link>
            </div>
        </main>
    );
}

export default PaymentCancelPage;

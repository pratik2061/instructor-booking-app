import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { loginSchema, type LoginFormValues } from "../../features/auth/auth.schema";
import { useLogin } from "../../features/auth/auth.mutation";
import { useToast } from "../../provider/toast-provider";

function LoginPage() {
    const navigate = useNavigate();
    const loginMutation = useLogin();
    const toast = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (values: LoginFormValues) => {
        loginMutation.mutate(values, {
            onSuccess: (response) => {
                const role = response.data.user.role;
                toast.success(`Welcome back, ${response.data.user.name}!`);

                navigate(
                    role === "instructor"
                        ? "/instructor/dashboard"
                        : "/student/dashboard",
                );
            },
            onError: (err: any) => {
                const message =
                    err?.response?.data?.message || err?.message || "Invalid email or password.";
                toast.error(message);
            },
        });
    };

    return (
        <main className="flex min-h-[80vh] items-center justify-center bg-slate-50 px-6 py-12">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
            >
                <h1 className="text-2xl font-bold text-slate-900">
                    Welcome back
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Sign in to continue to your account.
                </p>

                <div className="mt-6 space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Email address
                        </label>

                        <input
                            type="email"
                            {...register("email")}
                            placeholder="you@example.com"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
                        />

                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Password
                        </label>

                        <input
                            type="password"
                            {...register("password")}
                            placeholder="Enter your password"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
                        />

                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {loginMutation.isError && (
                        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {loginMutation.error.message || "Unable to log in."}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loginMutation.isPending ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <span>Sign In</span>
                        )}
                    </button>
                </div>

                <p className="mt-6 text-center text-sm text-slate-500">
                    Don't have an account?{" "}
                    <Link to="/register" className="font-medium text-indigo-600">
                        Register
                    </Link>
                </p>
            </form>
        </main>
    );
}

export default LoginPage;
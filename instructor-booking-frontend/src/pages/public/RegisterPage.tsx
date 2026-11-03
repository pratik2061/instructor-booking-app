import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import {
    registerSchema,
    type RegisterFormValues,
} from "../../features/auth/auth.schema";
import { useRegister } from "../../features/auth/auth.mutation";


function RegisterPage() {
    const navigate = useNavigate();
    const registerMutation = useRegister();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: "student",
        },
    });

    const onSubmit = (values: RegisterFormValues) => {
        registerMutation.mutate(values, {
            onSuccess: (response) => {
                const role = response.data.user.role;

                navigate(
                    role === "instructor"
                        ? "/instructor/dashboard"
                        : "/student/dashboard",
                );
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
                    Create an account
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Join us and start booking consultations.
                </p>

                <div className="mt-6 space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Full name
                        </label>

                        <input
                            {...register("name")}
                            placeholder="John Doe"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
                        />

                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

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
                            placeholder="At least 8 characters"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
                        />

                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Register as
                        </label>

                        <select
                            {...register("role")}
                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500"
                        >
                            <option value="student">Student</option>
                            <option value="instructor">Instructor</option>
                        </select>
                    </div>

                    {registerMutation.isError && (
                        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {registerMutation.error.message || "Unable to register."}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={registerMutation.isPending}
                        className="w-full rounded-lg bg-indigo-600 py-3 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {registerMutation.isPending
                            ? "Creating account..."
                            : "Create Account"}
                    </button>
                </div>

                <p className="mt-6 text-center text-sm text-slate-500">
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium text-indigo-600">
                        Login
                    </Link>
                </p>
            </form>
        </main>
    );
}

export default RegisterPage;
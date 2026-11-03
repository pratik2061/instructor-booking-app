import { useParams, Link } from "react-router-dom";
import { ArrowLeft, UserRound } from "lucide-react";

import { useInstructor } from "../../features/instructor/instructor.queries";
import InstructorAvailabilityList from "../../features/availability/components/InstructorAvailabilityList";

function InstructorDetailsPage() {
    const { instructorId } = useParams<{ instructorId: string }>();

    const {
        data: instructor,
        isLoading,
        isError,
        error,
    } = useInstructor(instructorId!);

    const rawData = instructor as any;
    const profile = (rawData?.profile || rawData) as typeof instructor;

    if (isLoading) {
        return (
            <div className="py-20 text-center text-slate-500">
                Loading instructor profile...
            </div>
        );
    }

    if (isError || !profile) {
        return (
            <div className="py-20 text-center">
                <p className="text-red-500">
                    {error?.message || "Instructor not found."}
                </p>

                <Link
                    to="/student/dashboard"
                    className="mt-4 inline-block text-indigo-600"
                >
                    Back to instructors
                </Link>
            </div>
        );
    }

    const name =
        typeof profile.userId === "string"
            ? "Instructor"
            : profile.userId?.name || "Instructor";

    const currencyCode = profile.currency || "USD";
    const fee = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currencyCode,
    }).format((profile.consultationFee || 0) / 100);

    return (
        <main className="space-y-8">
            <Link
                to="/student/dashboard"
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600"
            >
                <ArrowLeft size={16} />
                Back to instructors
            </Link>

            <section className="rounded-2xl border border-slate-200 bg-white p-8">
                <div className="flex flex-col gap-6 sm:flex-row">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-indigo-50">
                        <UserRound size={44} className="text-indigo-600" />
                    </div>

                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-slate-900">
                            {name}
                        </h1>

                        <p className="mt-3 leading-7 text-slate-500">
                            {profile.bio}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-2">
                            {(profile.expertise || []).map((skill: string) => (
                                <span
                                    key={skill}
                                    className="rounded-full bg-indigo-50 px-3 py-1.5 text-sm text-indigo-600"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-5 sm:min-w-48">
                        <p className="text-sm text-slate-500">
                            Consultation fee
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-900">
                            {fee}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            Per 30-minute session
                        </p>
                    </div>
                </div>
            </section>

            <InstructorAvailabilityList instructorId={profile._id} />
        </main>
    );
}

export default InstructorDetailsPage;
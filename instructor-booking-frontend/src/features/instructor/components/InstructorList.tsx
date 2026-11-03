import { useInstructors } from "../instructor.queries";
import InstructorCard from "./InstructorCard";

function InstructorList() {
    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
    } = useInstructors();

    if (isLoading) {
        return (
            <div className="py-20 text-center text-slate-500">
                Loading instructors...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="py-20 text-center">
                <p className="text-red-500">
                    {error.message || "Failed to load instructors."}
                </p>

                <button
                    onClick={() => refetch()}
                    className="mt-4 rounded-lg bg-indigo-600 px-5 py-2 text-white"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!data?.instructors.length) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-300 py-20 text-center">
                <p className="text-xl font-semibold text-slate-800">
                    No instructors available yet
                </p>

                <p className="mt-2 text-sm text-slate-500">
                    Approved instructors will appear here once they join.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.instructors.map((instructor) => (
                <InstructorCard
                    key={instructor._id}
                    instructor={instructor}
                />
            ))}
        </div>
    );
}

export default InstructorList;
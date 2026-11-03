import { Link } from "react-router-dom";
import { UserRound, ArrowRight } from "lucide-react";

import type { Instructor } from "../instructor.types";

interface InstructorCardProps {
    instructor: Instructor;
}

function InstructorCard({ instructor }: InstructorCardProps) {
    const instructorName =
        typeof instructor.userId === "string"
            ? "Instructor"
            : instructor.userId.name;

    const formattedFee = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: instructor.currency,
    }).format(
        instructor.consultationFee / 100,
    );

    return (
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-center bg-indigo-50 py-8">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100">
                    <UserRound size={38} className="text-indigo-600" />
                </div>
            </div>

            <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-900">
                    {instructorName}
                </h3>

                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                    {instructor.bio}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                    {instructor.expertise.map((skill) => (
                        <span
                            key={skill}
                            className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600"
                        >
                            {skill}
                        </span>
                    ))}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                    <div>
                        <p className="text-xs text-slate-400">
                            30-minute consultation
                        </p>

                        <p className="mt-1 text-lg font-bold text-slate-900">
                            {formattedFee}
                        </p>
                    </div>

                    <Link
                        to={`/instructors/${instructor._id}`}
                        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
                    >
                        View
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </article>
    );
}

export default InstructorCard;
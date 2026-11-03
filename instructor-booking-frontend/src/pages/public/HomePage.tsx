import { Link } from "react-router-dom";
import { ArrowRight, CalendarCheck, Video, Users } from "lucide-react";

function HomePage() {
    return (
        <main>
            <section className="bg-slate-950 px-6 py-28 text-white">
                <div className="mx-auto max-w-7xl">
                    <div className="max-w-2xl">
                        <span className="rounded-full bg-indigo-500/20 px-4 py-2 text-sm text-indigo-300">
                            Learn directly from experts
                        </span>

                        <h1 className="mt-8 text-5xl font-bold leading-tight">
                            Your next breakthrough starts with a conversation.
                        </h1>

                        <p className="mt-6 text-lg leading-8 text-slate-400">
                            Connect with experienced instructors, book personalized
                            consultations, and get guidance that moves you forward.
                        </p>

                        <div className="mt-9 flex gap-4">
                            <Link
                                to="/register"
                                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-medium hover:bg-indigo-500"
                            >
                                Get Started
                                <ArrowRight size={18} />
                            </Link>

                            <Link
                                to="/login"
                                className="rounded-lg border border-slate-700 px-6 py-3 font-medium hover:bg-slate-800"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto grid max-w-7xl gap-8 px-6 py-20 md:grid-cols-3">
                {[
                    {
                        icon: Users,
                        title: "Expert Instructors",
                        description: "Find instructors with experience in your field.",
                    },
                    {
                        icon: CalendarCheck,
                        title: "Flexible Scheduling",
                        description: "Choose a convenient 30-minute consultation slot.",
                    },
                    {
                        icon: Video,
                        title: "Personal Guidance",
                        description: "Get focused guidance through individual sessions.",
                    },
                ].map((feature) => {
                    const Icon = feature.icon;

                    return (
                        <div
                            key={feature.title}
                            className="rounded-2xl border border-slate-200 p-8"
                        >
                            <Icon size={30} className="text-indigo-600" />

                            <h2 className="mt-5 text-xl font-semibold text-slate-900">
                                {feature.title}
                            </h2>

                            <p className="mt-3 leading-7 text-slate-500">
                                {feature.description}
                            </p>
                        </div>
                    );
                })}
            </section>
        </main>
    );
}

export default HomePage;
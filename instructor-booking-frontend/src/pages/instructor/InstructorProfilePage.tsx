import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, AlertCircle, UserRound, Loader2 } from "lucide-react";
import { useMyProfile } from "../../features/instructor/instructor.queries";
import {
    useCreateProfile,
    useUpdateProfile,
} from "../../features/instructor/instructor.mutation";
import type { InstructorCurrency } from "../../features/instructor/instructor.types";
import { useToast } from "../../provider/toast-provider";

const profileSchema = z.object({
    bio: z
        .string()
        .min(20, "Bio must be at least 20 characters")
        .max(1000, "Bio cannot exceed 1000 characters"),
    expertiseInput: z
        .string()
        .min(2, "Please enter at least one expertise area (comma separated)"),
    consultationFee: z
        .number()
        .positive("Consultation fee must be greater than 0"),
    currency: z.enum(["NPR", "USD"]),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function InstructorProfilePage() {
    const { data: rawProfile, isLoading, isError, refetch } = useMyProfile();
    const profile = (rawProfile as any)?.profile || rawProfile;
    const createProfile = useCreateProfile();
    const updateProfile = useUpdateProfile();
    const toast = useToast();

    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            bio: "",
            expertiseInput: "",
            consultationFee: 15,
            currency: "USD",
        },
    });

    useEffect(() => {
        if (profile) {
            reset({
                bio: profile.bio || "",
                expertiseInput: profile.expertise ? profile.expertise.join(", ") : "",
                consultationFee: profile.consultationFee ? profile.consultationFee / 100 : 15,
                currency: profile.currency || "USD",
            });
        }
    }, [profile, reset]);

    const onSubmit = (values: ProfileFormValues) => {
        setSuccessMessage(null);

        const expertiseArray = values.expertiseInput
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);

        if (expertiseArray.length === 0) {
            toast.error("Please provide at least one expertise topic.");
            return;
        }

        // Convert fee to smallest currency unit (cents / paisa)
        const feeInSmallestUnit = Math.round(values.consultationFee * 100);

        if (profile) {
            updateProfile.mutate(
                {
                    bio: values.bio,
                    expertise: expertiseArray,
                    consultationFee: feeInSmallestUnit,
                    currency: values.currency as InstructorCurrency,
                },
                {
                    onSuccess: () => {
                        setSuccessMessage("Profile updated successfully!");
                        toast.success("Instructor profile updated!");
                        refetch();
                    },
                    onError: (err: any) => {
                        const message =
                            err?.response?.data?.message || err?.message || "Failed to update profile.";
                        toast.error(message);
                    },
                }
            );
        } else {
            createProfile.mutate(
                {
                    bio: values.bio,
                    expertise: expertiseArray,
                    consultationFee: feeInSmallestUnit,
                    currency: values.currency as InstructorCurrency,
                },
                {
                    onSuccess: () => {
                        setSuccessMessage("Profile created successfully!");
                        toast.success("Instructor profile created!");
                        refetch();
                    },
                    onError: (err: any) => {
                        const message =
                            err?.response?.data?.message || err?.message || "Failed to create profile.";
                        toast.error(message);
                    },
                }
            );
        }
    };

    const isSubmitting = createProfile.isPending || updateProfile.isPending;

    if (isLoading) {
        return (
            <div className="py-20 text-center text-slate-500">
                Loading profile...
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl space-y-8 p-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">
                    Instructor Profile
                </h1>
                <p className="mt-2 text-slate-500">
                    Set up your consultation details so students can discover and book 30-minute sessions with you.
                </p>
            </div>

            {profile && (
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                            <UserRound size={24} />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900">
                                {typeof profile.userId === "object" ? profile.userId.name : "Your Profile"}
                            </p>
                            <p className="text-xs text-slate-500">
                                Current fee: {profile.currency} {(profile.consultationFee / 100).toFixed(2)} / 30 mins
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                            <CheckCircle2 size={14} />
                            Status: {profile.status.toUpperCase()}
                        </span>
                    </div>
                </div>
            )}

            {!profile && isError && (
                <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium">Profile Not Yet Created</p>
                        <p className="text-sm text-amber-700">
                            Fill out the form below to create your instructor profile. Once created, you can set your availability and accept paid bookings.
                        </p>
                    </div>
                </div>
            )}

            {successMessage && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
                    ✓ {successMessage}
                </div>
            )}

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
            >
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Professional Bio
                    </label>
                    <textarea
                        {...register("bio")}
                        rows={4}
                        placeholder="Describe your background, years of experience, and what students will learn during a 30-minute consultation with you (minimum 20 characters)..."
                        className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-indigo-500"
                    />
                    {errors.bio && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.bio.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Expertise Areas (comma-separated)
                    </label>
                    <input
                        type="text"
                        {...register("expertiseInput")}
                        placeholder="e.g. React, Node.js, System Design, Career Mentorship"
                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500"
                    />
                    <p className="mt-1 text-xs text-slate-400">
                        Separate multiple skills with commas.
                    </p>
                    {errors.expertiseInput && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.expertiseInput.message}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Consultation Fee (for 30 minutes)
                        </label>
                        <input
                            type="number"
                            step="any"
                            {...register("consultationFee", { valueAsNumber: true })}
                            placeholder="e.g. 25"
                            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500"
                        />
                        {errors.consultationFee && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.consultationFee.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Currency
                        </label>
                        <select
                            {...register("currency")}
                            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500"
                        >
                            <option value="USD">USD ($)</option>
                            <option value="NPR">NPR (Rs.)</option>
                        </select>
                        {errors.currency && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.currency.message}
                            </p>
                        )}
                    </div>
                </div>

                {(createProfile.isError || updateProfile.isError) && (
                    <p className="text-sm text-red-600">
                        {createProfile.error?.message ||
                            updateProfile.error?.message ||
                            "Failed to save profile."}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>Saving profile...</span>
                        </>
                    ) : profile ? (
                        <span>Update Profile</span>
                    ) : (
                        <span>Create Profile</span>
                    )}
                </button>
            </form>
        </div>
    );
}

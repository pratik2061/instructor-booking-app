import mongoose from "mongoose";

import InstructorProfile from "./instructor.model.js";

import ApiError from "../../utils/ApiError.js";

import {
    InstructorStatus,
} from "./instructor.types.js";

import type {
    CreateInstructorInput,
    UpdateInstructorInput,
    InstructorQuery,
} from "./instructor.validation.js";
import User from "../users/user.modules.js";

class InstructorService {

    // Create instructor profile
    async createProfile(
        userId: string,
        input: CreateInstructorInput
    ) {
        const user = await User.findById(userId);

        if (!user || !user.isActive) {
            throw new ApiError(404, "User not found");
        }

        if (user.role !== "instructor") {
            throw new ApiError(
                403,
                "Only instructors can create instructor profiles"
            );
        }

        const existingProfile = await InstructorProfile.findOne({
            userId,
        });

        if (existingProfile) {
            throw new ApiError(
                409,
                "Instructor profile already exists"
            );
        }

        const profile = await InstructorProfile.create({
            userId,
            ...input,
            status: InstructorStatus.APPROVED,
        });

        return profile;
    }

    // Update instructor profile
    async updateProfile(
        userId: string,
        input: UpdateInstructorInput
    ) {
        const profile = await InstructorProfile.findOne({
            userId,
        });

        if (!profile) {
            throw new ApiError(404, "Instructor profile not found");
        }

        const updatedProfile =
            await InstructorProfile.findByIdAndUpdate(
                profile._id,
                {
                    $set: input,
                },
                {
                    new: true,
                    runValidators: true,
                }
            );

        return updatedProfile;
    }

    // Get own instructor profile
    async getMyProfile(userId: string) {
        const profile = await InstructorProfile.findOne({
            userId,
        }).populate("userId", "name");

        if (!profile) {
            throw new ApiError(404, "Instructor profile not found");
        }

        return profile;
    }

    // Get public instructor listing
    async getInstructors(query: InstructorQuery) {
        const { page, limit, expertise } = query;

        const filter: Record<string, unknown> = {
            status: InstructorStatus.APPROVED,
        };

        if (expertise) {
            filter.expertise = {
                $regex: `^${expertise.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
                $options: "i",
            };
        }

        const skip = (page - 1) * limit;

        const [instructors, total] = await Promise.all([
            InstructorProfile.find(filter)
                .populate("userId", "name")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            InstructorProfile.countDocuments(filter),
        ]);

        return {
            instructors,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPreviousPage: page > 1,
            },
        };
    }

    // Get individual public instructor profile
    async getInstructorById(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ApiError(400, "Invalid instructor profile ID");
        }

        const profile = await InstructorProfile.findOne({
            _id: id,
            status: InstructorStatus.APPROVED,
        }).populate("userId", "name");

        if (!profile) {
            throw new ApiError(404, "Instructor not found");
        }

        return profile;
    }
}

export default new InstructorService();
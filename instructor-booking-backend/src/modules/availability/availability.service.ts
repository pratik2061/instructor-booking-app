import mongoose from "mongoose";
import Availability from "./availability.model.js";
import InstructorProfile from "../instructors/instructor.model.js";

import {
    AvailabilityStatus,
} from "./availability.types.js";

import { InstructorStatus } from "../instructors/instructor.types.js";

import type {
    CreateAvailabilityInput,
    AvailabilityQuery,
} from "./availability.validation.js";

import ApiError from "../../utils/ApiError.js";

const SLOT_DURATION = 30 * 60 * 1000;

class AvailabilityService {
    // Get the approved instructor profile belonging to the logged-in user.
    private async getApprovedProfile(userId: string) {
        const profile = await InstructorProfile.findOne({ userId });

        if (!profile) {
            throw new ApiError(404, "Instructor profile not found");
        }

        if (profile.status !== InstructorStatus.APPROVED) {
            throw new ApiError(
                403,
                "Your instructor profile must be approved before creating availability"
            );
        }

        return profile;
    }

    // Create a new availability slot.
    async createSlot(userId: string, input: CreateAvailabilityInput) {
        const profile = await this.getApprovedProfile(userId);

        const startAt = new Date(input.startAt);

        // Do not allow past or immediate slots.
        if (startAt.getTime() <= Date.now()) {
            throw new ApiError(400, "Availability must be scheduled in the future");
        }

        const endAt = new Date(startAt.getTime() + SLOT_DURATION);

        const overlappingSlot = await Availability.findOne({
            instructorId: profile._id,
            startAt: { $lt: endAt },
            endAt: { $gt: startAt },
        });

        if (overlappingSlot) {
            throw new ApiError(
                409,
                "This availability overlaps with an existing slot"
            );
        }

        try {
            const slot = await Availability.create({
                instructorId: profile._id,
                startAt,
                endAt,
            });

            return slot;
        } catch (error) {
            // Handles duplicate start times enforced by the unique index.
            if (
                typeof error === "object" &&
                error !== null &&
                "code" in error &&
                error.code === 11000
            ) {
                throw new ApiError(409, "This availability slot already exists");
            }

            throw error;
        }
    }

    // Get the logged-in instructor's slots.
    async getMySlots(userId: string, query: AvailabilityQuery) {
        const profile = await this.getApprovedProfile(userId);

        // Release any held slots whose hold has expired
        await Availability.updateMany(
            {
                instructorId: profile._id,
                status: AvailabilityStatus.HELD,
                holdExpiresAt: { $lt: new Date() },
            },
            {
                $set: { status: AvailabilityStatus.AVAILABLE },
                $unset: { bookingId: "", holdExpiresAt: "" },
            }
        );

        const { page, limit } = query;
        const skip = (page - 1) * limit;

        const filter = {
            instructorId: profile._id,
        };

        const [slots, total] = await Promise.all([
            Availability.find(filter)
                .sort({ startAt: 1 })
                .skip(skip)
                .limit(limit),

            Availability.countDocuments(filter),
        ]);

        return {
            slots,
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

    // Public: get available slots belonging to an approved instructor.
    async getInstructorSlots(
        instructorId: string,
        query: AvailabilityQuery
    ) {
        if (!mongoose.Types.ObjectId.isValid(instructorId)) {
            throw new ApiError(400, "Invalid instructor profile ID");
        }

        // Release any held slots whose hold has expired
        await Availability.updateMany(
            {
                instructorId,
                status: AvailabilityStatus.HELD,
                holdExpiresAt: { $lt: new Date() },
            },
            {
                $set: { status: AvailabilityStatus.AVAILABLE },
                $unset: { bookingId: "", holdExpiresAt: "" },
            }
        );

        const profile = await InstructorProfile.findOne({
            _id: instructorId,
            status: InstructorStatus.APPROVED,
        });

        if (!profile) {
            throw new ApiError(404, "Instructor not found");
        }

        const { page, limit, from, to } = query;
        const skip = (page - 1) * limit;

        const startAtFilter: Record<string, Date> = {
            $gt: new Date(),
        };

        if (from) {
            startAtFilter.$gte = new Date(from);
        }

        if (to) {
            startAtFilter.$lt = new Date(to);
        }

        const filter = {
            instructorId: profile._id,
            status: AvailabilityStatus.AVAILABLE,
            startAt: startAtFilter,
        };

        const [slots, total] = await Promise.all([
            Availability.find(filter)
                .sort({ startAt: 1 })
                .skip(skip)
                .limit(limit),

            Availability.countDocuments(filter),
        ]);

        return {
            slots,
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

    // Delete an instructor's available slot.
    async deleteSlot(userId: string, slotId: string) {
        const profile = await this.getApprovedProfile(userId);

        if (!mongoose.Types.ObjectId.isValid(slotId)) {
            throw new ApiError(400, "Invalid availability ID");
        }

        const slot = await Availability.findById(slotId);

        if (!slot) {
            throw new ApiError(404, "Availability slot not found");
        }

        if (!slot.instructorId.equals(profile._id)) {
            throw new ApiError(403, "You cannot delete another instructor's slot");
        }

        if (slot.status !== AvailabilityStatus.AVAILABLE) {
            throw new ApiError(409, "A booked slot cannot be deleted");
        }

        // The status condition makes this deletion atomic with respect
        // to a booking operation that changes AVAILABLE to BOOKED.
        const deletedSlot = await Availability.findOneAndDelete({
            _id: slotId,
            instructorId: profile._id,
            status: AvailabilityStatus.AVAILABLE,
        });

        if (!deletedSlot) {
            throw new ApiError(
                409,
                "This slot is no longer available for deletion"
            );
        }

        return deletedSlot;
    }
}

export default new AvailabilityService();
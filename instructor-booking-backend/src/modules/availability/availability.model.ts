import mongoose, { Schema, type Model } from "mongoose";

import {
    AvailabilityStatus,
    type IAvailability,
} from "./availability.types.js";

const availabilitySchema = new Schema<IAvailability>(
    {
        instructorId: {
            type: Schema.Types.ObjectId,
            ref: "InstructorProfile",
            required: true,
        },

        startAt: {
            type: Date,
            required: true,
        },

        endAt: {
            type: Date,
            required: true,
        },

        status: {
            type: String,
            enum: Object.values(AvailabilityStatus),
            default: AvailabilityStatus.AVAILABLE,
        },
        bookingId: {
            type: Schema.Types.ObjectId,
            ref: "Booking",
        },

        holdExpiresAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// An instructor cannot have two slots with the same start time.
availabilitySchema.index(
    { instructorId: 1, startAt: 1 },
    { unique: true }
);

// Helps retrieve available slots efficiently.
availabilitySchema.index({
    instructorId: 1,
    status: 1,
    startAt: 1,
});

const Availability: Model<IAvailability> =
    mongoose.model<IAvailability>("Availability", availabilitySchema);

export default Availability;
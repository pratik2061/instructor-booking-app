import mongoose, { Schema, type Model } from "mongoose";

import {
    BookingStatus,
    type IBooking,
} from "./booking.types.js";

const bookingSchema = new Schema<IBooking>(
    {
        studentId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        instructorId: {
            type: Schema.Types.ObjectId,
            ref: "InstructorProfile",
            required: true,
        },

        availabilityId: {
            type: Schema.Types.ObjectId,
            ref: "Availability",
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

        consultationFee: {
            type: Number,
            required: true,
            min: 1,
        },

        currency: {
            type: String,
            required: true,
            enum: ["NPR", "USD"],
        },

        status: {
            type: String,
            enum: Object.values(BookingStatus),
            default: BookingStatus.CONFIRMED,
        },

        meetingLink: {
            type: String,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Student booking history.
bookingSchema.index({
    studentId: 1,
    createdAt: -1,
});

// Instructor booking history.
bookingSchema.index({
    instructorId: 1,
    startAt: 1,
});
bookingSchema.index(
    { availabilityId: 1 },
    {
        unique: true,
        partialFilterExpression: {
            status: BookingStatus.CONFIRMED,
        },
    }
);

const Booking: Model<IBooking> = mongoose.model<IBooking>(
    "Booking",
    bookingSchema
);

export default Booking;
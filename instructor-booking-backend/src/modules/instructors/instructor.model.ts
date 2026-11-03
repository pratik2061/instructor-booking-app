import mongoose, {
    Schema,
    type Model,
} from "mongoose";

import {
    InstructorStatus,
    Currency,
    type IInstructorProfile,
} from "./instructor.types.js";

const instructorSchema = new Schema<IInstructorProfile>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        bio: {
            type: String,
            required: true,
            trim: true,
            minlength: 20,
            maxlength: 1000,
        },

        expertise: {
            type: [String],
            required: true,
            validate: {
                validator: (value: string[]) =>
                    value.length > 0 && value.length <= 10,
                message: "Provide between 1 and 10 expertise areas",
            },
        },

        consultationFee: {
            type: Number,
            required: true,
            min: 1,
            validate: {
                validator: Number.isSafeInteger,
                message: "Consultation fee must be an integer",
            },
        },

        currency: {
            type: String,
            enum: Object.values(Currency),
            default: Currency.NPR,
        },

        status: {
            type: String,
            enum: Object.values(InstructorStatus),
            default: InstructorStatus.APPROVED,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const InstructorProfile: Model<IInstructorProfile> =
    mongoose.model<IInstructorProfile>(
        "InstructorProfile",
        instructorSchema
    );

export default InstructorProfile;
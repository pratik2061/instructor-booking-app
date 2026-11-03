import mongoose, { Schema, type Model } from "mongoose";

import { UserRole, type IUser } from "./user.types.js";

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: 2,
            maxlength: 100,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 8,
            select: false,
        },

        role: {
            type: String,
            enum: Object.values(UserRole),
            required: true,
            default: UserRole.STUDENT,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const User: Model<IUser> = mongoose.model<IUser>(
    "User",
    userSchema
);

export default User;
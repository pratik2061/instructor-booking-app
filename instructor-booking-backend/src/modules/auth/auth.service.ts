import bcrypt from "bcryptjs";

import ApiError from "../../utils/ApiError.js";
import { generateAccessToken } from "../../utils/jwt.js";

import type {
    RegisterInput,
    LoginInput,
} from "./auth.validation.js";
import User from "../users/user.modules.js";

const SALT_ROUNDS = 10;

class AuthService {

    async register(input: RegisterInput) {
        const existingUser = await User.findOne({
            email: input.email,
        });

        if (existingUser) {
            throw new ApiError(409, "Email already registered");
        }

        const hashedPassword = await bcrypt.hash(
            input.password,
            SALT_ROUNDS
        );

        const user = await User.create({
            name: input.name,
            email: input.email,
            password: hashedPassword,
            role: input.role,
        });

        const accessToken = generateAccessToken({
            userId: user._id.toString(),
            role: user.role,
        });

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            accessToken,
        };
    }

    async login(input: LoginInput) {
        const user = await User.findOne({
            email: input.email,
        }).select("+password");

        if (!user) {
            throw new ApiError(401, "Invalid email or password");
        }

        if (!user.isActive) {
            throw new ApiError(403, "Account is deactivated");
        }

        const isPasswordValid = await bcrypt.compare(
            input.password,
            user.password
        );

        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid email or password");
        }

        const accessToken = generateAccessToken({
            userId: user._id.toString(),
            role: user.role,
        });

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            accessToken,
        };
    }

    async getCurrentUser(userId: string) {
        const user = await User.findById(userId);

        if (!user || !user.isActive) {
            throw new ApiError(404, "User not found");
        }

        return user;
    }
}

export default new AuthService();
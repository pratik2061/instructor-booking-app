import api from "../../lib/axios";

import type {
    CreateCheckoutPayload,
    CreateCheckoutResponse,
} from "./payment.types";

export interface VerifySessionResponse {
    success: boolean;
    message: string;
    data: {
        status: string;
        booking?: {
            _id: string;
            startAt: string;
            endAt: string;
            consultationFee: number;
            currency: string;
            status: string;
            meetingLink?: string;
            instructorId?: {
                _id: string;
                userId?: {
                    name: string;
                    email: string;
                };
            };
        };
        payment?: {
            _id: string;
            amount: number;
            currency: string;
            status: string;
        };
    };
}

export const paymentService = {
    createCheckoutSession: async (
        payload: CreateCheckoutPayload,
    ) => {
        const response = await api.post<CreateCheckoutResponse>(
            "/payments/checkout",
            payload,
        );

        return response.data;
    },

    verifyCheckoutSession: async (sessionId: string) => {
        const response = await api.get<VerifySessionResponse>(
            `/payments/verify/${sessionId}`
        );

        return response.data.data;
    },
};
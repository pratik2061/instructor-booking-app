export interface CreateCheckoutPayload {
    availabilityId: string;
}

export interface CheckoutSession {
    bookingId: string;
    paymentId: string;
    checkoutUrl: string;
    sessionId: string;
}

export interface CreateCheckoutResponse {
    success: boolean;
    message: string;
    data: CheckoutSession;
}
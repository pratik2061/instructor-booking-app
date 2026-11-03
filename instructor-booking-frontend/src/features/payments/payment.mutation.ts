import { useMutation } from "@tanstack/react-query";

import { paymentService } from "./payment.service";
import type { CreateCheckoutPayload } from "./payment.types";

export function useCreateCheckout() {
    return useMutation({
        mutationFn: (payload: CreateCheckoutPayload) =>
            paymentService.createCheckoutSession(payload),

        onSuccess: (response) => {
            const checkoutUrl = response.data.checkoutUrl;

            if (!checkoutUrl) {
                throw new Error("Stripe checkout URL was not returned.");
            }

            window.location.assign(checkoutUrl);
        },
    });
}
import { loadStripe } from "@stripe/stripe-js";
import { env } from "~/env";
import { api } from "~/utils/api";

const apiKey =
  "pk_test_51OXmO0JXph72ud7d8eKS9GcaX4StxXVoUt3BsOpDVH2g3xqcWfkRCdSgcr4X6cQ1FO2aERBZZMMpyuxRbyQx0bSJ00TEpOsZ1Q";

const stripePromise = loadStripe(apiKey);

export function useBuyCredits() {
  const checkout = api.checkout.createCheckout.useMutation();

  return {
    buyCredits: async () => {
      const session = await checkout.mutateAsync();
      const stripe = await stripePromise;

      await stripe?.redirectToCheckout({
        sessionId: session.id,
      });
    },
  };
}

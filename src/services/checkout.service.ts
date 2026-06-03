import { fetchJson } from "@/lib/api-client";
import type {
  CheckoutCompleteRequest,
  CheckoutCompleteResponse,
} from "@/types/checkout";

export async function completeCheckout(
  payload: CheckoutCompleteRequest,
): Promise<CheckoutCompleteResponse> {
  return fetchJson<CheckoutCompleteResponse>("/api/checkout/complete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

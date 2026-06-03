import type { NextApiRequest, NextApiResponse } from "next";
import type {
  CheckoutCompleteResponse,
  CheckoutCompleteRequest,
} from "@/types/checkout";

type ErrorResponse = {
  message: string;
};

function hasCheckoutPayload(body: unknown): body is CheckoutCompleteRequest {
  if (!body || typeof body !== "object") {
    return false;
  }

  const payload = body as Partial<CheckoutCompleteRequest>;

  return Boolean(
    Array.isArray(payload.basketItems) &&
      payload.basketItems.length > 0 &&
      payload.customer &&
      typeof payload.totalPrice === "number" &&
      payload.totalPrice > 0 &&
      payload.payment,
  );
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckoutCompleteResponse | ErrorResponse>,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Bu yöntem desteklenmiyor" });
  }

  if (!hasCheckoutPayload(req.body)) {
    return res.status(400).json({ message: "Ödeme bilgileri eksik" });
  }

  return res.status(200).json({
    success: true,
    orderId: `EVL-${Math.floor(100000 + Math.random() * 900000)}`,
    message: "Checkout completed successfully",
  });
}

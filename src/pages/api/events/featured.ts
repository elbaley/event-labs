import type { NextApiRequest, NextApiResponse } from "next";
import { getFeaturedEventSummaries } from "@/lib/events";
import type { EventListResponse } from "@/types/event";

type ErrorResponse = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<EventListResponse | ErrorResponse>,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  return res.status(200).json({
    events: getFeaturedEventSummaries(),
  });
}

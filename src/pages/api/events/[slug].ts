import type { NextApiRequest, NextApiResponse } from "next";
import { getEventBySlug } from "@/lib/events";
import type { EventDetailResponse } from "@/types/event";

type ErrorResponse = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<EventDetailResponse | ErrorResponse>,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { slug } = req.query;

  if (Array.isArray(slug) || !slug) {
    return res.status(400).json({ message: "Slug must be a single value" });
  }

  const event = getEventBySlug(slug);

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  return res.status(200).json({ event });
}

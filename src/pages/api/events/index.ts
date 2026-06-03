import type { NextApiRequest, NextApiResponse } from "next";
import { getEventSummaries } from "@/lib/events";
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

  const { category, city_id } = req.query;

  if (Array.isArray(category)) {
    return res.status(400).json({ message: "Category must be a single value" });
  }

  if (Array.isArray(city_id)) {
    return res.status(400).json({ message: "City id must be a single value" });
  }

  const cityIdFilter = city_id ? Number(city_id) : undefined;

  return res.status(200).json({
    events: getEventSummaries({ category, cityId: cityIdFilter }),
  });
}

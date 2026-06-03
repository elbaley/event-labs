import type { NextApiRequest, NextApiResponse } from "next";
import { parseCityId } from "@/lib/cities";
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

  const { city_id } = req.query;

  if (Array.isArray(city_id)) {
    return res.status(400).json({ message: "City id must be a single value" });
  }

  if (city_id && parseCityId(city_id) === undefined) {
    return res.status(400).json({ message: "City id is invalid" });
  }

  return res.status(200).json({
    events: getFeaturedEventSummaries({ cityId: parseCityId(city_id) }),
  });
}

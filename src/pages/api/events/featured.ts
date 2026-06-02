import type { NextApiRequest, NextApiResponse } from "next";
import events from "@/data/events.json";
import type { Event, EventListResponse, EventSummary } from "@/types/event";

type ErrorResponse = {
  message: string;
};

function toEventSummary(event: Event): EventSummary {
  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    location: event.location,
    date: event.date,
    city_id: event.city_id,
    category: event.category,
    cover: event.cover,
    basePrice: event.basePrice,
  };
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<EventListResponse | ErrorResponse>,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  return res.status(200).json({
    events: (events as Event[]).slice(0, 8).map(toEventSummary),
  });
}

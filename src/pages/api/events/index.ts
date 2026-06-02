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

  const { category, city_id } = req.query;

  if (Array.isArray(category)) {
    return res.status(400).json({ message: "Category must be a single value" });
  }

  if (Array.isArray(city_id)) {
    return res.status(400).json({ message: "City id must be a single value" });
  }

  const cityIdFilter = city_id ? Number(city_id) : undefined;
  const filteredEvents = (events as Event[])
    .filter((event) => {
      if (category && event.category !== category) {
        return false;
      }

      if (cityIdFilter !== undefined && event.city_id !== cityIdFilter) {
        return false;
      }

      return true;
    })
    .map(toEventSummary);

  return res.status(200).json({
    events: filteredEvents,
  });
}

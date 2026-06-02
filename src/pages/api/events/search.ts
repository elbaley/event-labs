import type { NextApiRequest, NextApiResponse } from "next";
import events from "@/data/events.json";
import type { Event, EventSearchResponse, EventSummary } from "@/types/event";

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

function normalizeSearchText(value: string): string {
  return value
    .trim()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("tr-TR");
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<EventSearchResponse | ErrorResponse>,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { keyword } = req.query;

  if (Array.isArray(keyword)) {
    return res.status(400).json({ message: "Keyword must be a single value" });
  }

  if (!keyword || !keyword.trim()) {
    return res.status(400).json({ message: "Keyword is required" });
  }

  const normalizedKeyword = normalizeSearchText(keyword);
  const matchedEvents = (events as Event[])
    .filter((event) => {
      const searchableText = normalizeSearchText(
        [
          event.title,
          event.location,
          event.category,
          event.description,
        ].join(" "),
      );

      return searchableText.includes(normalizedKeyword);
    })
    .map(toEventSummary);

  return res.status(200).json({ events: matchedEvents });
}

import type { NextApiRequest, NextApiResponse } from "next";
import { getAllEvents, toEventSummary } from "@/lib/events";
import type { EventSearchResponse } from "@/types/event";

type ErrorResponse = {
  message: string;
};

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
  const matchedEvents = getAllEvents()
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

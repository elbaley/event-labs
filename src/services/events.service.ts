import type {
  EventCategory,
  EventDetailResponse,
  EventListResponse,
  EventSearchResponse,
  EventSummary,
} from "@/types/event";
import { fetchJson } from "@/lib/api-client";

export async function getFeaturedEventsRequest(): Promise<EventSummary[]> {
  const data = await fetchJson<EventListResponse>("/api/events/featured");

  return data.events;
}

export async function getEventsRequest(
  category?: EventCategory,
): Promise<EventSummary[]> {
  const searchParams = new URLSearchParams();

  if (category) {
    searchParams.set("category", category);
  }

  const queryString = searchParams.toString();
  const data = await fetchJson<EventListResponse>(
    `/api/events${queryString ? `?${queryString}` : ""}`,
  );

  return data.events;
}

export async function getEventDetailRequest(slug: string) {
  const data = await fetchJson<EventDetailResponse>(
    `/api/events/${encodeURIComponent(slug)}`,
  );

  return data.event;
}

export async function searchEventsRequest(
  keyword: string,
): Promise<EventSummary[]> {
  const searchParams = new URLSearchParams({ keyword });
  const data = await fetchJson<EventSearchResponse>(
    `/api/events/search?${searchParams.toString()}`,
  );

  return data.events;
}

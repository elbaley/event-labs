import type {
  EventListResponse,
  EventSearchResponse,
  EventSummary,
} from "@/types/event";
import { fetchJson } from "@/lib/api-client";

export async function searchEventsRequest(
  keyword: string,
  options?: { cityId?: number },
  init?: RequestInit,
): Promise<EventSummary[]> {
  const searchParams = new URLSearchParams({ keyword });

  if (options?.cityId !== undefined) {
    searchParams.set("city_id", `${options.cityId}`);
  }

  const data = await fetchJson<EventSearchResponse>(
    `/api/events/search?${searchParams.toString()}`,
    init,
  );

  return data.events;
}

export async function getFeaturedEventsRequest(
  cityId: number,
  init?: RequestInit,
): Promise<EventSummary[]> {
  const searchParams = new URLSearchParams({ city_id: `${cityId}` });
  const data = await fetchJson<EventListResponse>(
    `/api/events/featured?${searchParams.toString()}`,
    init,
  );

  return data.events;
}

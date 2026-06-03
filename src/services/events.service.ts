import type {
  EventSearchResponse,
  EventSummary,
} from "@/types/event";
import { fetchJson } from "@/lib/api-client";

export async function searchEventsRequest(
  keyword: string,
  init?: RequestInit,
): Promise<EventSummary[]> {
  const searchParams = new URLSearchParams({ keyword });
  const data = await fetchJson<EventSearchResponse>(
    `/api/events/search?${searchParams.toString()}`,
    init,
  );

  return data.events;
}

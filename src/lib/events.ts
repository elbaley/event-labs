import events from "@/data/events.json";
import type { Event, EventCategory, EventSummary } from "@/types/event";

const allEvents = events as Event[];

export function toEventSummary(event: Event): EventSummary {
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

export function getAllEvents(): Event[] {
  return allEvents;
}

export function getEventBySlug(slug: string): Event | undefined {
  return allEvents.find((event) => event.slug === slug);
}

export function getFeaturedEventSummaries(options?: {
  cityId?: number;
}): EventSummary[] {
  return allEvents
    .filter((event) => {
      if (options?.cityId !== undefined && event.city_id !== options.cityId) {
        return false;
      }

      return true;
    })
    .slice(0, 8)
    .map(toEventSummary);
}

export function getEventSummariesByCategory(
  category: EventCategory,
): EventSummary[] {
  return allEvents
    .filter((event) => event.category === category)
    .map(toEventSummary);
}

export function getEventSummaries(options?: {
  category?: string;
  cityId?: number;
}): EventSummary[] {
  return allEvents
    .filter((event) => {
      if (options?.category && event.category !== options.category) {
        return false;
      }

      if (options?.cityId !== undefined && event.city_id !== options.cityId) {
        return false;
      }

      return true;
    })
    .map(toEventSummary);
}

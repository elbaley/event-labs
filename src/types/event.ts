export type EventCategory = "concert" | "theatre" | "sport";

export type Event = {
  id: string;
  slug: string;
  title: string;
  location: string;
  date: string;
  city_id: number;
  category: EventCategory;
  description: string;
  cover: string;
  basePrice: number;
};

export type EventSummary = Pick<
  Event,
  | "id"
  | "slug"
  | "title"
  | "location"
  | "date"
  | "city_id"
  | "category"
  | "cover"
  | "basePrice"
>;

export type EventListResponse = {
  events: EventSummary[];
};

export type EventDetailResponse = {
  event: Event;
};

export type EventSearchResponse = EventListResponse;

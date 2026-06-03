import { EventSummaryCard } from "@/components/events/event-summary-card";
import { useCityPreference } from "@/hooks/use-city-preference";
import type { EventSummary } from "@/types/event";

type CityFilteredEventGridProps = {
  emptyMessage: string;
  events: EventSummary[];
};

export function CityFilteredEventGrid({
  emptyMessage,
  events,
}: CityFilteredEventGridProps) {
  const { selectedCityId } = useCityPreference();
  const visibleEvents =
    selectedCityId === undefined
      ? events
      : events.filter((event) => event.city_id === selectedCityId);

  if (visibleEvents.length === 0) {
    return (
      <div className="rounded-md border bg-card p-6 text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {visibleEvents.map((event) => (
        <EventSummaryCard key={event.id} event={event} />
      ))}
    </div>
  );
}

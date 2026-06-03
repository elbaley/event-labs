import { FeaturedEventsCarousel } from "@/components/events/featured-events-carousel";
import type { EventSummary } from "@/types/event";

type FeaturedEventsSectionProps = {
  events: EventSummary[];
};

export function FeaturedEventsSection({ events }: FeaturedEventsSectionProps) {
  return (
    <section id="featured-events" className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Öne çıkan etkinlikler</h2>
          <p className="text-sm text-muted-foreground">
            Yaklaşan popüler etkinliklerden seçili programlar.
          </p>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="rounded-md border bg-card p-6 text-sm text-muted-foreground">
          Yaklaşan bir etkinlik yok, yakında yeni etkinliklerde buluşmak üzere!
        </div>
      ) : (
        <FeaturedEventsCarousel events={events} />
      )}
    </section>
  );
}

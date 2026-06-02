import { FeaturedEventsCarousel } from "@/components/events/featured-events-carousel";
import { useFeaturedEvents } from "@/hooks/use-events";

export function FeaturedEventsSection() {
  const { events, isLoading, error } = useFeaturedEvents();

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

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-96 animate-pulse rounded-md border bg-muted"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-md border bg-card p-6 text-sm text-muted-foreground">
          {error}
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-md border bg-card p-6 text-sm text-muted-foreground">
          Yaklaşan bir etkinlik yok, yakında yeni etkinliklerde buluşmak üzere!
        </div>
      ) : (
        <FeaturedEventsCarousel events={events} />
      )}
    </section>
  );
}

import { useEffect, useMemo, useState } from "react";
import { FeaturedEventsCarousel } from "@/components/events/featured-events-carousel";
import { useCityPreference } from "@/hooks/use-city-preference";
import { getFeaturedEventsRequest } from "@/services/events.service";
import type { EventSummary } from "@/types/event";

type FeaturedEventsSectionProps = {
  events: EventSummary[];
};

type CityEventsRequestState = {
  cityId: number;
  error: string | null;
  events: EventSummary[] | null;
};

export function FeaturedEventsSection({ events }: FeaturedEventsSectionProps) {
  const { selectedCityId } = useCityPreference();
  const [requestState, setRequestState] =
    useState<CityEventsRequestState | null>(null);

  useEffect(() => {
    if (selectedCityId === undefined) {
      return;
    }

    const controller = new AbortController();

    getFeaturedEventsRequest(selectedCityId, { signal: controller.signal })
      .then((cityEvents) => {
        setRequestState({
          cityId: selectedCityId,
          error: null,
          events: cityEvents,
        });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setRequestState({
          cityId: selectedCityId,
          error:
            error instanceof Error
              ? error.message
              : "Etkinlikler yüklenemedi.",
          events: null,
        });
      });

    return () => {
      controller.abort();
    };
  }, [selectedCityId]);

  const activeRequestState =
    requestState?.cityId === selectedCityId ? requestState : null;

  const visibleEvents = useMemo(() => {
    if (selectedCityId === undefined) {
      return events;
    }

    return (
      activeRequestState?.events ??
      events.filter((event) => event.city_id === selectedCityId)
    );
  }, [activeRequestState, events, selectedCityId]);

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

      {activeRequestState?.error ? (
        <div className="rounded-md border bg-card p-6 text-sm text-muted-foreground">
          {activeRequestState.error}
        </div>
      ) : visibleEvents.length === 0 ? (
        <div className="rounded-md border bg-card p-6 text-sm text-muted-foreground">
          Yaklaşan bir etkinlik yok, yakında yeni etkinliklerde buluşmak üzere!
        </div>
      ) : (
        <FeaturedEventsCarousel events={visibleEvents} />
      )}
    </section>
  );
}

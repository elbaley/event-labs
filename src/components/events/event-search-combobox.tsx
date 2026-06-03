"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { useCityPreference } from "@/hooks/use-city-preference";
import { searchEventsRequest } from "@/services/events.service";
import type { EventSummary } from "@/types/event";

const minSearchLength = 3;
const searchDebounceMs = 300;

function formatEventDate(date: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

type EventSearchComboboxProps = {
  className?: string;
};

export function EventSearchCombobox({ className }: EventSearchComboboxProps) {
  const { selectedCityId } = useCityPreference();
  const [query, setQuery] = useState("");
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmedQuery = query.trim();
  const canSearch = trimmedQuery.length >= minSearchLength;

  useEffect(() => {
    if (!canSearch) {
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      setIsLoading(true);

      searchEventsRequest(
        trimmedQuery,
        { cityId: selectedCityId },
        { signal: controller.signal },
      )
        .then(setEvents)
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === "AbortError") {
            return;
          }

          setError(
            error instanceof Error ? error.message : "Etkinlikler aranamadı.",
          );
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setIsLoading(false);
          }
        });
    }, searchDebounceMs);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [canSearch, selectedCityId, trimmedQuery]);

  function handleInputValueChange(value: string) {
    setQuery(value);
    setEvents([]);
    setError(null);
    setIsLoading(false);
  }

  const emptyMessage = !canSearch
    ? "Aramak için en az 3 karakter yazın."
    : isLoading
      ? "Etkinlikler aranıyor..."
      : error
        ? error
        : "Sonuç bulunamadı.";

  return (
    <Combobox<EventSummary>
      filter={null}
      inputValue={query}
      itemToStringLabel={(event) => event.title}
      itemToStringValue={(event) => event.slug}
      items={events}
      onInputValueChange={handleInputValueChange}
    >
      <ComboboxInput
        placeholder="Etkinlik, sanatçı ya da mekan arayın."
        showClear
        className={className}
      />
      <ComboboxContent>
        <ComboboxList>
          {events.map((event, index) => (
            <ComboboxItem
              key={event.id}
              index={index}
              value={event}
              render={<Link href={`/event/${encodeURIComponent(event.slug)}`} />}
              className="items-start gap-3 py-3 pr-3"
            >
              <span className="flex min-w-0 flex-col gap-1">
                <span className="truncate font-medium">{event.title}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {event.location}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatEventDate(event.date)}
                </span>
              </span>
            </ComboboxItem>
          ))}
          <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

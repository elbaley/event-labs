import { useEffect, useState } from "react";
import { getFeaturedEventsRequest } from "@/services/events.service";
import type { EventSummary } from "@/types/event";

type FeaturedEventsState = {
  events: EventSummary[];
  isLoading: boolean;
  error: string | null;
};

export function useFeaturedEvents() {
  const [state, setState] = useState<FeaturedEventsState>({
    events: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadFeaturedEvents() {
      try {
        const events = await getFeaturedEventsRequest();

        if (!isMounted) return;
        setState({ events, isLoading: false, error: null });
      } catch (error) {
        if (!isMounted) return;
        setState({
          events: [],
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Etkinlikler yüklenemedi.",
        });
      }
    }

    loadFeaturedEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}

import { useEffect, useState } from "react";
import {
  getEventsRequest,
  getFeaturedEventsRequest,
} from "@/services/events.service";
import type { EventCategory, EventSummary } from "@/types/event";

type FeaturedEventsState = {
  events: EventSummary[];
  isLoading: boolean;
  error: string | null;
};

type EventsState = FeaturedEventsState & {
  category?: EventCategory;
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

export function useEvents(category?: EventCategory) {
  const [state, setState] = useState<EventsState>({
    events: [],
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (!category) {
      return;
    }

    let isMounted = true;

    async function loadEvents() {
      setState((currentState) => ({
        ...currentState,
        isLoading: true,
        error: null,
      }));

      try {
        const events = await getEventsRequest(category);

        if (!isMounted) return;
        setState({ category, events, isLoading: false, error: null });
      } catch (error) {
        if (!isMounted) return;
        setState({
          category,
          events: [],
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Etkinlikler yüklenemedi.",
        });
      }
    }

    loadEvents();

    return () => {
      isMounted = false;
    };
  }, [category]);

  return {
    events: state.category === category ? state.events : [],
    isLoading: Boolean(category) && (state.category !== category || state.isLoading),
    error: state.category === category ? state.error : null,
  };
}

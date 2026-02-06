"use client";

import { useState, useEffect, useCallback } from "react";
import type { Event } from "@/types/event.types";

interface UseEventsReturn {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useEvents(options?: { upcoming?: boolean }): UseEventsReturn {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (options?.upcoming) {
        params.set("upcoming", "true");
      }
      const url = `/api/events${params.toString() ? `?${params}` : ""}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      setEvents(Array.isArray(data) ? data : data.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [options?.upcoming]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, isLoading, error, refetch: fetchEvents };
}

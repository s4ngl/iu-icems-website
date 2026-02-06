"use client";

import { useState, useEffect, useCallback } from "react";
import type { TrainingSession } from "@/types/training.types";

interface UseTrainingReturn {
  sessions: TrainingSession[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTraining(): UseTrainingReturn {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/training");
      if (!response.ok) {
        throw new Error("Failed to fetch training sessions");
      }
      const data = await response.json();
      setSessions(Array.isArray(data) ? data : data.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return { sessions, isLoading, error, refetch: fetchSessions };
}

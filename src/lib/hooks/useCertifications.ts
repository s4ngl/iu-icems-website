"use client";

import { useState, useEffect, useCallback } from "react";
import type { Certification } from "@/types/certification.types";

interface UseCertificationsReturn {
  certifications: Certification[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCertifications(): UseCertificationsReturn {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCertifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/certifications");
      if (!response.ok) {
        throw new Error("Failed to fetch certifications");
      }
      const data = await response.json();
      setCertifications(Array.isArray(data) ? data : data.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCertifications();
  }, [fetchCertifications]);

  return { certifications, isLoading, error, refetch: fetchCertifications };
}

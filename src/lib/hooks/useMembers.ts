"use client";

import { useState, useEffect, useCallback } from "react";
import type { Member } from "@/types/member.types";

interface UseMembersReturn {
  members: Member[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useMembers(options?: {
  search?: string;
  status?: number;
}): UseMembersReturn {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (options?.search) {
        params.set("search", options.search);
      }
      if (options?.status !== undefined) {
        params.set("status", String(options.status));
      }
      const url = `/api/members${params.toString() ? `?${params}` : ""}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }
      const data = await response.json();
      setMembers(Array.isArray(data) ? data : data.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [options?.search, options?.status]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return { members, isLoading, error, refetch: fetchMembers };
}

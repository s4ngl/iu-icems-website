"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Member } from "@/types/member.types";
import type { AuthUser } from "@/types/auth.types";

interface UseUserReturn {
  user: AuthUser | null;
  profile: Member | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (
    updates: Partial<Member>
  ) => Promise<{ error: string | null }>;
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchProfile = useCallback(
    async (userId: string) => {
      const { data, error: fetchError } = await supabase
        .from("members")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setProfile(data);
      }
    },
    [supabase]
  );

  useEffect(() => {
    const init = async () => {
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();
        setUser(currentUser);
        if (currentUser) {
          await fetchProfile(currentUser.id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [supabase, fetchProfile]);

  const updateProfile = useCallback(
    async (
      updates: Partial<Member>
    ): Promise<{ error: string | null }> => {
      if (!user) {
        return { error: "Not authenticated" };
      }

      const { error: updateError } = await supabase
        .from("members")
        .update(updates)
        .eq("user_id", user.id);

      if (updateError) {
        return { error: updateError.message };
      }

      await fetchProfile(user.id);
      return { error: null };
    },
    [supabase, user, fetchProfile]
  );

  return { user, profile, isLoading, error, updateProfile };
}

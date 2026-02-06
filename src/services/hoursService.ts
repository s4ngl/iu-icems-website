import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

type EventHours = Database["public"]["Tables"]["event_hours"]["Row"];

export async function getHoursForMember(
  userId: string
): Promise<EventHours[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("event_hours")
    .select("*")
    .eq("user_id", userId)
    .order("confirmed_date", { ascending: false });

  if (error) return [];
  return data;
}

export async function confirmHours(
  hourId: string,
  confirmedHours: number,
  confirmedBy: string
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("event_hours")
    .update({
      confirmed_hours: confirmedHours,
      confirmed_by: confirmedBy,
      is_confirmed: true,
      confirmed_date: new Date().toISOString(),
    })
    .eq("hour_id", hourId);

  return { error: error?.message ?? null };
}

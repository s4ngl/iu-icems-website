import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

type PenaltyPoint = Database["public"]["Tables"]["penalty_points"]["Row"];

export async function getPenaltyPoints(
  userId: string
): Promise<PenaltyPoint[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("penalty_points")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("assigned_date", { ascending: false });

  if (error) return [];
  return data;
}

export async function addPenaltyPoints(
  userId: string,
  points: number,
  reason: string,
  assignedBy: string,
  autoRemoveDate?: string
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from("penalty_points").insert({
    user_id: userId,
    points,
    reason,
    assigned_by: assignedBy,
    auto_remove_date: autoRemoveDate || null,
  });

  return { error: error?.message ?? null };
}

export async function removePenaltyPoint(
  pointId: string
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("penalty_points")
    .update({ is_active: false })
    .eq("point_id", pointId);

  return { error: error?.message ?? null };
}

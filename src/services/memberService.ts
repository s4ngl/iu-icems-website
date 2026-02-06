import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

type Member = Database["public"]["Tables"]["members"]["Row"];
type MemberUpdate = Database["public"]["Tables"]["members"]["Update"];

export async function getMemberById(userId: string): Promise<Member | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) return null;
  return data;
}

export async function getAllMembers(): Promise<Member[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("last_name");

  if (error) return [];
  return data;
}

export async function updateMember(
  userId: string,
  updates: MemberUpdate
): Promise<{ data: Member | null; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("members")
    .update(updates)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function updateDuesStatus(
  userId: string,
  duesPaid: boolean,
  duesExpiration?: string
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("members")
    .update({
      dues_paid: duesPaid,
      dues_expiration: duesExpiration || null,
    })
    .eq("user_id", userId);

  return { error: error?.message ?? null };
}

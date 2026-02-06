import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

type Member = Database["public"]["Tables"]["members"]["Row"];

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

export async function getCurrentSession() {
  const supabase = await createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    return null;
  }

  return session;
}

export async function getCurrentMember(): Promise<Member | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error || !data) return null;
  return data;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}

export async function requireMember() {
  const member = await getCurrentMember();
  if (!member) {
    throw new Error("Member profile required");
  }
  return member;
}
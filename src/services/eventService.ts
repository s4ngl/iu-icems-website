import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

type Event = Database["public"]["Tables"]["events"]["Row"];
type EventInsert = Database["public"]["Tables"]["events"]["Insert"];
type EventUpdate = Database["public"]["Tables"]["events"]["Update"];
type EventSignup = Database["public"]["Tables"]["event_signups"]["Row"];

export async function getEvents(): Promise<Event[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });

  if (error) return [];
  return data;
}

export async function getEventById(eventId: string): Promise<Event | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("event_id", eventId)
    .single();

  if (error) return null;
  return data;
}

export async function createEvent(
  event: EventInsert
): Promise<{ data: Event | null; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .insert(event)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function updateEvent(
  eventId: string,
  updates: EventUpdate
): Promise<{ data: Event | null; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .update(updates)
    .eq("event_id", eventId)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function deleteEvent(
  eventId: string
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("events")
    .delete()
    .eq("event_id", eventId);

  return { error: error?.message ?? null };
}

export async function signUpForEvent(
  eventId: string,
  userId: string,
  positionType: number
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from("event_signups").insert({
    event_id: eventId,
    user_id: userId,
    position_type: positionType,
  });

  return { error: error?.message ?? null };
}

export async function getEventWaitlist(
  eventId: string
): Promise<EventSignup[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("event_signups")
    .select("*")
    .eq("event_id", eventId)
    .order("signup_time", { ascending: true });

  if (error) return [];
  return data;
}

export async function assignMember(
  signupId: string,
  assignedBy: string
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("event_signups")
    .update({
      is_assigned: true,
      assigned_by: assignedBy,
      assigned_time: new Date().toISOString(),
    })
    .eq("signup_id", signupId);

  return { error: error?.message ?? null };
}

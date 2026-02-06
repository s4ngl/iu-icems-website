import type { Database } from "./database.types";

export type Event = Database["public"]["Tables"]["events"]["Row"];
export type EventInsert = Database["public"]["Tables"]["events"]["Insert"];
export type EventUpdate = Database["public"]["Tables"]["events"]["Update"];
export type EventSignup =
  Database["public"]["Tables"]["event_signups"]["Row"];
export type EventSignupInsert =
  Database["public"]["Tables"]["event_signups"]["Insert"];
export type EventHours = Database["public"]["Tables"]["event_hours"]["Row"];
export type EventHoursInsert =
  Database["public"]["Tables"]["event_hours"]["Insert"];
export type EventHoursUpdate =
  Database["public"]["Tables"]["event_hours"]["Update"];

export const POSITION_TYPE_LABELS: Record<number, string> = {
  0: "Supervisor",
  1: "EMT",
  2: "FA/EMR",
};

export interface EventWithSignups extends Event {
  signups?: EventSignup[];
  signup_count?: number;
}
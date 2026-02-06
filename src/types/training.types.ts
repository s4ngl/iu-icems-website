import type { Database } from "./database.types";

export type TrainingSession =
  Database["public"]["Tables"]["training_sessions"]["Row"];
export type TrainingSessionInsert =
  Database["public"]["Tables"]["training_sessions"]["Insert"];
export type TrainingSessionUpdate =
  Database["public"]["Tables"]["training_sessions"]["Update"];
export type TrainingSignup =
  Database["public"]["Tables"]["training_signups"]["Row"];
export type TrainingSignupInsert =
  Database["public"]["Tables"]["training_signups"]["Insert"];

export const SIGNUP_TYPE_LABELS: Record<number, string> = {
  0: "CPR Only",
  1: "First Aid Only",
  2: "Both",
};
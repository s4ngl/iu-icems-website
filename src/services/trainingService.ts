import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

type TrainingSession = Database["public"]["Tables"]["training_sessions"]["Row"];
type TrainingSessionInsert = Database["public"]["Tables"]["training_sessions"]["Insert"];

export async function getTrainingSessions(): Promise<TrainingSession[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("training_sessions")
    .select("*")
    .order("training_date", { ascending: true });

  if (error) return [];
  return data;
}

export async function createTrainingSession(
  session: TrainingSessionInsert
): Promise<{ data: TrainingSession | null; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("training_sessions")
    .insert(session)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function signUpForTraining(
  trainingId: string,
  userId: string,
  signupType: number
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from("training_signups").insert({
    training_id: trainingId,
    user_id: userId,
    signup_type: signupType,
  });

  return { error: error?.message ?? null };
}

export async function confirmTrainingPayment(
  signupId: string,
  confirmedBy: string
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("training_signups")
    .update({
      payment_confirmed: true,
      confirmed_by: confirmedBy,
    })
    .eq("signup_id", signupId);

  return { error: error?.message ?? null };
}

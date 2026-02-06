import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

type Event = Database["public"]["Tables"]["events"]["Row"];
type TrainingSession = Database["public"]["Tables"]["training_sessions"]["Row"];

export interface CalendarData {
  events: Event[];
  trainingSessions: TrainingSession[];
}

export async function getCalendarData(): Promise<CalendarData> {
  const supabase = await createClient();

  const [eventsResult, trainingResult] = await Promise.all([
    supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true }),
    supabase
      .from("training_sessions")
      .select("*")
      .order("training_date", { ascending: true }),
  ]);

  return {
    events: eventsResult.data ?? [],
    trainingSessions: trainingResult.data ?? [],
  };
}

export async function getCalendarDataByMonth(
  month: number,
  year: number
): Promise<CalendarData> {
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endMonth = month === 12 ? 1 : month + 1;
  const endYear = month === 12 ? year + 1 : year;
  const endDate = `${endYear}-${String(endMonth).padStart(2, "0")}-01`;

  const supabase = await createClient();

  const [eventsResult, trainingResult] = await Promise.all([
    supabase
      .from("events")
      .select("*")
      .gte("event_date", startDate)
      .lt("event_date", endDate)
      .order("event_date", { ascending: true }),
    supabase
      .from("training_sessions")
      .select("*")
      .gte("training_date", startDate)
      .lt("training_date", endDate)
      .order("training_date", { ascending: true }),
  ]);

  return {
    events: eventsResult.data ?? [],
    trainingSessions: trainingResult.data ?? [],
  };
}

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

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  type: "event" | "training";
}

export async function getCalendarEvents(
  month: number,
  year: number
): Promise<CalendarEvent[]> {
  const data = await getCalendarDataByMonth(month, year);

  const eventItems: CalendarEvent[] = data.events.map((e) => ({
    id: e.event_id,
    title: e.event_name,
    date: e.event_date,
    start_time: e.start_time,
    end_time: e.end_time,
    location: e.location,
    type: "event" as const,
  }));

  const trainingItems: CalendarEvent[] = data.trainingSessions.map((t) => ({
    id: t.training_id,
    title: t.training_name,
    date: t.training_date,
    start_time: t.start_time,
    end_time: t.end_time,
    location: t.location,
    type: "training" as const,
  }));

  return [...eventItems, ...trainingItems].sort(
    (a, b) => a.date.localeCompare(b.date) || a.start_time.localeCompare(b.start_time)
  );
}

export async function getUpcomingEvents(days: number = 7): Promise<CalendarEvent[]> {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);

  const todayStr = today.toISOString().split("T")[0];
  const futureStr = futureDate.toISOString().split("T")[0];

  const supabase = await createClient();

  const [eventsResult, trainingResult] = await Promise.all([
    supabase
      .from("events")
      .select("*")
      .gte("event_date", todayStr)
      .lte("event_date", futureStr)
      .order("event_date", { ascending: true }),
    supabase
      .from("training_sessions")
      .select("*")
      .gte("training_date", todayStr)
      .lte("training_date", futureStr)
      .order("training_date", { ascending: true }),
  ]);

  const eventItems: CalendarEvent[] = (eventsResult.data ?? []).map((e) => ({
    id: e.event_id,
    title: e.event_name,
    date: e.event_date,
    start_time: e.start_time,
    end_time: e.end_time,
    location: e.location,
    type: "event" as const,
  }));

  const trainingItems: CalendarEvent[] = (trainingResult.data ?? []).map((t) => ({
    id: t.training_id,
    title: t.training_name,
    date: t.training_date,
    start_time: t.start_time,
    end_time: t.end_time,
    location: t.location,
    type: "training" as const,
  }));

  return [...eventItems, ...trainingItems].sort(
    (a, b) => a.date.localeCompare(b.date) || a.start_time.localeCompare(b.start_time)
  );
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

"use client";

import { useMemo } from "react";
import {
  startOfWeek,
  addDays,
  format,
  isSameDay,
  isToday,
} from "date-fns";
import { cn } from "@/lib/utils/cn";
import type { CalendarEvent } from "./CalendarView";

const HOUR_START = 7;
const HOUR_END = 22;
const HOURS = Array.from(
  { length: HOUR_END - HOUR_START },
  (_, i) => HOUR_START + i,
);

const typeColor: Record<CalendarEvent["type"], string> = {
  event: "bg-blue-600 border-blue-700",
  "general-training": "bg-emerald-600 border-emerald-700",
  "aha-training": "bg-orange-600 border-orange-700",
};

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export default function WeekView({
  currentDate,
  events,
  onEventClick,
}: WeekViewProps) {
  const weekStart = useMemo(() => startOfWeek(currentDate), [currentDate]);

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  const eventsForDay = (day: Date) =>
    events.filter((e) => isSameDay(new Date(e.date), day));

  const totalMinutes = (HOUR_END - HOUR_START) * 60;

  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[50rem] grid-cols-[3.5rem_repeat(7,1fr)]">
        {/* Header row */}
        <div className="border-b border-r" />
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className={cn(
              "border-b px-1 py-2 text-center text-xs font-semibold",
              isToday(day) && "bg-primary/10",
            )}
          >
            <div className="text-muted-foreground">{format(day, "EEE")}</div>
            <div
              className={cn(
                "mx-auto mt-0.5 flex size-6 items-center justify-center text-sm",
                isToday(day) && "rounded-full bg-primary text-primary-foreground",
              )}
            >
              {format(day, "d")}
            </div>
          </div>
        ))}

        {/* Time grid */}
        <div className="relative border-r">
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="flex h-12 items-start justify-end border-b pr-1.5 pt-0.5 text-[10px] text-muted-foreground"
            >
              {format(new Date(2025, 0, 1, hour), "h a")}
            </div>
          ))}
        </div>

        {weekDays.map((day) => {
          const dayEvents = eventsForDay(day);
          return (
            <div
              key={day.toISOString()}
              className={cn("relative", isToday(day) && "bg-primary/5")}
            >
              {/* Hour grid lines */}
              {HOURS.map((hour) => (
                <div key={hour} className="h-12 border-b border-r" />
              ))}

              {/* Event blocks */}
              {dayEvents.map((ev) => {
                const startMin = Math.max(0, Math.min(totalMinutes, timeToMinutes(ev.startTime) - HOUR_START * 60));
                const endMin = Math.max(0, Math.min(totalMinutes, timeToMinutes(ev.endTime) - HOUR_START * 60));
                const top = (startMin / totalMinutes) * 100;
                const height = Math.max(
                  2,
                  ((endMin - startMin) / totalMinutes) * 100,
                );

                return (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => onEventClick(ev)}
                    className={cn(
                      "absolute inset-x-0.5 cursor-pointer overflow-hidden rounded border-l-2 px-1 py-0.5 text-left text-[10px] leading-tight text-white transition-opacity hover:opacity-90",
                      typeColor[ev.type],
                    )}
                    style={{
                      top: `${top}%`,
                      height: `${height}%`,
                      minHeight: "1.25rem",
                    }}
                  >
                    <div className="truncate font-medium">{ev.title}</div>
                    <div className="truncate opacity-80">
                      {ev.startTime}–{ev.endTime}
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
"use client";

import { useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isToday,
  format,
  addDays,
} from "date-fns";
import { cn } from "@/lib/utils/cn";
import type { CalendarEvent } from "./CalendarView";

const weekDays = Array.from({ length: 7 }, (_, i) =>
  format(addDays(startOfWeek(new Date()), i), "EEE"),
);

const typeColor: Record<CalendarEvent["type"], string> = {
  event: "bg-blue-600",
  "general-training": "bg-emerald-600",
  "aha-training": "bg-orange-600",
};

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDateClick: (date: Date) => void;
}

export default function MonthView({
  currentDate,
  events,
  onDateClick,
}: MonthViewProps) {
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calStart = startOfWeek(monthStart);
    const calEnd = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentDate]);

  const eventsForDay = (day: Date) =>
    events.filter((e) => isSameDay(new Date(e.date), day));

  return (
    <div className="grid grid-cols-7">
      {weekDays.map((wd) => (
        <div
          key={wd}
          className="border-b py-1.5 text-center text-xs font-semibold uppercase text-muted-foreground"
        >
          {wd}
        </div>
      ))}

      {days.map((day) => {
        const inMonth = isSameMonth(day, currentDate);
        const today = isToday(day);
        const dayEvents = eventsForDay(day);

        return (
          <button
            key={day.toISOString()}
            type="button"
            onClick={() => dayEvents.length > 0 && onDateClick(day)}
            className={cn(
              "flex min-h-[4.5rem] flex-col border-b border-r p-1 text-left transition-colors",
              !inMonth && "bg-muted/40 text-muted-foreground/50",
              dayEvents.length > 0 && "cursor-pointer hover:bg-muted/60",
              dayEvents.length === 0 && "cursor-default",
            )}
          >
            <span
              className={cn(
                "inline-flex size-6 items-center justify-center text-xs font-semibold",
                today && "rounded-full bg-primary text-primary-foreground",
              )}
            >
              {format(day, "d")}
            </span>

            {inMonth && dayEvents.length > 0 && (
              <div className="mt-auto flex flex-col gap-0.5">
                {dayEvents.slice(0, 2).map((ev) => (
                  <span
                    key={ev.id}
                    className={cn(
                      "truncate rounded px-1 py-px text-[9px] font-medium leading-tight text-white",
                      typeColor[ev.type],
                    )}
                  >
                    {ev.title}
                  </span>
                ))}
                {dayEvents.length > 2 && (
                  <span className="text-[9px] text-muted-foreground">
                    +{dayEvents.length - 2} more
                  </span>
                )}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
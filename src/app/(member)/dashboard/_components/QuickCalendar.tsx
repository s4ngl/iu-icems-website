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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface QuickCalendarProps {
  eventDates?: Date[];
}

const now = new Date();

const defaultEventDates = [
  new Date(now.getFullYear(), now.getMonth(), 7),
  new Date(now.getFullYear(), now.getMonth(), 14),
  new Date(now.getFullYear(), now.getMonth(), 21),
];

const weekDays = Array.from({ length: 7 }, (_, i) =>
  format(addDays(startOfWeek(new Date()), i), "EEEEEE"),
);

export default function QuickCalendar({ eventDates = defaultEventDates }: QuickCalendarProps) {
  const today = new Date();

  const days = useMemo(() => {
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const calStart = startOfWeek(monthStart);
    const calEnd = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: calStart, end: calEnd });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today.getMonth(), today.getFullYear()]);

  const hasEvent = (day: Date) => eventDates.some((d) => isSameDay(d, day));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{format(today, "MMMM yyyy")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 text-center text-xs">
          {weekDays.map((d) => (
            <div key={d} className="pb-2 font-medium text-muted-foreground">
              {d}
            </div>
          ))}

          {days.map((day) => {
            const inMonth = isSameMonth(day, today);
            const current = isToday(day);
            const event = hasEvent(day);

            return (
              <div
                key={day.toISOString()}
                className={`relative flex items-center justify-center py-1 text-sm ${
                  !inMonth ? "text-muted-foreground/30" : ""
                } ${current ? "font-bold text-primary" : ""}`}
              >
                {current ? (
                  <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    {format(day, "d")}
                  </span>
                ) : (
                  format(day, "d")
                )}
                {event && inMonth && (
                  <span className="absolute bottom-0 left-1/2 size-1 -translate-x-1/2 rounded-full bg-sky-500" />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
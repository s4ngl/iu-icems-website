"use client";

import { useState, useCallback } from "react";
import { addMonths, subMonths, addWeeks, subWeeks, format, isSameDay } from "date-fns";
import {
  IconChevronLeft,
  IconChevronRight,
  IconCalendarMonth,
} from "@tabler/icons-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import EventPopup from "./EventPopup";

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  type: "event" | "general-training" | "aha-training";
  role?: string;
}

interface CalendarViewProps {
  events: CalendarEvent[];
  view: "month" | "week";
}

export default function CalendarView({ events, view }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);

  const goNext = () =>
    setCurrentDate((d) => (view === "month" ? addMonths(d, 1) : addWeeks(d, 1)));

  const goPrev = () =>
    setCurrentDate((d) => (view === "month" ? subMonths(d, 1) : subWeeks(d, 1)));

  const goToday = () => setCurrentDate(new Date());

  const title =
    view === "month"
      ? format(currentDate, "MMMM yyyy")
      : `Week of ${format(currentDate, "MMM d, yyyy")}`;

  const handleDateClick = useCallback(
    (date: Date) => {
      const dayEvents = events.filter((e) =>
        isSameDay(new Date(e.date), date),
      );
      if (dayEvents.length > 0) {
        setSelectedEvent(dayEvents[0]);
        setPopupOpen(true);
      }
    },
    [events],
  );

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setPopupOpen(true);
  }, []);

  return (
    <>
      <Card>
        <CardHeader className="flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <IconCalendarMonth
              className="size-5 text-muted-foreground"
              stroke={1.5}
            />
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>
                {view === "month"
                  ? "Tap a date for event details"
                  : "Click an event for details"}
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon-sm" onClick={goPrev}>
              <IconChevronLeft className="size-4" />
              <span className="sr-only">Previous</span>
            </Button>
            <Button variant="outline" size="sm" onClick={goToday}>
              Today
            </Button>
            <Button variant="outline" size="icon-sm" onClick={goNext}>
              <IconChevronRight className="size-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          {view === "month" ? (
            <MonthView
              currentDate={currentDate}
              events={events}
              onDateClick={handleDateClick}
            />
          ) : (
            <WeekView
              currentDate={currentDate}
              events={events}
              onEventClick={handleEventClick}
            />
          )}
        </CardContent>
      </Card>

      <EventPopup
        event={selectedEvent}
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
      />
    </>
  );
}
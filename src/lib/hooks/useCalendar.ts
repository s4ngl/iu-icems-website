"use client";

import { useState, useMemo, useCallback } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
} from "date-fns";

type CalendarView = "month" | "week";

interface UseCalendarReturn {
  currentDate: Date;
  view: CalendarView;
  setView: (view: CalendarView) => void;
  goToNextMonth: () => void;
  goToPrevMonth: () => void;
  goToToday: () => void;
  monthDays: Date[];
  weekDays: Date[];
}

export function useCalendar(): UseCalendarReturn {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>("month");

  const goToNextMonth = useCallback(() => {
    setCurrentDate((prev) => addMonths(prev, 1));
  }, []);

  const goToPrevMonth = useCallback(() => {
    setCurrentDate((prev) => subMonths(prev, 1));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  }, [currentDate]);

  return {
    currentDate,
    view,
    setView,
    goToNextMonth,
    goToPrevMonth,
    goToToday,
    monthDays,
    weekDays,
  };
}

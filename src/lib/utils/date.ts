import {
  format,
  parseISO,
  isAfter,
  isBefore,
  addDays,
  differenceInDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  startOfWeek,
  endOfWeek,
} from "date-fns";

function toDate(date: string | Date): Date {
  return typeof date === "string" ? parseISO(date) : date;
}

export function formatDate(date: string | Date): string {
  return format(toDate(date), "MMM d, yyyy");
}

export function formatDateShort(date: string | Date): string {
  return format(toDate(date), "M/d/yy");
}

export function formatDateLong(date: string | Date): string {
  return format(toDate(date), "EEEE, MMMM d, yyyy");
}

export function formatDateTime(date: string | Date): string {
  return format(toDate(date), "MMM d, yyyy 'at' h:mm a");
}

export function isExpired(date: string | Date): boolean {
  return isBefore(toDate(date), new Date());
}

export function isExpiringSoon(
  date: string | Date,
  daysThreshold: number = 30
): boolean {
  const d = toDate(date);
  const now = new Date();
  return isAfter(d, now) && isBefore(d, addDays(now, daysThreshold));
}

export function daysUntilExpiration(date: string | Date): number {
  return differenceInDays(toDate(date), new Date());
}

export function getMonthDays(date: Date): Date[] {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
}

export function isSameDayCheck(date1: Date, date2: Date): boolean {
  return isSameDay(date1, date2);
}

export function toISODateString(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

// Re-export isSameMonth for convenience
export { isSameMonth };

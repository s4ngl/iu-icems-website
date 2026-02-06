import { parse, format, differenceInMinutes, isBefore } from "date-fns";

function parseTime(time: string): Date {
  return parse(time, "HH:mm", new Date());
}

export function formatTime(time: string): string {
  return format(parseTime(time), "h:mm a");
}

export function formatTimeRange(startTime: string, endTime: string): string {
  return `${formatTime(startTime)} – ${formatTime(endTime)}`;
}

export function calculateDurationHours(
  startTime: string,
  endTime: string
): number {
  const start = parseTime(startTime);
  const end = parseTime(endTime);
  return differenceInMinutes(end, start) / 60;
}

export function isTimeInPast(date: string, time: string): boolean {
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);
  const dateTime = new Date(year, month - 1, day, hours, minutes);
  return isBefore(dateTime, new Date());
}

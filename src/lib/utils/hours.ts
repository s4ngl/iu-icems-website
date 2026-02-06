import { calculateDurationHours } from "./time";

export function formatHours(hours: number): string {
  return `${hours} hrs`;
}

export function calculateEventHours(
  startTime: string,
  endTime: string
): number {
  return calculateDurationHours(startTime, endTime);
}

export function getTotalConfirmedHours(
  hours: Array<{ confirmed_hours: number | null; is_confirmed: boolean }>
): number {
  return hours.reduce((total, entry) => {
    if (entry.is_confirmed && entry.confirmed_hours != null) {
      return total + entry.confirmed_hours;
    }
    return total;
  }, 0);
}

export function getTotalPendingHours(
  hours: Array<{ calculated_hours: number | null; is_confirmed: boolean }>
): number {
  return hours.reduce((total, entry) => {
    if (!entry.is_confirmed && entry.calculated_hours != null) {
      return total + entry.calculated_hours;
    }
    return total;
  }, 0);
}

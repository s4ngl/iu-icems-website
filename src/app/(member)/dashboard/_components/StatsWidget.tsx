"use client";

import {
  IconClockHour4,
  IconClockPause,
  IconFileCertificate,
  IconAlertOctagon,
} from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsWidgetProps {
  stats?: {
    totalHours: number;
    pendingHours: number;
    activeCerts: string;
    penaltyPoints: number;
  };
}

const defaultStats = {
  totalHours: 24.5,
  pendingHours: 3.0,
  activeCerts: "3 / 4",
  penaltyPoints: 0,
};

const tiles = [
  { key: "totalHours", heading: "Total Hours", accent: "text-sky-700 dark:text-sky-400", Glyph: IconClockHour4 },
  { key: "pendingHours", heading: "Pending Hours", accent: "text-amber-700 dark:text-amber-400", Glyph: IconClockPause },
  { key: "activeCerts", heading: "Active Certs", accent: "text-teal-700 dark:text-teal-400", Glyph: IconFileCertificate },
  { key: "penaltyPoints", heading: "Penalty Pts", accent: "text-rose-700 dark:text-rose-400", Glyph: IconAlertOctagon },
] as const;

export default function StatsWidget({ stats = defaultStats }: StatsWidgetProps) {
  const displayMap: Record<string, string> = {
    totalHours: String(stats.totalHours),
    pendingHours: String(stats.pendingHours),
    activeCerts: stats.activeCerts,
    penaltyPoints: String(stats.penaltyPoints),
  };

  return (
    <div className="grid gap-4 xs:grid-cols-2 lg:grid-cols-4">
      {tiles.map(({ key, heading, accent, Glyph }) => (
        <Card key={key}>
          <CardContent className="flex items-center gap-3 pt-6">
            <Glyph className={`size-7 shrink-0 ${accent}`} stroke={1.6} />
            <div className="min-w-0">
              <p className="truncate text-xs uppercase tracking-wide text-muted-foreground">
                {heading}
              </p>
              <p className="text-xl font-bold">{displayMap[key]}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
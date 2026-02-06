"use client";

import { IconAlertOctagon } from "@tabler/icons-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils/date";

interface PenaltyEntry {
  id: number;
  points: number;
  reason: string;
  date: string;
  autoRemoveDate: string;
}

const demoPenalties: PenaltyEntry[] = [
  {
    id: 1,
    points: 1,
    reason: "Late arrival to IU vs Michigan football shift",
    date: "2025-01-05",
    autoRemoveDate: "2025-07-05",
  },
  {
    id: 2,
    points: 2,
    reason: "No-show for Women's Basketball shift",
    date: "2024-12-10",
    autoRemoveDate: "2025-06-10",
  },
  {
    id: 3,
    points: 1,
    reason: "Late cancellation for Track & Field event",
    date: "2024-11-22",
    autoRemoveDate: "2025-05-22",
  },
];

function severityVariant(points: number) {
  if (points >= 3) return "destructive" as const;
  if (points === 2) return "secondary" as const;
  return "outline" as const;
}

function severityColor(points: number) {
  if (points >= 3) return "text-red-600";
  if (points === 2) return "text-amber-600";
  return "text-muted-foreground";
}

export default function PenaltyPoints() {
  const totalPoints = demoPenalties.reduce((sum, p) => sum + p.points, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="inline-flex items-center gap-2">
          <IconAlertOctagon className="size-5" stroke={1.5} />
          Penalty Points
        </CardTitle>
        <CardDescription>
          Points are automatically removed after 6 months.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Total */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Current Total:</span>
          <Badge
            variant={
              totalPoints >= 5
                ? "destructive"
                : totalPoints > 0
                  ? "secondary"
                  : "default"
            }
          >
            {totalPoints} {totalPoints === 1 ? "point" : "points"}
          </Badge>
          {totalPoints >= 5 && (
            <span className="text-xs text-destructive">
              Warning: Excessive penalty points may result in suspension.
            </span>
          )}
        </div>

        {demoPenalties.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No penalty points — keep it up!
          </p>
        ) : (
          <>
            <Separator />
            <div className="space-y-3">
              {demoPenalties.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start justify-between gap-4 text-sm"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{entry.reason}</span>
                    <span className="text-xs text-muted-foreground">
                      Issued {formatDate(entry.date)} · Removes{" "}
                      {formatDate(entry.autoRemoveDate)}
                    </span>
                  </div>
                  <Badge variant={severityVariant(entry.points)}>
                    <span className={severityColor(entry.points)}>
                      +{entry.points}
                    </span>
                  </Badge>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
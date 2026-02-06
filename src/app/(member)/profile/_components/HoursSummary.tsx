"use client";

import Link from "next/link";
import {
  IconClockHour4,
  IconArrowNarrowRight,
} from "@tabler/icons-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils/date";
import { formatHours } from "@/lib/utils/hours";

const HOURS_GOAL = 40;

const demoShifts = [
  {
    id: 1,
    eventName: "IU vs Purdue Football",
    date: "2025-01-18",
    hours: 4.5,
    confirmed: true,
  },
  {
    id: 2,
    eventName: "Men's Basketball vs Ohio State",
    date: "2025-01-12",
    hours: 3.0,
    confirmed: true,
  },
  {
    id: 3,
    eventName: "Women's Soccer Semifinal",
    date: "2025-01-08",
    hours: 5.0,
    confirmed: true,
  },
  {
    id: 4,
    eventName: "Little 500 Qualifications",
    date: "2025-02-01",
    hours: 6.0,
    confirmed: true,
  },
  {
    id: 5,
    eventName: "Track & Field Invitational",
    date: "2025-02-10",
    hours: 3.0,
    confirmed: false,
  },
  {
    id: 6,
    eventName: "Swim Meet vs Michigan",
    date: "2025-02-15",
    hours: 3.0,
    confirmed: false,
  },
];

export default function HoursSummary() {
  const confirmedHours = demoShifts
    .filter((s) => s.confirmed)
    .reduce((sum, s) => sum + s.hours, 0);
  const pendingHours = demoShifts
    .filter((s) => !s.confirmed)
    .reduce((sum, s) => sum + s.hours, 0);
  const progressPct = Math.min((confirmedHours / HOURS_GOAL) * 100, 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="inline-flex items-center gap-2">
          <IconClockHour4 className="size-5" stroke={1.5} />
          Hours Summary
        </CardTitle>
        <CardDescription>
          Your volunteer hours for the current semester.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Totals */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{formatHours(confirmedHours)}</p>
            <p className="text-xs text-muted-foreground">Confirmed</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{formatHours(pendingHours)}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{formatHours(HOURS_GOAL)}</p>
            <p className="text-xs text-muted-foreground">Goal</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{Math.round(progressPct)}% of semester goal</span>
            <span>
              {formatHours(confirmedHours)} / {formatHours(HOURS_GOAL)}
            </span>
          </div>
          <Progress value={progressPct} />
        </div>

        <Separator />

        {/* Recent shifts */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Recent Shifts</h4>
          <div className="space-y-2">
            {demoShifts.map((shift) => (
              <div
                key={shift.id}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{shift.eventName}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(shift.date)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{formatHours(shift.hours)}</span>
                  <Badge variant={shift.confirmed ? "default" : "secondary"}>
                    {shift.confirmed ? "Confirmed" : "Pending"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button variant="outline" size="sm" asChild>
          <Link href="/events">
            View All Events
            <IconArrowNarrowRight className="ml-1 size-4" stroke={1.5} />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
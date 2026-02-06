"use client";

import { IconActivity } from "@tabler/icons-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RecentEvent {
  eventTitle: string;
  dateStr: string;
  hoursLogged: number;
}

interface RecentEventsProps {
  events?: RecentEvent[];
}

const defaultEvents: RecentEvent[] = [
  { eventTitle: "Women's Soccer — Senior Night", dateStr: "Nov 30", hoursLogged: 4.0 },
  { eventTitle: "Swim & Dive Invitational Day 2", dateStr: "Nov 22", hoursLogged: 6.5 },
  { eventTitle: "Swim & Dive Invitational Day 1", dateStr: "Nov 21", hoursLogged: 5.0 },
  { eventTitle: "Monthly Skills Review", dateStr: "Nov 15", hoursLogged: 2.0 },
];

export default function RecentEvents({ events = defaultEvents }: RecentEventsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="inline-flex items-center gap-2">
          <IconActivity className="size-5" stroke={1.5} />
          Recent Activity
        </CardTitle>
        <CardDescription>Hours credited from recent shifts</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="divide-y">
          {events.map((c) => (
            <li
              key={c.eventTitle}
              className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
            >
              <span>
                <span className="font-medium">{c.eventTitle}</span>
                <span className="ml-2 text-sm text-muted-foreground">{c.dateStr}</span>
              </span>
              <Badge variant="secondary">{c.hoursLogged} hrs</Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
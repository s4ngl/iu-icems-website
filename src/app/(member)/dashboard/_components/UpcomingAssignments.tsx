"use client";

import Link from "next/link";
import {
  IconCalendarDue,
  IconMapPinFilled,
  IconArrowNarrowRight,
} from "@tabler/icons-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Assignment {
  eventTitle: string;
  dateTime: string;
  crewRole: string;
  venueName: string;
}

interface UpcomingAssignmentsProps {
  assignments?: Assignment[];
}

const defaultAssignments: Assignment[] = [
  {
    eventTitle: "Little 500 Practice — Day 1",
    dateTime: "Dec 14 · 8 AM–4 PM",
    crewRole: "EMT",
    venueName: "Bill Armstrong Stadium",
  },
  {
    eventTitle: "IU Basketball vs. Purdue",
    dateTime: "Dec 21 · 2–6 PM",
    crewRole: "FA / EMR",
    venueName: "Simon Skjodt Assembly Hall",
  },
];

export default function UpcomingAssignments({
  assignments = defaultAssignments,
}: UpcomingAssignmentsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Assignments</CardTitle>
        <CardDescription>Shifts you&apos;re confirmed for</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {assignments.map((s) => (
          <div key={s.eventTitle} className="rounded-md border px-3 py-2.5">
            <p className="flex items-start justify-between gap-2">
              <span className="font-medium leading-snug">{s.eventTitle}</span>
              <Badge variant="outline" className="shrink-0">
                {s.crewRole}
              </Badge>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              <IconCalendarDue className="mr-1 inline size-3.5 align-[-2px]" stroke={1.5} />
              {s.dateTime}
              <IconMapPinFilled className="ml-3 mr-1 inline size-3.5 align-[-2px]" stroke={1.5} />
              {s.venueName}
            </p>
          </div>
        ))}

        <Button variant="ghost" size="sm" className="mt-1 self-start" asChild>
          <Link href="/events">
            Browse all events
            <IconArrowNarrowRight className="ml-1 size-4" stroke={1.5} />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
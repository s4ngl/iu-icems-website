"use client";

import Link from "next/link";
import { format, parseISO } from "date-fns";
import {
  IconCalendarEvent,
  IconClockHour3,
  IconMapPin2,
  IconUsersGroup,
  IconLock,
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
import type { Event } from "@/types/event.types";

interface EventCardProps {
  event: Event;
}

function formatTime(time: string): string {
  const [h, m] = time.split(":");
  const date = new Date(2000, 0, 1, Number(h), Number(m));
  return format(date, "h:mm a");
}

export default function EventCard({ event }: EventCardProps) {
  const dateStr = format(parseISO(event.event_date), "MMMM d, yyyy");
  const timeStr = `${formatTime(event.start_time)} – ${formatTime(event.end_time)}`;

  const slots: { label: string; tone: "default" | "secondary" | "outline" }[] =
    [];
  if (event.emt_needed > 0)
    slots.push({
      label: `${event.emt_needed} EMT${event.emt_needed > 1 ? "s" : ""} needed`,
      tone: "default",
    });
  if (event.fa_emr_needed > 0)
    slots.push({
      label: `${event.fa_emr_needed} FA/EMR needed`,
      tone: "secondary",
    });
  if (event.supervisor_needed > 0)
    slots.push({
      label: `${event.supervisor_needed} Supervisor${event.supervisor_needed > 1 ? "s" : ""}`,
      tone: "outline",
    });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{event.event_name}</CardTitle>
          {event.is_finalized && (
            <Badge variant="outline" className="shrink-0 gap-1">
              <IconLock className="size-3" stroke={1.5} />
              Finalized
            </Badge>
          )}
        </div>
        <CardDescription className="flex flex-wrap gap-x-4 gap-y-1">
          <span className="inline-flex items-center gap-1">
            <IconCalendarEvent className="size-4" stroke={1.5} />
            {dateStr}
          </span>
          <span className="inline-flex items-center gap-1">
            <IconClockHour3 className="size-4" stroke={1.5} />
            {timeStr}
          </span>
          <span className="inline-flex items-center gap-1">
            <IconMapPin2 className="size-4" stroke={1.5} />
            {event.location}
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-wrap gap-2">
        {slots.map((slot) => (
          <Badge key={slot.label} variant={slot.tone}>
            <IconUsersGroup className="mr-1 size-3" stroke={1.5} />
            {slot.label}
          </Badge>
        ))}
      </CardContent>

      <CardFooter>
        <Button size="sm" asChild>
          <Link href={`/events/${event.event_id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

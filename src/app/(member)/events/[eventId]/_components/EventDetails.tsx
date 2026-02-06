"use client";

import { format, parseISO } from "date-fns";
import {
  IconCalendarEvent,
  IconClockHour3,
  IconMapPin2,
  IconNotes,
  IconUsersGroup,
} from "@tabler/icons-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Event } from "@/types/event.types";

interface EventDetailsProps {
  event: Event;
}

function formatTime(time: string): string {
  const [h, m] = time.split(":");
  const date = new Date(2000, 0, 1, Number(h), Number(m));
  return format(date, "h:mm a");
}

export default function EventDetails({ event }: EventDetailsProps) {
  const dateStr = format(parseISO(event.event_date), "EEEE, MMMM d, yyyy");
  const timeStr = `${formatTime(event.start_time)} – ${formatTime(event.end_time)}`;

  const crewRequirements = [
    { role: "Supervisor", needed: event.supervisor_needed },
    { role: "EMT", needed: event.emt_needed },
    { role: "FA / EMR", needed: event.fa_emr_needed },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* header */}
      <header>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Coverage</Badge>
          {event.is_finalized && <Badge variant="outline">Finalized</Badge>}
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">
          {event.event_name}
        </h1>
      </header>

      {/* logistics */}
      <Card>
        <CardContent className="flex flex-wrap gap-x-6 gap-y-2 pt-6 text-sm">
          <span className="inline-flex items-center gap-1.5">
            <IconCalendarEvent className="size-4 text-muted-foreground" stroke={1.5} />
            {dateStr}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <IconClockHour3 className="size-4 text-muted-foreground" stroke={1.5} />
            {timeStr}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <IconMapPin2 className="size-4 text-muted-foreground" stroke={1.5} />
            {event.location}
          </span>
        </CardContent>
      </Card>

      {/* description */}
      {event.description && (
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2 text-base">
              <IconNotes className="size-4" stroke={1.5} />
              Description
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>{event.description}</p>
          </CardContent>
        </Card>
      )}

      {/* crew requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-2 text-base">
            <IconUsersGroup className="size-4" stroke={1.5} />
            Staffing Needs
          </CardTitle>
          <CardDescription>Open positions for this coverage</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead className="text-center">Needed</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {crewRequirements.map((cr) => (
                <TableRow key={cr.role}>
                  <TableCell className="font-medium">{cr.role}</TableCell>
                  <TableCell className="text-center">{cr.needed}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={cr.needed > 0 ? "default" : "secondary"}>
                      {cr.needed > 0 ? `${cr.needed} open` : "None required"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

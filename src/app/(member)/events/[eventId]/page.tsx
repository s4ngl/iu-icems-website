import type { Metadata } from "next";
import Link from "next/link";
import {
  IconCalendarEvent,
  IconClockHour3,
  IconMapPin2,
  IconNotes,
  IconUserCheck,
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
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Event Detail | IC-EMS",
  description: "View event details and sign up for a shift.",
};

/* demo crew-requirement rows */
const crewRequirements = [
  { role: "Supervisor", required: 1, filled: 0 },
  { role: "EMT", required: 2, filled: 1 },
  { role: "FA / EMR", required: 3, filled: 2 },
];

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  return (
    <div className="flex flex-col gap-6">
      <Button variant="ghost" size="sm" className="self-start" asChild>
        <Link href="/events">← Back to events</Link>
      </Button>

      {/* header info */}
      <header>
        <Badge variant="secondary" className="mb-2">
          Coverage
        </Badge>
        <h1 className="text-2xl font-bold tracking-tight">
          Little 500 Practice — Day 1
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Event ID: {eventId}
        </p>
      </header>

      {/* logistics strip */}
      <Card>
        <CardContent className="flex flex-wrap gap-x-6 gap-y-2 pt-6 text-sm">
          <span className="inline-flex items-center gap-1.5">
            <IconCalendarEvent className="size-4 text-muted-foreground" stroke={1.5} />
            Saturday, December 14, 2025
          </span>
          <span className="inline-flex items-center gap-1.5">
            <IconClockHour3 className="size-4 text-muted-foreground" stroke={1.5} />
            8:00 AM – 4:00 PM
          </span>
          <span className="inline-flex items-center gap-1.5">
            <IconMapPin2 className="size-4 text-muted-foreground" stroke={1.5} />
            Bill Armstrong Stadium
          </span>
        </CardContent>
      </Card>

      {/* description */}
      <Card>
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-2 text-base">
            <IconNotes className="size-4" stroke={1.5} />
            Description
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            Medical standby coverage for Little 500 cycling practice at Bill
            Armstrong Stadium. Crew members should arrive 30 minutes before the
            posted start time for equipment setup and briefing. Wear your IC-EMS
            polo and bring personal PPE.
          </p>
        </CardContent>
      </Card>

      {/* role requirements table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Crew Requirements</CardTitle>
          <CardDescription>
            Open positions for this coverage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead className="text-center">Needed</TableHead>
                <TableHead className="text-center">Filled</TableHead>
                <TableHead className="text-center">Available</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {crewRequirements.map((cr) => {
                const open = cr.required - cr.filled;
                return (
                  <TableRow key={cr.role}>
                    <TableCell className="font-medium">{cr.role}</TableCell>
                    <TableCell className="text-center">{cr.required}</TableCell>
                    <TableCell className="text-center">{cr.filled}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={open > 0 ? "default" : "secondary"}>
                        {open > 0 ? `${open} open` : "Full"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Separator />

      {/* signup / status area */}
      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sign Up</CardTitle>
            <CardDescription>
              Choose your role and request a spot on this crew.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              Select a role when signing up. If all positions for your
              certification level are filled you will be placed on the waitlist.
            </p>
          </CardContent>
          <CardFooter>
            <Button>Join Waitlist</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2 text-base">
              <IconUserCheck className="size-4" stroke={1.5} />
              Your Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You have not signed up for this event yet.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

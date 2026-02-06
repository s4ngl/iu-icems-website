"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  IconCalendarEvent,
  IconClockHour3,
  IconMapPin2,
  IconNotes,
  IconUserCheck,
  IconAlertCircle,
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
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";
import type { Event } from "@/types/event.types";

interface CrewRequirement {
  role: string;
  required: number;
  filled: number;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params?.eventId as string;
  const { user, isLoading: authLoading } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [crewRequirements, setCrewRequirements] = useState<CrewRequirement[]>(
    []
  );
  const [userSignedUp, setUserSignedUp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user && eventId) {
      fetchEvent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user, eventId]);

  async function fetchEvent() {
    if (!user || !eventId) return;
    try {
      setIsLoading(true);
      setError(null);
      const supabase = createClient();

      const { data: eventData, error: eventErr } = await supabase
        .from("events")
        .select("*")
        .eq("event_id", eventId)
        .single();

      if (eventErr) throw eventErr;
      setEvent(eventData);

      // Fetch signup counts by position type
      const { data: signups } = await supabase
        .from("event_signups")
        .select("position_type, is_assigned")
        .eq("event_id", eventId)
        .eq("is_assigned", true);

      const filledSupervisors =
        signups?.filter((s) => s.position_type === 0).length || 0;
      const filledEmts =
        signups?.filter((s) => s.position_type === 1).length || 0;
      const filledFaEmr =
        signups?.filter((s) => s.position_type === 2).length || 0;

      setCrewRequirements([
        {
          role: "Supervisor",
          required: eventData.supervisor_needed,
          filled: filledSupervisors,
        },
        {
          role: "EMT",
          required: eventData.emt_needed,
          filled: filledEmts,
        },
        {
          role: "FA / EMR",
          required: eventData.fa_emr_needed,
          filled: filledFaEmr,
        },
      ]);

      // Check user signup status
      const { data: mySignup } = await supabase
        .from("event_signups")
        .select("signup_id")
        .eq("event_id", eventId)
        .eq("user_id", user.id)
        .maybeSingle();

      setUserSignedUp(!!mySignup);
    } catch (err) {
      console.error("Error fetching event:", err);
      setError("Failed to load event details.");
    } finally {
      setIsLoading(false);
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex flex-col gap-6">
        <Button variant="ghost" size="sm" className="self-start" asChild>
          <Link href="/events">← Back to events</Link>
        </Button>
        <Alert variant="destructive">
          <IconAlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || "Event not found."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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
          {event.event_name}
        </h1>
      </header>

      {/* logistics strip */}
      <Card>
        <CardContent className="flex flex-wrap gap-x-6 gap-y-2 pt-6 text-sm">
          <span className="inline-flex items-center gap-1.5">
            <IconCalendarEvent
              className="size-4 text-muted-foreground"
              stroke={1.5}
            />
            {formatDate(event.event_date)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <IconClockHour3
              className="size-4 text-muted-foreground"
              stroke={1.5}
            />
            {formatTime(event.start_time)} – {formatTime(event.end_time)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <IconMapPin2
              className="size-4 text-muted-foreground"
              stroke={1.5}
            />
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

      {/* role requirements table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Crew Requirements</CardTitle>
          <CardDescription>Open positions for this coverage</CardDescription>
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
            <Button disabled={userSignedUp}>
              {userSignedUp ? "Already Signed Up" : "Join Waitlist"}
            </Button>
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
              {userSignedUp
                ? "You are signed up for this event."
                : "You have not signed up for this event yet."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

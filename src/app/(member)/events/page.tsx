"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  IconCalendarEvent,
  IconMapPin2,
  IconClockHour3,
  IconUsersGroup,
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";
import type { Event } from "@/types/event.types";

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

export default function EventsListPage() {
  const { user, member, isLoading: authLoading } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isSupervisor =
    member?.position_web !== null &&
    member?.position_web !== undefined &&
    member.position_web <= 2;

  useEffect(() => {
    if (!authLoading && user) {
      fetchEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  async function fetchEvents() {
    if (!user) return;
    try {
      setIsLoading(true);
      setError(null);
      const supabase = createClient();
      const now = new Date().toISOString().split("T")[0];

      // Fetch all upcoming events
      const { data: upcoming, error: upErr } = await supabase
        .from("events")
        .select("*")
        .gte("event_date", now)
        .order("event_date", { ascending: true });

      if (upErr) throw upErr;

      // Fetch all past events
      const { data: past, error: pastErr } = await supabase
        .from("events")
        .select("*")
        .lt("event_date", now)
        .order("event_date", { ascending: false })
        .limit(20);

      if (pastErr) throw pastErr;

      // Fetch events the user signed up for
      const { data: mySignups, error: myErr } = await supabase
        .from("event_signups")
        .select("event_id, events (*)")
        .eq("user_id", user.id);

      if (myErr) throw myErr;

      const myEventsData = (mySignups || [])
        .map((s) => s.events as unknown as Event)
        .filter(Boolean);

      setUpcomingEvents(upcoming || []);
      setPastEvents(past || []);
      setMyEvents(myEventsData);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="mt-2 h-5 w-96" />
        <Separator />
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">
          {isSupervisor ? "Events" : "Events"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {isSupervisor
            ? "Browse upcoming coverages, manage your sign-ups, and view your assigned supervision events."
            : "Browse upcoming coverages, manage your sign-ups, and review past events."}
        </p>
      </header>

      <Separator />

      {error && (
        <Alert variant="destructive">
          <IconAlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingEvents.length})
          </TabsTrigger>
          <TabsTrigger value="mine">
            My Events ({myEvents.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            Past ({pastEvents.length})
          </TabsTrigger>
        </TabsList>

        {/* ---- upcoming ---- */}
        <TabsContent value="upcoming" className="mt-5 flex flex-col gap-4">
          {upcomingEvents.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center text-sm text-muted-foreground">
                No upcoming events at this time.
              </CardContent>
            </Card>
          ) : (
            upcomingEvents.map((evt) => (
              <EventCard key={evt.event_id} event={evt} />
            ))
          )}
        </TabsContent>

        {/* ---- my events ---- */}
        <TabsContent value="mine" className="mt-5 flex flex-col gap-4">
          {myEvents.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center text-sm text-muted-foreground">
                Events you&apos;ve signed up for will appear here once you join
                a shift.
              </CardContent>
            </Card>
          ) : (
            myEvents.map((evt) => (
              <EventCard key={evt.event_id} event={evt} />
            ))
          )}
        </TabsContent>

        {/* ---- past events ---- */}
        <TabsContent value="history" className="mt-5 flex flex-col gap-4">
          {pastEvents.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center text-sm text-muted-foreground">
                Previously completed coverages and logged hours will show up
                here.
              </CardContent>
            </Card>
          ) : (
            pastEvents.map((evt) => (
              <EventCard key={evt.event_id} event={evt} isPast />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EventCard({
  event,
  isPast = false,
}: {
  event: Event;
  isPast?: boolean;
}) {
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
    <Card className={isPast ? "opacity-70" : ""}>
      <CardHeader>
        <CardTitle className="text-lg">{event.event_name}</CardTitle>
        <CardDescription className="flex flex-wrap gap-x-4 gap-y-1">
          <span className="inline-flex items-center gap-1">
            <IconCalendarEvent className="size-4" stroke={1.5} />
            {formatDate(event.event_date)}
          </span>
          <span className="inline-flex items-center gap-1">
            <IconClockHour3 className="size-4" stroke={1.5} />
            {formatTime(event.start_time)} – {formatTime(event.end_time)}
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
          <Link href={`/events/${event.event_id}`}>
            {isPast ? "View Details" : "Sign Up"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

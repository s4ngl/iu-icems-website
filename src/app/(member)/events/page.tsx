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

interface EventWithMemberCount extends Event {
  assigned_members_count?: number;
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

export default function EventsListPage() {
  const { user, member, isLoading: authLoading } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [supervisedEvents, setSupervisedEvents] = useState<
    EventWithMemberCount[]
  >([]);
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

      // Fetch supervised events if the user is a supervisor
      if (
        member?.position_web !== null &&
        member?.position_web !== undefined &&
        member.position_web <= 2
      ) {
        const { data: supervisorSignups, error: supErr } = await supabase
          .from("event_signups")
          .select(
            `event_id, events (
              event_id, event_name, event_date, start_time, end_time,
              location, description, fa_emr_needed, emt_needed,
              supervisor_needed, is_finalized, created_by, created_at
            )`
          )
          .eq("user_id", user.id)
          .eq("position_type", 0)
          .eq("is_assigned", true);

        if (supErr) throw supErr;

        const uniqueEvents = new Map<string, Event>();
        (supervisorSignups || []).forEach((signup) => {
          if (signup.events && !uniqueEvents.has(signup.event_id)) {
            uniqueEvents.set(
              signup.event_id,
              signup.events as unknown as Event
            );
          }
        });

        const eventIds = Array.from(uniqueEvents.keys());

        const eventsWithCounts: EventWithMemberCount[] = await Promise.all(
          eventIds.map(async (eventId) => {
            const event = uniqueEvents.get(eventId)!;
            const { count } = await supabase
              .from("event_signups")
              .select("*", { count: "exact", head: true })
              .eq("event_id", eventId)
              .eq("is_assigned", true);
            return { ...event, assigned_members_count: count || 0 };
          })
        );

        eventsWithCounts.sort(
          (a, b) =>
            new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
        );

        setSupervisedEvents(eventsWithCounts);
      }
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
        <h1 className="text-3xl font-bold tracking-tight">Events</h1>
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
          {isSupervisor && (
            <TabsTrigger value="supervised">
              Supervised ({supervisedEvents.length})
            </TabsTrigger>
          )}
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

        {/* ---- supervised events (supervisor only) ---- */}
        {isSupervisor && (
          <TabsContent
            value="supervised"
            className="mt-5 flex flex-col gap-4"
          >
            {supervisedEvents.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-16 text-center text-sm text-muted-foreground">
                  You are not currently assigned to any events as a supervisor.
                </CardContent>
              </Card>
            ) : (
              supervisedEvents.map((evt) => (
                <SupervisedEventCard
                  key={evt.event_id}
                  event={evt}
                />
              ))
            )}
          </TabsContent>
        )}

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

function SupervisedEventCard({
  event,
}: {
  event: EventWithMemberCount;
}) {
  const isPast = new Date(event.event_date) < new Date();

  const positionsNeeded = [
    event.supervisor_needed > 0 && {
      label: `${event.supervisor_needed} Supervisor${event.supervisor_needed > 1 ? "s" : ""}`,
      tone: "outline" as const,
    },
    event.emt_needed > 0 && {
      label: `${event.emt_needed} EMT${event.emt_needed > 1 ? "s" : ""}`,
      tone: "default" as const,
    },
    event.fa_emr_needed > 0 && {
      label: `${event.fa_emr_needed} FA/EMR`,
      tone: "secondary" as const,
    },
  ].filter(Boolean);

  return (
    <Card className={isPast ? "opacity-70" : ""}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{event.event_name}</CardTitle>
            <CardDescription className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
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
          </div>
          {event.is_finalized && (
            <Badge variant="default" className="ml-2">
              Finalized
            </Badge>
          )}
        </div>

        {event.description && (
          <p className="mt-2 text-sm text-muted-foreground">
            {event.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {positionsNeeded.map(
            (slot) =>
              slot && (
                <Badge key={slot.label} variant={slot.tone}>
                  <IconUsersGroup className="mr-1 size-3" stroke={1.5} />
                  {slot.label} needed
                </Badge>
              )
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <IconUsersGroup className="size-4" stroke={1.5} />
          <span>
            {event.assigned_members_count ?? 0} member
            {(event.assigned_members_count ?? 0) !== 1 ? "s" : ""} assigned
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <Button size="sm" asChild>
          <Link href={`/events/${event.event_id}/manage`}>
            View Details &amp; Manage Hours
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

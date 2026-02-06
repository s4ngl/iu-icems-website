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
import type { Event, EventSignup } from "@/types/event.types";
import type { Database } from "@/types/database.types";

type Member = Database["public"]["Tables"]["members"]["Row"];

interface EventWithDetails extends Event {
  assigned_members_count: number;
  signups?: Array<EventSignup & { member?: Member }>;
}

export default function AssignedEventsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState<EventWithDetails[]>([]);
  const [pastEvents, setPastEvents] = useState<EventWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      fetchAssignedEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  async function fetchAssignedEvents() {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);
      const supabase = createClient();

      // Fetch events where the current user is assigned as supervisor
      const { data: signups, error: signupsError } = await supabase
        .from("event_signups")
        .select(`
          event_id,
          events (
            event_id,
            event_name,
            event_date,
            start_time,
            end_time,
            location,
            description,
            fa_emr_needed,
            emt_needed,
            supervisor_needed,
            is_finalized,
            created_by,
            created_at
          )
        `)
        .eq("user_id", user.id)
        .eq("position_type", 0) // 0 = Supervisor
        .eq("is_assigned", true);

      if (signupsError) {
        console.error("Error fetching assigned events:", signupsError);
        throw signupsError;
      }

      if (!signups || signups.length === 0) {
        setUpcomingEvents([]);
        setPastEvents([]);
        return;
      }

      // Extract unique events and fetch member counts
      const uniqueEvents = new Map<string, Event>();
      signups.forEach((signup) => {
        if (signup.events && !uniqueEvents.has(signup.event_id)) {
          uniqueEvents.set(signup.event_id, signup.events as unknown as Event);
        }
      });

      const eventIds = Array.from(uniqueEvents.keys());

      // Fetch assigned members count for each event
      const eventsWithDetails = await Promise.all(
        eventIds.map(async (eventId) => {
          const event = uniqueEvents.get(eventId)!;
          
          const { count } = await supabase
            .from("event_signups")
            .select("*", { count: "exact", head: true })
            .eq("event_id", eventId)
            .eq("is_assigned", true);

          return {
            ...event,
            assigned_members_count: count || 0,
          } as EventWithDetails;
        })
      );

      // Sort events by date and split into upcoming/past
      const now = new Date();
      const sortedEvents = eventsWithDetails.sort((a, b) => 
        new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
      );

      const upcoming = sortedEvents.filter(
        (event) => new Date(event.event_date) >= now
      );
      const past = sortedEvents.filter(
        (event) => new Date(event.event_date) < now
      );

      setUpcomingEvents(upcoming);
      setPastEvents(past);
    } catch (err) {
      console.error("Error fetching assigned events:", err);
      setError("Failed to load assigned events. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
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

  if (authLoading || isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <header>
          <Skeleton className="h-9 w-64" />
          <Skeleton className="mt-2 h-5 w-96" />
        </header>
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
        <h1 className="text-3xl font-bold tracking-tight">Assigned Events</h1>
        <p className="mt-1 text-muted-foreground">
          View and manage events where you are assigned as a supervisor.
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
          <TabsTrigger value="past">
            Past ({pastEvents.length})
          </TabsTrigger>
        </TabsList>

        {/* ---- Upcoming Events ---- */}
        <TabsContent value="upcoming" className="mt-5 flex flex-col gap-4">
          {upcomingEvents.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center text-sm text-muted-foreground">
                You are not currently assigned to any upcoming events as a
                supervisor.
              </CardContent>
            </Card>
          ) : (
            upcomingEvents.map((event) => (
              <EventCard
                key={event.event_id}
                event={event}
                formatDate={formatDate}
                formatTime={formatTime}
              />
            ))
          )}
        </TabsContent>

        {/* ---- Past Events ---- */}
        <TabsContent value="past" className="mt-5 flex flex-col gap-4">
          {pastEvents.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center text-sm text-muted-foreground">
                No past events found. Your previously supervised events will
                appear here.
              </CardContent>
            </Card>
          ) : (
            pastEvents.map((event) => (
              <EventCard
                key={event.event_id}
                event={event}
                formatDate={formatDate}
                formatTime={formatTime}
                isPast
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EventCard({
  event,
  formatDate,
  formatTime,
  isPast = false,
}: {
  event: EventWithDetails;
  formatDate: (date: string) => string;
  formatTime: (time: string) => string;
  isPast?: boolean;
}) {
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
            {event.assigned_members_count} member
            {event.assigned_members_count !== 1 ? "s" : ""} assigned
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <Button size="sm" asChild>
          <Link href={`/assigned-events/${event.event_id}`}>
            View Details & Manage Hours
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

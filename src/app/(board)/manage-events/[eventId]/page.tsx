"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  IconArrowLeft,
  IconEdit,
  IconList,
  IconCalendar,
  IconClock,
  IconMapPin,
} from "@tabler/icons-react";
import { POSITION_LABELS, POSITION_TYPES } from "@/lib/utils/constants";
import { EventNotifications } from "../_components/EventNotifications";
import type { Database } from "@/types/database.types";

type Event = Database["public"]["Tables"]["events"]["Row"];

interface EventWithCount extends Event {
  signup_count?: number;
}

export default function EventDetailPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const router = useRouter();
  const [event, setEvent] = useState<EventWithCount | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        if (!response.ok) throw new Error("Failed to fetch event");
        const json = await response.json();
        setEvent(json.data);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEvent();
  }, [eventId]);

  const formatDate = (dateString: string) =>
    new Date(dateString + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (isLoading) {
    return (
      <section className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </section>
    );
  }

  if (!event) {
    return (
      <section className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => router.push("/manage-events")}>
          <IconArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>
        <p className="text-muted-foreground">Event not found.</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/manage-events")}>
          <IconArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{event.event_name}</h1>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant={event.is_finalized ? "default" : "outline"}>
              {event.is_finalized ? "Finalized" : "Open"}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {event.signup_count ?? 0} signup{(event.signup_count ?? 0) !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/manage-events/${eventId}/waitlist`)}>
            <IconList className="mr-2 h-4 w-4" />
            Waitlist
          </Button>
          <Button onClick={() => router.push(`/manage-events/${eventId}/edit`)}>
            <IconEdit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <IconCalendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(event.event_date)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <IconClock className="h-4 w-4 text-muted-foreground" />
              <span>{formatTime(event.start_time)} – {formatTime(event.end_time)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <IconMapPin className="h-4 w-4 text-muted-foreground" />
              <span>{event.location}</span>
            </div>
            {event.description && (
              <>
                <Separator />
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Staffing Requirements</CardTitle>
            <CardDescription>Personnel needed for this event</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">{POSITION_LABELS[POSITION_TYPES.FA_EMR]}</span>
              <Badge variant="outline">{event.fa_emr_needed} needed</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{POSITION_LABELS[POSITION_TYPES.EMT]}</span>
              <Badge variant="outline">{event.emt_needed} needed</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{POSITION_LABELS[POSITION_TYPES.SUPERVISOR]}</span>
              <Badge variant="outline">{event.supervisor_needed} needed</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <EventNotifications
            eventId={event.event_id}
            eventName={event.event_name}
          />
        </CardContent>
      </Card>
    </section>
  );
}

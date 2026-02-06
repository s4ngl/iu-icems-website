"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { IconArrowLeft, IconAlertCircle } from "@tabler/icons-react";
import { EventForm } from "../../_components/EventForm";
import type { Database } from "@/types/database.types";

type Event = Database["public"]["Tables"]["events"]["Row"];

export default function EditEventPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        if (!response.ok) throw new Error("Failed to fetch event");
        const json = await response.json();
        setEvent(json.data);
      } catch (err) {
        console.error("Error fetching event:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEvent();
  }, [eventId]);

  async function handleSubmit(data: {
    event_name: string;
    event_date: string;
    start_time: string;
    end_time: string;
    location: string;
    description: string;
    fa_emr_needed: number;
    emt_needed: number;
    supervisor_needed: number;
  }) {
    try {
      setIsSubmitting(true);
      setError(null);
      const response = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const json = await response.json();
        throw new Error(json.error || "Failed to update event");
      }

      router.push(`/manage-events/${eventId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update event");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <section className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
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
        <Button variant="ghost" size="sm" onClick={() => router.push(`/manage-events/${eventId}`)}>
          <IconArrowLeft className="mr-2 h-4 w-4" />
          Back to Event
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Event</CardTitle>
          <CardDescription>
            Update the details for &ldquo;{event.event_name}&rdquo;
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <IconAlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <fieldset disabled={isSubmitting}>
            <EventForm
              event={event}
              onSubmit={handleSubmit}
              onCancel={() => router.push(`/manage-events/${eventId}`)}
            />
          </fieldset>
        </CardContent>
      </Card>
    </section>
  );
}

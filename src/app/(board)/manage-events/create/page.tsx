"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IconArrowLeft, IconAlertCircle } from "@tabler/icons-react";
import { EventForm } from "../_components/EventForm";

export default function CreateEventPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const json = await response.json();
        throw new Error(json.error || "Failed to create event");
      }

      router.push("/manage-events");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/manage-events")}>
          <IconArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Event</CardTitle>
          <CardDescription>
            Fill in the details below to create a new event
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
              onSubmit={handleSubmit}
              onCancel={() => router.push("/manage-events")}
            />
          </fieldset>
        </CardContent>
      </Card>
    </section>
  );
}

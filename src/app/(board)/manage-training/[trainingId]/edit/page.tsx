"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { IconArrowLeft, IconAlertCircle } from "@tabler/icons-react";
import { TrainingForm } from "../../_components/TrainingForm";
import type { Database } from "@/types/database.types";

type TrainingSession = Database["public"]["Tables"]["training_sessions"]["Row"];

export default function EditTrainingPage() {
  const { trainingId } = useParams<{ trainingId: string }>();
  const router = useRouter();
  const [training, setTraining] = useState<TrainingSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchTraining() {
      try {
        const response = await fetch(`/api/training/${trainingId}`);
        if (!response.ok) throw new Error("Failed to fetch training");
        const json = await response.json();
        setTraining(json.data);
      } catch (err) {
        console.error("Error fetching training:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTraining();
  }, [trainingId]);

  async function handleSubmit(data: {
    training_name: string;
    training_date: string;
    start_time: string;
    end_time: string;
    location: string;
    description: string;
    max_participants: number | null;
    is_aha_training: boolean;
    cpr_cost: number | null;
    fa_cost: number | null;
    both_cost: number | null;
    point_contact: string;
  }) {
    try {
      setIsSubmitting(true);
      setError(null);
      const response = await fetch(`/api/training/${trainingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const json = await response.json();
        throw new Error(json.error || "Failed to update training session");
      }

      router.push(`/manage-training/${trainingId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update training session");
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

  if (!training) {
    return (
      <section className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => router.push("/manage-training")}>
          <IconArrowLeft className="mr-2 h-4 w-4" />
          Back to Training
        </Button>
        <p className="text-muted-foreground">Training session not found.</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push(`/manage-training/${trainingId}`)}>
          <IconArrowLeft className="mr-2 h-4 w-4" />
          Back to Training
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Training Session</CardTitle>
          <CardDescription>
            Update the details for &ldquo;{training.training_name}&rdquo;
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
            <TrainingForm
              trainingSession={training}
              onSubmit={handleSubmit}
              onCancel={() => router.push(`/manage-training/${trainingId}`)}
            />
          </fieldset>
        </CardContent>
      </Card>
    </section>
  );
}

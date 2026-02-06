"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IconArrowLeft, IconAlertCircle } from "@tabler/icons-react";
import { TrainingForm } from "../_components/TrainingForm";

export default function CreateTrainingPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const response = await fetch("/api/training", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const json = await response.json();
        throw new Error(json.error || "Failed to create training session");
      }

      router.push("/manage-training");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create training session");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/manage-training")}>
          <IconArrowLeft className="mr-2 h-4 w-4" />
          Back to Training
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Training Session</CardTitle>
          <CardDescription>
            Fill in the details below to create a new training session
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
              onSubmit={handleSubmit}
              onCancel={() => router.push("/manage-training")}
            />
          </fieldset>
        </CardContent>
      </Card>
    </section>
  );
}

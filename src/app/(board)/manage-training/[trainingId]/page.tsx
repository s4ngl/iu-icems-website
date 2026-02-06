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
  IconUsers,
  IconCalendar,
  IconClock,
  IconMapPin,
  IconCurrencyDollar,
} from "@tabler/icons-react";
import type { Database } from "@/types/database.types";

type TrainingSession = Database["public"]["Tables"]["training_sessions"]["Row"];

interface TrainingWithCount extends TrainingSession {
  signup_count?: number;
}

export default function TrainingDetailPage() {
  const { trainingId } = useParams<{ trainingId: string }>();
  const router = useRouter();
  const [training, setTraining] = useState<TrainingWithCount | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTraining() {
      try {
        const response = await fetch(`/api/training/${trainingId}`);
        if (!response.ok) throw new Error("Failed to fetch training");
        const json = await response.json();
        setTraining(json.data);
      } catch (error) {
        console.error("Error fetching training:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTraining();
  }, [trainingId]);

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
        <Button variant="ghost" size="sm" onClick={() => router.push("/manage-training")}>
          <IconArrowLeft className="mr-2 h-4 w-4" />
          Back to Training
        </Button>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{training.training_name}</h1>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant={training.is_aha_training ? "default" : "outline"}>
              {training.is_aha_training ? "AHA" : "General"}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {training.signup_count ?? 0} participant{(training.signup_count ?? 0) !== 1 ? "s" : ""}
              {training.max_participants && ` / ${training.max_participants} max`}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/manage-training/${trainingId}/participants`)}>
            <IconUsers className="mr-2 h-4 w-4" />
            Participants
          </Button>
          <Button onClick={() => router.push(`/manage-training/${trainingId}/edit`)}>
            <IconEdit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Training Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <IconCalendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(training.training_date)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <IconClock className="h-4 w-4 text-muted-foreground" />
              <span>{formatTime(training.start_time)} – {formatTime(training.end_time)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <IconMapPin className="h-4 w-4 text-muted-foreground" />
              <span>{training.location}</span>
            </div>
            {training.point_contact && (
              <div className="flex items-center gap-2 text-sm">
                <IconUsers className="h-4 w-4 text-muted-foreground" />
                <span>Contact: {training.point_contact}</span>
              </div>
            )}
            {training.description && (
              <>
                <Separator />
                <p className="text-sm text-muted-foreground">{training.description}</p>
              </>
            )}
          </CardContent>
        </Card>

        {training.is_aha_training && (
          <Card>
            <CardHeader>
              <CardTitle>AHA Training Costs</CardTitle>
              <CardDescription>Pricing for this AHA certification course</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {training.cpr_cost !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">CPR Only</span>
                  <div className="flex items-center gap-1">
                    <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{training.cpr_cost}</span>
                  </div>
                </div>
              )}
              {training.fa_cost !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">First Aid Only</span>
                  <div className="flex items-center gap-1">
                    <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{training.fa_cost}</span>
                  </div>
                </div>
              )}
              {training.both_cost !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Both</span>
                  <div className="flex items-center gap-1">
                    <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{training.both_cost}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}

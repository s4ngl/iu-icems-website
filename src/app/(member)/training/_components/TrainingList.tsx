"use client";

import { IconHeartbeat, IconStethoscope } from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import TrainingCard from "./TrainingCard";
import type { Database } from "@/types/database.types";

type TrainingSession = Database["public"]["Tables"]["training_sessions"]["Row"];

interface TrainingListProps {
  trainingSessions: TrainingSession[];
}

export default function TrainingList({ trainingSessions }: TrainingListProps) {
  const generalSessions = trainingSessions.filter((s) => !s.is_aha_training);
  const ahaSessions = trainingSessions.filter((s) => s.is_aha_training);

  if (trainingSessions.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-16 text-center text-sm text-muted-foreground">
          No training sessions available at this time.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {generalSessions.length > 0 && (
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold tracking-tight">
            <IconStethoscope className="size-5 text-emerald-600" stroke={1.5} />
            General Training
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {generalSessions.map((session) => (
              <TrainingCard key={session.training_id} training={session} />
            ))}
          </div>
        </section>
      )}

      {ahaSessions.length > 0 && (
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold tracking-tight">
            <IconHeartbeat className="size-5 text-orange-600" stroke={1.5} />
            AHA Training
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ahaSessions.map((session) => (
              <TrainingCard key={session.training_id} training={session} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

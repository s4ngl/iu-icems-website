"use client";

import Link from "next/link";
import { format, parseISO } from "date-fns";
import {
  IconCalendarEvent,
  IconClockHour3,
  IconMapPin2,
  IconUsers,
  IconCurrencyDollar,
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
import type { Database } from "@/types/database.types";

type TrainingSession = Database["public"]["Tables"]["training_sessions"]["Row"];

interface TrainingCardProps {
  training: TrainingSession;
}

function formatTime(time: string): string {
  const [h, m] = time.split(":");
  const date = new Date(2000, 0, 1, Number(h), Number(m));
  return format(date, "h:mm a");
}

export default function TrainingCard({ training }: TrainingCardProps) {
  const dateStr = format(parseISO(training.training_date), "MMMM d, yyyy");
  const timeStr = `${formatTime(training.start_time)} – ${formatTime(training.end_time)}`;
  const isAHA = training.is_aha_training;

  return (
    <Card
      className={isAHA ? "border-orange-500/40" : "border-emerald-500/40"}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{training.training_name}</CardTitle>
          {isAHA && (
            <Badge className="shrink-0 bg-orange-600 text-white">AHA</Badge>
          )}
        </div>
        <CardDescription className="flex flex-wrap gap-x-4 gap-y-1">
          <span className="inline-flex items-center gap-1">
            <IconCalendarEvent className="size-4" stroke={1.5} />
            {dateStr}
          </span>
          <span className="inline-flex items-center gap-1">
            <IconClockHour3 className="size-4" stroke={1.5} />
            {timeStr}
          </span>
          <span className="inline-flex items-center gap-1">
            <IconMapPin2 className="size-4" stroke={1.5} />
            {training.location}
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
        {training.description && <p>{training.description}</p>}
        {training.max_participants && (
          <p className="inline-flex items-center gap-1">
            <IconUsers className="size-3.5" stroke={1.5} />
            {training.max_participants} spots
          </p>
        )}
        {isAHA && training.cpr_cost != null && (
          <p className="inline-flex items-center gap-1 font-medium text-foreground">
            <IconCurrencyDollar className="size-3.5" stroke={1.5} />
            ${training.cpr_cost} CPR · ${training.fa_cost} FA · $
            {training.both_cost} Both
          </p>
        )}
      </CardContent>

      <CardFooter>
        <Button size="sm" asChild>
          <Link href={`/training/${training.training_id}`}>
            Details &amp; Sign Up
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  IconHeartbeat,
  IconFirstAidKit,
  IconStethoscope,
  IconUsers,
  IconCurrencyDollar,
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
import type { Database } from "@/types/database.types";

type TrainingSession =
  Database["public"]["Tables"]["training_sessions"]["Row"];

function formatTrainingDate(session: TrainingSession): string {
  const d = new Date(session.training_date);
  const date = d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const startTime = session.start_time.slice(0, 5);
  const endTime = session.end_time.slice(0, 5);
  return `${date} · ${startTime}–${endTime}`;
}

function costNote(session: TrainingSession): string | null {
  if (!session.is_aha_training) return null;
  const parts: string[] = [];
  if (session.cpr_cost != null) parts.push(`$${session.cpr_cost} CPR`);
  if (session.fa_cost != null) parts.push(`$${session.fa_cost} FA`);
  if (session.both_cost != null) parts.push(`$${session.both_cost} Both`);
  return parts.length > 0 ? parts.join(" · ") : null;
}

function TrainingTile({ session }: { session: TrainingSession }) {
  const kindColor = session.is_aha_training
    ? "bg-orange-600"
    : "bg-emerald-600";
  const Glyph = session.is_aha_training ? IconHeartbeat : IconStethoscope;
  const cost = costNote(session);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <Glyph className="size-6 shrink-0 text-primary" stroke={1.5} />
          <Badge className={`${kindColor} text-white`}>
            {session.is_aha_training ? "AHA" : "General"}
          </Badge>
        </div>
        <CardTitle className="mt-1 text-lg">
          {session.training_name}
        </CardTitle>
        <CardDescription>{formatTrainingDate(session)}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
        {session.description && <p>{session.description}</p>}
        <p className="inline-flex items-center gap-1">
          <IconUsers className="size-3.5" stroke={1.5} />
          {session.max_participants
            ? `${session.max_participants} spots`
            : "No cap"}
        </p>
        {cost && (
          <p className="inline-flex items-center gap-1 font-medium text-foreground">
            <IconCurrencyDollar className="size-3.5" stroke={1.5} />
            {cost}
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button size="sm" asChild>
          <Link href={`/training/${session.training_id}`}>
            Details &amp; Sign Up
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function TrainingListPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [available, setAvailable] = useState<TrainingSession[]>([]);
  const [enrolled, setEnrolled] = useState<TrainingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      fetchTrainingSessions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  async function fetchTrainingSessions() {
    if (!user) return;
    try {
      setIsLoading(true);
      setError(null);
      const supabase = createClient();
      const now = new Date().toISOString().split("T")[0];

      const [availableResult, enrolledResult] = await Promise.all([
        supabase
          .from("training_sessions")
          .select("*")
          .gte("training_date", now)
          .order("training_date", { ascending: true }),
        supabase
          .from("training_signups")
          .select("training_id, training_sessions (*)")
          .eq("user_id", user.id),
      ]);

      if (availableResult.error) throw availableResult.error;
      if (enrolledResult.error) throw enrolledResult.error;

      setAvailable(availableResult.data || []);
      const enrolledSessions = (enrolledResult.data || [])
        .map((s) => s.training_sessions as unknown as TrainingSession)
        .filter(Boolean);
      setEnrolled(enrolledSessions);
    } catch (err) {
      console.error("Error fetching training sessions:", err);
      setError("Failed to load training sessions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="mt-2 h-5 w-96" />
        <Separator />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">
          Training Sessions
        </h1>
        <p className="mt-1 text-muted-foreground">
          Browse available certification classes and skills training offered by
          IC-EMS.
        </p>
      </header>

      <Separator />

      {error && (
        <Alert variant="destructive">
          <IconAlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="available">
        <TabsList>
          <TabsTrigger value="available">
            Available ({available.length})
          </TabsTrigger>
          <TabsTrigger value="enrolled">
            My Training ({enrolled.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="mt-5">
          {available.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center text-sm text-muted-foreground">
                No upcoming training sessions at this time.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {available.map((s) => (
                <TrainingTile key={s.training_id} session={s} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="enrolled" className="mt-5">
          {enrolled.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center text-sm text-muted-foreground">
                Training sessions you&apos;ve registered for will appear here.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {enrolled.map((s) => (
                <TrainingTile key={s.training_id} session={s} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

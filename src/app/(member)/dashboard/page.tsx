"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  IconClockHour4,
  IconClockPause,
  IconFileCertificate,
  IconAlertOctagon,
  IconCalendarDue,
  IconActivity,
  IconArrowNarrowRight,
  IconMapPinFilled,
} from "@tabler/icons-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";

interface UpcomingShift {
  eventTitle: string;
  dateTime: string;
  crewRole: string;
  venueName: string;
}

interface RecentShift {
  eventTitle: string;
  dateStr: string;
  hoursLogged: number;
}

const POSITION_TYPE_LABELS: Record<number, string> = {
  0: "Supervisor",
  1: "EMT",
  2: "FA/EMR",
};

function StatTile({
  heading,
  display,
  accent,
  Glyph,
}: {
  heading: string;
  display: string;
  accent: string;
  Glyph: typeof IconClockHour4;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 pt-6">
        <Glyph className={`size-7 shrink-0 ${accent}`} stroke={1.6} />
        <div className="min-w-0">
          <p className="truncate text-xs uppercase tracking-wide text-muted-foreground">
            {heading}
          </p>
          <p className="text-xl font-bold">{display}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { user, member, isLoading: authLoading } = useAuth();
  const [activeCerts, setActiveCerts] = useState(0);
  const [totalCerts, setTotalCerts] = useState(0);
  const [penaltyPoints, setPenaltyPoints] = useState(0);
  const [upcomingShifts, setUpcomingShifts] = useState<UpcomingShift[]>([]);
  const [recentShifts, setRecentShifts] = useState<RecentShift[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  async function fetchDashboardData() {
    if (!user) return;
    try {
      setIsLoading(true);
      const supabase = createClient();
      const now = new Date().toISOString().split("T")[0];

      const [certsResult, penaltiesResult, upcomingResult, hoursResult] =
        await Promise.all([
          supabase
            .from("certifications")
            .select("cert_id, is_approved, expiration_date")
            .eq("user_id", user.id),
          supabase
            .from("penalty_points")
            .select("points")
            .eq("user_id", user.id)
            .eq("is_active", true),
          supabase
            .from("event_signups")
            .select(
              "position_type, events (event_name, event_date, start_time, end_time, location)"
            )
            .eq("user_id", user.id)
            .eq("is_assigned", true),
          supabase
            .from("event_hours")
            .select(
              "confirmed_hours, calculated_hours, is_confirmed, events (event_name, event_date)"
            )
            .eq("user_id", user.id)
            .eq("is_confirmed", true)
            .order("confirmed_date", { ascending: false })
            .limit(5),
        ]);

      // Certifications
      const certs = certsResult.data || [];
      const active = certs.filter(
        (c) =>
          c.is_approved &&
          (!c.expiration_date || new Date(c.expiration_date) >= new Date())
      );
      setActiveCerts(active.length);
      setTotalCerts(certs.length);

      // Penalty points
      const totalPts = (penaltiesResult.data || []).reduce(
        (sum, p) => sum + p.points,
        0
      );
      setPenaltyPoints(totalPts);

      // Upcoming assignments
      const upcoming = (upcomingResult.data || [])
        .filter((s) => {
          const evt = s.events as unknown as {
            event_date: string;
          } | null;
          return evt && evt.event_date >= now;
        })
        .map((s) => {
          const evt = s.events as unknown as {
            event_name: string;
            event_date: string;
            start_time: string;
            end_time: string;
            location: string;
          };
          const d = new Date(evt.event_date);
          const dateLabel = d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
          return {
            eventTitle: evt.event_name,
            dateTime: `${dateLabel} · ${evt.start_time.slice(0, 5)}–${evt.end_time.slice(0, 5)}`,
            crewRole: POSITION_TYPE_LABELS[s.position_type] || "Member",
            venueName: evt.location,
          };
        });
      setUpcomingShifts(upcoming);

      // Recent activity
      const recent = (hoursResult.data || []).map((h) => {
        const evt = h.events as unknown as { event_name: string; event_date: string } | null;
        return {
          eventTitle: evt?.event_name || "Unknown Event",
          dateStr: evt?.event_date
            ? new Date(evt.event_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            : "",
          hoursLogged: h.confirmed_hours ?? h.calculated_hours ?? 0,
        };
      });
      setRecentShifts(recent);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <Skeleton className="h-9 w-48" />
        <div className="grid gap-4 xs:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const portalMetrics = [
    {
      heading: "Total Hours",
      display: String(member?.total_hours ?? 0),
      accent: "text-sky-700 dark:text-sky-400",
      Glyph: IconClockHour4,
    },
    {
      heading: "Pending Hours",
      display: String(member?.pending_hours ?? 0),
      accent: "text-amber-700 dark:text-amber-400",
      Glyph: IconClockPause,
    },
    {
      heading: "Active Certs",
      display: `${activeCerts} / ${totalCerts}`,
      accent: "text-teal-700 dark:text-teal-400",
      Glyph: IconFileCertificate,
    },
    {
      heading: "Penalty Pts",
      display: String(penaltyPoints),
      accent: "text-rose-700 dark:text-rose-400",
      Glyph: IconAlertOctagon,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">
        Welcome back{member ? `, ${member.first_name}` : ""}!
      </h1>

      {/* metric tiles */}
      <div className="grid gap-4 xs:grid-cols-2 lg:grid-cols-4">
        {portalMetrics.map((m) => (
          <StatTile key={m.heading} {...m} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* upcoming assignments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Assignments</CardTitle>
            <CardDescription>Shifts you&apos;re confirmed for</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {upcomingShifts.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No upcoming assignments. Sign up for an event!
              </p>
            ) : (
              upcomingShifts.map((s) => (
                <div
                  key={s.eventTitle}
                  className="rounded-md border px-3 py-2.5"
                >
                  <p className="flex items-start justify-between gap-2">
                    <span className="font-medium leading-snug">
                      {s.eventTitle}
                    </span>
                    <Badge variant="outline" className="shrink-0">
                      {s.crewRole}
                    </Badge>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    <IconCalendarDue
                      className="mr-1 inline size-3.5 align-[-2px]"
                      stroke={1.5}
                    />
                    {s.dateTime}
                    <IconMapPinFilled
                      className="ml-3 mr-1 inline size-3.5 align-[-2px]"
                      stroke={1.5}
                    />
                    {s.venueName}
                  </p>
                </div>
              ))
            )}

            <Button
              variant="ghost"
              size="sm"
              className="mt-1 self-start"
              asChild
            >
              <Link href="/events">
                Browse all events
                <IconArrowNarrowRight className="ml-1 size-4" stroke={1.5} />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* recent activity */}
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <IconActivity className="size-5" stroke={1.5} />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Hours credited from recent shifts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentShifts.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No confirmed hours yet.
              </p>
            ) : (
              <ul className="divide-y">
                {recentShifts.map((c) => (
                  <li
                    key={c.eventTitle}
                    className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
                  >
                    <span>
                      <span className="font-medium">{c.eventTitle}</span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        {c.dateStr}
                      </span>
                    </span>
                    <Badge variant="secondary">{c.hoursLogged} hrs</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

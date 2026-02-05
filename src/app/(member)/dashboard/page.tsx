import type { Metadata } from "next";
import Link from "next/link";
import {
  IconClockHour4,
  IconClockPause,
  IconFileCertificate,
  IconAlertOctagon,
  IconCheckbox,
  IconSquare,
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

export const metadata: Metadata = {
  title: "Dashboard | IC-EMS",
  description:
    "IC-EMS member dashboard with volunteer hours, certification status, and event assignments.",
};

/*
 * Hard-coded demo values — these will eventually come from
 * Supabase queries against the member's profile row.
 */

const portalMetrics: {
  heading: string;
  display: string;
  accent: string;
  Glyph: typeof IconClockHour4;
}[] = [
  { heading: "Total Hours", display: "24.5", accent: "text-sky-700 dark:text-sky-400", Glyph: IconClockHour4 },
  { heading: "Pending Hours", display: "3.0", accent: "text-amber-700 dark:text-amber-400", Glyph: IconClockPause },
  { heading: "Active Certs", display: "3 / 4", accent: "text-teal-700 dark:text-teal-400", Glyph: IconFileCertificate },
  { heading: "Penalty Pts", display: "0", accent: "text-rose-700 dark:text-rose-400", Glyph: IconAlertOctagon },
];

const actionChecklist = [
  { isDone: false, text: "Upload BLS certification — expires soon" },
  { isDone: false, text: "Pay membership dues before Dec 31" },
  { isDone: true, text: "Finish ICS-100 online course" },
  { isDone: true, text: "Submit headshot for the member directory" },
  { isDone: false, text: "RSVP to December general body meeting" },
];

const confirmedShifts = [
  {
    eventTitle: "Little 500 Practice — Day 1",
    dateTime: "Dec 14 · 8 AM–4 PM",
    crewRole: "EMT",
    venueName: "Bill Armstrong Stadium",
  },
  {
    eventTitle: "IU Basketball vs. Purdue",
    dateTime: "Dec 21 · 2–6 PM",
    crewRole: "FA / EMR",
    venueName: "Simon Skjodt Assembly Hall",
  },
];

const completedShifts = [
  { eventTitle: "Women's Soccer — Senior Night", dateStr: "Nov 30", hoursLogged: 4.0 },
  { eventTitle: "Swim & Dive Invitational Day 2", dateStr: "Nov 22", hoursLogged: 6.5 },
  { eventTitle: "Swim & Dive Invitational Day 1", dateStr: "Nov 21", hoursLogged: 5.0 },
  { eventTitle: "Monthly Skills Review", dateStr: "Nov 15", hoursLogged: 2.0 },
];

/* small presentational helpers scoped to this page */

function StatTile({ heading, display, accent, Glyph }: (typeof portalMetrics)[number]) {
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

function ChecklistRow({ isDone, text }: { isDone: boolean; text: string }) {
  return (
    <li className="flex gap-2">
      {isDone ? (
        <IconCheckbox className="mt-px size-5 shrink-0 text-emerald-600" stroke={1.5} />
      ) : (
        <IconSquare className="mt-px size-5 shrink-0 text-muted-foreground/50" stroke={1.5} />
      )}
      <span className={isDone ? "text-muted-foreground line-through" : ""}>
        {text}
      </span>
    </li>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>

      {/* metric tiles */}
      <div className="grid gap-4 xs:grid-cols-2 lg:grid-cols-4">
        {portalMetrics.map((m) => (
          <StatTile key={m.heading} {...m} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* action items */}
        <Card>
          <CardHeader>
            <CardTitle>Action Items</CardTitle>
            <CardDescription>Tasks that need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              {actionChecklist.map((a) => (
                <ChecklistRow key={a.text} {...a} />
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* upcoming assignments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Assignments</CardTitle>
            <CardDescription>Shifts you&apos;re confirmed for</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {confirmedShifts.map((s) => (
              <div key={s.eventTitle} className="rounded-md border px-3 py-2.5">
                <p className="flex items-start justify-between gap-2">
                  <span className="font-medium leading-snug">{s.eventTitle}</span>
                  <Badge variant="outline" className="shrink-0">
                    {s.crewRole}
                  </Badge>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  <IconCalendarDue className="mr-1 inline size-3.5 align-[-2px]" stroke={1.5} />
                  {s.dateTime}
                  <IconMapPinFilled className="ml-3 mr-1 inline size-3.5 align-[-2px]" stroke={1.5} />
                  {s.venueName}
                </p>
              </div>
            ))}

            <Button variant="ghost" size="sm" className="mt-1 self-start" asChild>
              <Link href="/events">
                Browse all events
                <IconArrowNarrowRight className="ml-1 size-4" stroke={1.5} />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* recent activity spanning both columns */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <IconActivity className="size-5" stroke={1.5} />
              Recent Activity
            </CardTitle>
            <CardDescription>Hours credited from recent shifts</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {completedShifts.map((c) => (
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

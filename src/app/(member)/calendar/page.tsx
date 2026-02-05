import type { Metadata } from "next";
import { IconCalendarMonth, IconInfoSmall } from "@tabler/icons-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Calendar | IC-EMS",
  description: "Monthly scheduling calendar for IC-EMS coverages and training.",
};

/*
 * Presentational calendar for December 2025.
 * Dec 1 2025 is a Monday, so the grid has 1 leading blank (Sunday).
 */

const DOW_HEADERS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;
const LEADING_BLANKS = 1;
const DAYS_IN_DEC = 31;

type MarkerKind = "coverage" | "general_training" | "aha_training";

const dayMarkers: Record<number, { title: string; kind: MarkerKind }> = {
  6: { title: "Skills Review", kind: "general_training" },
  14: { title: "L500 Practice", kind: "coverage" },
  18: { title: "BLS Cert", kind: "aha_training" },
  21: { title: "Basketball", kind: "coverage" },
  27: { title: "FA Refresher", kind: "general_training" },
};

const kindStyle: Record<MarkerKind, { dot: string; pill: string }> = {
  coverage: { dot: "bg-blue-600", pill: "bg-blue-600 text-white" },
  general_training: { dot: "bg-emerald-600", pill: "bg-emerald-600 text-white" },
  aha_training: { dot: "bg-orange-600", pill: "bg-orange-600 text-white" },
};

const legendItems: { label: string; kind: MarkerKind }[] = [
  { label: "Events", kind: "coverage" },
  { label: "General Training", kind: "general_training" },
  { label: "AHA Training", kind: "aha_training" },
];

export default function CalendarPage() {
  /* build the cell array: null = blank, number = day of month */
  const gridCells: (number | null)[] = [
    ...Array.from<null>({ length: LEADING_BLANKS }).fill(null),
    ...Array.from({ length: DAYS_IN_DEC }, (_, i) => i + 1),
  ];

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="mt-1 text-muted-foreground">
          Color-coded overview of scheduled coverages and training.
        </p>
      </header>

      {/* colour legend */}
      <div className="flex flex-wrap items-center gap-5 text-sm">
        {legendItems.map((li) => (
          <span key={li.label} className="inline-flex items-center gap-1.5">
            <span className={`inline-block size-2.5 rounded-full ${kindStyle[li.kind].dot}`} />
            {li.label}
          </span>
        ))}
      </div>

      <Separator />

      {/* static filter chips — no client JS needed */}
      <nav aria-label="Calendar category filter" className="flex gap-2">
        <Badge>Show All</Badge>
        <Badge variant="outline">Events Only</Badge>
        <Badge variant="outline">Training Only</Badge>
      </nav>

      {/* month grid card */}
      <Card>
        <CardHeader className="flex-row items-center gap-2">
          <IconCalendarMonth className="size-5 text-muted-foreground" stroke={1.5} />
          <div>
            <CardTitle>December 2025</CardTitle>
            <CardDescription>Tap a date for event details</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="grid min-w-[28rem] grid-cols-7">
            {DOW_HEADERS.map((wd) => (
              <div
                key={wd}
                className="border-b py-1.5 text-center text-xs font-semibold uppercase text-muted-foreground"
              >
                {wd}
              </div>
            ))}

            {gridCells.map((day, idx) => {
              const marker = day !== null ? dayMarkers[day] : undefined;
              return (
                <div
                  key={day ?? `blank-${idx}`}
                  className="flex min-h-[4rem] flex-col border-b p-1"
                >
                  {day !== null && (
                    <>
                      <span className="text-[11px] font-semibold leading-none">
                        {day}
                      </span>
                      {marker && (
                        <span
                          className={`mt-auto inline-block self-start rounded px-1 py-px text-[9px] font-medium leading-tight ${kindStyle[marker.kind].pill}`}
                        >
                          {marker.title}
                        </span>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* work-in-progress callout */}
      <Card className="border-dashed">
        <CardContent className="flex items-start gap-3 py-5">
          <IconInfoSmall className="mt-0.5 size-5 shrink-0 text-muted-foreground" stroke={1.5} />
          <p className="text-sm text-muted-foreground">
            Interactive calendar with week view, direct sign-up, and live
            filtering is under active development.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

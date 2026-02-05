"use client";

import Link from "next/link";
import {
  IconHeartbeat,
  IconFirstAidKit,
  IconStethoscope,
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

/* demo training catalogue */

interface TrainingEntry {
  id: string;
  title: string;
  kind: "AHA" | "General";
  dateLabel: string;
  spotsLabel: string;
  costNote: string | null;
  description: string;
  Glyph: typeof IconHeartbeat;
}

const catalogue: TrainingEntry[] = [
  {
    id: "trn-bls-spring",
    title: "BLS / CPR Certification",
    kind: "AHA",
    dateLabel: "Date TBA — Spring 2026",
    spotsLabel: "20 spots",
    costNote: "$45 CPR · $35 FA · $70 Both",
    description:
      "American Heart Association BLS Provider course. Covers adult, child, and infant CPR with AED use.",
    Glyph: IconHeartbeat,
  },
  {
    id: "trn-fa-spring",
    title: "Heartsaver First Aid",
    kind: "AHA",
    dateLabel: "Date TBA — Spring 2026",
    spotsLabel: "20 spots",
    costNote: "$35 standalone · included in combo",
    description:
      "AHA Heartsaver First Aid covering scene assessment, medical emergencies, Narcan administration, and bleeding control.",
    Glyph: IconFirstAidKit,
  },
  {
    id: "trn-skills-jan",
    title: "Monthly Skills Review",
    kind: "General",
    dateLabel: "January 18, 2026 · 10 AM–12 PM",
    spotsLabel: "No cap",
    costNote: null,
    description:
      "Hands-on practice with vitals, splinting, spinal motion restriction, and scenario walk-throughs. Open to all active members.",
    Glyph: IconStethoscope,
  },
];

function TrainingTile({ t }: { t: TrainingEntry }) {
  const kindColor = t.kind === "AHA" ? "bg-orange-600" : "bg-emerald-600";
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <t.Glyph className="size-6 shrink-0 text-primary" stroke={1.5} />
          <Badge className={`${kindColor} text-white`}>{t.kind}</Badge>
        </div>
        <CardTitle className="mt-1 text-lg">{t.title}</CardTitle>
        <CardDescription>{t.dateLabel}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
        <p>{t.description}</p>
        <p className="inline-flex items-center gap-1">
          <IconUsers className="size-3.5" stroke={1.5} />
          {t.spotsLabel}
        </p>
        {t.costNote && (
          <p className="inline-flex items-center gap-1 font-medium text-foreground">
            <IconCurrencyDollar className="size-3.5" stroke={1.5} />
            {t.costNote}
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button size="sm" asChild>
          <Link href={`/training/${t.id}`}>Details &amp; Sign Up</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function TrainingListPage() {
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

      <Tabs defaultValue="available">
        <TabsList>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="enrolled">My Training</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="mt-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {catalogue.map((t) => (
              <TrainingTile key={t.id} t={t} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="enrolled" className="mt-5">
          <Card className="border-dashed">
            <CardContent className="py-16 text-center text-sm text-muted-foreground">
              Training sessions you&apos;ve registered for will appear here.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

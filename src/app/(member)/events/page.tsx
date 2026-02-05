"use client";

import Link from "next/link";
import {
  IconCalendarEvent,
  IconMapPin2,
  IconClockHour3,
  IconUsersGroup,
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

/* demo event coverage data — will be fetched from Supabase */

const coverageList = [
  {
    id: "evt-little500-d1",
    name: "Little 500 Practice — Day 1",
    dateStr: "December 14, 2025",
    timeStr: "8:00 AM – 4:00 PM",
    venue: "Bill Armstrong Stadium",
    openSlots: [
      { label: "2 EMTs needed", tone: "default" as const },
      { label: "3 FA / EMR needed", tone: "secondary" as const },
      { label: "1 Supervisor", tone: "outline" as const },
    ],
  },
  {
    id: "evt-bball-purdue",
    name: "IU Men's Basketball vs. Purdue",
    dateStr: "December 21, 2025",
    timeStr: "2:00 PM – 6:00 PM",
    venue: "Simon Skjodt Assembly Hall",
    openSlots: [
      { label: "1 EMT needed", tone: "default" as const },
      { label: "2 FA / EMR needed", tone: "secondary" as const },
    ],
  },
  {
    id: "evt-swim-winter",
    name: "Swim & Dive Winter Invitational",
    dateStr: "January 10, 2026",
    timeStr: "9:00 AM – 5:00 PM",
    venue: "Counsilman-Billingsley Aquatic Center",
    openSlots: [
      { label: "2 EMTs needed", tone: "default" as const },
      { label: "4 FA / EMR needed", tone: "secondary" as const },
      { label: "1 Supervisor", tone: "outline" as const },
    ],
  },
];

export default function EventsListPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Events</h1>
        <p className="mt-1 text-muted-foreground">
          Browse upcoming coverages, manage your sign-ups, and review past
          events.
        </p>
      </header>

      <Separator />

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="mine">My Events</TabsTrigger>
          <TabsTrigger value="history">Past Events</TabsTrigger>
        </TabsList>

        {/* ---- upcoming ---- */}
        <TabsContent value="upcoming" className="mt-5 flex flex-col gap-4">
          {coverageList.map((evt) => (
            <Card key={evt.id}>
              <CardHeader>
                <CardTitle className="text-lg">{evt.name}</CardTitle>
                <CardDescription className="flex flex-wrap gap-x-4 gap-y-1">
                  <span className="inline-flex items-center gap-1">
                    <IconCalendarEvent className="size-4" stroke={1.5} />
                    {evt.dateStr}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <IconClockHour3 className="size-4" stroke={1.5} />
                    {evt.timeStr}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <IconMapPin2 className="size-4" stroke={1.5} />
                    {evt.venue}
                  </span>
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-wrap gap-2">
                {evt.openSlots.map((slot) => (
                  <Badge key={slot.label} variant={slot.tone}>
                    <IconUsersGroup className="mr-1 size-3" stroke={1.5} />
                    {slot.label}
                  </Badge>
                ))}
              </CardContent>

              <CardFooter>
                <Button size="sm" asChild>
                  <Link href={`/events/${evt.id}`}>Sign Up</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>

        {/* ---- my events (empty state) ---- */}
        <TabsContent value="mine" className="mt-5">
          <Card className="border-dashed">
            <CardContent className="py-16 text-center text-sm text-muted-foreground">
              Events you&apos;ve signed up for will appear here once you join a
              shift.
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---- past events (empty state) ---- */}
        <TabsContent value="history" className="mt-5">
          <Card className="border-dashed">
            <CardContent className="py-16 text-center text-sm text-muted-foreground">
              Previously completed coverages and logged hours will show up here.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

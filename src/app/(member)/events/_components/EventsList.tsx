"use client";

import { useState } from "react";
import { IconLayoutGrid, IconLayoutList } from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import EventCard from "./EventCard";
import type { Event } from "@/types/event.types";

interface EventsListProps {
  events: Event[];
}

export default function EventsList({ events }: EventsListProps) {
  const [layout, setLayout] = useState<"list" | "grid">("list");

  if (events.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-16 text-center text-sm text-muted-foreground">
          No events found.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <ToggleGroup
          type="single"
          value={layout}
          onValueChange={(v) => {
            if (v) setLayout(v as "list" | "grid");
          }}
        >
          <ToggleGroupItem value="list" aria-label="List view">
            <IconLayoutList className="size-4" stroke={1.5} />
          </ToggleGroupItem>
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <IconLayoutGrid className="size-4" stroke={1.5} />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div
        className={
          layout === "grid"
            ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            : "flex flex-col gap-4"
        }
      >
        {events.map((event) => (
          <EventCard key={event.event_id} event={event} />
        ))}
      </div>
    </div>
  );
}

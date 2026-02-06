"use client";

import { IconList, IconCalendarMonth } from "@tabler/icons-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface EventCalendarToggleProps {
  view: "list" | "calendar";
  onViewChange: (view: "list" | "calendar") => void;
}

export default function EventCalendarToggle({
  view,
  onViewChange,
}: EventCalendarToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={view}
      onValueChange={(v) => {
        if (v) onViewChange(v as "list" | "calendar");
      }}
    >
      <ToggleGroupItem value="list" aria-label="List view">
        <IconList className="size-4" stroke={1.5} />
        <span className="ml-1 text-sm">List</span>
      </ToggleGroupItem>
      <ToggleGroupItem value="calendar" aria-label="Calendar view">
        <IconCalendarMonth className="size-4" stroke={1.5} />
        <span className="ml-1 text-sm">Calendar</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

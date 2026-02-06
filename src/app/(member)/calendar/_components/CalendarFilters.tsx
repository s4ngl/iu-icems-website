"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconSearch } from "@tabler/icons-react";

export interface CalendarFilterState {
  events: boolean;
  generalTraining: boolean;
  ahaTraining: boolean;
  search: string;
}

interface CalendarFiltersProps {
  filters: CalendarFilterState;
  onFilterChange: (filters: CalendarFilterState) => void;
}

const filterItems = [
  { key: "events" as const, label: "Events", dot: "bg-blue-600" },
  { key: "generalTraining" as const, label: "General Training", dot: "bg-emerald-600" },
  { key: "ahaTraining" as const, label: "AHA Training", dot: "bg-orange-600" },
];

export default function CalendarFilters({
  filters,
  onFilterChange,
}: CalendarFiltersProps) {
  const toggle = (key: keyof Omit<CalendarFilterState, "search">) => {
    onFilterChange({ ...filters, [key]: !filters[key] });
  };

  return (
    <div className="flex flex-wrap items-center gap-5">
      {filterItems.map((item) => (
        <Label key={item.key} className="cursor-pointer gap-1.5">
          <Checkbox
            checked={filters[item.key]}
            onCheckedChange={() => toggle(item.key)}
          />
          <span className={`inline-block size-2 rounded-full ${item.dot}`} />
          {item.label}
        </Label>
      ))}

      <div className="relative ml-auto w-full max-w-56">
        <IconSearch className="absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search events…"
          value={filters.search}
          onChange={(e) =>
            onFilterChange({ ...filters, search: e.target.value })
          }
          className="pl-7"
        />
      </div>
    </div>
  );
}
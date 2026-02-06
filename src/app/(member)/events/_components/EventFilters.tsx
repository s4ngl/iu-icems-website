"use client";

import { IconSearch, IconFilter } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

export interface EventFilterState {
  search: string;
  roleType: "all" | "supervisor" | "emt" | "fa_emr";
  status: "all" | "open" | "finalized";
  dateFrom: string;
  dateTo: string;
}

interface EventFiltersProps {
  filters: EventFilterState;
  onChange: (filters: EventFilterState) => void;
}

export default function EventFilters({ filters, onChange }: EventFiltersProps) {
  function update(patch: Partial<EventFilterState>) {
    onChange({ ...filters, ...patch });
  }

  return (
    <Card>
      <CardContent className="flex flex-wrap items-end gap-4 pt-6">
        {/* search */}
        <div className="flex min-w-[200px] flex-1 flex-col gap-1.5">
          <label className="text-sm font-medium">Search</label>
          <div className="relative">
            <IconSearch className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" stroke={1.5} />
            <Input
              placeholder="Event name…"
              value={filters.search}
              onChange={(e) => update({ search: e.target.value })}
              className="pl-8"
            />
          </div>
        </div>

        {/* role type */}
        <div className="flex min-w-[140px] flex-col gap-1.5">
          <label className="text-sm font-medium">Role</label>
          <Select
            value={filters.roleType}
            onValueChange={(v) =>
              update({ roleType: v as EventFilterState["roleType"] })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="supervisor">Supervisor</SelectItem>
              <SelectItem value="emt">EMT</SelectItem>
              <SelectItem value="fa_emr">FA/EMR</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* status */}
        <div className="flex min-w-[140px] flex-col gap-1.5">
          <label className="text-sm font-medium">Status</label>
          <Select
            value={filters.status}
            onValueChange={(v) =>
              update({ status: v as EventFilterState["status"] })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="finalized">Finalized</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* date range */}
        <div className="flex min-w-[140px] flex-col gap-1.5">
          <label className="text-sm font-medium">From</label>
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => update({ dateFrom: e.target.value })}
          />
        </div>
        <div className="flex min-w-[140px] flex-col gap-1.5">
          <label className="text-sm font-medium">To</label>
          <Input
            type="date"
            value={filters.dateTo}
            onChange={(e) => update({ dateTo: e.target.value })}
          />
        </div>

        <IconFilter className="mb-2 size-4 text-muted-foreground" stroke={1.5} />
      </CardContent>
    </Card>
  );
}

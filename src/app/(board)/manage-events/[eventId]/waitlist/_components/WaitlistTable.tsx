"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconArrowUp, IconArrowDown, IconUserPlus } from "@tabler/icons-react";
import { POSITION_LABELS } from "@/lib/utils/constants";

export interface WaitlistEntry {
  signup_id: string;
  user_id: string;
  name: string;
  position_type: number;
  signup_time: string;
  total_hours: number;
  penalty_points: number;
  is_assigned: boolean;
}

interface WaitlistTableProps {
  waitlist?: WaitlistEntry[];
  onAssign?: (signupId: string) => void;
  onMemberClick?: (userId: string) => void;
}

const DEMO_WAITLIST: WaitlistEntry[] = [
  {
    signup_id: "ws-1",
    user_id: "u-1",
    name: "Alice Johnson",
    position_type: 2,
    signup_time: "2025-01-10T08:30:00Z",
    total_hours: 45,
    penalty_points: 0,
    is_assigned: true,
  },
  {
    signup_id: "ws-2",
    user_id: "u-2",
    name: "Bob Smith",
    position_type: 1,
    signup_time: "2025-01-10T09:15:00Z",
    total_hours: 12,
    penalty_points: 0,
    is_assigned: true,
  },
  {
    signup_id: "ws-3",
    user_id: "u-3",
    name: "Carol Williams",
    position_type: 2,
    signup_time: "2025-01-10T10:00:00Z",
    total_hours: 28,
    penalty_points: 1,
    is_assigned: false,
  },
  {
    signup_id: "ws-4",
    user_id: "u-4",
    name: "David Lee",
    position_type: 0,
    signup_time: "2025-01-10T10:30:00Z",
    total_hours: 60,
    penalty_points: 0,
    is_assigned: true,
  },
  {
    signup_id: "ws-5",
    user_id: "u-5",
    name: "Emma Davis",
    position_type: 2,
    signup_time: "2025-01-10T11:00:00Z",
    total_hours: 8,
    penalty_points: 2,
    is_assigned: false,
  },
];

type SortField = "total_hours" | "penalty_points";
type SortDirection = "asc" | "desc";

const formatSignupTime = (timeString: string) => {
  return new Date(timeString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export function WaitlistTable({
  waitlist = DEMO_WAITLIST,
  onAssign,
  onMemberClick,
}: WaitlistTableProps) {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedWaitlist = [...waitlist].sort((a, b) => {
    if (!sortField) return 0;
    const multiplier = sortDirection === "asc" ? 1 : -1;
    return (a[sortField] - b[sortField]) * multiplier;
  });

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <IconArrowUp className="ml-1 inline h-3 w-3" />
    ) : (
      <IconArrowDown className="ml-1 inline h-3 w-3" />
    );
  };

  if (waitlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No signups for this event yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Position Type</TableHead>
              <TableHead>Signup Time</TableHead>
              <TableHead>
                <button
                  className="inline-flex items-center hover:text-foreground"
                  onClick={() => handleSort("total_hours")}
                >
                  Total Hours
                  {renderSortIcon("total_hours")}
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="inline-flex items-center hover:text-foreground"
                  onClick={() => handleSort("penalty_points")}
                >
                  Penalty Points
                  {renderSortIcon("penalty_points")}
                </button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedWaitlist.map((entry) => (
              <TableRow key={entry.signup_id}>
                <TableCell>
                  <button
                    className="font-medium text-left hover:underline"
                    onClick={() => onMemberClick?.(entry.user_id)}
                  >
                    {entry.name}
                  </button>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {POSITION_LABELS[entry.position_type] ?? "Unknown"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatSignupTime(entry.signup_time)}
                </TableCell>
                <TableCell>{entry.total_hours}</TableCell>
                <TableCell>
                  {entry.penalty_points > 0 ? (
                    <span className="text-amber-600">{entry.penalty_points}</span>
                  ) : (
                    <span className="text-muted-foreground">0</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={entry.is_assigned ? "default" : "secondary"}>
                    {entry.is_assigned ? "Assigned" : "Waitlist"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {!entry.is_assigned && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAssign?.(entry.signup_id)}
                    >
                      <IconUserPlus className="mr-1 h-4 w-4" />
                      Assign
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {waitlist.length} signup{waitlist.length !== 1 ? "s" : ""} &middot;{" "}
        {waitlist.filter((e) => e.is_assigned).length} assigned
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
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
import { IconEdit, IconTrash, IconList } from "@tabler/icons-react";
import { POSITION_LABELS, POSITION_TYPES } from "@/lib/utils/constants";
import type { Database } from "@/types/database.types";

type Event = Database["public"]["Tables"]["events"]["Row"];

interface EventWithStaffing extends Event {
  fa_emr_assigned?: number;
  emt_assigned?: number;
  supervisor_assigned?: number;
}

interface EventsManagementTableProps {
  events?: EventWithStaffing[];
  onEdit?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
}

const DEMO_EVENTS: EventWithStaffing[] = [
  {
    event_id: "evt-1",
    event_name: "IU Football vs Purdue",
    event_date: "2025-09-20",
    start_time: "11:00",
    end_time: "16:00",
    location: "Memorial Stadium",
    description: "Home football game coverage",
    fa_emr_needed: 4,
    emt_needed: 2,
    supervisor_needed: 1,
    fa_emr_assigned: 3,
    emt_assigned: 2,
    supervisor_assigned: 1,
    is_finalized: true,
    created_by: null,
    created_at: "2025-01-10T00:00:00Z",
  },
  {
    event_id: "evt-2",
    event_name: "Campus 5K Run",
    event_date: "2025-10-05",
    start_time: "08:00",
    end_time: "12:00",
    location: "Woodlawn Field",
    description: "Annual campus charity run",
    fa_emr_needed: 3,
    emt_needed: 1,
    supervisor_needed: 1,
    fa_emr_assigned: 1,
    emt_assigned: 0,
    supervisor_assigned: 0,
    is_finalized: false,
    created_by: null,
    created_at: "2025-01-12T00:00:00Z",
  },
  {
    event_id: "evt-3",
    event_name: "Greek Week Activities",
    event_date: "2025-10-15",
    start_time: "14:00",
    end_time: "20:00",
    location: "Dunn Meadow",
    description: "Greek week outdoor events",
    fa_emr_needed: 2,
    emt_needed: 1,
    supervisor_needed: 1,
    fa_emr_assigned: 0,
    emt_assigned: 0,
    supervisor_assigned: 0,
    is_finalized: false,
    created_by: null,
    created_at: "2025-01-15T00:00:00Z",
  },
];

const formatDate = (dateString: string) => {
  return new Date(dateString + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function StaffingCell({
  needed,
  assigned,
  label,
}: {
  needed: number;
  assigned: number;
  label: string;
}) {
  const isFull = assigned >= needed;
  return (
    <span className={isFull ? "text-green-600" : "text-amber-600"}>
      {label}: {assigned}/{needed}
    </span>
  );
}

export function EventsManagementTable({
  events = DEMO_EVENTS,
  onEdit,
  onDelete,
}: EventsManagementTableProps) {
  const router = useRouter();

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No events found</p>
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
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Staffing</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.event_id}>
                <TableCell className="font-medium">{event.event_name}</TableCell>
                <TableCell>{formatDate(event.event_date)}</TableCell>
                <TableCell className="text-muted-foreground">{event.location}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5 text-xs">
                    <StaffingCell
                      needed={event.fa_emr_needed}
                      assigned={event.fa_emr_assigned ?? 0}
                      label={POSITION_LABELS[POSITION_TYPES.FA_EMR]}
                    />
                    <StaffingCell
                      needed={event.emt_needed}
                      assigned={event.emt_assigned ?? 0}
                      label={POSITION_LABELS[POSITION_TYPES.EMT]}
                    />
                    <StaffingCell
                      needed={event.supervisor_needed}
                      assigned={event.supervisor_assigned ?? 0}
                      label={POSITION_LABELS[POSITION_TYPES.SUPERVISOR]}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={event.is_finalized ? "default" : "outline"}>
                    {event.is_finalized ? "Finalized" : "Open"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/manage-events/${event.event_id}/waitlist`)}
                      title="View Waitlist"
                    >
                      <IconList className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit?.(event.event_id)}
                      title="Edit"
                    >
                      <IconEdit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete?.(event.event_id)}
                      title="Delete"
                    >
                      <IconTrash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {events.length} event{events.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}

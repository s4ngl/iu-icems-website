"use client";

import { format } from "date-fns";
import {
  IconCalendar,
  IconClock,
  IconMapPin,
} from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CalendarEvent } from "./CalendarView";

const typeMeta: Record<
  CalendarEvent["type"],
  { label: string; className: string }
> = {
  event: { label: "Event", className: "bg-blue-600 text-white" },
  "general-training": {
    label: "General Training",
    className: "bg-emerald-600 text-white",
  },
  "aha-training": {
    label: "AHA Training",
    className: "bg-orange-600 text-white",
  },
};

interface EventPopupProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EventPopup({
  event,
  isOpen,
  onClose,
}: EventPopupProps) {
  if (!event) return null;

  const meta = typeMeta[event.type];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>{event.title}</DialogTitle>
            <Badge className={meta.className}>{meta.label}</Badge>
          </div>
          <DialogDescription>
            {event.role ?? "Open to all members"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconCalendar className="size-4 shrink-0" stroke={1.5} />
            {format(new Date(event.date), "EEEE, MMMM d, yyyy")}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconClock className="size-4 shrink-0" stroke={1.5} />
            {event.startTime} – {event.endTime}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconMapPin className="size-4 shrink-0" stroke={1.5} />
            {event.location}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>Sign Up</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
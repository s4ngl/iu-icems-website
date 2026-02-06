"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IconCalendar, IconClock, IconMapPin } from "@tabler/icons-react";
import type { Database } from "@/types/database.types";

type Event = Database["public"]["Tables"]["events"]["Row"];

interface EventFormData {
  event_name: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  description: string;
  fa_emr_needed: number;
  emt_needed: number;
  supervisor_needed: number;
}

interface EventFormProps {
  event?: Event;
  onSubmit: (data: EventFormData) => void;
  onCancel?: () => void;
}

const DEFAULT_FORM_DATA: EventFormData = {
  event_name: "",
  event_date: "",
  start_time: "",
  end_time: "",
  location: "",
  description: "",
  fa_emr_needed: 0,
  emt_needed: 0,
  supervisor_needed: 0,
};

export function EventForm({ event, onSubmit, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>(
    event
      ? {
          event_name: event.event_name,
          event_date: event.event_date,
          start_time: event.start_time,
          end_time: event.end_time,
          location: event.location,
          description: event.description ?? "",
          fa_emr_needed: event.fa_emr_needed,
          emt_needed: event.emt_needed,
          supervisor_needed: event.supervisor_needed,
        }
      : DEFAULT_FORM_DATA
  );
  const [errors, setErrors] = useState<Partial<Record<keyof EventFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof EventFormData, string>> = {};

    if (!formData.event_name.trim()) {
      newErrors.event_name = "Event name is required";
    }
    if (!formData.event_date) {
      newErrors.event_date = "Event date is required";
    } else {
      const eventDate = new Date(formData.event_date + "T00:00:00");
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (eventDate < today) {
        newErrors.event_date = "Event date must be in the future";
      }
    }
    if (!formData.start_time) {
      newErrors.start_time = "Start time is required";
    }
    if (!formData.end_time) {
      newErrors.end_time = "End time is required";
    } else if (formData.start_time && formData.end_time <= formData.start_time) {
      newErrors.end_time = "End time must be after start time";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const updateField = <K extends keyof EventFormData>(key: K, value: EventFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="event_name">Event Name</Label>
        <Input
          id="event_name"
          placeholder="Enter event name"
          value={formData.event_name}
          onChange={(e) => updateField("event_name", e.target.value)}
        />
        {errors.event_name && (
          <p className="text-sm text-destructive">{errors.event_name}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="event_date">
            <IconCalendar className="mr-1 inline h-4 w-4" />
            Date
          </Label>
          <Input
            id="event_date"
            type="date"
            value={formData.event_date}
            onChange={(e) => updateField("event_date", e.target.value)}
          />
          {errors.event_date && (
            <p className="text-sm text-destructive">{errors.event_date}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="start_time">
            <IconClock className="mr-1 inline h-4 w-4" />
            Start Time
          </Label>
          <Input
            id="start_time"
            type="time"
            value={formData.start_time}
            onChange={(e) => updateField("start_time", e.target.value)}
          />
          {errors.start_time && (
            <p className="text-sm text-destructive">{errors.start_time}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_time">
            <IconClock className="mr-1 inline h-4 w-4" />
            End Time
          </Label>
          <Input
            id="end_time"
            type="time"
            value={formData.end_time}
            onChange={(e) => updateField("end_time", e.target.value)}
          />
          {errors.end_time && (
            <p className="text-sm text-destructive">{errors.end_time}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">
          <IconMapPin className="mr-1 inline h-4 w-4" />
          Location
        </Label>
        <Input
          id="location"
          placeholder="Enter event location"
          value={formData.location}
          onChange={(e) => updateField("location", e.target.value)}
        />
        {errors.location && (
          <p className="text-sm text-destructive">{errors.location}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter event description"
          rows={4}
          value={formData.description}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>

      <div className="space-y-3">
        <Label>Staffing Requirements</Label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="fa_emr_needed" className="text-sm font-normal">
              FA/EMR Needed
            </Label>
            <Input
              id="fa_emr_needed"
              type="number"
              min={0}
              value={formData.fa_emr_needed}
              onChange={(e) => updateField("fa_emr_needed", parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emt_needed" className="text-sm font-normal">
              EMT Needed
            </Label>
            <Input
              id="emt_needed"
              type="number"
              min={0}
              value={formData.emt_needed}
              onChange={(e) => updateField("emt_needed", parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="supervisor_needed" className="text-sm font-normal">
              Supervisor Needed
            </Label>
            <Input
              id="supervisor_needed"
              type="number"
              min={0}
              value={formData.supervisor_needed}
              onChange={(e) => updateField("supervisor_needed", parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">{event ? "Update Event" : "Create Event"}</Button>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { IconCalendar, IconClock, IconMapPin } from "@tabler/icons-react";
import type { Database } from "@/types/database.types";

type TrainingSession = Database["public"]["Tables"]["training_sessions"]["Row"];

interface TrainingFormData {
  training_name: string;
  training_date: string;
  start_time: string;
  end_time: string;
  location: string;
  description: string;
  max_participants: number | null;
  is_aha_training: boolean;
  cpr_cost: number | null;
  fa_cost: number | null;
  both_cost: number | null;
  point_contact: string;
}

interface TrainingFormProps {
  trainingSession?: TrainingSession;
  onSubmit: (data: TrainingFormData) => void;
  onCancel?: () => void;
}

const DEFAULT_FORM_DATA: TrainingFormData = {
  training_name: "",
  training_date: "",
  start_time: "",
  end_time: "",
  location: "",
  description: "",
  max_participants: null,
  is_aha_training: false,
  cpr_cost: null,
  fa_cost: null,
  both_cost: null,
  point_contact: "",
};

export function TrainingForm({ trainingSession, onSubmit, onCancel }: TrainingFormProps) {
  const [formData, setFormData] = useState<TrainingFormData>(
    trainingSession
      ? {
          training_name: trainingSession.training_name,
          training_date: trainingSession.training_date,
          start_time: trainingSession.start_time,
          end_time: trainingSession.end_time,
          location: trainingSession.location,
          description: trainingSession.description ?? "",
          max_participants: trainingSession.max_participants,
          is_aha_training: trainingSession.is_aha_training,
          cpr_cost: trainingSession.cpr_cost,
          fa_cost: trainingSession.fa_cost,
          both_cost: trainingSession.both_cost,
          point_contact: trainingSession.point_contact ?? "",
        }
      : DEFAULT_FORM_DATA
  );
  const [errors, setErrors] = useState<Partial<Record<keyof TrainingFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TrainingFormData, string>> = {};

    if (!formData.training_name.trim()) {
      newErrors.training_name = "Training name is required";
    }
    if (!formData.training_date) {
      newErrors.training_date = "Training date is required";
    } else {
      const trainingDate = new Date(formData.training_date + "T00:00:00");
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (trainingDate < today) {
        newErrors.training_date = "Training date must be in the future";
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
    if (formData.is_aha_training) {
      if (formData.cpr_cost === null || formData.cpr_cost < 0) {
        newErrors.cpr_cost = "CPR cost is required for AHA training";
      }
      if (formData.fa_cost === null || formData.fa_cost < 0) {
        newErrors.fa_cost = "FA cost is required for AHA training";
      }
      if (formData.both_cost === null || formData.both_cost < 0) {
        newErrors.both_cost = "Both cost is required for AHA training";
      }
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

  const updateField = <K extends keyof TrainingFormData>(key: K, value: TrainingFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="training_name">Training Name</Label>
        <Input
          id="training_name"
          placeholder="Enter training name"
          value={formData.training_name}
          onChange={(e) => updateField("training_name", e.target.value)}
        />
        {errors.training_name && (
          <p className="text-sm text-destructive">{errors.training_name}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="training_date">
            <IconCalendar className="mr-1 inline h-4 w-4" />
            Date
          </Label>
          <Input
            id="training_date"
            type="date"
            value={formData.training_date}
            onChange={(e) => updateField("training_date", e.target.value)}
          />
          {errors.training_date && (
            <p className="text-sm text-destructive">{errors.training_date}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="training_start_time">
            <IconClock className="mr-1 inline h-4 w-4" />
            Start Time
          </Label>
          <Input
            id="training_start_time"
            type="time"
            value={formData.start_time}
            onChange={(e) => updateField("start_time", e.target.value)}
          />
          {errors.start_time && (
            <p className="text-sm text-destructive">{errors.start_time}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="training_end_time">
            <IconClock className="mr-1 inline h-4 w-4" />
            End Time
          </Label>
          <Input
            id="training_end_time"
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
        <Label htmlFor="training_location">
          <IconMapPin className="mr-1 inline h-4 w-4" />
          Location
        </Label>
        <Input
          id="training_location"
          placeholder="Enter training location"
          value={formData.location}
          onChange={(e) => updateField("location", e.target.value)}
        />
        {errors.location && (
          <p className="text-sm text-destructive">{errors.location}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="training_description">Description</Label>
        <Textarea
          id="training_description"
          placeholder="Enter training description"
          rows={4}
          value={formData.description}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="max_participants">Max Participants</Label>
          <Input
            id="max_participants"
            type="number"
            min={1}
            placeholder="No limit"
            value={formData.max_participants ?? ""}
            onChange={(e) =>
              updateField("max_participants", e.target.value ? parseInt(e.target.value) : null)
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="point_contact">Point of Contact</Label>
          <Input
            id="point_contact"
            placeholder="Contact name or email"
            value={formData.point_contact}
            onChange={(e) => updateField("point_contact", e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-md border p-4">
        <div className="space-y-0.5">
          <Label htmlFor="is_aha">AHA Training</Label>
          <p className="text-xs text-muted-foreground">
            Enable if this is an American Heart Association training with costs
          </p>
        </div>
        <Switch
          id="is_aha"
          checked={formData.is_aha_training}
          onCheckedChange={(checked) => updateField("is_aha_training", checked)}
        />
      </div>

      {formData.is_aha_training && (
        <div className="space-y-3 rounded-md border p-4">
          <Label>AHA Training Costs</Label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="cpr_cost" className="text-sm font-normal">
                CPR Only ($)
              </Label>
              <Input
                id="cpr_cost"
                type="number"
                min={0}
                step={0.01}
                placeholder="0.00"
                value={formData.cpr_cost ?? ""}
                onChange={(e) =>
                  updateField("cpr_cost", e.target.value ? parseFloat(e.target.value) : null)
                }
              />
              {errors.cpr_cost && (
                <p className="text-sm text-destructive">{errors.cpr_cost}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="fa_cost" className="text-sm font-normal">
                First Aid Only ($)
              </Label>
              <Input
                id="fa_cost"
                type="number"
                min={0}
                step={0.01}
                placeholder="0.00"
                value={formData.fa_cost ?? ""}
                onChange={(e) =>
                  updateField("fa_cost", e.target.value ? parseFloat(e.target.value) : null)
                }
              />
              {errors.fa_cost && (
                <p className="text-sm text-destructive">{errors.fa_cost}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="both_cost" className="text-sm font-normal">
                Both ($)
              </Label>
              <Input
                id="both_cost"
                type="number"
                min={0}
                step={0.01}
                placeholder="0.00"
                value={formData.both_cost ?? ""}
                onChange={(e) =>
                  updateField("both_cost", e.target.value ? parseFloat(e.target.value) : null)
                }
              />
              {errors.both_cost && (
                <p className="text-sm text-destructive">{errors.both_cost}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">
          {trainingSession ? "Update Training" : "Create Training"}
        </Button>
      </div>
    </form>
  );
}

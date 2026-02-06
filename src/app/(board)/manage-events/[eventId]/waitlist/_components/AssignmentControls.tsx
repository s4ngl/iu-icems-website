"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { IconWand } from "@tabler/icons-react";
import { POSITION_LABELS, POSITION_TYPES } from "@/lib/utils/constants";

interface StaffingCounts {
  fa_emr_needed: number;
  emt_needed: number;
  supervisor_needed: number;
  fa_emr_assigned: number;
  emt_assigned: number;
  supervisor_assigned: number;
}

interface AssignmentControlsProps {
  staffing?: StaffingCounts;
  onAutoAssign?: () => void;
  onManualAssignToggle?: (enabled: boolean) => void;
}

const DEFAULT_STAFFING: StaffingCounts = {
  fa_emr_needed: 4,
  emt_needed: 2,
  supervisor_needed: 1,
  fa_emr_assigned: 3,
  emt_assigned: 1,
  supervisor_assigned: 1,
};

function SlotIndicator({
  label,
  needed,
  assigned,
}: {
  label: string;
  needed: number;
  assigned: number;
}) {
  const remaining = Math.max(0, needed - assigned);
  const isFull = remaining === 0;

  return (
    <div className="flex items-center justify-between rounded-md border p-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">
          {assigned} / {needed} assigned
        </p>
      </div>
      <Badge variant={isFull ? "default" : "secondary"}>
        {isFull ? "Full" : `${remaining} remaining`}
      </Badge>
    </div>
  );
}

export function AssignmentControls({
  staffing = DEFAULT_STAFFING,
  onAutoAssign,
  onManualAssignToggle,
}: AssignmentControlsProps) {
  const [manualMode, setManualMode] = useState(false);

  const handleManualToggle = (checked: boolean) => {
    setManualMode(checked);
    onManualAssignToggle?.(checked);
  };

  const totalNeeded =
    staffing.fa_emr_needed + staffing.emt_needed + staffing.supervisor_needed;
  const totalAssigned =
    staffing.fa_emr_assigned + staffing.emt_assigned + staffing.supervisor_assigned;
  const allFull = totalAssigned >= totalNeeded;

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Slots Remaining</h3>
        <SlotIndicator
          label={POSITION_LABELS[POSITION_TYPES.FA_EMR]}
          needed={staffing.fa_emr_needed}
          assigned={staffing.fa_emr_assigned}
        />
        <SlotIndicator
          label={POSITION_LABELS[POSITION_TYPES.EMT]}
          needed={staffing.emt_needed}
          assigned={staffing.emt_assigned}
        />
        <SlotIndicator
          label={POSITION_LABELS[POSITION_TYPES.SUPERVISOR]}
          needed={staffing.supervisor_needed}
          assigned={staffing.supervisor_assigned}
        />
      </div>

      <div className="space-y-3 border-t pt-4">
        <Button
          className="w-full"
          onClick={onAutoAssign}
          disabled={allFull}
        >
          <IconWand className="mr-2 h-4 w-4" />
          Auto-Assign by Hours
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Assigns members with the fewest hours first
        </p>
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <div className="space-y-0.5">
          <Label htmlFor="manual-mode" className="text-sm font-medium">
            Manual Assign
          </Label>
          <p className="text-xs text-muted-foreground">
            Select members individually
          </p>
        </div>
        <Switch
          id="manual-mode"
          checked={manualMode}
          onCheckedChange={handleManualToggle}
        />
      </div>
    </div>
  );
}

"use client";

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
import { IconTrash, IconCash } from "@tabler/icons-react";
import { SIGNUP_TYPE_LABELS } from "@/lib/utils/constants";

export interface TrainingParticipant {
  signup_id: string;
  user_id: string;
  name: string;
  email: string;
  signup_type: number;
  payment_confirmed: boolean;
  signup_time: string;
  is_aha_training: boolean;
}

interface ParticipantsListProps {
  participants?: TrainingParticipant[];
  onRemove?: (signupId: string) => void;
  onConfirmPayment?: (signupId: string) => void;
}

const DEMO_PARTICIPANTS: TrainingParticipant[] = [
  {
    signup_id: "ts-1",
    user_id: "u-1",
    name: "Alice Johnson",
    email: "ajohnso@iu.edu",
    signup_type: 2,
    payment_confirmed: true,
    signup_time: "2025-01-10T08:30:00Z",
    is_aha_training: true,
  },
  {
    signup_id: "ts-2",
    user_id: "u-2",
    name: "Bob Smith",
    email: "bsmith@iu.edu",
    signup_type: 0,
    payment_confirmed: false,
    signup_time: "2025-01-10T09:15:00Z",
    is_aha_training: true,
  },
  {
    signup_id: "ts-3",
    user_id: "u-3",
    name: "Carol Williams",
    email: "cwillia@iu.edu",
    signup_type: 1,
    payment_confirmed: true,
    signup_time: "2025-01-11T10:00:00Z",
    is_aha_training: true,
  },
  {
    signup_id: "ts-4",
    user_id: "u-4",
    name: "David Lee",
    email: "dlee@iu.edu",
    signup_type: 0,
    payment_confirmed: false,
    signup_time: "2025-01-11T14:20:00Z",
    is_aha_training: true,
  },
];

const formatSignupTime = (timeString: string) => {
  return new Date(timeString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export function ParticipantsList({
  participants = DEMO_PARTICIPANTS,
  onRemove,
  onConfirmPayment,
}: ParticipantsListProps) {
  if (participants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No participants signed up yet</p>
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
              <TableHead>Email</TableHead>
              <TableHead>Signup Type</TableHead>
              {participants.some((p) => p.is_aha_training) && (
                <TableHead>Payment</TableHead>
              )}
              <TableHead>Signup Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participants.map((participant) => (
              <TableRow key={participant.signup_id}>
                <TableCell className="font-medium">{participant.name}</TableCell>
                <TableCell className="text-muted-foreground">{participant.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {SIGNUP_TYPE_LABELS[participant.signup_type] ?? "Unknown"}
                  </Badge>
                </TableCell>
                {participants.some((p) => p.is_aha_training) && (
                  <TableCell>
                    {participant.is_aha_training ? (
                      <Badge
                        variant={participant.payment_confirmed ? "default" : "secondary"}
                      >
                        {participant.payment_confirmed ? "Confirmed" : "Pending"}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                )}
                <TableCell className="text-muted-foreground">
                  {formatSignupTime(participant.signup_time)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {participant.is_aha_training && !participant.payment_confirmed && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onConfirmPayment?.(participant.signup_id)}
                        title="Confirm Payment"
                      >
                        <IconCash className="mr-1 h-4 w-4" />
                        Confirm
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemove?.(participant.signup_id)}
                      title="Remove"
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
        Showing {participants.length} participant{participants.length !== 1 ? "s" : ""}
        {participants.some((p) => p.is_aha_training) && (
          <>
            {" "}
            &middot; {participants.filter((p) => p.payment_confirmed).length} payment
            {participants.filter((p) => p.payment_confirmed).length !== 1 ? "s" : ""} confirmed
          </>
        )}
      </div>
    </div>
  );
}

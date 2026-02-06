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
import { IconEdit, IconTrash, IconUsers } from "@tabler/icons-react";
import type { Database } from "@/types/database.types";

type TrainingSession = Database["public"]["Tables"]["training_sessions"]["Row"];

export interface TrainingWithParticipants extends TrainingSession {
  participant_count?: number;
}

interface TrainingManagementTableProps {
  sessions: TrainingWithParticipants[];
  onEdit?: (trainingId: string) => void;
  onDelete?: (trainingId: string) => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export function TrainingManagementTable({
  sessions,
  onEdit,
  onDelete,
}: TrainingManagementTableProps) {
  const router = useRouter();

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No training sessions found</p>
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
              <TableHead>Type</TableHead>
              <TableHead>Participants</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.training_id}>
                <TableCell className="font-medium">{session.training_name}</TableCell>
                <TableCell>{formatDate(session.training_date)}</TableCell>
                <TableCell className="text-muted-foreground">{session.location}</TableCell>
                <TableCell>
                  <Badge variant={session.is_aha_training ? "default" : "outline"}>
                    {session.is_aha_training ? "AHA" : "General"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {session.participant_count ?? 0}
                    {session.max_participants && (
                      <span className="text-muted-foreground"> / {session.max_participants}</span>
                    )}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        router.push(`/manage-training/${session.training_id}/participants`)
                      }
                      title="View Participants"
                    >
                      <IconUsers className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit?.(session.training_id)}
                      title="Edit"
                    >
                      <IconEdit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete?.(session.training_id)}
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
        Showing {sessions.length} session{sessions.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconAlertTriangle,
  IconPlus,
  IconTrash,
  IconX,
  IconCheck,
} from "@tabler/icons-react";
import { useAuth } from "@/hooks/use-auth";
import type { Database } from "@/types/database.types";

type Member = Database["public"]["Tables"]["members"]["Row"];
type PenaltyPoint = Database["public"]["Tables"]["penalty_points"]["Row"];

interface PenaltyPointsManagementProps {
  member: Member;
  onUpdate: () => void;
}

export function PenaltyPointsManagement({ member, onUpdate }: PenaltyPointsManagementProps) {
  const { member: currentUser } = useAuth();
  const [penaltyPoints, setPenaltyPoints] = useState<PenaltyPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const [newPoints, setNewPoints] = useState("");
  const [newReason, setNewReason] = useState("");
  const [newAutoRemoveDate, setNewAutoRemoveDate] = useState("");

  useEffect(() => {
    fetchPenaltyPoints();
  }, [member.user_id]);

  async function fetchPenaltyPoints() {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/members/${member.user_id}/penalty-points`);
      if (!response.ok) {
        throw new Error("Failed to fetch penalty points");
      }
      const data = await response.json();
      setPenaltyPoints(data);
    } catch (error) {
      console.error("Error fetching penalty points:", error);
      setPenaltyPoints([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddPenaltyPoint() {
    if (!currentUser?.user_id || !newPoints || !newReason) return;

    try {
      setIsSaving(true);
      const response = await fetch(`/api/members/${member.user_id}/penalty-points`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          points: parseInt(newPoints),
          reason: newReason,
          assignedBy: currentUser.user_id,
          autoRemoveDate: newAutoRemoveDate || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add penalty point");
      }

      setIsAdding(false);
      setNewPoints("");
      setNewReason("");
      setNewAutoRemoveDate("");
      await fetchPenaltyPoints();
      onUpdate();
    } catch (error) {
      console.error("Error adding penalty point:", error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleRemovePenaltyPoint(pointId: string) {
    setDeletingIds((prev) => new Set(prev).add(pointId));
    try {
      const response = await fetch(`/api/penalty-points/${pointId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove penalty point");
      }

      await fetchPenaltyPoints();
      onUpdate();
    } catch (error) {
      console.error("Error removing penalty point:", error);
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(pointId);
        return next;
      });
    }
  }

  function handleCancel() {
    setIsAdding(false);
    setNewPoints("");
    setNewReason("");
    setNewAutoRemoveDate("");
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const totalPoints = penaltyPoints.reduce((sum, point) => sum + point.points, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <IconAlertTriangle className="h-5 w-5" />
              Penalty Points
              {totalPoints > 0 && (
                <Badge variant="destructive">{totalPoints} total</Badge>
              )}
            </CardTitle>
            <CardDescription>Manage member penalty points and reasons</CardDescription>
          </div>
          {!isAdding && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdding(true)}
            >
              <IconPlus className="mr-2 h-4 w-4" />
              Add
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdding && (
          <div className="space-y-4 rounded-lg border p-4">
            <div className="space-y-2">
              <Label htmlFor="points">Points</Label>
              <Input
                id="points"
                type="number"
                placeholder="e.g., 5"
                value={newPoints}
                onChange={(e) => setNewPoints(e.target.value)}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Explain the reason for penalty points..."
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="auto-remove">Auto Remove Date (Optional)</Label>
              <Input
                id="auto-remove"
                type="date"
                value={newAutoRemoveDate}
                onChange={(e) => setNewAutoRemoveDate(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleAddPenaltyPoint}
                disabled={isSaving || !newPoints || !newReason}
                className="flex-1"
              >
                <IconCheck className="mr-2 h-4 w-4" />
                Add Points
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
                className="flex-1"
              >
                <IconX className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : penaltyPoints.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No penalty points
          </div>
        ) : (
          <div className="space-y-3">
            {penaltyPoints.map((point) => (
              <div
                key={point.point_id}
                className="rounded-lg border p-4 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">{point.points} points</Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(point.assigned_date)}
                      </span>
                    </div>
                    <p className="text-sm">{point.reason}</p>
                    {point.auto_remove_date && (
                      <p className="text-xs text-muted-foreground">
                        Auto-remove: {formatDate(point.auto_remove_date)}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemovePenaltyPoint(point.point_id)}
                    disabled={deletingIds.has(point.point_id)}
                  >
                    <IconTrash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

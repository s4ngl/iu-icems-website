"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { IconCreditCard, IconCheck, IconX } from "@tabler/icons-react";
import type { Database } from "@/types/database.types";

type Member = Database["public"]["Tables"]["members"]["Row"];

interface DuesManagementProps {
  member: Member;
  onUpdate: () => void;
}

export function DuesManagement({ member, onUpdate }: DuesManagementProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [duesPaid, setDuesPaid] = useState(member.dues_paid);
  const [duesExpiration, setDuesExpiration] = useState(
    member.dues_expiration
      ? new Date(member.dues_expiration).toISOString().split("T")[0]
      : ""
  );

  async function handleSave() {
    try {
      setIsSaving(true);
      const response = await fetch(`/api/members/${member.user_id}/dues`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          duesPaid,
          duesExpiration: duesExpiration || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update dues");
      }

      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Error updating dues:", error);
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    setIsEditing(false);
    setDuesPaid(member.dues_paid);
    setDuesExpiration(
      member.dues_expiration
        ? new Date(member.dues_expiration).toISOString().split("T")[0]
        : ""
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const isExpiringSoon = () => {
    if (!member.dues_expiration) return false;
    const expirationDate = new Date(member.dues_expiration);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expirationDate <= thirtyDaysFromNow;
  };

  const isExpired = () => {
    if (!member.dues_expiration) return false;
    return new Date(member.dues_expiration) < new Date();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <IconCreditCard className="h-5 w-5" />
              Dues Management
            </CardTitle>
            <CardDescription>Update member dues status and expiration</CardDescription>
          </div>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dues-paid" className="text-sm font-medium">
                Dues Paid
              </Label>
              <Switch
                id="dues-paid"
                checked={duesPaid}
                onCheckedChange={setDuesPaid}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dues-expiration" className="text-sm font-medium">
                Expiration Date
              </Label>
              <Input
                id="dues-expiration"
                type="date"
                value={duesExpiration}
                onChange={(e) => setDuesExpiration(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1"
              >
                <IconCheck className="mr-2 h-4 w-4" />
                Save
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
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge variant={member.dues_paid ? "default" : "secondary"}>
                {member.dues_paid ? "Paid" : "Unpaid"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Expiration</p>
              <div className="flex items-center gap-2">
                <p className="text-sm">{formatDate(member.dues_expiration)}</p>
                {isExpired() && (
                  <Badge variant="destructive" className="text-xs">
                    Expired
                  </Badge>
                )}
                {!isExpired() && isExpiringSoon() && (
                  <Badge variant="default" className="text-xs">
                    Expiring Soon
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

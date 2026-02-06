"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconMail, IconPhone, IconCalendar, IconClock, IconUser } from "@tabler/icons-react";
import type { Database } from "@/types/database.types";

type Member = Database["public"]["Tables"]["members"]["Row"];

interface MemberProfileProps {
  member: Member;
  onUpdate: () => void;
}

const STATUS_LABELS: Record<number, string> = {
  0: "Pending",
  1: "Active",
  2: "Inactive",
};

const STATUS_COLORS: Record<number, "default" | "secondary" | "outline"> = {
  0: "outline",
  1: "default",
  2: "secondary",
};

const ROLE_LABELS: Record<number, string> = {
  0: "Admin",
  1: "Board",
  2: "Supervisor",
  3: "Member",
};

const POSITION_CLUB_LABELS: Record<number, string> = {
  0: "General Member",
  1: "FA/EMR Member",
  2: "EMT Member",
  3: "Supervisor EMT",
};

const CLASS_YEAR_LABELS: Record<number, string> = {
  0: "Freshman",
  1: "Sophomore",
  2: "Junior",
  3: "Senior",
  4: "Other",
};

const PRONOUN_LABELS: Record<number, string> = {
  0: "He/Him",
  1: "She/Her",
  2: "Other",
};

export function MemberProfile({ member }: MemberProfileProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Member Information</CardTitle>
        <CardDescription>Personal details and account information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge variant={STATUS_COLORS[member.account_status]}>
                {STATUS_LABELS[member.account_status]}
              </Badge>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-sm font-medium text-muted-foreground">Role</p>
              <p className="text-sm">
                {member.position_web !== null ? ROLE_LABELS[member.position_web] : "N/A"}
              </p>
            </div>
          </div>

          <div className="grid gap-4 border-t pt-4">
            <div className="flex items-center gap-3">
              <IconMail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{member.iu_email}</p>
              </div>
            </div>

            {member.phone_number && (
              <div className="flex items-center gap-3">
                <IconPhone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{member.phone_number}</p>
                </div>
              </div>
            )}

            {member.position_club !== null && (
              <div className="flex items-center gap-3">
                <IconUser className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Club Position</p>
                  <p className="text-sm text-muted-foreground">
                    {POSITION_CLUB_LABELS[member.position_club] || "N/A"}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-4 border-t pt-4">
            <div className="grid grid-cols-2 gap-4">
              {member.class_year !== null && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Class Year</p>
                  <p className="text-sm">{CLASS_YEAR_LABELS[member.class_year] || "N/A"}</p>
                </div>
              )}
              {member.pronouns !== null && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pronouns</p>
                  <p className="text-sm">{PRONOUN_LABELS[member.pronouns] || "N/A"}</p>
                </div>
              )}
            </div>

            {member.student_id && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Student ID</p>
                <p className="text-sm">{member.student_id}</p>
              </div>
            )}

            {member.psid && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">PSID</p>
                <p className="text-sm">{member.psid}</p>
              </div>
            )}
          </div>

          <div className="grid gap-4 border-t pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
                <p className="text-2xl font-bold">{member.total_hours}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Hours</p>
                <p className="text-2xl font-bold">{member.pending_hours}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-2 border-t pt-4">
            <div className="flex items-center gap-2">
              <IconCalendar className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Member since {formatDate(member.created_at)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <IconClock className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Last updated {formatDate(member.updated_at)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

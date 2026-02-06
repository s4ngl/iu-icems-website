"use client";

import {
  IconUserCheck,
  IconPhone,
  IconMail,
} from "@tabler/icons-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface AssignedMember {
  name: string;
  role: "Supervisor" | "EMT" | "FA/EMR";
  phone?: string;
  email?: string;
}

interface AssignedMembersProps {
  members: AssignedMember[];
}

const roleBadgeVariant: Record<string, "default" | "secondary" | "outline"> = {
  Supervisor: "outline",
  EMT: "default",
  "FA/EMR": "secondary",
};

export default function AssignedMembers({ members }: AssignedMembersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="inline-flex items-center gap-2 text-base">
          <IconUserCheck className="size-4" stroke={1.5} />
          Assigned Crew
        </CardTitle>
        <CardDescription>
          {members.length} member{members.length !== 1 ? "s" : ""} assigned
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {members.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No members have been assigned yet.
          </p>
        )}
        {members.map((member) => (
          <div
            key={member.name}
            className="flex items-start justify-between gap-2 rounded-md border px-3 py-2.5"
          >
            <div className="flex flex-col gap-1">
              <span className="font-medium leading-snug">{member.name}</span>
              {/* show contact info for supervisors */}
              {member.role === "Supervisor" && (
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                  {member.phone && (
                    <span className="inline-flex items-center gap-1">
                      <IconPhone className="size-3" stroke={1.5} />
                      {member.phone}
                    </span>
                  )}
                  {member.email && (
                    <span className="inline-flex items-center gap-1">
                      <IconMail className="size-3" stroke={1.5} />
                      {member.email}
                    </span>
                  )}
                </div>
              )}
            </div>
            <Badge variant={roleBadgeVariant[member.role]} className="shrink-0">
              {member.role}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import {
  IconUsersGroup,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface AssignedMember {
  userId: string;
  firstName: string;
  lastName: string;
  role: "EMT" | "FA/EMR" | "Supervisor";
  phone: string;
  email: string;
  status: "Confirmed" | "Pending" | "Checked-In";
}

const ROLE_VARIANT: Record<AssignedMember["role"], "default" | "secondary" | "outline"> = {
  EMT: "default",
  "FA/EMR": "secondary",
  Supervisor: "outline",
};

const DEMO_MEMBERS: AssignedMember[] = [
  { userId: "1", firstName: "Sarah", lastName: "Chen", role: "Supervisor", phone: "(812) 555-0101", email: "schen@iu.edu", status: "Confirmed" },
  { userId: "2", firstName: "James", lastName: "Rodriguez", role: "EMT", phone: "(812) 555-0102", email: "jrodrig@iu.edu", status: "Confirmed" },
  { userId: "3", firstName: "Emily", lastName: "Nguyen", role: "EMT", phone: "(812) 555-0103", email: "enguyen@iu.edu", status: "Pending" },
  { userId: "4", firstName: "Marcus", lastName: "Johnson", role: "FA/EMR", phone: "(812) 555-0104", email: "mjohnso@iu.edu", status: "Checked-In" },
  { userId: "5", firstName: "Aisha", lastName: "Patel", role: "FA/EMR", phone: "(812) 555-0105", email: "apatel@iu.edu", status: "Confirmed" },
  { userId: "6", firstName: "David", lastName: "Kim", role: "EMT", phone: "(812) 555-0106", email: "dkim@iu.edu", status: "Pending" },
];

interface AssignedMembersListProps {
  members?: AssignedMember[];
}

export default function AssignedMembersList({ members = DEMO_MEMBERS }: AssignedMembersListProps) {
  const [data] = useState(members);

  const roleCounts = data.reduce<Record<string, number>>((acc, m) => {
    acc[m.role] = (acc[m.role] || 0) + 1;
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconUsersGroup className="size-5" stroke={1.5} />
          Assigned Members
        </CardTitle>
        <CardDescription>
          {data.length} member{data.length !== 1 ? "s" : ""} assigned to this event.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Role summary */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(roleCounts).map(([role, count]) => (
            <Badge key={role} variant={ROLE_VARIANT[role as AssignedMember["role"]] ?? "secondary"}>
              {count} {role}
            </Badge>
          ))}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((member) => (
              <TableRow key={member.userId}>
                <TableCell className="font-medium">
                  {member.firstName} {member.lastName}
                </TableCell>
                <TableCell>
                  <Badge variant={ROLE_VARIANT[member.role]}>
                    {member.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <a href={`tel:${member.phone}`} className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                    <IconPhone className="h-3 w-3" />
                    {member.phone}
                  </a>
                </TableCell>
                <TableCell>
                  <a href={`mailto:${member.email}`} className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                    <IconMail className="h-3 w-3" />
                    {member.email}
                  </a>
                </TableCell>
                <TableCell>
                  <Badge variant={member.status === "Confirmed" ? "default" : member.status === "Checked-In" ? "secondary" : "outline"}>
                    {member.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
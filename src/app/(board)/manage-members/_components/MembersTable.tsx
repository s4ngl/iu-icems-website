"use client";

import { useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { IconRefresh, IconEye } from "@tabler/icons-react";
import type { Database } from "@/types/database.types";

type Member = Database["public"]["Tables"]["members"]["Row"];

interface MembersTableProps {
  members: Member[];
  isLoading: boolean;
  onRefresh: () => void;
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

export function MembersTable({ members, isLoading, onRefresh }: MembersTableProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No members found</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="mt-4"
        >
          <IconRefresh className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <IconRefresh className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Dues</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow
                key={member.user_id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => router.push(`/manage-members/${member.user_id}`)}
              >
                <TableCell className="font-medium">
                  {member.first_name} {member.last_name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {member.iu_email}
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_COLORS[member.account_status]}>
                    {STATUS_LABELS[member.account_status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {member.position_web !== null ? ROLE_LABELS[member.position_web] : "N/A"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant={member.dues_paid ? "default" : "secondary"}>
                      {member.dues_paid ? "Paid" : "Unpaid"}
                    </Badge>
                    {member.dues_expiration && (
                      <span className="text-xs text-muted-foreground">
                        {formatDate(member.dues_expiration)}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <span className="font-medium">{member.total_hours}</span>
                    {member.pending_hours > 0 && (
                      <span className="text-muted-foreground">
                        {" "}(+{member.pending_hours})
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/manage-members/${member.user_id}`);
                    }}
                  >
                    <IconEye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {members.length} member{members.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}

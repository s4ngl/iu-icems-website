"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconFilter, IconX } from "@tabler/icons-react";

interface MemberFiltersProps {
  statusFilter: number | null;
  duesFilter: boolean | null;
  roleFilter: number | null;
  onStatusChange: (value: number | null) => void;
  onDuesChange: (value: boolean | null) => void;
  onRoleChange: (value: number | null) => void;
}

export function MemberFilters({
  statusFilter,
  duesFilter,
  roleFilter,
  onStatusChange,
  onDuesChange,
  onRoleChange,
}: MemberFiltersProps) {
  const hasActiveFilters = statusFilter !== null || duesFilter !== null || roleFilter !== null;

  const clearFilters = () => {
    onStatusChange(null);
    onDuesChange(null);
    onRoleChange(null);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <IconFilter className="h-4 w-4" />
        <span>Filter:</span>
      </div>

      <Select
        value={statusFilter?.toString() ?? "all"}
        onValueChange={(value) => onStatusChange(value === "all" ? null : parseInt(value))}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="0">Pending</SelectItem>
          <SelectItem value="1">Active</SelectItem>
          <SelectItem value="2">Inactive</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={duesFilter === null ? "all" : duesFilter ? "paid" : "unpaid"}
        onValueChange={(value) =>
          onDuesChange(value === "all" ? null : value === "paid")
        }
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Dues" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Dues</SelectItem>
          <SelectItem value="paid">Paid</SelectItem>
          <SelectItem value="unpaid">Unpaid</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={roleFilter?.toString() ?? "all"}
        onValueChange={(value) => onRoleChange(value === "all" ? null : parseInt(value))}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="0">Admin</SelectItem>
          <SelectItem value="1">Board</SelectItem>
          <SelectItem value="2">Supervisor</SelectItem>
          <SelectItem value="3">Member</SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-9 px-2"
        >
          <IconX className="h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
}

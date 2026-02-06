"use client";

import { Input } from "@/components/ui/input";
import { IconSearch } from "@tabler/icons-react";

interface MemberSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function MemberSearch({ value, onChange }: MemberSearchProps) {
  return (
    <div className="relative">
      <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search by name or email..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}

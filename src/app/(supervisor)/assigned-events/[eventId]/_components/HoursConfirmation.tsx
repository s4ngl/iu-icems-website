"use client";

import { useState } from "react";
import {
  IconClockHour3,
  IconCheck,
  IconChecks,
  IconX,
} from "@tabler/icons-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface HoursMember {
  userId: string;
  name: string;
  calculatedHours: number;
  confirmedHours?: number;
  isConfirmed: boolean;
}

const DEMO_MEMBERS: HoursMember[] = [
  { userId: "1", name: "Sarah Chen", calculatedHours: 4.5, confirmedHours: 4.5, isConfirmed: true },
  { userId: "2", name: "James Rodriguez", calculatedHours: 4.5, isConfirmed: false },
  { userId: "3", name: "Emily Nguyen", calculatedHours: 4.5, isConfirmed: false },
  { userId: "4", name: "Marcus Johnson", calculatedHours: 4.5, confirmedHours: 4.0, isConfirmed: true },
  { userId: "5", name: "Aisha Patel", calculatedHours: 4.5, isConfirmed: false },
  { userId: "6", name: "David Kim", calculatedHours: 4.5, isConfirmed: false },
];

interface HoursConfirmationProps {
  members?: HoursMember[];
}

export default function HoursConfirmation({ members = DEMO_MEMBERS }: HoursConfirmationProps) {
  const [data, setData] = useState<HoursMember[]>(members);
  const [hoursInput, setHoursInput] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    members.forEach((m) => {
      initial[m.userId] = String(m.confirmedHours ?? m.calculatedHours);
    });
    return initial;
  });

  const confirmedCount = data.filter((m) => m.isConfirmed).length;
  const allConfirmed = confirmedCount === data.length;

  function confirmMember(userId: string) {
    const hours = parseFloat(hoursInput[userId]);
    if (isNaN(hours) || hours < 0) return;

    setData((prev) =>
      prev.map((m) =>
        m.userId === userId ? { ...m, confirmedHours: hours, isConfirmed: true } : m
      )
    );
  }

  function confirmAll() {
    setData((prev) =>
      prev.map((m) => {
        if (m.isConfirmed) return m;
        const hours = parseFloat(hoursInput[m.userId]);
        const confirmed = isNaN(hours) || hours < 0 ? m.calculatedHours : hours;
        return { ...m, confirmedHours: confirmed, isConfirmed: true };
      })
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconClockHour3 className="size-5" stroke={1.5} />
          Hours Confirmation
        </CardTitle>
        <CardDescription>
          {confirmedCount} of {data.length} members confirmed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Calculated Hours</TableHead>
              <TableHead>Confirmed Hours</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((member) => (
              <TableRow key={member.userId}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{member.calculatedHours} hrs</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.5"
                      min="0"
                      value={hoursInput[member.userId] ?? ""}
                      onChange={(e) =>
                        setHoursInput((prev) => ({
                          ...prev,
                          [member.userId]: e.target.value,
                        }))
                      }
                      className="w-20"
                      disabled={member.isConfirmed}
                    />
                    <span className="text-sm text-muted-foreground">hrs</span>
                  </div>
                </TableCell>
                <TableCell>
                  {member.isConfirmed ? (
                    <Badge variant="default" className="gap-1">
                      <IconCheck className="h-3 w-3" />
                      Confirmed
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1">
                      <IconX className="h-3 w-3" />
                      Pending
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    onClick={() => confirmMember(member.userId)}
                    disabled={member.isConfirmed}
                  >
                    <IconCheck className="mr-1 h-4 w-4" />
                    Confirm
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Button onClick={confirmAll} disabled={allConfirmed}>
          <IconChecks className="mr-2 h-4 w-4" />
          Confirm All ({data.length - confirmedCount} remaining)
        </Button>
      </CardFooter>
    </Card>
  );
}
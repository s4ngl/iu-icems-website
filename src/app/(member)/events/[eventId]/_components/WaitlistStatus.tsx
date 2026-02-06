"use client";

import { IconClock, IconUsers, IconTrendingUp } from "@tabler/icons-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WaitlistStatusProps {
  position: number;
  totalOnWaitlist: number;
  estimatedChance: "high" | "medium" | "low";
}

const chanceConfig = {
  high: { label: "High", variant: "default" as const },
  medium: { label: "Medium", variant: "secondary" as const },
  low: { label: "Low", variant: "outline" as const },
};

export default function WaitlistStatus({
  position,
  totalOnWaitlist,
  estimatedChance,
}: WaitlistStatusProps) {
  const chance = chanceConfig[estimatedChance];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="inline-flex items-center gap-2 text-base">
          <IconClock className="size-4" stroke={1.5} />
          Waitlist Status
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <IconUsers className="size-4" stroke={1.5} />
            Your Position
          </span>
          <span className="text-lg font-semibold">
            {position} <span className="text-sm font-normal text-muted-foreground">of {totalOnWaitlist}</span>
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <IconTrendingUp className="size-4" stroke={1.5} />
            Estimated Chance
          </span>
          <Badge variant={chance.variant}>{chance.label}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

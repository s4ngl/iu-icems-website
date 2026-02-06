"use client";

import { IconUsers, IconCheck } from "@tabler/icons-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface GeneralTrainingSignupProps {
  trainingId: string;
  maxParticipants: number | null;
  currentCount: number;
  isSignedUp: boolean;
  onSignUp: () => void;
}

export default function GeneralTrainingSignup({
  trainingId,
  maxParticipants,
  currentCount,
  isSignedUp,
  onSignUp,
}: GeneralTrainingSignupProps) {
  const isFull = maxParticipants !== null && currentCount >= maxParticipants;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Register</CardTitle>
        <CardDescription>
          {maxParticipants !== null
            ? `${currentCount} of ${maxParticipants} spots filled`
            : `${currentCount} registered`}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 text-sm">
        {maxParticipants !== null && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconUsers className="size-4" stroke={1.5} />
            <span>
              {isFull
                ? "This session is full."
                : `${maxParticipants - currentCount} spot${maxParticipants - currentCount !== 1 ? "s" : ""} remaining`}
            </span>
          </div>
        )}

        {isSignedUp && (
          <Badge variant="secondary" className="w-fit gap-1">
            <IconCheck className="size-3" stroke={2} />
            You are registered
          </Badge>
        )}
      </CardContent>

      <CardFooter>
        <Button onClick={onSignUp} disabled={isSignedUp || isFull}>
          {isSignedUp
            ? "Already Registered"
            : isFull
              ? "Session Full"
              : "Sign Up"}
        </Button>
      </CardFooter>
    </Card>
  );
}

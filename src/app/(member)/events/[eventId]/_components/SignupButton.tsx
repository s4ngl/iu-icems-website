"use client";

import {
  IconUserPlus,
  IconClockHour3,
  IconUserCheck,
  IconUserOff,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

interface SignupButtonProps {
  eventId: string;
  isSignedUp: boolean;
  isAssigned: boolean;
  isEligible: boolean;
  onSignUp: () => void;
}

export default function SignupButton({
  eventId,
  isSignedUp,
  isAssigned,
  isEligible,
  onSignUp,
}: SignupButtonProps) {
  if (isAssigned) {
    return (
      <Button variant="secondary" disabled className="gap-1.5">
        <IconUserCheck className="size-4" stroke={1.5} />
        Assigned
      </Button>
    );
  }

  if (isSignedUp) {
    return (
      <Button variant="outline" disabled className="gap-1.5">
        <IconClockHour3 className="size-4" stroke={1.5} />
        On Waitlist
      </Button>
    );
  }

  if (!isEligible) {
    return (
      <Button variant="ghost" disabled className="gap-1.5">
        <IconUserOff className="size-4" stroke={1.5} />
        Not Eligible
      </Button>
    );
  }

  return (
    <Button onClick={onSignUp} className="gap-1.5">
      <IconUserPlus className="size-4" stroke={1.5} />
      Sign Up
    </Button>
  );
}

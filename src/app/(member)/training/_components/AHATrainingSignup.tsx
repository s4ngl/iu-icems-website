"use client";

import { useState } from "react";
import { IconCheck, IconCurrencyDollar } from "@tabler/icons-react";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SIGNUP_TYPES, SIGNUP_TYPE_LABELS } from "@/lib/utils/constants";

interface AHATrainingSignupProps {
  trainingId: string;
  costs: { cpr: number; fa: number; both: number };
  isSignedUp: boolean;
  signupType?: number;
  onSignUp: (type: number) => void;
}

const options = [
  { type: SIGNUP_TYPES.CPR_ONLY, costKey: "cpr" as const },
  { type: SIGNUP_TYPES.FA_ONLY, costKey: "fa" as const },
  { type: SIGNUP_TYPES.BOTH, costKey: "both" as const },
];

export default function AHATrainingSignup({
  trainingId,
  costs,
  isSignedUp,
  signupType,
  onSignUp,
}: AHATrainingSignupProps) {
  const [selectedType, setSelectedType] = useState<number | undefined>(
    signupType,
  );

  return (
    <Card className="border-orange-500/40">
      <CardHeader>
        <CardTitle className="text-base">Register — AHA Training</CardTitle>
        <CardDescription>
          Select a certification option and reserve your seat.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {isSignedUp ? (
          <Badge variant="secondary" className="w-fit gap-1">
            <IconCheck className="size-3" stroke={2} />
            Registered — {SIGNUP_TYPE_LABELS[signupType ?? 0]}
          </Badge>
        ) : (
          <RadioGroup
            value={
              selectedType !== undefined ? String(selectedType) : undefined
            }
            onValueChange={(val) => setSelectedType(Number(val))}
          >
            {options.map(({ type, costKey }) => (
              <div key={type} className="flex items-center gap-3">
                <RadioGroupItem value={String(type)} id={`aha-${type}`} />
                <Label htmlFor={`aha-${type}`} className="text-sm font-normal">
                  {SIGNUP_TYPE_LABELS[type]} — ${costs[costKey]}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        <div className="flex items-start gap-2 rounded-md border p-3 text-xs text-muted-foreground">
          <IconCurrencyDollar
            className="mt-0.5 size-4 shrink-0"
            stroke={1.5}
          />
          <span>
            Payment via Venmo <strong>@iu-icems</strong> is required before the
            session date.
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={() => {
            if (selectedType !== undefined) onSignUp(selectedType);
          }}
          disabled={isSignedUp || selectedType === undefined}
        >
          {isSignedUp ? "Already Registered" : "Sign Up"}
        </Button>
      </CardFooter>
    </Card>
  );
}

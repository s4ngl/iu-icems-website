"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconCheck, IconCash } from "@tabler/icons-react";
import { SIGNUP_TYPE_LABELS, SIGNUP_TYPES } from "@/lib/utils/constants";

interface ParticipantPaymentData {
  signup_id: string;
  name: string;
  signup_type: number;
  cpr_cost: number | null;
  fa_cost: number | null;
  both_cost: number | null;
}

interface PaymentConfirmationProps {
  participant?: ParticipantPaymentData;
  onConfirm: (signupId: string) => void;
  onCancel?: () => void;
}

const DEMO_PARTICIPANT: ParticipantPaymentData = {
  signup_id: "ts-2",
  name: "Bob Smith",
  signup_type: 0,
  cpr_cost: 45,
  fa_cost: 40,
  both_cost: 75,
};

function getAmountDue(participant: ParticipantPaymentData): number {
  switch (participant.signup_type) {
    case SIGNUP_TYPES.CPR_ONLY:
      return participant.cpr_cost ?? 0;
    case SIGNUP_TYPES.FA_ONLY:
      return participant.fa_cost ?? 0;
    case SIGNUP_TYPES.BOTH:
      return participant.both_cost ?? 0;
    default:
      return 0;
  }
}

export function PaymentConfirmation({
  participant = DEMO_PARTICIPANT,
  onConfirm,
  onCancel,
}: PaymentConfirmationProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  const amountDue = getAmountDue(participant);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm(participant.signup_id);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <IconCash className="h-5 w-5" />
          Confirm Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Participant</span>
            <span className="text-sm font-medium">{participant.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Signup Type</span>
            <Badge variant="outline">
              {SIGNUP_TYPE_LABELS[participant.signup_type] ?? "Unknown"}
            </Badge>
          </div>
          <div className="flex items-center justify-between border-t pt-2">
            <span className="text-sm font-medium">Amount Due</span>
            <span className="text-lg font-semibold">${amountDue.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex gap-2">
          {onCancel && (
            <Button variant="outline" className="flex-1" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            className="flex-1"
            onClick={handleConfirm}
            disabled={isConfirming}
          >
            <IconCheck className="mr-1 h-4 w-4" />
            {isConfirming ? "Confirming..." : "Confirm Payment"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

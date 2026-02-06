"use client";

import {
  IconCreditCard,
  IconAlertTriangle,
  IconCheck,
  IconExternalLink,
} from "@tabler/icons-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { formatDate, isExpiringSoon, daysUntilExpiration } from "@/lib/utils/date";
import { formatCurrency } from "@/lib/utils/format";

const demoDues = {
  paid: true,
  amount: 50,
  paidDate: "2024-09-01",
  expirationDate: "2025-05-31",
  venmoHandle: "@IU-ICEMS",
};

export default function DuesStatus() {
  const expiringSoon =
    demoDues.paid && isExpiringSoon(demoDues.expirationDate, 60);
  const daysLeft = demoDues.paid
    ? daysUntilExpiration(demoDues.expirationDate)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="inline-flex items-center gap-2">
          <IconCreditCard className="size-5" stroke={1.5} />
          Dues Status
        </CardTitle>
        <CardDescription>
          Semester membership dues — {formatCurrency(demoDues.amount)}.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status */}
        <div className="flex items-center gap-3">
          <Badge variant={demoDues.paid ? "default" : "destructive"}>
            {demoDues.paid ? (
              <>
                <IconCheck className="mr-1 size-3" stroke={1.5} />
                Paid
              </>
            ) : (
              "Unpaid"
            )}
          </Badge>
          {demoDues.paid && (
            <span className="text-sm text-muted-foreground">
              Valid through {formatDate(demoDues.expirationDate)}
            </span>
          )}
        </div>

        {/* Expiring soon alert */}
        {expiringSoon && (
          <Alert>
            <IconAlertTriangle className="size-4" stroke={1.5} />
            <AlertTitle>Dues Expiring Soon</AlertTitle>
            <AlertDescription>
              Your dues expire in {daysLeft} day{daysLeft !== 1 ? "s" : ""}. Renew
              to maintain active membership status.
            </AlertDescription>
          </Alert>
        )}

        {/* Unpaid alert */}
        {!demoDues.paid && (
          <Alert variant="destructive">
            <IconAlertTriangle className="size-4" stroke={1.5} />
            <AlertTitle>Dues Unpaid</AlertTitle>
            <AlertDescription>
              Your membership dues are unpaid. Pay now to access event signups
              and maintain active status.
            </AlertDescription>
          </Alert>
        )}

        <Separator />

        {/* Payment instructions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Payment Instructions</h4>
          <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
            <li>
              Send {formatCurrency(demoDues.amount)} via Venmo to{" "}
              <span className="font-medium text-foreground">
                {demoDues.venmoHandle}
              </span>
            </li>
            <li>Include your full name and &quot;ICEMS Dues&quot; in the note</li>
            <li>Allow 1–2 business days for confirmation</li>
          </ol>
          <Button variant="outline" size="sm" asChild>
            <a
              href={`https://venmo.com/${demoDues.venmoHandle.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconExternalLink className="mr-1 size-4" stroke={1.5} />
              Pay with Venmo
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
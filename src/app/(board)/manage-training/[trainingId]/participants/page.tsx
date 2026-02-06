"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IconArrowLeft, IconCheck } from "@tabler/icons-react";
import { SIGNUP_TYPE_LABELS } from "@/lib/utils/constants";

interface SignupWithMember {
  signup_id: string;
  training_id: string;
  user_id: string;
  signup_type: number | null;
  payment_confirmed: boolean;
  confirmed_by: string | null;
  signup_time: string;
  members: {
    user_id: string;
    first_name: string;
    last_name: string;
    iu_email: string;
  } | null;
}

export default function ParticipantsPage() {
  const { trainingId } = useParams<{ trainingId: string }>();
  const router = useRouter();
  const [signups, setSignups] = useState<SignupWithMember[]>([]);
  const [trainingName, setTrainingName] = useState("");
  const [isAha, setIsAha] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainingId]);

  async function fetchData() {
    try {
      setIsLoading(true);
      const [participantsRes, trainingRes] = await Promise.all([
        fetch(`/api/training/${trainingId}/participants`),
        fetch(`/api/training/${trainingId}`),
      ]);

      if (participantsRes.ok) {
        const participantsJson = await participantsRes.json();
        setSignups(participantsJson.data ?? []);
      }
      if (trainingRes.ok) {
        const trainingJson = await trainingRes.json();
        setTrainingName(trainingJson.data?.training_name ?? "");
        setIsAha(trainingJson.data?.is_aha_training ?? false);
      }
    } catch (error) {
      console.error("Error fetching participants:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleConfirmPayment(signupId: string) {
    try {
      setConfirmingId(signupId);
      const response = await fetch(`/api/training/${trainingId}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signup_id: signupId }),
      });

      if (!response.ok) throw new Error("Failed to confirm payment");

      setSignups((prev) =>
        prev.map((s) =>
          s.signup_id === signupId ? { ...s, payment_confirmed: true } : s
        )
      );
    } catch (error) {
      console.error("Error confirming payment:", error);
    } finally {
      setConfirmingId(null);
    }
  }

  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  if (isLoading) {
    return (
      <section className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push(`/manage-training/${trainingId}`)}>
          <IconArrowLeft className="mr-2 h-4 w-4" />
          Back to Training
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Participants</h1>
        {trainingName && (
          <p className="text-muted-foreground mt-2">
            Managing participants for &ldquo;{trainingName}&rdquo;
          </p>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Participants ({signups.length})</CardTitle>
          <CardDescription>
            {isAha
              ? "View participants and confirm AHA training payments"
              : "View participants registered for this training"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {signups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No participants registered yet</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Signed Up</TableHead>
                    {isAha && <TableHead>Payment</TableHead>}
                    {isAha && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {signups.map((signup) => (
                    <TableRow key={signup.signup_id}>
                      <TableCell className="font-medium">
                        {signup.members
                          ? `${signup.members.first_name} ${signup.members.last_name}`
                          : "Unknown"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {signup.members?.iu_email ?? "N/A"}
                      </TableCell>
                      <TableCell>
                        {signup.signup_type !== null
                          ? SIGNUP_TYPE_LABELS[signup.signup_type] ?? "Unknown"
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {signup.signup_time ? formatDateTime(signup.signup_time) : "N/A"}
                      </TableCell>
                      {isAha && (
                        <TableCell>
                          <Badge variant={signup.payment_confirmed ? "default" : "secondary"}>
                            {signup.payment_confirmed ? "Confirmed" : "Pending"}
                          </Badge>
                        </TableCell>
                      )}
                      {isAha && (
                        <TableCell className="text-right">
                          {!signup.payment_confirmed && (
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={confirmingId === signup.signup_id}
                              onClick={() => handleConfirmPayment(signup.signup_id)}
                              title="Confirm Payment"
                            >
                              <IconCheck className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

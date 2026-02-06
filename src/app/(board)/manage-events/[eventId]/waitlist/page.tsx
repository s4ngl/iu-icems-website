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
import { IconArrowLeft, IconCheck, IconX } from "@tabler/icons-react";
import { POSITION_LABELS } from "@/lib/utils/constants";

interface SignupWithMember {
  signup_id: string;
  event_id: string;
  user_id: string;
  position_type: number | null;
  signup_time: string;
  is_assigned: boolean;
  assigned_by: string | null;
  assigned_time: string | null;
  members: {
    user_id: string;
    first_name: string;
    last_name: string;
    iu_email: string;
    position_club: number;
  } | null;
}

export default function WaitlistPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const router = useRouter();
  const [signups, setSignups] = useState<SignupWithMember[]>([]);
  const [eventName, setEventName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [assigningId, setAssigningId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  async function fetchData() {
    try {
      setIsLoading(true);
      const [waitlistRes, eventRes] = await Promise.all([
        fetch(`/api/events/${eventId}/waitlist`),
        fetch(`/api/events/${eventId}`),
      ]);

      if (waitlistRes.ok) {
        const waitlistJson = await waitlistRes.json();
        setSignups(waitlistJson.data ?? []);
      }
      if (eventRes.ok) {
        const eventJson = await eventRes.json();
        setEventName(eventJson.data?.event_name ?? "");
      }
    } catch (error) {
      console.error("Error fetching waitlist:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAssign(signupId: string) {
    try {
      setAssigningId(signupId);
      const response = await fetch(`/api/events/${eventId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signup_id: signupId }),
      });

      if (!response.ok) throw new Error("Failed to assign member");

      setSignups((prev) =>
        prev.map((s) =>
          s.signup_id === signupId ? { ...s, is_assigned: true } : s
        )
      );
    } catch (error) {
      console.error("Error assigning member:", error);
    } finally {
      setAssigningId(null);
    }
  }

  async function handleUnassign(signupId: string) {
    try {
      setAssigningId(signupId);
      const response = await fetch(`/api/events/${eventId}/waitlist`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signup_id: signupId, is_assigned: false, assigned_by: null, assigned_time: null }),
      });

      if (!response.ok) throw new Error("Failed to unassign member");

      setSignups((prev) =>
        prev.map((s) =>
          s.signup_id === signupId ? { ...s, is_assigned: false } : s
        )
      );
    } catch (error) {
      console.error("Error unassigning member:", error);
    } finally {
      setAssigningId(null);
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
        <Button variant="ghost" size="sm" onClick={() => router.push(`/manage-events/${eventId}`)}>
          <IconArrowLeft className="mr-2 h-4 w-4" />
          Back to Event
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Waitlist &amp; Assignments</h1>
        {eventName && (
          <p className="text-muted-foreground mt-2">
            Managing signups for &ldquo;{eventName}&rdquo;
          </p>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Signups ({signups.length})</CardTitle>
          <CardDescription>
            Assign or unassign members to this event
          </CardDescription>
        </CardHeader>
        <CardContent>
          {signups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No signups for this event yet</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Signed Up</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
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
                        {signup.position_type !== null
                          ? POSITION_LABELS[signup.position_type] ?? "Unknown"
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {signup.signup_time ? formatDateTime(signup.signup_time) : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={signup.is_assigned ? "default" : "outline"}>
                          {signup.is_assigned ? "Assigned" : "Waitlisted"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {signup.is_assigned ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={assigningId === signup.signup_id}
                            onClick={() => handleUnassign(signup.signup_id)}
                            title="Unassign"
                          >
                            <IconX className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={assigningId === signup.signup_id}
                            onClick={() => handleAssign(signup.signup_id)}
                            title="Assign"
                          >
                            <IconCheck className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
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

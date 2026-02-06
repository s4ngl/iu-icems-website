"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  IconCalendarEvent,
  IconMapPin2,
  IconClockHour3,
  IconArrowLeft,
  IconAlertCircle,
  IconPhone,
  IconMail,
  IconCheck,
  IconX,
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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";
import type { Event, EventSignup } from "@/types/event.types";
import type { Database } from "@/types/database.types";

type Member = Database["public"]["Tables"]["members"]["Row"];
type EventHours = Database["public"]["Tables"]["event_hours"]["Row"];

interface MemberWithSignup extends Member {
  signup: EventSignup;
  hours?: EventHours;
}

const POSITION_TYPE_MAP: Record<number, string> = {
  0: "Supervisor",
  1: "EMT",
  2: "FA/EMR",
};

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const eventId = params?.eventId as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [members, setMembers] = useState<MemberWithSignup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [hoursInput, setHoursInput] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && user && eventId) {
      fetchEventDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user, eventId]);

  async function fetchEventDetails() {
    if (!user || !eventId) return;

    try {
      setIsLoading(true);
      setError(null);
      const supabase = createClient();

      // Fetch event details
      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select("*")
        .eq("event_id", eventId)
        .single();

      if (eventError) {
        console.error("Error fetching event:", eventError);
        throw eventError;
      }

      setEvent(eventData);

      // Fetch assigned members for this event
      const { data: signups, error: signupsError } = await supabase
        .from("event_signups")
        .select(`
          *,
          members (
            user_id,
            first_name,
            last_name,
            iu_email,
            phone_number,
            position_club
          )
        `)
        .eq("event_id", eventId)
        .eq("is_assigned", true)
        .order("position_type", { ascending: true });

      if (signupsError) {
        console.error("Error fetching signups:", signupsError);
        throw signupsError;
      }

      // Fetch hours for each member
      const memberIds = signups?.map((s) => s.user_id) || [];
      const { data: hoursDataList, error: hoursError } = await supabase
        .from("event_hours")
        .select("*")
        .eq("event_id", eventId)
        .in("user_id", memberIds);

      if (hoursError) {
        console.error("Error fetching hours:", hoursError);
      }

      // Combine data
      const membersWithDetails: MemberWithSignup[] =
        signups?.map((signup) => {
          const memberData = signup.members as unknown as Member;
          const hoursData = (hoursDataList || []).find(
            (h) => h.user_id === signup.user_id
          );
          return {
            ...memberData,
            signup,
            hours: hoursData,
          };
        }) || [];

      setMembers(membersWithDetails);

      // Initialize hours input
      const initialHours: Record<string, string> = {};
      membersWithDetails.forEach((m) => {
        if (m.hours) {
          initialHours[m.user_id] = String(
            m.hours.confirmed_hours ?? m.hours.calculated_hours ?? ""
          );
        }
      });
      setHoursInput(initialHours);
    } catch (err) {
      console.error("Error fetching event details:", err);
      setError("Failed to load event details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function confirmHours(userId: string) {
    if (!user || !eventId) return;

    const hours = parseFloat(hoursInput[userId]);
    if (isNaN(hours) || hours < 0) {
      toast.error("Please enter a valid number of hours.");
      return;
    }

    try {
      setProcessingIds((prev) => new Set(prev).add(userId));
      const supabase = createClient();

      // Check if hours record exists
      const { data: existingHours } = await supabase
        .from("event_hours")
        .select("hour_id")
        .eq("event_id", eventId)
        .eq("user_id", userId)
        .single();

      if (existingHours) {
        // Update existing hours
        const { error: updateError } = await supabase
          .from("event_hours")
          .update({
            confirmed_hours: hours,
            confirmed_by: user.id,
            is_confirmed: true,
            confirmed_date: new Date().toISOString(),
          })
          .eq("hour_id", existingHours.hour_id);

        if (updateError) {
          console.error("Error updating hours:", updateError);
          throw updateError;
        }
      } else {
        // Create new hours record
        const { error: insertError } = await supabase
          .from("event_hours")
          .insert({
            event_id: eventId,
            user_id: userId,
            confirmed_hours: hours,
            confirmed_by: user.id,
            is_confirmed: true,
            confirmed_date: new Date().toISOString(),
          });

        if (insertError) {
          console.error("Error inserting hours:", insertError);
          throw insertError;
        }
      }

      await fetchEventDetails();
      toast.success("Hours confirmed successfully!");
    } catch (err) {
      console.error("Error confirming hours:", err);
      toast.error("Failed to confirm hours. Please try again.");
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  }

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function formatTime(timeStr: string): string {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  function calculateHours(startTime: string, endTime: string): number {
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    return (endMinutes - startMinutes) / 60;
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-12 w-96" />
        <Separator />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col gap-6">
        <Alert variant="destructive">
          <IconAlertCircle className="h-4 w-4" />
          <AlertDescription>Event not found.</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => router.back()}>
          <IconArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  const defaultHours = calculateHours(event.start_time, event.end_time);

  return (
    <div className="flex flex-col gap-6">
      <Button variant="ghost" onClick={() => router.back()} className="w-fit">
        <IconArrowLeft className="mr-2 h-4 w-4" />
        Back to Events
      </Button>

      <header>
        <h1 className="text-3xl font-bold tracking-tight">{event.event_name}</h1>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <IconCalendarEvent className="size-4" stroke={1.5} />
            {formatDate(event.event_date)}
          </span>
          <span className="inline-flex items-center gap-1">
            <IconClockHour3 className="size-4" stroke={1.5} />
            {formatTime(event.start_time)} – {formatTime(event.end_time)}
          </span>
          <span className="inline-flex items-center gap-1">
            <IconMapPin2 className="size-4" stroke={1.5} />
            {event.location}
          </span>
        </div>
        {event.description && (
          <p className="mt-3 text-muted-foreground">{event.description}</p>
        )}
      </header>

      <Separator />

      {error && (
        <Alert variant="destructive">
          <IconAlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Assigned Members Section */}
      <Card>
        <CardHeader>
          <CardTitle>Assigned Members</CardTitle>
          <CardDescription>
            View assigned members and confirm their hours for this event.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No members assigned to this event yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.user_id}>
                    <TableCell className="font-medium">
                      {member.first_name} {member.last_name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {POSITION_TYPE_MAP[member.signup.position_type] ||
                          "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        <span className="inline-flex items-center gap-1">
                          <IconMail className="h-3 w-3" />
                          <a
                            href={`mailto:${member.iu_email}`}
                            className="text-blue-600 hover:underline"
                          >
                            {member.iu_email}
                          </a>
                        </span>
                        {member.phone_number && (
                          <span className="inline-flex items-center gap-1">
                            <IconPhone className="h-3 w-3" />
                            <a
                              href={`tel:${member.phone_number}`}
                              className="text-blue-600 hover:underline"
                            >
                              {member.phone_number}
                            </a>
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          step="0.5"
                          min="0"
                          placeholder={String(defaultHours)}
                          value={hoursInput[member.user_id] || ""}
                          onChange={(e) =>
                            setHoursInput((prev) => ({
                              ...prev,
                              [member.user_id]: e.target.value,
                            }))
                          }
                          className="w-20"
                          disabled={processingIds.has(member.user_id)}
                        />
                        <span className="text-sm text-muted-foreground">
                          hrs
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {member.hours?.is_confirmed ? (
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
                        onClick={() => confirmHours(member.user_id)}
                        disabled={
                          processingIds.has(member.user_id) ||
                          !hoursInput[member.user_id]
                        }
                      >
                        {member.hours?.is_confirmed ? "Update" : "Confirm"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

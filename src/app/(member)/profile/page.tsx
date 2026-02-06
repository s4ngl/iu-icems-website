"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  IconUser,
  IconFileCertificate,
  IconClockHour4,
  IconAlertOctagon,
  IconCreditCard,
  IconLock,
  IconUpload,
  IconAlertCircle,
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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import type { Database } from "@/types/database.types";

type Member = Database["public"]["Tables"]["members"]["Row"];
type Certification = Database["public"]["Tables"]["certifications"]["Row"];
type PenaltyPoint = Database["public"]["Tables"]["penalty_points"]["Row"];

const CERT_TYPE_LABELS: Record<number, string> = {
  0: "BLS / CPR",
  1: "First Aid",
  2: "EMT-B",
  3: "ICS-100",
  4: "ICS-200",
  5: "ICS-700",
  6: "ICS-800",
};

const PRONOUNS_LABELS: Record<number, string> = {
  0: "he/him",
  1: "she/her",
  2: "they/them",
  3: "other",
};

function certStatusLabel(cert: Certification): string {
  if (cert.is_approved) {
    if (cert.expiration_date && new Date(cert.expiration_date) < new Date()) {
      return "Expired";
    }
    return "Approved";
  }
  return "Pending";
}

function statusBadgeVariant(s: string) {
  if (s === "Approved") return "default" as const;
  if (s === "Pending") return "secondary" as const;
  return "destructive" as const;
}

export default function ProfilePage() {
  const { user, member, isLoading: authLoading } = useAuth();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [penalties, setPenalties] = useState<PenaltyPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Personal info form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [classYear, setClassYear] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Password form state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    if (member) {
      setFirstName(member.first_name || "");
      setLastName(member.last_name || "");
      setPhone(member.phone_number || "");
      setClassYear(member.class_year != null ? String(member.class_year) : "");
      setPronouns(
        member.pronouns != null ? PRONOUNS_LABELS[member.pronouns] ?? "" : ""
      );
    }
  }, [member]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchProfileData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  async function fetchProfileData() {
    if (!user) return;
    try {
      setIsLoading(true);
      setError(null);
      const supabase = createClient();

      const [certsResult, penaltiesResult] = await Promise.all([
        supabase
          .from("certifications")
          .select("*")
          .eq("user_id", user.id)
          .order("cert_type", { ascending: true }),
        supabase
          .from("penalty_points")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_active", true)
          .order("assigned_date", { ascending: false }),
      ]);

      if (certsResult.error) throw certsResult.error;
      if (penaltiesResult.error) throw penaltiesResult.error;

      setCertifications(certsResult.data || []);
      setPenalties(penaltiesResult.data || []);
    } catch (err) {
      console.error("Error fetching profile data:", err);
      setError("Failed to load profile data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSavePersonalInfo() {
    if (!user) return;
    try {
      setIsSaving(true);
      const supabase = createClient();

      const normalizedInput = pronouns.toLowerCase().trim();
      const pronounsIndex = Object.entries(PRONOUNS_LABELS).find(
        ([, v]) => v.toLowerCase() === normalizedInput
      )?.[0];

      const { error: updateError } = await supabase
        .from("members")
        .update({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone_number: phone.trim() || null,
          class_year: classYear ? parseInt(classYear, 10) : null,
          pronouns: pronounsIndex != null ? parseInt(pronounsIndex, 10) : null,
        })
        .eq("user_id", user.id);

      if (updateError) throw updateError;
      toast.success("Personal information saved successfully.");
    } catch (err) {
      console.error("Error saving personal info:", err);
      toast.error("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleUpdatePassword() {
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setIsUpdatingPassword(true);
      const supabase = createClient();
      const { error: pwError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (pwError) throw pwError;

      toast.success("Password updated successfully.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Error updating password:", err);
      toast.error("Failed to update password. Please try again.");
    } finally {
      setIsUpdatingPassword(false);
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
        <div className="grid gap-6 sm:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <Alert variant="destructive">
        <IconAlertCircle className="h-4 w-4" />
        <AlertDescription>Unable to load your profile.</AlertDescription>
      </Alert>
    );
  }

  const totalPenalty = penalties.reduce((sum, p) => sum + p.points, 0);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>

      {error && (
        <Alert variant="destructive">
          <IconAlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* personal info form */}
      <Card>
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-2">
            <IconUser className="size-5" stroke={1.5} />
            Personal Information
          </CardTitle>
          <CardDescription>
            Update your contact details. Email cannot be changed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">First Name</span>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Last Name</span>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">IU Email</span>
              <Input
                value={member.iu_email}
                readOnly
                className="bg-muted"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Phone</span>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Class Year</span>
              <Input
                type="number"
                value={classYear}
                onChange={(e) => setClassYear(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Pronouns</span>
              <Input
                value={pronouns}
                onChange={(e) => setPronouns(e.target.value)}
              />
            </label>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSavePersonalInfo} disabled={isSaving}>
            {isSaving ? "Saving…" : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>

      {/* certifications */}
      <Card>
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-2">
            <IconFileCertificate className="size-5" stroke={1.5} />
            Certifications
          </CardTitle>
          <CardDescription>
            Upload and track your medical certifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {certifications.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No certifications on file. Upload your certifications to get
              started.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Certification</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certifications.map((cert) => {
                  const status = certStatusLabel(cert);
                  return (
                    <TableRow key={cert.cert_id}>
                      <TableCell className="font-medium">
                        {CERT_TYPE_LABELS[cert.cert_type] ?? `Type ${cert.cert_type}`}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusBadgeVariant(status)}>
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {cert.expiration_date
                          ? new Date(cert.expiration_date).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="xs">
                          <IconUpload className="mr-1 size-3" stroke={1.5} />
                          Upload
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* hours + penalty + dues row */}
      <div className="grid gap-6 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2 text-base">
              <IconClockHour4 className="size-4" stroke={1.5} />
              Hours Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>
              <span className="font-medium">Total:</span>{" "}
              {member.total_hours} hrs
            </p>
            <p>
              <span className="font-medium">Pending:</span>{" "}
              {member.pending_hours} hrs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2 text-base">
              <IconAlertOctagon className="size-4" stroke={1.5} />
              Penalty Points
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {penalties.length === 0 ? (
              <p>No penalty points — keep it up!</p>
            ) : (
              <div className="space-y-2">
                <p className="font-medium text-foreground">
                  {totalPenalty} active point{totalPenalty !== 1 ? "s" : ""}
                </p>
                {penalties.map((p) => (
                  <p key={p.point_id} className="text-xs">
                    {p.points} pt{p.points !== 1 ? "s" : ""} — {p.reason}
                  </p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2 text-base">
              <IconCreditCard className="size-4" stroke={1.5} />
              Dues Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <Badge variant={member.dues_paid ? "default" : "destructive"}>
              {member.dues_paid ? "Paid" : "Unpaid"}
            </Badge>
            {member.dues_expiration && (
              <p className="text-muted-foreground">
                Valid through{" "}
                {new Date(member.dues_expiration).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* change password */}
      <Card>
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-2">
            <IconLock className="size-5" stroke={1.5} />
            Change Password
          </CardTitle>
          <CardDescription>
            Update the password used to sign in to the member portal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex max-w-md flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">New Password</span>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Confirm New Password</span>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            onClick={handleUpdatePassword}
            disabled={isUpdatingPassword}
          >
            {isUpdatingPassword ? "Updating…" : "Update Password"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

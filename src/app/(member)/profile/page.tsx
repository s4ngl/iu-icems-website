"use client";

import {
  IconUser,
  IconFileCertificate,
  IconClockHour4,
  IconAlertOctagon,
  IconCreditCard,
  IconLock,
  IconUpload,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/* demo certification rows */
const certRows = [
  { name: "BLS / CPR", status: "Approved", expires: "2025-06-15" },
  { name: "First Aid", status: "Approved", expires: "2025-08-20" },
  { name: "ICS-100", status: "Approved", expires: "N/A" },
  { name: "EMT-B", status: "Pending", expires: "—" },
];

function statusBadgeVariant(s: string) {
  if (s === "Approved") return "default" as const;
  if (s === "Pending") return "secondary" as const;
  return "destructive" as const;
}

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>

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
              <span className="text-sm font-medium">Full Name</span>
              <Input defaultValue="Jordan Rivera" />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">IU Email</span>
              <Input defaultValue="jrivera@iu.edu" readOnly className="bg-muted" />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Phone</span>
              <Input defaultValue="(812) 555-0147" />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Class Year</span>
              <Input defaultValue="Junior — 2027" />
            </label>
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-sm font-medium">Pronouns</span>
              <Input defaultValue="they/them" />
            </label>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Changes</Button>
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
              {certRows.map((cr) => (
                <TableRow key={cr.name}>
                  <TableCell className="font-medium">{cr.name}</TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant(cr.status)}>
                      {cr.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{cr.expires}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="xs">
                      <IconUpload className="mr-1 size-3" stroke={1.5} />
                      Upload
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
              <span className="font-medium">Total:</span> 24.5 hrs
            </p>
            <p>
              <span className="font-medium">Pending:</span> 3.0 hrs
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
            <p>No penalty points — keep it up!</p>
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
            <Badge>Paid</Badge>
            <p className="text-muted-foreground">Valid through May 2026</p>
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
              <span className="text-sm font-medium">Current Password</span>
              <Input type="password" />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">New Password</span>
              <Input type="password" />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Confirm New Password</span>
              <Input type="password" />
            </label>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline">Update Password</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

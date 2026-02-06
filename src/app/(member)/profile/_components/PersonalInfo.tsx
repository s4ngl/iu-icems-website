"use client";

import { useState } from "react";
import {
  IconUser,
  IconEdit,
  IconDeviceFloppy,
  IconX,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GENDER,
  GENDER_LABELS,
  CLASS_YEAR,
  CLASS_YEAR_LABELS,
  PRONOUNS,
  PRONOUNS_LABELS,
  ACCOUNT_STATUS,
  ACCOUNT_STATUS_LABELS,
} from "@/lib/utils/constants";
import { formatPhoneNumber } from "@/lib/utils/format";

const demoMember = {
  firstName: "Jordan",
  lastName: "Rivera",
  email: "jrivera@iu.edu",
  phone: "8125550147",
  gender: GENDER.OTHER,
  classYear: CLASS_YEAR.JUNIOR,
  pronouns: PRONOUNS.OTHER,
  studentId: "2012345678",
  psid: "PS-00042",
  accountStatus: ACCOUNT_STATUS.ACTIVE,
};

function statusBadgeVariant(status: number) {
  if (status === ACCOUNT_STATUS.ACTIVE) return "default" as const;
  if (status === ACCOUNT_STATUS.PENDING) return "secondary" as const;
  return "destructive" as const;
}

export default function PersonalInfo() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: demoMember.firstName,
    lastName: demoMember.lastName,
    phone: demoMember.phone,
    gender: String(demoMember.gender),
    classYear: String(demoMember.classYear),
    pronouns: String(demoMember.pronouns),
  });

  function handleSave() {
    setEditing(false);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="inline-flex items-center gap-2">
            <IconUser className="size-5" stroke={1.5} />
            Personal Information
          </CardTitle>
          {!editing && (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              <IconEdit className="mr-1 size-3.5" stroke={1.5} />
              Edit
            </Button>
          )}
        </div>
        <CardDescription>
          Update your contact details. Email, Student ID, and PSID cannot be
          changed.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Name */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">First Name</span>
            {editing ? (
              <Input
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
              />
            ) : (
              <span className="text-sm text-muted-foreground">
                {demoMember.firstName}
              </span>
            )}
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Last Name</span>
            {editing ? (
              <Input
                value={form.lastName}
                onChange={(e) =>
                  setForm({ ...form, lastName: e.target.value })
                }
              />
            ) : (
              <span className="text-sm text-muted-foreground">
                {demoMember.lastName}
              </span>
            )}
          </label>

          {/* Email (read-only) */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">IU Email</span>
            <span className="text-sm text-muted-foreground">
              {demoMember.email}
            </span>
          </label>

          {/* Phone */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Phone</span>
            {editing ? (
              <Input
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />
            ) : (
              <span className="text-sm text-muted-foreground">
                {formatPhoneNumber(demoMember.phone)}
              </span>
            )}
          </label>

          {/* Gender */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Gender</span>
            {editing ? (
              <Select
                value={form.gender}
                onValueChange={(v) => setForm({ ...form, gender: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(GENDER_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <span className="text-sm text-muted-foreground">
                {GENDER_LABELS[demoMember.gender]}
              </span>
            )}
          </label>

          {/* Class Year */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Class Year</span>
            {editing ? (
              <Select
                value={form.classYear}
                onValueChange={(v) => setForm({ ...form, classYear: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CLASS_YEAR_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <span className="text-sm text-muted-foreground">
                {CLASS_YEAR_LABELS[demoMember.classYear]}
              </span>
            )}
          </label>

          {/* Pronouns */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Pronouns</span>
            {editing ? (
              <Select
                value={form.pronouns}
                onValueChange={(v) => setForm({ ...form, pronouns: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PRONOUNS_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <span className="text-sm text-muted-foreground">
                {PRONOUNS_LABELS[demoMember.pronouns]}
              </span>
            )}
          </label>

          {/* Student ID (read-only) */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Student ID</span>
            <span className="text-sm text-muted-foreground">
              {demoMember.studentId}
            </span>
          </label>

          {/* PSID (read-only) */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">PSID</span>
            <span className="text-sm text-muted-foreground">
              {demoMember.psid}
            </span>
          </label>

          {/* Account Status (read-only) */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Account Status</span>
            <div>
              <Badge variant={statusBadgeVariant(demoMember.accountStatus)}>
                {ACCOUNT_STATUS_LABELS[demoMember.accountStatus]}
              </Badge>
            </div>
          </label>
        </div>
      </CardContent>

      {editing && (
        <CardFooter className="gap-2">
          <Button onClick={handleSave}>
            <IconDeviceFloppy className="mr-1 size-4" stroke={1.5} />
            Save Changes
          </Button>
          <Button variant="outline" onClick={() => setEditing(false)}>
            <IconX className="mr-1 size-4" stroke={1.5} />
            Cancel
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
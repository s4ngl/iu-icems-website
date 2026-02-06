"use client";

import { useState } from "react";
import {
  IconPhone,
  IconMail,
  IconCopy,
  IconCheck,
  IconAddressBook,
} from "@tabler/icons-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface ContactMember {
  userId: string;
  firstName: string;
  lastName: string;
  role: "EMT" | "FA/EMR" | "Supervisor";
  phone: string;
  email: string;
}

const ROLE_VARIANT: Record<ContactMember["role"], "default" | "secondary" | "outline"> = {
  EMT: "default",
  "FA/EMR": "secondary",
  Supervisor: "outline",
};

const DEMO_MEMBERS: ContactMember[] = [
  { userId: "1", firstName: "Sarah", lastName: "Chen", role: "Supervisor", phone: "(812) 555-0101", email: "schen@iu.edu" },
  { userId: "2", firstName: "James", lastName: "Rodriguez", role: "EMT", phone: "(812) 555-0102", email: "jrodrig@iu.edu" },
  { userId: "3", firstName: "Emily", lastName: "Nguyen", role: "EMT", phone: "(812) 555-0103", email: "enguyen@iu.edu" },
  { userId: "4", firstName: "Marcus", lastName: "Johnson", role: "FA/EMR", phone: "(812) 555-0104", email: "mjohnso@iu.edu" },
  { userId: "5", firstName: "Aisha", lastName: "Patel", role: "FA/EMR", phone: "(812) 555-0105", email: "apatel@iu.edu" },
];

interface ContactInfoProps {
  members?: ContactMember[];
}

export default function ContactInfo({ members = DEMO_MEMBERS }: ContactInfoProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  async function copyToClipboard(text: string, fieldId: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Clipboard API not available
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconAddressBook className="size-5" stroke={1.5} />
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <Card key={member.userId} className="flex flex-col gap-3 p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {member.firstName} {member.lastName}
                </span>
                <Badge variant={ROLE_VARIANT[member.role]}>{member.role}</Badge>
              </div>

              {/* Phone */}
              <div className="flex items-center justify-between gap-2 text-sm">
                <a
                  href={`tel:${member.phone}`}
                  className="inline-flex items-center gap-1.5 text-blue-600 hover:underline"
                >
                  <IconPhone className="h-4 w-4" />
                  {member.phone}
                </a>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => copyToClipboard(member.phone, `phone-${member.userId}`)}
                >
                  {copiedField === `phone-${member.userId}` ? (
                    <IconCheck className="h-3.5 w-3.5 text-green-600" />
                  ) : (
                    <IconCopy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between gap-2 text-sm">
                <a
                  href={`mailto:${member.email}`}
                  className="inline-flex items-center gap-1.5 text-blue-600 hover:underline"
                >
                  <IconMail className="h-4 w-4" />
                  {member.email}
                </a>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => copyToClipboard(member.email, `email-${member.userId}`)}
                >
                  {copiedField === `email-${member.userId}` ? (
                    <IconCheck className="h-3.5 w-3.5 text-green-600" />
                  ) : (
                    <IconCopy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
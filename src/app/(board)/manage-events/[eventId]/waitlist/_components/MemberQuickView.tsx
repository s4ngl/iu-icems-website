"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconX, IconMail, IconPhone, IconCertificate, IconClock, IconAlertTriangle } from "@tabler/icons-react";
import { CERT_LABELS } from "@/lib/utils/constants";

export interface MemberDetails {
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  certifications: number[];
  total_hours: number;
  penalty_points: number;
}

interface MemberQuickViewProps {
  memberId: string;
  onClose?: () => void;
  memberData?: MemberDetails;
}

const DEMO_MEMBER: MemberDetails = {
  user_id: "u-1",
  name: "Alice Johnson",
  email: "ajohnso@iu.edu",
  phone: "812-555-0142",
  certifications: [0, 1, 4, 5, 6, 7],
  total_hours: 45,
  penalty_points: 0,
};

export function MemberQuickView({ memberId, onClose, memberData }: MemberQuickViewProps) {
  const member = memberData ?? { ...DEMO_MEMBER, user_id: memberId };

  return (
    <Card className="w-80">
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <CardTitle className="text-base">{member.name}</CardTitle>
        {onClose && (
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onClose}>
            <IconX className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <IconMail className="h-4 w-4 text-muted-foreground" />
          <span>{member.email}</span>
        </div>

        {member.phone && (
          <div className="flex items-center gap-2 text-sm">
            <IconPhone className="h-4 w-4 text-muted-foreground" />
            <span>{member.phone}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm font-medium">
            <IconCertificate className="h-4 w-4 text-muted-foreground" />
            Certifications
          </div>
          <div className="flex flex-wrap gap-1">
            {member.certifications.length > 0 ? (
              member.certifications.map((cert) => (
                <Badge key={cert} variant="outline" className="text-xs">
                  {CERT_LABELS[cert] ?? `Cert ${cert}`}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">None</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-3">
          <div className="flex items-center gap-1.5 text-sm">
            <IconClock className="h-4 w-4 text-muted-foreground" />
            <span>{member.total_hours} hours</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <IconAlertTriangle className="h-4 w-4 text-muted-foreground" />
            <span>
              {member.penalty_points} point{member.penalty_points !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

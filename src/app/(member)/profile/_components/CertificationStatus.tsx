"use client";

import {
  IconFileCertificate,
  IconUpload,
  IconFile,
  IconCheck,
  IconClock,
  IconAlertTriangle,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CERT_TYPES, CERT_LABELS } from "@/lib/utils/constants";
import { formatDate, isExpired, isExpiringSoon } from "@/lib/utils/date";

interface CertRow {
  type: number;
  status: "approved" | "pending";
  expirationDate: string | null;
  uploadDate: string;
}

const demoCerts: CertRow[] = [
  {
    type: CERT_TYPES.BLS_CPR,
    status: "approved",
    expirationDate: "2025-06-15",
    uploadDate: "2024-06-10",
  },
  {
    type: CERT_TYPES.FA,
    status: "approved",
    expirationDate: "2025-08-20",
    uploadDate: "2024-08-15",
  },
  {
    type: CERT_TYPES.ICS_100,
    status: "approved",
    expirationDate: null,
    uploadDate: "2024-01-12",
  },
  {
    type: CERT_TYPES.EMT,
    status: "pending",
    expirationDate: "2026-03-01",
    uploadDate: "2025-01-20",
  },
  {
    type: CERT_TYPES.ICS_700,
    status: "approved",
    expirationDate: null,
    uploadDate: "2024-01-12",
  },
  {
    type: CERT_TYPES.EMR,
    status: "approved",
    expirationDate: "2024-11-30",
    uploadDate: "2023-12-01",
  },
];

function getStatusInfo(cert: CertRow) {
  if (cert.expirationDate && isExpired(cert.expirationDate)) {
    return {
      label: "Expired",
      variant: "destructive" as const,
      icon: <IconAlertTriangle className="size-3.5" stroke={1.5} />,
    };
  }
  if (cert.status === "pending") {
    return {
      label: "Pending",
      variant: "secondary" as const,
      icon: <IconClock className="size-3.5" stroke={1.5} />,
    };
  }
  if (cert.expirationDate && isExpiringSoon(cert.expirationDate, 60)) {
    return {
      label: "Expiring Soon",
      variant: "outline" as const,
      icon: <IconAlertTriangle className="size-3.5" stroke={1.5} />,
    };
  }
  return {
    label: "Approved",
    variant: "default" as const,
    icon: <IconCheck className="size-3.5" stroke={1.5} />,
  };
}

export default function CertificationStatus() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="inline-flex items-center gap-2">
            <IconFileCertificate className="size-5" stroke={1.5} />
            Certifications
          </CardTitle>
          <Button variant="outline" size="sm">
            <IconUpload className="mr-1 size-3.5" stroke={1.5} />
            Upload New
          </Button>
        </div>
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
              <TableHead>Uploaded</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {demoCerts.map((cert) => {
              const info = getStatusInfo(cert);
              return (
                <TableRow key={cert.type}>
                  <TableCell className="font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      <IconFile className="size-3.5 text-muted-foreground" stroke={1.5} />
                      {CERT_LABELS[cert.type]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={info.variant}>
                      {info.icon}
                      <span className="ml-1">{info.label}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {cert.expirationDate
                      ? formatDate(cert.expirationDate)
                      : "N/A"}
                  </TableCell>
                  <TableCell>{formatDate(cert.uploadDate)}</TableCell>
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
      </CardContent>
    </Card>
  );
}
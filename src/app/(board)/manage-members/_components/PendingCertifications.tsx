"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { IconCheck, IconX, IconRefresh, IconExternalLink } from "@tabler/icons-react";
import { useAuth } from "@/hooks/use-auth";
import { CERT_TYPE_LABELS } from "@/types/certification.types";
import type { Database } from "@/types/database.types";

type Certification = Database["public"]["Tables"]["certifications"]["Row"];
type Member = Database["public"]["Tables"]["members"]["Row"];

interface CertificationWithMember extends Certification {
  member?: Member;
}

export function PendingCertifications() {
  const router = useRouter();
  const { member: currentUser } = useAuth();
  const [certifications, setCertifications] = useState<CertificationWithMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPendingCertifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchPendingCertifications() {
    try {
      setIsLoading(true);
      const response = await fetch("/api/certifications?status=pending");
      if (!response.ok) {
        throw new Error("Failed to fetch certifications");
      }
      const data = await response.json();
      setCertifications(data);
    } catch (error) {
      console.error("Error fetching pending certifications:", error);
      setCertifications([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function approveCertification(certId: string) {
    if (!currentUser?.user_id) return;

    setProcessingIds((prev) => new Set(prev).add(certId));
    try {
      const response = await fetch(`/api/certifications/${certId}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvedBy: currentUser.user_id }),
      });

      if (!response.ok) {
        throw new Error("Failed to approve certification");
      }

      await fetchPendingCertifications();
    } catch (error) {
      console.error("Error approving certification:", error);
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(certId);
        return next;
      });
    }
  }

  async function rejectCertification(certId: string) {
    setProcessingIds((prev) => new Set(prev).add(certId));
    try {
      const response = await fetch(`/api/certifications/${certId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to reject certification");
      }

      await fetchPendingCertifications();
    } catch (error) {
      console.error("Error rejecting certification:", error);
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(certId);
        return next;
      });
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Certifications</CardTitle>
          <CardDescription>Review and approve member certifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Pending Certifications</CardTitle>
            <CardDescription>Review and approve member certifications</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPendingCertifications}
            disabled={isLoading}
          >
            <IconRefresh className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {certifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">No pending certifications</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Certification Type</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>File</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certifications.map((cert) => (
                  <TableRow key={cert.cert_id}>
                    <TableCell>
                      <button
                        onClick={() => router.push(`/manage-members/${cert.user_id}`)}
                        className="font-medium hover:underline"
                      >
                        {cert.member
                          ? `${cert.member.first_name} ${cert.member.last_name}`
                          : "Unknown Member"}
                      </button>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {CERT_TYPE_LABELS[cert.cert_type] || `Type ${cert.cert_type}`}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(cert.upload_date)}
                    </TableCell>
                    <TableCell>
                      {cert.file_path ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(cert.file_path!, "_blank")}
                        >
                          <IconExternalLink className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      ) : (
                        <span className="text-sm text-muted-foreground">No file</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => approveCertification(cert.cert_id)}
                          disabled={processingIds.has(cert.cert_id)}
                        >
                          <IconCheck className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => rejectCertification(cert.cert_id)}
                          disabled={processingIds.has(cert.cert_id)}
                        >
                          <IconX className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {certifications.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground">
            {certifications.length} pending certification{certifications.length !== 1 ? "s" : ""}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  IconCertificate,
  IconCheck,
  IconX,
  IconExternalLink,
  IconCalendar,
} from "@tabler/icons-react";
import { useAuth } from "@/hooks/use-auth";
import { CERT_TYPE_LABELS } from "@/types/certification.types";
import type { Database } from "@/types/database.types";

type Certification = Database["public"]["Tables"]["certifications"]["Row"];

interface CertificationApprovalProps {
  memberId: string;
}

export function CertificationApproval({ memberId }: CertificationApprovalProps) {
  const { member: currentUser } = useAuth();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [editingExpiration, setEditingExpiration] = useState<string | null>(null);
  const [expirationDate, setExpirationDate] = useState("");

  useEffect(() => {
    if (memberId) {
      fetchCertifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberId]);

  async function fetchCertifications() {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/certifications?userId=${memberId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch certifications");
      }
      const data = await response.json();
      setCertifications(data);
    } catch (error) {
      console.error("Error fetching certifications:", error);
      setCertifications([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function approveCertification(certId: string, expDate?: string) {
    if (!currentUser?.user_id) return;

    setProcessingIds((prev) => new Set(prev).add(certId));
    try {
      const response = await fetch(`/api/certifications/${certId}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approvedBy: currentUser.user_id,
          expirationDate: expDate || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to approve certification");
      }

      setEditingExpiration(null);
      setExpirationDate("");
      await fetchCertifications();
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

      await fetchCertifications();
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
    });
  };

  const isExpired = (expirationDate: string | null) => {
    if (!expirationDate) return false;
    return new Date(expirationDate) < new Date();
  };

  const isExpiringSoon = (expirationDate: string | null) => {
    if (!expirationDate) return false;
    const expDate = new Date(expirationDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expDate <= thirtyDaysFromNow && expDate >= new Date();
  };

  const pendingCerts = certifications.filter((cert) => !cert.is_approved);
  const approvedCerts = certifications.filter((cert) => cert.is_approved);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconCertificate className="h-5 w-5" />
          Certifications
          {pendingCerts.length > 0 && (
            <Badge variant="default">{pendingCerts.length} pending</Badge>
          )}
        </CardTitle>
        <CardDescription>View and approve member certifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : certifications.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No certifications uploaded
          </div>
        ) : (
          <div className="space-y-4">
            {pendingCerts.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Pending Approval</h4>
                {pendingCerts.map((cert) => (
                  <div
                    key={cert.cert_id}
                    className="rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950 p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {CERT_TYPE_LABELS[cert.cert_type] || `Type ${cert.cert_type}`}
                          </Badge>
                          <Badge variant="default">Pending</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Uploaded {formatDate(cert.upload_date)}
                        </p>
                      </div>
                      {cert.file_path && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(cert.file_path!, "_blank")}
                        >
                          <IconExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {editingExpiration === cert.cert_id ? (
                      <div className="space-y-2">
                        <Label htmlFor={`exp-${cert.cert_id}`} className="text-xs">
                          Expiration Date (Optional)
                        </Label>
                        <Input
                          id={`exp-${cert.cert_id}`}
                          type="date"
                          value={expirationDate}
                          onChange={(e) => setExpirationDate(e.target.value)}
                          className="text-sm"
                        />
                      </div>
                    ) : null}

                    <div className="flex gap-2">
                      {editingExpiration === cert.cert_id ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => approveCertification(cert.cert_id, expirationDate)}
                            disabled={processingIds.has(cert.cert_id)}
                            className="flex-1"
                          >
                            <IconCheck className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingExpiration(null);
                              setExpirationDate("");
                            }}
                            className="flex-1"
                          >
                            <IconX className="mr-2 h-4 w-4" />
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingExpiration(cert.cert_id)}
                            disabled={processingIds.has(cert.cert_id)}
                            className="flex-1"
                          >
                            <IconCalendar className="mr-2 h-4 w-4" />
                            Set Expiration & Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => approveCertification(cert.cert_id)}
                            disabled={processingIds.has(cert.cert_id)}
                            className="flex-1"
                          >
                            <IconCheck className="mr-2 h-4 w-4" />
                            Approve Now
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => rejectCertification(cert.cert_id)}
                            disabled={processingIds.has(cert.cert_id)}
                          >
                            <IconX className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {approvedCerts.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Approved Certifications</h4>
                {approvedCerts.map((cert) => (
                  <div
                    key={cert.cert_id}
                    className="rounded-lg border p-4 space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline">
                            {CERT_TYPE_LABELS[cert.cert_type] || `Type ${cert.cert_type}`}
                          </Badge>
                          <Badge variant="default">Approved</Badge>
                          {isExpired(cert.expiration_date) && (
                            <Badge variant="destructive" className="text-xs">
                              Expired
                            </Badge>
                          )}
                          {!isExpired(cert.expiration_date) &&
                            isExpiringSoon(cert.expiration_date) && (
                              <Badge variant="default" className="text-xs">
                                Expiring Soon
                              </Badge>
                            )}
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p>Uploaded: {formatDate(cert.upload_date)}</p>
                          {cert.approved_date && (
                            <p>Approved: {formatDate(cert.approved_date)}</p>
                          )}
                          {cert.expiration_date && (
                            <p>Expires: {formatDate(cert.expiration_date)}</p>
                          )}
                        </div>
                      </div>
                      {cert.file_path && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(cert.file_path!, "_blank")}
                        >
                          <IconExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

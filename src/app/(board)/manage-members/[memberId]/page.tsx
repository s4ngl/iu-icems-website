"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { IconArrowLeft } from "@tabler/icons-react";
import { MemberProfile } from "./_components/MemberProfile";
import { DuesManagement } from "./_components/DuesManagement";
import { PenaltyPointsManagement } from "./_components/PenaltyPointsManagement";
import { CertificationApproval } from "./_components/CertificationApproval";
import type { Database } from "@/types/database.types";

type Member = Database["public"]["Tables"]["members"]["Row"];

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const memberId = params.memberId as string;
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (memberId) {
      fetchMember();
    }
  }, [memberId]);

  async function fetchMember() {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/members/${memberId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch member");
      }
      const data = await response.json();
      setMember(data);
    } catch (error) {
      console.error("Error fetching member:", error);
      setMember(null);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <section className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </section>
    );
  }

  if (!member) {
    return (
      <section className="space-y-4">
        <Button variant="ghost" onClick={() => router.push("/manage-members")}>
          <IconArrowLeft className="mr-2 h-4 w-4" />
          Back to Members
        </Button>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h1 className="text-2xl font-bold">Member Not Found</h1>
          <p className="text-muted-foreground mt-2">
            The requested member could not be found.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/manage-members")}>
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {member.first_name} {member.last_name}
            </h1>
            <p className="text-muted-foreground">{member.iu_email}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <MemberProfile member={member} onUpdate={fetchMember} />
          <DuesManagement member={member} onUpdate={fetchMember} />
        </div>
        <div className="space-y-6">
          <CertificationApproval memberId={member.user_id} />
          <PenaltyPointsManagement member={member} onUpdate={fetchMember} />
        </div>
      </div>
    </section>
  );
}

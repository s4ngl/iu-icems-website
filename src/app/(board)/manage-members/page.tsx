"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MembersTable } from "./_components/MembersTable";
import { MemberFilters } from "./_components/MemberFilters";
import { MemberSearch } from "./_components/MemberSearch";
import { PendingCertifications } from "./_components/PendingCertifications";
import { IconUsers, IconCertificate } from "@tabler/icons-react";
import type { Database } from "@/types/database.types";

type Member = Database["public"]["Tables"]["members"]["Row"];

export default function Page() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [duesFilter, setDuesFilter] = useState<boolean | null>(null);
  const [roleFilter, setRoleFilter] = useState<number | null>(null);

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchMembers() {
    try {
      setIsLoading(true);
      const response = await fetch("/api/members");
      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error("Error fetching members:", error);
      setMembers([]);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      !searchQuery ||
      member.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.iu_email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === null || member.account_status === statusFilter;
    const matchesDues = duesFilter === null || member.dues_paid === duesFilter;
    const matchesRole = roleFilter === null || member.position_web === roleFilter;

    return matchesSearch && matchesStatus && matchesDues && matchesRole;
  });

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Member Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage members, approve certifications, and update dues status
        </p>
      </div>

      <Tabs defaultValue="members" className="space-y-6">
        <TabsList>
          <TabsTrigger value="members" className="gap-2">
            <IconUsers className="h-4 w-4" />
            All Members
          </TabsTrigger>
          <TabsTrigger value="certifications" className="gap-2">
            <IconCertificate className="h-4 w-4" />
            Pending Certifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Member Directory</CardTitle>
              <CardDescription>
                View and manage all organization members
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-end">
                <div className="flex-1">
                  <MemberSearch value={searchQuery} onChange={setSearchQuery} />
                </div>
                <MemberFilters
                  statusFilter={statusFilter}
                  duesFilter={duesFilter}
                  roleFilter={roleFilter}
                  onStatusChange={setStatusFilter}
                  onDuesChange={setDuesFilter}
                  onRoleChange={setRoleFilter}
                />
              </div>

              <MembersTable
                members={filteredMembers}
                isLoading={isLoading}
                onRefresh={fetchMembers}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certifications">
          <PendingCertifications />
        </TabsContent>
      </Tabs>
    </section>
  );
}

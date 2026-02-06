"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { TrainingManagementTable, type TrainingWithParticipants } from "./_components/TrainingManagementTable";
import type { Database } from "@/types/database.types";

type TrainingSession = Database["public"]["Tables"]["training_sessions"]["Row"];

export default function ManageTrainingPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<TrainingWithParticipants[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  async function fetchSessions() {
    try {
      setIsLoading(true);
      const response = await fetch("/api/training");
      if (!response.ok) throw new Error("Failed to fetch training sessions");
      const json = await response.json();
      const data: TrainingSession[] = json.data ?? [];
      setSessions(data);
    } catch (error) {
      console.error("Error fetching training sessions:", error);
      setSessions([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/training/${deleteId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete training session");
      setSessions((prev) => prev.filter((s) => s.training_id !== deleteId));
    } catch (error) {
      console.error("Error deleting training session:", error);
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  }

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      !searchQuery ||
      session.training_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "aha" && session.is_aha_training) ||
      (typeFilter === "general" && !session.is_aha_training);

    return matchesSearch && matchesType;
  });

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Training Management</h1>
          <p className="text-muted-foreground mt-2">
            Create, edit, and manage training sessions and participants
          </p>
        </div>
        <Button onClick={() => router.push("/manage-training/create")}>
          <IconPlus className="mr-2 h-4 w-4" />
          Create Training
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Training Sessions</CardTitle>
          <CardDescription>View and manage all training sessions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search training by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="aha">AHA</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <TrainingManagementTable
              sessions={filteredSessions}
              onEdit={(trainingId) => router.push(`/manage-training/${trainingId}/edit`)}
              onDelete={(trainingId) => setDeleteId(trainingId)}
            />
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Training Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this training session? This action cannot be undone.
              All associated signups will also be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

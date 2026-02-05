import type { Metadata } from "next";
import Link from "next/link";
import {
  IconCalendarEvent,
  IconClockHour3,
  IconMapPin2,
  IconCurrencyDollar,
  IconUsers,
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
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Training Detail | IC-EMS",
  description: "View training session details and register.",
};

/* AHA pricing tiers */
const pricingRows = [
  { option: "CPR / BLS Only", price: "$45" },
  { option: "First Aid Only", price: "$35" },
  { option: "Both (CPR + FA)", price: "$70" },
];

export default async function TrainingDetailPage({
  params,
}: {
  params: Promise<{ trainingId: string }>;
}) {
  const { trainingId } = await params;

  return (
    <div className="flex flex-col gap-6">
      <Button variant="ghost" size="sm" className="self-start" asChild>
        <Link href="/training">← Back to training</Link>
      </Button>

      {/* heading */}
      <header>
        <Badge className="mb-2 bg-orange-600 text-white">AHA Training</Badge>
        <h1 className="text-2xl font-bold tracking-tight">
          BLS / CPR Certification
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Training ID: {trainingId}
        </p>
      </header>

      {/* logistics */}
      <Card>
        <CardContent className="flex flex-wrap gap-x-6 gap-y-2 pt-6 text-sm">
          <span className="inline-flex items-center gap-1.5">
            <IconCalendarEvent className="size-4 text-muted-foreground" stroke={1.5} />
            Date TBA — Spring 2026
          </span>
          <span className="inline-flex items-center gap-1.5">
            <IconClockHour3 className="size-4 text-muted-foreground" stroke={1.5} />
            9:00 AM – 3:00 PM (estimated)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <IconMapPin2 className="size-4 text-muted-foreground" stroke={1.5} />
            IU Health Bloomington — Sim Center
          </span>
          <span className="inline-flex items-center gap-1.5">
            <IconUsers className="size-4 text-muted-foreground" stroke={1.5} />
            12 / 20 registered
          </span>
        </CardContent>
      </Card>

      {/* description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">About This Course</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            American Heart Association BLS Provider course covering high-quality
            CPR for adults, children, and infants, AED operation, relief of
            choking, and team-based resuscitation. Successful participants
            receive an AHA BLS Provider eCard valid for two years.
          </p>
        </CardContent>
      </Card>

      {/* pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-2 text-base">
            <IconCurrencyDollar className="size-4" stroke={1.5} />
            Pricing
          </CardTitle>
          <CardDescription>
            Pay via Venmo @iu-icems before the class date.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Option</TableHead>
                <TableHead className="text-right">Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pricingRows.map((pr) => (
                <TableRow key={pr.option}>
                  <TableCell>{pr.option}</TableCell>
                  <TableCell className="text-right font-medium">
                    {pr.price}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Separator />

      {/* participants placeholder & signup */}
      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Registered Participants</CardTitle>
            <CardDescription>12 of 20 spots filled</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>Participant list visible after registration opens.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Register</CardTitle>
            <CardDescription>
              Select a certification option and reserve your seat.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              Choose CPR Only, First Aid Only, or Both when registering. Payment
              must be completed before the session.
            </p>
          </CardContent>
          <CardFooter>
            <Button>Sign Up</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

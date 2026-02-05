import type { Metadata } from "next";
import Link from "next/link";
import {
  IconStethoscope,
  IconClock,
  IconHeartbeat,
  IconSchool,
  IconTrophy,
  IconBook,
  IconUsersGroup,
  IconExternalLink,
  IconCurrencyDollar,
  IconCalendarEvent,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Join IC-EMS — IC-EMS at IU",
  description:
    "Apply to join IC-EMS at Indiana University. Volunteer your time to EMS and First-Aid and make an impact on your community.",
};

const benefits = [
  {
    icon: IconStethoscope,
    title: "Direct Patient Care Experience",
    description:
      "Work alongside IU Student Health Center Nurses and IU Health LifeLine EMS providers at events like Little 500.",
  },
  {
    icon: IconClock,
    title: "Clinical Volunteer Hours",
    description: "Gain hands-on experience in patient care.",
  },
  {
    icon: IconHeartbeat,
    title: "Life-saving Skills",
    description:
      "Practice the BLS scope of practice with frequent skills and scenario training.",
  },
  {
    icon: IconSchool,
    title: "Connection with IU School of Medicine",
    description: "Network at the IU Interprofessional Simulation Center.",
  },
  {
    icon: IconTrophy,
    title: "Leadership Opportunities",
    description:
      "Roles available in finance, training, public relations, and more.",
  },
  {
    icon: IconBook,
    title: "Expansive Trainings",
    description:
      "Learn from physicians and clinicians across various specialties.",
  },
];

export default function JoinPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-center text-4xl font-bold tracking-tight">
        Join IC-EMS at IU!
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
        Become a member of IC-EMS at IU! Volunteer your time to EMS and
        First-Aid and make an impact on your community.
      </p>

      <Separator className="my-12" />

      {/* Member Benefits */}
      <h2 className="text-2xl font-bold">Member Benefits</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((benefit) => (
          <Card key={benefit.title}>
            <CardHeader>
              <benefit.icon className="h-8 w-8 text-primary" />
              <CardTitle className="mt-2">{benefit.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{benefit.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="my-12" />

      {/* How to Apply */}
      <h2 className="text-2xl font-bold">How to Apply</h2>
      <p className="mt-4 text-muted-foreground">
        Please fill out the application below and join the GroupMe for quicker
        information.
      </p>
      <div className="mt-6 flex flex-wrap gap-4">
        <Button asChild size="lg">
          <Link
            href="https://groupme.com/join_group/108858027/OKfXBYCF"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconUsersGroup className="mr-2 h-5 w-5" />
            Join the GroupMe
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link
            href="https://docs.google.com/forms/d/e/1FAIpQLSfZjatJh_hoJee6hIroYYbYg83lQHfRmsItov7t1YdZCGlXUA/viewform"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconExternalLink className="mr-2 h-5 w-5" />
            Membership Application
          </Link>
        </Button>
      </div>

      <Separator className="my-12" />

      {/* Upcoming Events */}
      <h2 className="text-2xl font-bold">Upcoming Events</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <IconCalendarEvent className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Callout Meetings</CardTitle>
                <Badge variant="secondary" className="mt-1">
                  Fall 2025 TBA
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <IconHeartbeat className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>BLS / First Aid Class</CardTitle>
                <Badge variant="secondary" className="mt-1">
                  TBA — Join GroupMe for info
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      <Separator className="my-12" />

      {/* Membership Dues */}
      <h2 className="text-2xl font-bold">Membership Dues</h2>
      <Card className="mt-6">
        <CardContent className="flex items-center gap-4 pt-6">
          <IconCurrencyDollar className="h-8 w-8 shrink-0 text-primary" />
          <div>
            <p className="text-muted-foreground">
              Payments for dues and certification classes can be made via Venmo:
            </p>
            <Button asChild variant="link" className="mt-1 h-auto p-0">
              <Link
                href="https://account.venmo.com/u/iu-icems"
                target="_blank"
                rel="noopener noreferrer"
              >
                @iu-icems
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

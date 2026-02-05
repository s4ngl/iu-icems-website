import type { Metadata } from "next";
import Link from "next/link";
import {
  IconHeartbeat,
  IconAmbulance,
  IconCertificate,
  IconUsers,
  IconBike,
  IconBallFootball,
  IconMusic,
  IconRun,
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
  title: "IC-EMS at IU",
  description:
    "Intra-Collegiate Emergency Medical Service at Indiana University — providing emergency medical care to the IU community.",
};

const highlights = [
  {
    icon: IconHeartbeat,
    title: "Patient Care",
    description:
      "Certified EMT-basics and first aid personnel passionate about patient care.",
  },
  {
    icon: IconAmbulance,
    title: "State-Certified Agency",
    description:
      "A state-certified, non-profit, BLS non-transport EMS agency.",
  },
  {
    icon: IconCertificate,
    title: "AHA Certifications",
    description:
      "CPR and First Aid American Heart Association Certification classes for members and the public.",
  },
  {
    icon: IconUsers,
    title: "Open to All",
    description:
      "No certifications are required to join — we train our members.",
  },
];

const events = [
  {
    icon: IconBike,
    title: "Little 500",
    description:
      "Providing emergency medical coverage for the iconic Little 500 bicycle races.",
  },
  {
    icon: IconBallFootball,
    title: "IU Athletics",
    description:
      "Standby EMS support at IU Athletics events including football, basketball, and hockey.",
  },
  {
    icon: IconMusic,
    title: "First Thursdays",
    description:
      "Medical coverage for the Bloomington community's First Thursdays events.",
  },
  {
    icon: IconRun,
    title: "IU Dance Marathon",
    description:
      "Supporting the IU Dance Marathon, a fundraiser for Riley Children's Hospital.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-primary/5 py-20 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <Badge variant="secondary" className="mb-4">
            Student-Run EMS
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            IC-EMS at IU
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Intra-Collegiate Emergency Medical Service at Indiana University
          </p>
          <p className="mt-4 text-muted-foreground">
            Educating and providing emergency medical care to the Indiana
            University community since day one.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/join">Join IC-EMS</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      <Separator />

      {/* Mission */}
      <section className="mx-auto max-w-4xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold">Our Mission</h2>
        <p className="mt-6 text-muted-foreground">
          IC-EMS is a student organization comprised of certified EMT-basics and
          first aid personnel, all passionate about patient care. IC-EMS is also
          a state-certified, non-profit, BLS non-transport agency. The mission
          of IC-EMS is to educate and provide emergency medical care to the
          Indiana University community.
        </p>
      </section>

      <Separator />

      {/* What We Do */}
      <section className="bg-muted/40 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-3xl font-bold">What We Do</h2>
          <p className="mx-auto mt-6 max-w-3xl text-center text-muted-foreground">
            IC-EMS is privately hired by university departments, student
            organizations, and community organizations to provide comprehensive
            emergency medical care to event participants. We host CPR and First
            Aid American Heart Association Certification classes for our members
            and the general public, so no certifications are required to join.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item) => (
              <Card key={item.title}>
                <CardHeader>
                  <item.icon className="h-8 w-8 text-primary" />
                  <CardTitle className="mt-2">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* Events We Cover */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold">Events We Cover</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          The organization has a proud tradition of providing emergency medical
          service at major university events.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {events.map((event) => (
            <Card key={event.title}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <event.icon className="h-6 w-6 text-primary" />
                  <CardTitle>{event.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{event.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* CTA */}
      <section className="bg-primary/5 py-16 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-2xl font-bold">Ready to Make a Difference?</h2>
          <p className="mt-4 text-muted-foreground">
            Join IC-EMS and gain hands-on emergency medical experience while
            serving the IU community.
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link href="/join">Apply Now</Link>
          </Button>
        </div>
      </section>
    </>
  );
}

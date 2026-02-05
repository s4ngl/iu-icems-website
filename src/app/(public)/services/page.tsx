import type { Metadata } from "next";
import Link from "next/link";
import {
  IconHeartbeat,
  IconFirstAidKit,
  IconDroplet,
  IconStethoscope,
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
  title: "Training & Services — IC-EMS at IU",
  description:
    "IC-EMS offers BLS, First Aid, and Stop the Bleed certifications along with hands-on simulation training.",
};

const trainings = [
  {
    icon: IconHeartbeat,
    title: "BLS for Healthcare Providers",
    provider: "American Heart Association",
    description:
      "Class covers CPR and AED administration for healthcare providers.",
  },
  {
    icon: IconFirstAidKit,
    title: "Heartsaver First Aid",
    provider: "American Heart Association",
    description:
      "Certifies provider in basic first aid skills such as scene assessment, Narcan administration, bleeding control, etc.",
  },
  {
    icon: IconDroplet,
    title: "Stop the Bleed Provider Certification",
    provider: "American College of Surgeons",
    description:
      "Class created by the American College of Surgeons focused on hemorrhage control and preventing blood loss. Students learn vital skills including proper tourniquet usage, wound packing, and pressure dressings.",
  },
];

export default function ServicesPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-center text-4xl font-bold tracking-tight">
        Training &amp; Services
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
        IC-EMS provides a range of certifications and hands-on training
        opportunities for our members and the general public.
      </p>

      <Separator className="my-12" />

      {/* Offered Trainings */}
      <h2 className="text-2xl font-bold">Offered Trainings</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {trainings.map((training) => (
          <Card key={training.title}>
            <CardHeader>
              <training.icon className="h-8 w-8 text-primary" />
              <CardTitle className="mt-2">{training.title}</CardTitle>
              <Badge variant="secondary" className="w-fit">
                {training.provider}
              </Badge>
            </CardHeader>
            <CardContent>
              <CardDescription>{training.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="my-12" />

      {/* Recent Trainings */}
      <h2 className="text-2xl font-bold">Recent Trainings</h2>
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <IconStethoscope className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Cardiac Arrest Simulation Lab</CardTitle>
              <CardDescription>
                IU Health Bloomington Hospital &middot; Nov. 12, 2024
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            On November 12, Intra-Collegiate Emergency Medical Services (IC-EMS)
            conducted a cardiac arrest response training at the
            Interprofessional Simulation Center at IU Health Bloomington
            Hospital. The training was developed in response to cardiac
            arrest&apos;s status as one of the leading causes of death in the
            United States, affecting approximately 350,000 adults in
            out-of-hospital situations annually. The session focused on providing
            members with comprehensive, hands-on experience in managing cardiac
            arrest scenarios, ensuring they would be well-prepared for real-life
            emergencies. Participants practiced using a LIFEPAK 15, BVM, and
            King airway among other equipment typically used in the field.
          </p>
          <p>
            The training covered basic cardiac arrest response, emphasizing
            initial assessment, proper compression techniques, and ventilation
            management. The scenario required participants to demonstrate quick
            recognition skills, coordinate team roles, and maintain effective
            communication throughout the response process. The simulation
            center&apos;s advanced equipment allowed for realistic practice of
            basic life support skills.
          </p>
          <p>
            Following the scenario, the team conducted thorough debriefing
            sessions to analyze performance. These discussions revealed several
            strengths, including quick arrest recognition and strong basic life
            support skills, while also identifying areas for improvement such as
            maintaining consistent compression depth and proper compression to
            ventilation ratios with advanced airways. This hands-on experience
            strengthened both individual capabilities and team dynamics,
            ultimately better preparing our members for the critical moments when
            they might face a real cardiac arrest situation.
          </p>
        </CardContent>
      </Card>

      <Separator className="my-12" />

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-bold">Interested in Our Training?</h2>
        <p className="mt-4 text-muted-foreground">
          Join IC-EMS to access certifications, simulation labs, and hands-on
          learning experiences.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/join">Get Started</Link>
        </Button>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import {
  IconSchool,
  IconBook2,
  IconMessageCircle2,
  IconStethoscope,
  IconFileText,
  IconExternalLink,
  IconInfoCircle,
} from "@tabler/icons-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Resources | IC-EMS",
  description:
    "Member resources including Canvas course, handbook, GroupMe, and protocol references.",
};

const resourceCards: {
  title: string;
  blurb: string;
  href: string;
  Glyph: typeof IconSchool;
  external: boolean;
}[] = [
  {
    title: "Canvas Course",
    blurb:
      "Access training modules, quizzes, and announcements on the IC-EMS Canvas page.",
    href: siteConfig.canvasUrl,
    Glyph: IconSchool,
    external: true,
  },
  {
    title: "IC-EMS Handbook",
    blurb:
      "Policies, procedures, and expectations for all active members.",
    href: "#",
    Glyph: IconBook2,
    external: true,
  },
  {
    title: "GroupMe",
    blurb:
      "Stay in the loop — shift swaps, meeting reminders, and general chat.",
    href: siteConfig.groupMeUrl,
    Glyph: IconMessageCircle2,
    external: true,
  },
  {
    title: "Protocol Reference",
    blurb:
      "Quick-access EMS protocols and standing orders approved by our medical director.",
    href: "#",
    Glyph: IconStethoscope,
    external: true,
  },
  {
    title: "Forms & Documents",
    blurb:
      "ICS forms, incident reports, and other operational paperwork.",
    href: "#",
    Glyph: IconFileText,
    external: false,
  },
];

export default function ResourcesPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">
          Member Resources
        </h1>
        <p className="mt-1 text-muted-foreground">
          Quick links and reference material for active IC-EMS members.
        </p>
      </header>

      {/* access notice */}
      <Card className="border-dashed">
        <CardContent className="flex items-start gap-3 py-5">
          <IconInfoCircle className="mt-0.5 size-5 shrink-0 text-muted-foreground" stroke={1.5} />
          <p className="text-sm text-muted-foreground">
            These resources are available exclusively to dues-paying members. If
            you cannot access a link, verify your dues status on the{" "}
            <Link href="/profile" className="underline underline-offset-2">
              profile page
            </Link>
            .
          </p>
        </CardContent>
      </Card>

      <Separator />

      {/* resource grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resourceCards.map((rc) => (
          <Card key={rc.title} className="flex flex-col">
            <CardHeader>
              <rc.Glyph className="size-7 text-primary" stroke={1.5} />
              <CardTitle className="mt-1">{rc.title}</CardTitle>
              <CardDescription>{rc.blurb}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={rc.href}
                  {...(rc.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {rc.external ? "Open" : "View"}
                  {rc.external && (
                    <IconExternalLink className="ml-1 size-3.5" stroke={1.5} />
                  )}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = { title: "(supervisor)/assigned-events/[eventId] | IC-EMS" };

export default async function Page({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  return (
    <section className="space-y-4">
      <h1 className="text-xl font-bold">(supervisor)/assigned-events/[eventId]</h1>
      <p className="text-muted-foreground text-sm">
        Viewing eventId: {eventId}
      </p>
      <p className="text-muted-foreground text-sm">
        This page is under construction and will be available soon.
      </p>
    </section>
  );
}

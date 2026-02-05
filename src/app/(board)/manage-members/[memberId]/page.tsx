import type { Metadata } from "next";

export const metadata: Metadata = { title: "(board)/manage-members/[memberId] | IC-EMS" };

export default async function Page({
  params,
}: {
  params: Promise<{ memberId: string }>;
}) {
  const { memberId } = await params;

  return (
    <section className="space-y-4">
      <h1 className="text-xl font-bold">(board)/manage-members/[memberId]</h1>
      <p className="text-muted-foreground text-sm">
        Viewing memberId: {memberId}
      </p>
      <p className="text-muted-foreground text-sm">
        This page is under construction and will be available soon.
      </p>
    </section>
  );
}

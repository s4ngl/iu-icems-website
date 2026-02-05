import type { Metadata } from "next";

export const metadata: Metadata = { title: "(board)/manage-training/[trainingId]/edit | IC-EMS" };

export default async function Page({
  params,
}: {
  params: Promise<{ trainingId: string }>;
}) {
  const { trainingId } = await params;

  return (
    <section className="space-y-4">
      <h1 className="text-xl font-bold">(board)/manage-training/[trainingId]/edit</h1>
      <p className="text-muted-foreground text-sm">
        Viewing trainingId: {trainingId}
      </p>
      <p className="text-muted-foreground text-sm">
        This page is under construction and will be available soon.
      </p>
    </section>
  );
}

import Link from "next/link";
import { IconError404 } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-4 text-center">
      <IconError404 className="size-16 text-muted-foreground" />

      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold tracking-tight">
          Page Not Found
        </h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been
          moved.
        </p>
      </div>

      <Button asChild size="lg">
        <Link href="/">Go Back Home</Link>
      </Button>
    </main>
  );
}

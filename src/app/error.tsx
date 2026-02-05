"use client";

import Link from "next/link";
import { IconAlertTriangle } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const errorDigest = error.digest;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-4 text-center">
      <IconAlertTriangle className="size-16 text-destructive" />

      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold tracking-tight">
          Something went wrong
        </h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          An unexpected error occurred. Please try again or return to the
          home page.
        </p>
        {errorDigest && (
          <p className="text-xs text-muted-foreground/60">
            Reference: {errorDigest}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button size="lg" onClick={reset}>
          Try Again
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </main>
  );
}

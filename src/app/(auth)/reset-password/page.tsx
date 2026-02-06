"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconLock, IconArrowLeft } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setIsLoading(false);
    } else {
      router.push("/login?message=Password updated successfully");
    }
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <IconArrowLeft className="size-3.5" />
        Back to login
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Reset Password</CardTitle>
          <CardDescription>
            Choose a new password for your IC-EMS account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field>
              <FieldLabel>New password</FieldLabel>
              <FieldGroup>
                <IconLock className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  name="password"
                  placeholder="Enter new password"
                  className="pl-8"
                  required
                />
              </FieldGroup>
            </Field>

            <Field>
              <FieldLabel>Confirm new password</FieldLabel>
              <FieldGroup>
                <IconLock className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter new password"
                  className="pl-8"
                  required
                />
              </FieldGroup>
            </Field>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <Link
            href="/login"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Return to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

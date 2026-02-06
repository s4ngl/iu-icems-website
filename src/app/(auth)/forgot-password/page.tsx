"use client";

import Link from "next/link";
import { useState } from "react";
import { IconMail, IconArrowLeft } from "@tabler/icons-react";

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
import { useAuth } from "@/hooks/use-auth";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    const result = await resetPassword(email);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
    setIsLoading(false);
  }

  if (success) {
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
            <CardTitle className="text-lg">Check Your Email</CardTitle>
            <CardDescription>
              If an account exists with that email, we&apos;ve sent a password
              reset link. Please check your inbox.
            </CardDescription>
          </CardHeader>
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
          <CardTitle className="text-lg">Forgot Password?</CardTitle>
          <CardDescription>
            Enter your email and we will send you a link to reset your password.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field>
              <FieldLabel>Email address</FieldLabel>
              <FieldGroup>
                <IconMail className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  name="email"
                  placeholder="you@iu.edu"
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
              {isLoading ? "Sending..." : "Send Reset Link"}
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

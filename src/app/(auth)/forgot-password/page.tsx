import type { Metadata } from "next";
import Link from "next/link";
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

export const metadata: Metadata = {
  title: "Forgot Password | IC-EMS",
};

export default function ForgotPasswordPage() {
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
            Enter your email and we will send you a link to reset your
            password.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="flex flex-col gap-4">
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

            <Button type="submit" size="lg" className="w-full">
              Send Reset Link
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

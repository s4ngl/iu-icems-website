import type { Metadata } from "next";
import Link from "next/link";
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

export const metadata: Metadata = {
  title: "Reset Password | IC-EMS",
};

export default function ResetPasswordPage() {
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
          <form className="flex flex-col gap-4">
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

            <Button type="submit" size="lg" className="w-full">
              Reset Password
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

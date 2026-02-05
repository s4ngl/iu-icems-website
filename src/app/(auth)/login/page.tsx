import type { Metadata } from "next";
import Link from "next/link";
import {
  IconMail,
  IconLock,
  IconArrowLeft,
} from "@tabler/icons-react";

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
import {
  Field,
  FieldLabel,
  FieldGroup,
} from "@/components/ui/field";

export const metadata: Metadata = {
  title: "Login | IC-EMS",
};

export default function LoginPage() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <IconArrowLeft className="size-3.5" />
        Back to home
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your IC-EMS account
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

            <Field>
              <FieldLabel>Password</FieldLabel>
              <FieldGroup>
                <IconLock className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="pl-8"
                  required
                />
              </FieldGroup>
            </Field>

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Forgot your password?
              </Link>
            </div>

            <Button type="submit" size="lg" className="w-full">
              Sign In
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-foreground hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

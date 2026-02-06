"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  IconMail,
  IconLock,
  IconUser,
  IconPhone,
  IconArrowLeft,
  IconBrandGoogle,
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
  FieldDescription,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";

const classYearOptions = [
  "Freshman",
  "Sophomore",
  "Junior",
  "Senior",
  "Other",
] as const;

const pronounOptions = ["He/Him", "She/Her", "They/Them", "Other"] as const;

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phone = formData.get("phone") as string;
    const classYear = formData.get("classYear") as string;
    const pronouns = formData.get("pronouns") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (!email.endsWith("@iu.edu")) {
      setError("Only @iu.edu email addresses are allowed");
      setIsLoading(false);
      return;
    }

    const classYearMap: Record<string, number> = {
      freshman: 0,
      sophomore: 1,
      junior: 2,
      senior: 3,
      other: 4,
    };

    const pronounsMap: Record<string, number> = {
      "he/him": 0,
      "she/her": 1,
      "they/them": 2,
      other: 2,
    };

    const result = await signUp({
      email,
      password,
      firstName,
      lastName,
      phone,
      classYear: classYearMap[classYear] ?? undefined,
      pronouns: pronounsMap[pronouns] ?? undefined,
    });

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.push("/login?message=Registration successful. Please check your email.");
    }
  }

  return (
    <div className="flex w-full max-w-lg flex-col gap-4">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <IconArrowLeft className="size-3.5" />
        Back to home
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Create Account</CardTitle>
          <CardDescription>
            Join IC-EMS at Indiana University
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => signInWithGoogle()}
            >
              <IconBrandGoogle className="size-4" />
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or register with email
                </span>
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>First name</FieldLabel>
                  <FieldGroup>
                    <IconUser className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      name="firstName"
                      placeholder="Jane"
                      className="pl-8"
                      required
                    />
                  </FieldGroup>
                </Field>

                <Field>
                  <FieldLabel>Last name</FieldLabel>
                  <FieldGroup>
                    <IconUser className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      className="pl-8"
                      required
                    />
                  </FieldGroup>
                </Field>
              </div>

              <Field>
                <FieldLabel>IU Email</FieldLabel>
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
                <FieldDescription>
                  Use your @iu.edu email address
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel>Phone number</FieldLabel>
                <FieldGroup>
                  <IconPhone className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="(555) 123-4567"
                    className="pl-8"
                    required
                  />
                </FieldGroup>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Class year</FieldLabel>
                  <Select name="classYear">
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {classYearOptions.map((yr) => (
                          <SelectItem key={yr} value={yr.toLowerCase()}>
                            {yr}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>Pronouns</FieldLabel>
                  <Select name="pronouns">
                    <SelectTrigger>
                      <SelectValue placeholder="Select pronouns" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {pronounOptions.map((p) => (
                          <SelectItem key={p} value={p.toLowerCase()}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <Field>
                <FieldLabel>Password</FieldLabel>
                <FieldGroup>
                  <IconLock className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    className="pl-8"
                    required
                  />
                </FieldGroup>
              </Field>

              <Field>
                <FieldLabel>Confirm password</FieldLabel>
                <FieldGroup>
                  <IconLock className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="Re-enter your password"
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
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </div>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

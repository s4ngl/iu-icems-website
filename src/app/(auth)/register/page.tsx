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
  IconEye,
  IconEyeOff,
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

function validatePassword(password: string): string[] {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }
  
  return errors;
}

function validatePhoneNumber(phone: string): boolean {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  // Check if it's a valid US phone number (10 digits)
  return digits.length === 10;
}

function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPasswordErrors([]);
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

    // Validate password
    const pwdErrors = validatePassword(password);
    if (pwdErrors.length > 0) {
      setPasswordErrors(pwdErrors);
      setIsLoading(false);
      return;
    }

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

    // Validate phone number
    if (!validatePhoneNumber(phone)) {
      setError("Please enter a valid 10-digit US phone number");
      setIsLoading(false);
      return;
    }

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

            {passwordErrors.length > 0 && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                <p className="font-medium mb-1">Password requirements:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  {passwordErrors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>
                    First name <span className="text-destructive">*</span>
                  </FieldLabel>
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
                  <FieldLabel>
                    Last name <span className="text-destructive">*</span>
                  </FieldLabel>
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
                <FieldLabel>
                  IU Email <span className="text-destructive">*</span>
                </FieldLabel>
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
                <FieldLabel>
                  Phone number <span className="text-destructive">*</span>
                </FieldLabel>
                <FieldGroup>
                  <IconPhone className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="(555) 123-4567"
                    className="pl-8"
                    required
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value);
                      e.target.value = formatted;
                    }}
                    maxLength={14}
                  />
                </FieldGroup>
                <FieldDescription>
                  Enter a valid 10-digit US phone number
                </FieldDescription>
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
                <FieldLabel>
                  Password <span className="text-destructive">*</span>
                </FieldLabel>
                <FieldGroup>
                  <IconLock className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    className="pl-8 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <IconEyeOff className="size-3.5" />
                    ) : (
                      <IconEye className="size-3.5" />
                    )}
                  </button>
                </FieldGroup>
                <FieldDescription>
                  Minimum 8 characters with uppercase, lowercase, number, and special character
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel>
                  Confirm password <span className="text-destructive">*</span>
                </FieldLabel>
                <FieldGroup>
                  <IconLock className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    className="pl-8 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <IconEyeOff className="size-3.5" />
                    ) : (
                      <IconEye className="size-3.5" />
                    )}
                  </button>
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

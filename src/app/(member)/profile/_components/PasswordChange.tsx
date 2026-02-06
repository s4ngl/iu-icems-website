"use client";

import { useState } from "react";
import {
  IconLock,
  IconCheck,
  IconX,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidPassword } from "@/lib/validation/validators";
import { cn } from "@/lib/utils/cn";

export default function PasswordChange() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { valid, requirements } = isValidPassword(newPassword);
  const passwordsMatch =
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;
  const canSubmit =
    currentPassword.length > 0 && valid && passwordsMatch;

  const requirementLabels: { key: keyof typeof requirements; label: string }[] =
    [
      { key: "minLength", label: "At least 8 characters" },
      { key: "uppercase", label: "One uppercase letter" },
      { key: "lowercase", label: "One lowercase letter" },
      { key: "number", label: "One number" },
      { key: "specialChar", label: "One special character" },
    ];

  const metCount = Object.values(requirements).filter(Boolean).length;
  function strengthLabel() {
    if (newPassword.length === 0) return null;
    if (metCount <= 2) return { text: "Weak", color: "bg-red-500" };
    if (metCount <= 4) return { text: "Fair", color: "bg-amber-500" };
    return { text: "Strong", color: "bg-green-500" };
  }

  const strength = strengthLabel();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="inline-flex items-center gap-2">
          <IconLock className="size-5" stroke={1.5} />
          Change Password
        </CardTitle>
        <CardDescription>
          Update the password used to sign in to the member portal.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex max-w-md flex-col gap-4">
          {/* Current password */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Current Password</span>
            <div className="relative">
              <Input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-2 flex items-center text-muted-foreground"
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? (
                  <IconEyeOff className="size-4" stroke={1.5} />
                ) : (
                  <IconEye className="size-4" stroke={1.5} />
                )}
              </button>
            </div>
          </label>

          {/* New password */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">New Password</span>
            <div className="relative">
              <Input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-2 flex items-center text-muted-foreground"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? (
                  <IconEyeOff className="size-4" stroke={1.5} />
                ) : (
                  <IconEye className="size-4" stroke={1.5} />
                )}
              </button>
            </div>
          </label>

          {/* Strength indicator */}
          {strength && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      strength.color
                    )}
                    style={{ width: `${(metCount / 5) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium">{strength.text}</span>
              </div>

              {/* Requirements checklist */}
              <ul className="space-y-0.5">
                {requirementLabels.map(({ key, label }) => {
                  const met = requirements[key];
                  return (
                    <li
                      key={key}
                      className={cn(
                        "flex items-center gap-1.5 text-xs",
                        met ? "text-green-600" : "text-muted-foreground"
                      )}
                    >
                      {met ? (
                        <IconCheck className="size-3" stroke={2} />
                      ) : (
                        <IconX className="size-3" stroke={2} />
                      )}
                      {label}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Confirm password */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Confirm New Password</span>
            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-2 flex items-center text-muted-foreground"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? (
                  <IconEyeOff className="size-4" stroke={1.5} />
                ) : (
                  <IconEye className="size-4" stroke={1.5} />
                )}
              </button>
            </div>
            {confirmPassword.length > 0 && !passwordsMatch && (
              <span className="text-xs text-destructive">
                Passwords do not match.
              </span>
            )}
          </label>
        </div>
      </CardContent>

      <CardFooter>
        <Button variant="outline" disabled={!canSubmit}>
          Update Password
        </Button>
      </CardFooter>
    </Card>
  );
}
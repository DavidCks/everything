"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SignupFormController,
  OnSignupCallbackType,
} from "./signup-form-controller";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import { ErrorCard } from "./error-card";
import { SuccessCard } from "./success-card";

export function SignupForm({
  className,
  onSignup,
  ...props
}: React.ComponentProps<"div"> & {
  onSignup: OnSignupCallbackType;
}) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Sign up for an account</CardTitle>
          <CardDescription>
            Enter your email below to sign up for an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setIsLoading(true);
              const formData = new FormData(e.currentTarget);
              const result = await SignupFormController.hanldeSubmit(
                formData,
                onSignup
              );
              if (result.error) {
                setErrorMessage(
                  `${result.error.message} (${result.error.code})`
                );
                setSuccessMessage(null);
              } else if (result.value.redirectTo) {
                await router.push(result.value.redirectTo);
              } else {
                setSuccessMessage(result.value.message);
                setErrorMessage(null);
              }
              setIsLoading(false);
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Input id="password" name="password" type="password" required />
              </div>
              {errorMessage && <ErrorCard>{errorMessage}</ErrorCard>}
              {successMessage && <SuccessCard> {successMessage}</SuccessCard>}
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  <span className="flex items-baseline">
                    Sign up{" "}
                    {isLoading && (
                      <FaSpinner className="ml-2 animate-spin inline" />
                    )}
                  </span>
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

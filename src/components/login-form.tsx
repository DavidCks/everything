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
  LoginFormController,
  OnLoginCallbackType,
} from "./login-form-controller";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import { ErrorCard } from "./error-card";
import { SuccessCard } from "./success-card";
import { toast } from "./toast";
import Link from "next/link";
import { useEffect, useState } from "react";

export function LoginForm({
  className,
  onLogin,
  defaultEmail,
  ...props
}: React.ComponentProps<"div"> & {
  onLogin: OnLoginCallbackType;
  defaultEmail?: string;
}) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [email, setEmail] = useState(defaultEmail ?? "");
  useEffect(() => {
    if (!email && defaultEmail) {
      setEmail(defaultEmail);
    }
  }, [defaultEmail]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setIsLoading(true);
              const formData = new FormData(e.currentTarget);
              const result = await LoginFormController.hanldeSubmit(
                formData,
                onLogin
              );
              if (result.error) {
                setErrorMessage(
                  `${result.error.message} (${result.error.code})`
                );
                setSuccessMessage(null);
              } else {
                setSuccessMessage(result.value.message);
                setErrorMessage(null);
                if (result.value.redirectTo) {
                  toast.success(
                    <>
                      Redirecting to
                      <Link href={result.value.redirectTo!}>
                        {` ${result.value.redirectTo}`}
                      </Link>
                    </>
                  );
                  await router.push(result.value.redirectTo);
                }
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
                  value={email}
                  onChange={(v) => setEmail(v.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
              {errorMessage && <ErrorCard>{errorMessage}</ErrorCard>}
              {successMessage && <SuccessCard> {successMessage}</SuccessCard>}
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  <span className="flex items-baseline">
                    Login{" "}
                    {isLoading && (
                      <FaSpinner className="ml-2 animate-spin inline" />
                    )}
                  </span>
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

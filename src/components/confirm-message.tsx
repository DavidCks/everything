"use client";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import {
  OnLoadCallbackType,
  ConfirmMessageController,
} from "./confirm-message-controller";
import { toast } from "./toast";
import Link from "next/link";
import { ErrorCard } from "./error-card";
import { SuccessCard } from "./success-card";
import { WarningCard } from "./warning-card";

export function ConfirmMessage({
  className,
  onLoad,
  title,
  type = "success",
  ...props
}: React.ComponentProps<"div"> & {
  title: ReactNode;
  type?: "success" | "warning";
  onLoad: OnLoadCallbackType;
}) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    ConfirmMessageController.handleLoad(onLoad).then((result) => {
      if (result.error) {
        setErrorMessage(`${result.error.message} (${result.error.code})`);
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

          router.push(result.value.redirectTo!);
        }
      }
      setIsLoading(false);
    });
  }, []);

  return (
    <div
      className={cn("flex flex-col gap-6 min-w-xs max-w-screen", className)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-baseline">
            {title}{" "}
            {isLoading && <FaSpinner className="animate-spin inline mx-2" />}
          </CardTitle>
        </CardHeader>
        <CardContent
          className={"transition-all flex items-center justify-center"}
          style={{
            height: isLoading ? "12px" : "96px",
            opacity: isLoading ? 0 : 1,
          }}
        >
          <div className="flex flex-col gap-4">
            {errorMessage && <ErrorCard> {errorMessage}</ErrorCard>}
            {successMessage && type === "success" ? (
              <SuccessCard>{successMessage}</SuccessCard>
            ) : (
              <WarningCard>{successMessage}</WarningCard>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

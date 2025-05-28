"use client";
import { ComponentProps, ReactNode } from "react";
import { Supabase } from "../__supabase__/supabase";
import { cn } from "../utils";
import { ConfirmMessage } from "@/components/confirm-message";

/**
 * ConfirmPage component is responsible for handling email confirmation redirects from Supabase.
 *
 * It calls `SB.confirmSignUp()` when the component loads (via `onLoad`) and displays a confirmation message.
 * This page should be the target of the `emailRedirectTo` option passed to `Supabase.signUp()` or as the
 * redirectTo url for the <SignupPage /> component.
 *
 * If this component is implemented under `/confirm`, the SignupPage component should look like this:
 * ```tsx
 * <SignupPage SB={SB} redirectTo="/confirm" />
 * ```
 *
 * @component
 *
 * @param {Object} props - The props object.
 * @param {typeof Supabase} props.SB - Your Supabase wrapper instance used to complete email confirmation via token.
 * @param {string} [props.className] - Optional class to apply to the page container.
 * @param {ReactNode} [props.header] - Optional element to display above the confirmation message.
 * @param {ReactNode} [props.footer] - Optional element to display below the confirmation message.
 * @param {ComponentProps<"div">} [props] - Any additional props passed to the root `<div>`.
 *
 * @returns {JSX.Element} A confirmation page that finalizes sign-up and optionally redirects on success.
 *
 * @example
 * ```tsx
 * <ConfirmPage
 *   SB={Supabase}
 *   header={<Logo />}
 *   footer={<Footer />}
 * />
 * ```
 */
export default function ConfirmPage({
  SB,
  redirectTo,
  header,
  footer,
  className,
  ...props
}: ComponentProps<"div"> & {
  SB: typeof Supabase;
  redirectTo: string;
  className?: string;
  header?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <>
      {header}
      <div
        className={cn(
          "flex min-h-svh w-full items-center justify-center p-6 md:p-10",
          className
        )}
        {...props}
      >
        <div className="w-full max-w-sm">
          <ConfirmMessage
            title="Confirming account"
            onLoad={async () => {
              const result = await SB.confirmSignUp();
              if (result.error) {
                return {
                  value: null,
                  error: {
                    message: result.error.message,
                    code: result.error.code,
                  },
                };
              } else {
                return {
                  value: {
                    message: `Your account has been confirmed successfully. \nredirecting to ${redirectTo}...`,
                    redirectTo: redirectTo,
                  },
                  error: null,
                };
              }
            }}
          />
        </div>
      </div>
      {footer}
    </>
  );
}

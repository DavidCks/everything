"use client";
import { ComponentProps, ReactNode } from "react";
import { Supabase } from "../__supabase__/supabase";
import { cn } from "../utils";
import { SignupForm } from "@/components/signup-form";

/**
 * SignupPage component provides a styled signup interface using the `SignupForm` component.
 *
 * It handles user registration with Supabase and optionally includes custom header and footer elements.
 * A redirect URL is passed to Supabase for email confirmation links.
 *
 * If `redirectTo` starts with "http", it will be used as the redirect URL for email confirmation links.
 * Otherwise, it will be handled as a relative path.
 *
 * ⚠️ The route for this component **must be** `/signup`
 *
 * @component
 *
 * @param {Object} props - The props object.
 * @param {typeof Supabase} props.SB - A reference to your Supabase wrapper used for performing signup logic.
 * @param {string} props.redirectTo - The path or full URL to redirect to after email confirmation.
 * @param {string} [props.className] - Optional class to apply to the main container for layout styling.
 * @param {ReactNode} [props.header] - Optional React element displayed above the form (e.g. logo or heading).
 * @param {ReactNode} [props.footer] - Optional React element displayed below the form (e.g. legal links).
 * @param {ComponentProps<"div">} [props] - Additional valid props for the wrapping `<div>` (e.g. `id`, `style`).
 *
 * @returns {JSX.Element} A styled signup page with optional header/footer and integrated Supabase signup logic.
 *
 * @example
 * ```tsx
 * <SignupPage
 *   SB={Supabase}
 *   redirectTo="/confirm"
 *   header={<Logo />}
 *   footer={<Footer />}
 * />
 * ```
 */

export default function SignupPage({
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
          <SignupForm
            onSignup={async (email: string, password: string) => {
              console.log("Sign up attempt", { email, password });
              let url: URL;
              if (redirectTo.startsWith("http")) {
                url = new URL(redirectTo);
              } else {
                url = new URL(window.location.href);
                url.pathname = redirectTo;
              }
              const redirectUrl = url.toString();
              const result = await SB.signUp(email, password, redirectUrl);
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
                    message: "Check your email for the magic link",
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

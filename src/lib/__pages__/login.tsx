"use client";
import { LoginForm } from "@/components/login-form";
import { ComponentProps, ReactNode } from "react";
import { Supabase } from "../__supabase__/supabase";
import { cn } from "../utils";
import useUrlParameter from "../__hooks__/useUrlParameter";

/**
 * LoginPage component provides a styled login interface that wraps the `LoginForm` component.
 *
 * It accepts a Supabase instance for authentication and optional layout elements like a header and footer.
 * Upon successful login, it returns a success message and triggers redirection logic.
 *
 * This component is intended to be used as a standalone login page in a Next.js (App Router) application.
 *
 * ⚠️ The route for this component **must be** `/login`
 *
 * @component
 *
 * @param {Object} props - The props object.
 * @param {typeof Supabase} props.SB - An instance of your custom Supabase wrapper used to perform sign-in logic.
 * @param {string} props.redirectTo - URL path to redirect to after a successful login.
 * @param {string} [props.className] - Optional className to apply to the outer container for layout customization.
 * @param {ReactNode} [props.header] - Optional element to render above the login form (e.g. logo or title).
 * @param {ReactNode} [props.footer] - Optional element to render below the login form (e.g. legal links or copyright).
 * @param {ComponentProps<"div">} [props] - All other valid `div` props (e.g. `id`, `style`, etc.) are passed through.
 *
 * @returns {JSX.Element} A fully styled login page with header, login form, and footer sections.
 *
 * @example
 * ```tsx
 * <LoginPage
 *   SB={Supabase}
 *   redirectTo="/dashboard"
 *   header={<Logo />}
 *   footer={<Footer />}
 * />
 * ```
 */
export default function LoginPage({
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
  const defaultEmail = useUrlParameter("email");

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
          <LoginForm
            defaultEmail={defaultEmail}
            onLogin={async (email: string, password: string) => {
              console.log("Login attempt", { email, password });
              const result = await SB.signIn(email, password);
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
                    message: "Login successful",
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

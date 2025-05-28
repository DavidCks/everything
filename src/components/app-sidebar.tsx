"use client";
import { Icon, IconInnerShadowTop } from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ReactNode, useState } from "react";
import { Supabase } from "@/lib/__supabase__/supabase";
import { usePathname } from "next/navigation";
import { useAuthEffect } from "@/lib/__supabase__/__hooks__/useAuthEffect";
import Link from "next/link";

export type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  SB: typeof Supabase;
  navMain: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
  navSecondary?: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
  documents?: {
    name: string;
    url: string;
    icon?: Icon;
  }[];
  loginUrl: string;
  title: ReactNode;
};

export function AppSidebar({
  SB,
  navMain,
  navSecondary,
  documents,
  loginUrl,
  title,
  ...props
}: AppSidebarProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | number | null>(null);
  const pathname = usePathname();
  const [user, setUser] = useState<{
    email: string;
  } | null>(null);

  useAuthEffect((event, session) => {
    if (
      (event === "SIGNED_IN" && user?.email !== session?.user.email) ||
      (event === "INITIAL_SESSION" && session === null)
    ) {
      // Get the current user from Supabase
      SB.getCurrentUser().then((user) => {
        if (user.error) {
          setErrorMessage(user.error.message);
          setErrorCode(user.error.code);
        } else {
          setUser({
            email: user.value.email!,
          });
        }
      });
    }
  });

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">{title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} activeUrl={pathname} />
        {documents && <NavDocuments items={documents} />}
        {navSecondary && (
          <NavSecondary items={navSecondary} className="mt-auto" />
        )}
      </SidebarContent>
      <SidebarFooter>
        {user ? (
          <NavUser SB={SB} user={user} loginUrl={loginUrl} />
        ) : errorMessage ? (
          errorCode === 400 ? (
            <Link href={loginUrl}>Login</Link>
          ) : (
            <>{errorMessage}</>
          )
        ) : null}
      </SidebarFooter>
    </Sidebar>
  );
}

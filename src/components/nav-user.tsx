"use client";

import { IconDotsVertical } from "@tabler/icons-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Supabase } from "@/lib/__supabase__/supabase";

import { useRouter } from "next/navigation";
import { Plus, RefreshCcw } from "lucide-react";

export function NavUser({
  user,
  SB,
  loginUrl,
}: {
  user: {
    email: string;
  };
  SB: typeof Supabase;
  loginUrl: string;
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarFallback className="rounded-lg">
                  {user.email.at(0)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    {user.email.at(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuGroup> */}
            {/* <DropdownMenuItem>
                <IconUserCircle />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconCreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconNotification />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup> */}
            {SB.storedSessions.value &&
              SB.storedSessions.value
                .filter(
                  (storedSessionData) => storedSessionData.email !== user.email
                )
                .map((storedSessionData) => (
                  <DropdownMenuItem
                    key={storedSessionData.email}
                    onClick={() =>
                      SB.restoreSession(storedSessionData.email).then((res) => {
                        if (res.error) {
                          let url: URL;
                          if (
                            loginUrl.startsWith("http://") ||
                            loginUrl.startsWith("https://")
                          ) {
                            url = new URL(loginUrl); // Absolute
                          } else {
                            url = new URL(loginUrl, window.location.origin); // Relative
                          }
                          url.searchParams.set(
                            "email",
                            storedSessionData.email
                          );
                          const urlString = url.toString();
                          router.push(urlString);
                        }
                      })
                    }
                  >
                    <div className="flex items-center gap-2 py-1.5 text-left text-sm">
                      <RefreshCcw />
                      <Avatar className="h-8 w-8<RefreshCcw /> rounded-lg">
                        <AvatarFallback className="rounded-lg">
                          {storedSessionData.email.at(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="text-muted-foreground truncate text-xs">
                          {storedSessionData.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
            <DropdownMenuItem onClick={() => router.push(loginUrl)}>
              <Plus /> Add account
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                SB.signOut().then(() => {
                  router.push(loginUrl);
                })
              }
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

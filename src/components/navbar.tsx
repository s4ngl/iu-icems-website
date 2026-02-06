"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IconMenu2, IconX, IconLogout } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { publicNav, memberNav, boardNav, supervisorNav } from "@/config/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, member, isLoading, signOut } = useAuth();

  // Get user initials from member data
  const getInitials = () => {
    if (member?.first_name && member?.last_name) {
      return `${member.first_name[0]}${member.last_name[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  // Get role-based navigation items
  const getRoleNavItems = () => {
    if (!member) return [];
    
    const items = [...memberNav];
    
    // Add supervisor items if role is supervisor or higher
    if (member.position_web !== null && member.position_web <= 2) { // 0=Admin, 1=Board, 2=Supervisor
      items.push(...supervisorNav);
    }
    
    // Add board items if role is board or admin
    if (member.position_web !== null && member.position_web <= 1) { // 0=Admin, 1=Board
      items.push(...boardNav);
    }
    
    return items;
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const roleNavItems = getRoleNavItems();

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        {/* Brand */}
        <Link href="/" className="text-lg font-bold">
          IC-EMS
        </Link>

        {/* Desktop nav - always show public nav items */}
        <ul className="hidden items-center gap-1 md:flex">
          {publicNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {/* Show login button or profile dropdown */}
          {!isLoading && (
            <>
              {user && member ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary">
                      <Avatar size="default">
                        <AvatarFallback>{getInitials()}</AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {member.first_name} {member.last_name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {roleNavItems.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link href={item.href} className="cursor-pointer">
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                      <IconLogout className="mr-2 size-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild variant="outline" size="sm">
                  <Link href="/login">Login</Link>
                </Button>
              )}
            </>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <IconX size={22} /> : <IconMenu2 size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="border-t border-border px-4 pb-4 md:hidden">
          <ul>
            {publicNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {user && member && (
              <>
                <li className="my-2 border-t border-border" />
                {roleNavItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                        pathname === item.href
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li className="my-2 border-t border-border" />
                <li>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <IconLogout className="size-4" />
                    Sign out
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}

"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CurrentUserAvatar } from "@/components/current-user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function UserMenu({ hideWaitlist }: { hideWaitlist: boolean }) {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: any) => {
      setUser(data?.user);
    });
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (!user) {
    if (!hideWaitlist) return null;
    return (
      <div className="flex shrink-0 gap-2">
        <Link href="/sign-in">
          <Button variant="outline" size="sm" className="sm:h-9 sm:px-4">
            Sign In
          </Button>
        </Link>
        <Link href="/sign-up">
          <Button
            size="sm"
            className="bg-purple-600 text-white hover:bg-purple-700 sm:h-9 sm:px-4"
          >
            Get Started
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="rounded-full outline-none ring-offset-background transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Open user menu"
        >
          <CurrentUserAvatar />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <User className="mr-2 h-4 w-4" /> Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

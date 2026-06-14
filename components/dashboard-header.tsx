"use client";
import { useEffect, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserMenu } from "@/components/user-menu";
import { cn } from "@/lib/utils";

// Sticky top bar that hides when scrolling down and reappears instantly on
// scroll up, so the sidebar trigger and user menu stay reachable without
// permanently eating vertical space (important on mobile).
export function DashboardHeader({ hideWaitlist }: { hideWaitlist: boolean }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      // Ignore tiny jitters and rubber-band scrolling near the top.
      if (Math.abs(y - last) < 6) return;
      setHidden(y > last && y > 56);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex items-center justify-between gap-2 border-b bg-background/80 px-2 py-2 backdrop-blur transition-transform duration-200 sm:px-3",
        hidden && "-translate-y-full"
      )}
    >
      <SidebarTrigger />
      <UserMenu hideWaitlist={hideWaitlist} />
    </header>
  );
}

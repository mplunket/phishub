"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Guitar } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserMenu } from "@/components/user-menu";
import { cn } from "@/lib/utils";

// Sticky top bar that hides when scrolling down and reappears instantly on
// scroll up, so the sidebar trigger and user menu stay reachable without
// permanently eating vertical space (important on mobile).
export function DashboardHeader({ hideWaitlist }: { hideWaitlist: boolean }) {
  const headerRef = useRef<HTMLElement>(null);
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

  // Publish the header's current bottom edge as a CSS variable so secondary
  // sticky bars (e.g. the tab controls) can dock just beneath it instead of
  // being covered when the header re-appears on scroll-up. The value drops to
  // 0 while the header is hidden so those bars can rise to the very top.
  useEffect(() => {
    const root = document.documentElement;
    const height = headerRef.current?.offsetHeight ?? 0;
    root.style.setProperty("--app-header-offset", hidden ? "0px" : `${height}px`);
  }, [hidden]);

  useEffect(() => {
    const root = document.documentElement;
    return () => {
      root.style.removeProperty("--app-header-offset");
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-30 flex items-center justify-between gap-2 border-b bg-background/80 px-2 py-2 backdrop-blur transition-transform duration-200 sm:px-3",
        hidden && "-translate-y-full"
      )}
    >
      <div className="flex min-w-0 items-center gap-1">
        <SidebarTrigger />
        {/* Wordmark truncates (min-w-0) so it yields space to the auth buttons
            on narrow screens instead of pushing them off-screen. */}
        <Link
          href="/"
          aria-label="Phishub home"
          className="flex min-w-0 items-center"
        >
          <Guitar className="h-6 w-6 shrink-0 text-purple-600" />
          <span className="ml-1.5 truncate bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-xl font-bold text-transparent">
            Phishub
          </span>
        </Link>
      </div>
      <UserMenu hideWaitlist={hideWaitlist} />
    </header>
  );
}

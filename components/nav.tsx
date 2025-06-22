import Link from "next/link";
import { ThemeSwitcher } from "./theme-switcher";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/client";

export function Navigation() {
  const supabase = createClient();

  return (
    <nav className="w-full border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo and site name */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold">
                Phishub
              </Link>
            </div>
            {/* Main navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/songs"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Songs
              </Link>
              <Link
                href="/tabs"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Tabs
              </Link>
              <Link
                href="/setlists"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Setlists
              </Link>
            </div>
          </div>

          {/* Right side navigation */}
          <div className="flex items-center">
            <form action="/search" className="hidden sm:block mr-4">
              <input
                type="search"
                name="q"
                placeholder="Search songs, tabs..."
                className="w-64 px-4 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </form>
            <ThemeSwitcher />
            <div className="ml-4">
              <form action="/auth/sign-out" method="post">
                <Button variant="ghost">Sign out</Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="/songs"
            className="block pl-3 pr-4 py-2 text-base font-medium"
          >
            Songs
          </Link>
          <Link
            href="/tabs"
            className="block pl-3 pr-4 py-2 text-base font-medium"
          >
            Tabs
          </Link>
          <Link
            href="/setlists"
            className="block pl-3 pr-4 py-2 text-base font-medium"
          >
            Setlists
          </Link>
        </div>
      </div>
    </nav>
  );
}

import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import Link from "next/link";
import { Guitar } from "lucide-react";

export function AppHeader() {
  return (
    <header className="w-full px-4 lg:px-6 h-16 flex items-center justify-between border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <Link className="flex items-center justify-center" href="/">
        <Guitar className="h-8 w-8 text-purple-600" />
        <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
          Phishub
        </span>
      </Link>
      <div className="hidden md:flex gap-2">
        <Button variant="ghost" size="sm">
          Sign In
        </Button>
        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
          Get Started
        </Button>
      </div>
      <MobileNav />
    </header>
  );
}

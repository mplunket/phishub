"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { UserMenu } from "@/components/user-menu";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col gap-6 mt-6">
          <Link
            className="text-lg font-medium hover:text-purple-600 transition-colors"
            href="#features"
            onClick={() => setIsOpen(false)}
          >
            Features
          </Link>
          <Link
            className="text-lg font-medium hover:text-purple-600 transition-colors"
            href="#community"
            onClick={() => setIsOpen(false)}
          >
            Community
          </Link>
          <Link
            className="text-lg font-medium hover:text-purple-600 transition-colors"
            href="#about"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <div className="flex flex-col gap-3 mt-6 pt-6 border-t">
            <UserMenu />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

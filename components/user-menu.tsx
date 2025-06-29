"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function UserMenu() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: any) => {
      setUser(data?.user);
    });
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  if (!user) {
    return (
      <div className="flex gap-2">
        <Link href="/sign-in">
          <Button variant="outline">Sign In</Button>
        </Link>
        <Link href="/sign-up">
          <Button className="bg-purple-600 text-white hover:bg-purple-700">
            Get Started
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={user?.avatar_url || undefined} alt="User avatar" />
        <AvatarFallback>
          <User className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>
      <Button variant="ghost" size="sm" onClick={handleSignOut}>
        <LogOut className="h-4 w-4 mr-1" /> Sign Out
      </Button>
    </div>
  );
}

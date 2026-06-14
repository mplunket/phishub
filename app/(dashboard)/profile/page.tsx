import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Pencil } from "lucide-react";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, avatar_url, country, state, city")
    .eq("user_id", user.id)
    .single();

  const location = [profile?.city, profile?.state, profile?.country]
    .filter(Boolean)
    .join(", ");
  const initials = (profile?.username ?? user.email ?? "?")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="container max-w-2xl py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold sm:text-3xl">Profile</h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/profile/edit">
            <Pencil className="mr-1 h-4 w-4" /> Edit profile
          </Link>
        </Button>
      </div>
      <div className="flex items-center gap-4 rounded-lg border p-4 sm:p-6">
        <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
          {profile?.avatar_url && (
            <AvatarImage src={profile.avatar_url} alt={profile.username} />
          )}
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 space-y-1">
          <p className="truncate text-xl font-semibold">
            {profile?.username ?? "Phishub user"}
          </p>
          <p className="flex items-center gap-1.5 truncate text-sm text-muted-foreground">
            <Mail className="h-4 w-4 shrink-0" /> {user.email}
          </p>
          {location && (
            <p className="flex items-center gap-1.5 truncate text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" /> {location}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

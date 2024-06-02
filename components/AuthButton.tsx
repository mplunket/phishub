import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/");
  };

  return user ? (
    <div className="w-full items-center gap-4">
      <form action={signOut}>
        <Button variant="secondary" className="w-full">Logout</Button>
      </form>
    </div>
  ) : (
    <Button className="group">
      <Link href="/login">
        Login
      </Link>
      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
    </Button>
  );
}

import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ChevronLeft, GuitarIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import SignUpWithOAuth from "@/components/SignUpWithOAuth";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/");
  };

  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/login?message=Check email to continue sign in process");
  };

  return (
    <section className="w-full h-screen pt-8 pb-12 md:pb-24 bg-gradient-to-r from-[#9333EA] to-[#6366F1] text-white">
      <div className="container mx-auto flex-1 flex flex-col w-full py-6 px-8 sm:max-w-md justify-center gap-2">
        <Card className="mx-auto max-w-sm mt-6">
          <CardHeader>
            <CardTitle className="text-xl">Sign In</CardTitle>
            <CardDescription>
              Log in to phishub
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <form className="animate-in flex-1 flex flex-col w-full justify-center pt-6 gap-2 text-foreground">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="hpb@phish.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" />
                </div>
                <Button type="submit" className="w-full"
                  formAction={signIn}>
                  Log In
                </Button>

              </form>
              <SignUpWithOAuth />
            </div>
            <div className="mt-4 text-center text-sm">
              Forgot password?{" "}
              <Link href="/forgot" className="underline">
                Click here
              </Link>
            </div>
            {searchParams?.message && (
              <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
                {searchParams.message}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

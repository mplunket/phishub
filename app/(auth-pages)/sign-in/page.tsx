import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Guitar } from "lucide-react";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-orange-50">
      <div className="w-full max-w-md mx-auto p-8 bg-white/90 rounded-2xl shadow-xl flex flex-col items-center">
        <div className="flex items-center mb-6">
          <Guitar className="h-8 w-8 text-purple-600" />
          <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
            Phishub
          </span>
        </div>
        <form className="w-full flex flex-col gap-6" action={signInAction}>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
              Sign in
            </h1>
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                className="text-purple-700 font-medium underline"
                href="/sign-up"
              >
                Sign up
              </Link>
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="email" className="mb-1">
                Email
              </Label>
              <Input
                name="email"
                placeholder="you@example.com"
                required
                className="mt-1"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="password">Password</Label>
                <Link
                  className="text-xs text-purple-700 underline"
                  href="/forgot-password"
                >
                  Forgot Password?
                </Link>
              </div>
              <Input
                type="password"
                name="password"
                placeholder="Your password"
                required
              />
            </div>
          </div>
          <SubmitButton pendingText="Signing In...">Sign in</SubmitButton>
          <FormMessage message={searchParams} />
        </form>
      </div>
    </div>
  );
}

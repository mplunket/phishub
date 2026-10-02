import { signInAction, signInWithGitHubAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { TurnstileField } from "@/components/turnstile-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Guitar } from "lucide-react";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  const turnstileConfigured = Boolean(
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  );
  // Allow submit without a site key only in local development (see TurnstileField).
  const canSubmitEmailSignIn =
    turnstileConfigured || process.env.NODE_ENV === "development";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900">
      <div className="w-full max-w-md mx-auto p-8 bg-white/95 rounded-2xl shadow-2xl ring-1 ring-black/5 flex flex-col items-center">
        <div className="flex items-center mb-6">
          <Guitar className="h-8 w-8 text-purple-600" />
          <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
            Phishub
          </span>
        </div>
        <form className="w-full flex flex-col gap-6" action={signInAction}>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">Sign in</h1>
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
            <TurnstileField action="sign-in" />
          </div>
          {canSubmitEmailSignIn ? (
            <SubmitButton pendingText="Signing In...">Sign in</SubmitButton>
          ) : (
            <button
              type="button"
              disabled
              className="w-full rounded-md bg-gray-300 text-gray-600 py-2 px-4 text-sm font-medium cursor-not-allowed"
            >
              Sign in unavailable
            </button>
          )}
          <FormMessage message={searchParams} />
        </form>
        <div className="w-full flex items-center gap-3 my-2">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-500">or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>
        <form className="w-full" action={signInWithGitHubAction}>
          <input type="hidden" name="errorPath" value="/sign-in" />
          <SubmitButton
            variant="outline"
            className="w-full border-gray-300 text-gray-800 hover:bg-gray-50"
            pendingText="Redirecting to GitHub..."
          >
            Continue with GitHub
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}

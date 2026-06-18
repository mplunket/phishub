import Link from "next/link";
import { Guitar, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/actions";

export const metadata = {
  title: "You're on the list - Phishub",
  description:
    "Phishub is currently in private beta. Your account is on the waitlist.",
};

// Landing spot for authenticated users who are not yet on the beta allowlist.
// The middleware redirects them here instead of into the app.
export default function PendingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-orange-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white/90 p-8 text-center shadow-xl">
        <Link href="/" className="mb-6 flex items-center justify-center">
          <Guitar className="h-9 w-9 text-purple-600" />
          <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
            Phishub
          </span>
        </Link>

        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
          <Mail className="h-6 w-6 text-purple-600" />
        </div>

        <h1 className="text-2xl font-bold">You&apos;re on the list 🎸</h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          Thanks for signing up! Phishub is in a small private beta right now
          while we build out the tab and chord library with our first
          contributors. We&apos;ll email you as soon as your account is approved
          and you can dive in.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          If you were expecting access already, give it a minute and refresh —
          and make sure you signed in with the same email you were invited
          with.
        </p>

        <form action={signOutAction} className="mt-6">
          <Button type="submit" variant="outline" className="w-full">
            Sign out
          </Button>
        </form>
      </div>
    </div>
  );
}

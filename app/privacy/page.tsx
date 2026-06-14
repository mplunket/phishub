import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Monitored address for privacy questions and data requests. Update this to the
// real address before launch.
const PRIVACY_CONTACT = "hello@phishub.com";

const LAST_UPDATED = "June 14, 2026";

export const metadata = {
  title: "Privacy Policy - Phishub",
  description:
    "What data Phishub collects, how it's used, and the choices you have.",
};

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl py-10">
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link href="/">
          <ArrowLeft className="mr-1 h-4 w-4" /> Home
        </Link>
      </Button>

      <h1 className="text-3xl font-bold sm:text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-muted-foreground">Last updated {LAST_UPDATED}</p>

      <div className="prose mt-8 max-w-none space-y-8 text-sm leading-relaxed">
        <section className="space-y-2">
          <p>
            Phishub is an independent, fan-run platform for Phish guitar tabs,
            lessons, and community. This policy explains what we collect and why.
            We aim to collect as little as possible.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Information we collect</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>Account information</strong> — your email address and
              password (passwords are stored hashed by our authentication
              provider, never in plain text).
            </li>
            <li>
              <strong>Profile information</strong> — the username, optional
              avatar, and optional location (country/state/city) you choose to
              add.
            </li>
            <li>
              <strong>Content you submit</strong> — tabs, comments, setlists,
              video links, and favorites you create on the platform.
            </li>
            <li>
              <strong>Waitlist email</strong> — if you join the waitlist, the
              email address you provide and how you reached us.
            </li>
            <li>
              <strong>Basic usage data</strong> — privacy-friendly, aggregated
              analytics about how the site is used, to help us improve it.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">How we use it</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>To run your account and show your contributions.</li>
            <li>
              To send essential account email such as sign-up confirmation and
              password resets.
            </li>
            <li>To maintain, secure, and improve the platform.</li>
          </ul>
          <p>
            We do not sell your personal information, and we don&apos;t send
            marketing email without your consent.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Service providers</h2>
          <p>
            We rely on a few trusted providers to operate Phishub — including
            Supabase (database and authentication), Vercel (hosting), and an
            email delivery provider for account email. They process data only on
            our behalf to provide these services.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Public content</h2>
          <p>
            Your username and the content you contribute (tabs, comments,
            setlists) are visible to other users and the public. Please
            don&apos;t include private information in content you post.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Your choices</h2>
          <p>
            You can edit your profile at any time, request removal of content you
            posted, or ask us to delete your account and associated personal
            data. To make a request, contact us at the address below.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Children</h2>
          <p>
            Phishub is not directed to children under 13, and we do not knowingly
            collect their personal information.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Changes</h2>
          <p>
            We may update this policy as Phishub evolves; we&apos;ll revise the
            date above when we do.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Contact</h2>
          <p>
            Questions or data requests? Email{" "}
            <a
              href={`mailto:${PRIVACY_CONTACT}`}
              className="font-medium underline hover:text-foreground"
            >
              {PRIVACY_CONTACT}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bug } from "lucide-react";

// Public GitHub repo used for beta bug/feature tracking. Update if the repo
// moves.
const GITHUB_ISSUES_URL = "https://github.com/mplunket/phishub/issues/new/choose";

// Where beta questions should go. Keep in sync with the contact address used in
// the Terms of Use.
const CONTACT_EMAIL = "hello@phishub.com";

export const metadata = {
  title: "FAQ - Phishub",
  description:
    "Frequently asked questions about Phishub, the private beta, contributing tabs, and reporting bugs.",
};

export default function FaqPage() {
  return (
    <div className="container max-w-3xl py-10">
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link href="/">
          <ArrowLeft className="mr-1 h-4 w-4" /> Home
        </Link>
      </Button>

      <h1 className="text-3xl font-bold sm:text-4xl">Frequently asked questions</h1>
      <p className="mt-2 text-muted-foreground">
        Everything you need to know about the Phishub private beta.
      </p>

      <div className="prose mt-8 max-w-none space-y-8 text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">What is Phishub?</h2>
          <p>
            Phishub is a community platform for Phish music education — guitar
            tabs, chord charts, video lessons, setlists, and discussion, built
            on top of a complete catalog of every Phish song. It&apos;s an
            independent, fan-run project and is not affiliated with or endorsed
            by the band.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">
            What does &ldquo;private beta&rdquo; mean?
          </h2>
          <p>
            We&apos;re opening Phishub to a small group of contributors first so
            we can grow the tab and chord library and smooth out rough edges
            before a wider launch. Access is invite-only right now: if you
            signed up and landed on the &ldquo;you&apos;re on the list&rdquo;
            page, your spot is reserved and we&apos;ll email you when your
            account is approved.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">How do I get in?</h2>
          <p>
            Beta access is granted by invitation. If you were invited, sign up
            using the same email address your invite was sent to — that&apos;s
            how we match your account to your spot. If you joined the waitlist
            on the homepage, you&apos;re in the queue and we&apos;ll reach out as
            we add more contributors.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">
            How do I contribute a tab or chord chart?
          </h2>
          <p>
            Once you&apos;re in, find a song and add your tab, chords, or a video
            lesson right from the song&apos;s page. The catalog already has every
            Phish song, so you can jump straight to filling in the parts you
            know. The more you share, the more useful Phishub gets for everyone.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">
            What can I post? (Please read)
          </h2>
          <p>
            Tabs you contribute must be <strong>your own original
            transcription</strong> — your interpretation of how to play the song
            — not a copy of someone else&apos;s published tablature or
            copyrighted sheet music. Don&apos;t upload scanned, photographed, or
            copied official sheet music or publisher arrangements. See the{" "}
            <Link
              href="/content-policy"
              className="font-medium underline hover:text-foreground"
            >
              Content &amp; Copyright Policy
            </Link>{" "}
            and{" "}
            <Link
              href="/terms"
              className="font-medium underline hover:text-foreground"
            >
              Terms of Use
            </Link>{" "}
            for the full details.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">
            I found a bug / have a feature idea. Where does it go?
          </h2>
          <p>
            During the beta we track bugs and feature requests on our public
            GitHub repository. Filing an issue is the fastest way to make sure
            it gets seen and tracked. You&apos;ll need a free GitHub account.
          </p>
          <Button asChild className="not-prose bg-purple-600 hover:bg-purple-700">
            <a href={GITHUB_ISSUES_URL} target="_blank" rel="noopener noreferrer">
              <Bug className="mr-2 h-4 w-4" /> Report a bug or request a feature
            </a>
          </Button>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Still have questions?</h2>
          <p>
            Email{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-medium underline hover:text-foreground"
            >
              {CONTACT_EMAIL}
            </a>{" "}
            and we&apos;ll get back to you.
          </p>
        </section>
      </div>
    </div>
  );
}

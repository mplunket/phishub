import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Designated contact for questions about these terms. Update this to the real
// monitored address before launch.
const CONTACT_EMAIL = "hello@phishub.com";

// Bump this whenever the substance of the terms changes so users can see when
// they were last revised.
const LAST_UPDATED = "June 14, 2026";

export const metadata = {
  title: "Terms of Use - Phishub",
  description:
    "The terms governing your use of Phishub, including community conduct and the license you grant when contributing tabs.",
};

export default function TermsPage() {
  return (
    <div className="container max-w-3xl py-10">
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link href="/">
          <ArrowLeft className="mr-1 h-4 w-4" /> Home
        </Link>
      </Button>

      <h1 className="text-3xl font-bold sm:text-4xl">Terms of Use</h1>
      <p className="mt-2 text-muted-foreground">
        Last updated {LAST_UPDATED}
      </p>

      <div className="prose mt-8 max-w-none space-y-8 text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">1. Acceptance of these terms</h2>
          <p>
            Phishub is a community platform for Phish guitar tabs, video lessons,
            setlists, and discussion. By creating an account or otherwise using
            Phishub, you agree to these Terms of Use. If you do not agree, please
            do not use the platform. Phishub is an independent, fan-run project
            and is not affiliated with or endorsed by the band.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">2. Your account</h2>
          <p>
            You must provide accurate information when registering and are
            responsible for activity that happens under your account. You must be
            old enough to form a binding agreement in your jurisdiction to use
            Phishub. Keep your credentials secure; tell us promptly if you
            believe your account has been compromised.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">
            3. Contributing tabs and other content
          </h2>
          <p>
            When you submit a tab, chord chart, transcription, video link,
            comment, setlist, or other material (&ldquo;your content&rdquo;), you
            confirm that:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              It is <strong>your own original transcription or work</strong> —
              your interpretation of how to play the song — and not a copy of
              someone else&apos;s published tablature or copyrighted sheet music.
            </li>
            <li>
              You are not uploading scanned, photographed, or copied official
              sheet music or publisher-owned arrangements.
            </li>
            <li>
              You have the right to share it and to grant the license below.
            </li>
          </ul>
          <p>
            You retain ownership of your content. You grant Phishub a
            non-exclusive, royalty-free, worldwide license to host, display,
            reproduce, and distribute your content on the platform, with
            attribution to your account, for as long as you keep it posted. You
            may request removal of your content at any time.
          </p>
          <p>
            Tabs are transcriptions of musical works whose underlying
            compositions and lyrics remain the property of their respective
            copyright holders, and are shared for educational and personal use.
            For full detail on contributions, the underlying compositions, and
            how to file a copyright takedown (DMCA) notice, see our{" "}
            <Link
              href="/content-policy"
              className="font-medium underline hover:text-foreground"
            >
              Content &amp; Copyright Policy
            </Link>
            .
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">4. Community conduct</h2>
          <p>When using Phishub, you agree not to:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              Post content that is unlawful, harassing, hateful, or infringes
              someone else&apos;s rights.
            </li>
            <li>
              Upload official sheet music, publisher arrangements, or other
              material you don&apos;t have the right to share.
            </li>
            <li>Spam, scrape, or attempt to disrupt or abuse the service.</li>
            <li>
              Impersonate others or misrepresent your affiliation with any
              person or organization.
            </li>
          </ul>
          <p>
            We may remove content or suspend accounts that violate these terms,
            and may disable the accounts of repeat infringers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">5. Content from others</h2>
          <p>
            Most content on Phishub is contributed by the community. We don&apos;t
            review everything posted and can&apos;t guarantee its accuracy. You use
            community-contributed material at your own discretion.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">
            6. Disclaimers and limitation of liability
          </h2>
          <p>
            Phishub is provided &ldquo;as is&rdquo; and &ldquo;as
            available,&rdquo; without warranties of any kind. To the fullest
            extent permitted by law, Phishub and its operators are not liable for
            any indirect, incidental, or consequential damages arising from your
            use of the platform.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">7. Changes to these terms</h2>
          <p>
            We may update these terms as Phishub evolves. When we make material
            changes we&apos;ll update the date above, and continued use of the
            platform means you accept the revised terms.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">8. Contact</h2>
          <p>
            Questions about these terms? Email{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-medium underline hover:text-foreground"
            >
              {CONTACT_EMAIL}
            </a>
            . For copyright takedown notices, see the{" "}
            <Link
              href="/content-policy"
              className="font-medium underline hover:text-foreground"
            >
              Content &amp; Copyright Policy
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}

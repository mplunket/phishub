import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Designated contact for contributor-license questions and copyright/DMCA
// takedown notices. Update this to the real monitored address before launch.
const COPYRIGHT_CONTACT = "copyright@phishub.com";

export const metadata = {
  title: "Content & Copyright Policy - Phishub",
  description:
    "How user-contributed tabs are licensed on Phishub, and how to submit a copyright takedown notice.",
};

export default function ContentPolicyPage() {
  return (
    <div className="container max-w-3xl py-10">
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link href="/">
          <ArrowLeft className="mr-1 h-4 w-4" /> Home
        </Link>
      </Button>

      <h1 className="text-3xl font-bold sm:text-4xl">
        Content &amp; Copyright Policy
      </h1>
      <p className="mt-2 text-muted-foreground">
        How community-contributed tabs work on Phishub.
      </p>

      <div className="prose mt-8 max-w-none space-y-8 text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Community contributions</h2>
          <p>
            Tabs, chords, and transcriptions on Phishub are created and uploaded
            by the community. Phishub is a hosting platform for those
            contributions — it does not sell or distribute official sheet music.
            Official transcriptions can be purchased from the band&apos;s own
            stores.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">
            Your responsibilities as a contributor
          </h2>
          <p>When you submit a tab, you confirm that:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              It is <strong>your own original transcription</strong> — your
              interpretation of how to play the song — and not a copy of someone
              else&apos;s published tablature or copyrighted sheet music.
            </li>
            <li>
              You are not uploading scanned, photographed, or copied official
              sheet music or publisher-owned arrangements.
            </li>
            <li>
              You grant Phishub a non-exclusive, royalty-free license to host,
              display, and distribute your contribution on the platform, with
              attribution to your account.
            </li>
          </ul>
          <p>
            You retain ownership of your transcription and may request its
            removal at any time.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Underlying compositions</h2>
          <p>
            Tabs are transcriptions of musical works whose compositions and
            lyrics remain the property of their respective copyright holders.
            Contributions are shared for educational and personal use. If you
            are a rights holder and believe content here exceeds that scope, use
            the takedown process below.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">
            Copyright takedown (DMCA) requests
          </h2>
          <p>
            If you are a copyright owner (or authorized agent) and believe
            material on Phishub infringes your rights, email our designated
            contact with:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Identification of the work and the specific URL(s) at issue.</li>
            <li>Your contact information.</li>
            <li>
              A statement that you have a good-faith belief the use is not
              authorized, and that the information in your notice is accurate.
            </li>
          </ul>
          <p>
            Send notices to{" "}
            <a
              href={`mailto:${COPYRIGHT_CONTACT}`}
              className="font-medium underline hover:text-foreground"
            >
              {COPYRIGHT_CONTACT}
            </a>
            . We remove material that is the subject of a valid notice and may
            disable repeat infringers&apos; accounts.
          </p>
        </section>
      </div>
    </div>
  );
}

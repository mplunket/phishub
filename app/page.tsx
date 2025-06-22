import Link from "next/link";

import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { Button } from "@/components/ui/button";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";

export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Welcome to Phishub
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Your ultimate resource for learning and sharing Phish songs, tabs,
              and setlists.
            </p>
            <div className="space-x-4">
              <Button asChild>
                <Link href="/songs">Browse Songs</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/auth/sign-in">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured content */}
      <section className="py-12">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tight mb-8">
            Popular Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Featured Songs */}
            <div className="rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Popular Songs</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/songs/you-enjoy-myself"
                    className="text-blue-500 hover:underline"
                  >
                    You Enjoy Myself
                  </Link>
                </li>
                <li>
                  <Link
                    href="/songs/divided-sky"
                    className="text-blue-500 hover:underline"
                  >
                    Divided Sky
                  </Link>
                </li>
                <li>
                  <Link
                    href="/songs/tweezer"
                    className="text-blue-500 hover:underline"
                  >
                    Tweezer
                  </Link>
                </li>
              </ul>
            </div>

            {/* Latest Tabs */}
            <div className="rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Latest Tabs</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/tabs/fluffhead-guitar"
                    className="text-blue-500 hover:underline"
                  >
                    Fluffhead (Guitar)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tabs/reba-bass"
                    className="text-blue-500 hover:underline"
                  >
                    Reba (Bass)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tabs/ghost-piano"
                    className="text-blue-500 hover:underline"
                  >
                    Ghost (Piano)
                  </Link>
                </li>
              </ul>
            </div>

            {/* Recent Setlists */}
            <div className="rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Setlists</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/setlists/2024-12-31"
                    className="text-blue-500 hover:underline"
                  >
                    2024-12-31 MSG
                  </Link>
                </li>
                <li>
                  <Link
                    href="/setlists/2024-12-30"
                    className="text-blue-500 hover:underline"
                  >
                    2024-12-30 MSG
                  </Link>
                </li>
                <li>
                  <Link
                    href="/setlists/2024-12-29"
                    className="text-blue-500 hover:underline"
                  >
                    2024-12-29 MSG
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-12 bg-muted/50">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tight mb-8">
            Why Phishub?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Comprehensive Library</h3>
              <p className="text-muted-foreground">
                Access a vast collection of Phish songs, including tabs, chord
                charts, and sheet music.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Community Driven</h3>
              <p className="text-muted-foreground">
                Share your own tabs and collaborate with other musicians to
                improve the resources.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Interactive Learning</h3>
              <p className="text-muted-foreground">
                Create and share setlists, comment on tabs, and engage with the
                Phish community.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Hero />
      <main className="flex-1 flex flex-col gap-6 px-4">
        <h2 className="font-medium text-xl mb-4">Next steps</h2>
        {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
      </main>
    </div>
  );
}

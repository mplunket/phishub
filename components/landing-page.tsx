import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Music,
  Users,
  Heart,
  List,
  Upload,
  MessageCircle,
  Share2,
  Guitar,
  Star,
  BookOpen,
  Video,
} from "lucide-react";
import Link from "next/link";
import { SearchBar } from "@/components/search-bar";
import { AppHeader } from "@/components/nav";
import { WaitlistForm } from "@/components/waitlist-form";
import { waitlistDisabled } from "@/flags";

export default async function LandingPage() {
  // Check Waitlist feature flag
  const hideWaitlist = await waitlistDisabled();

  return (
    <>
      <AppHeader />
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
        {/* Hero Section */}
        <section className="w-full flex items-center justify-center min-h-[calc(100vh-4rem)] pb-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="pt-2 pb-4">
                <Badge
                  variant="secondary"
                  className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-200"
                >
                  🎸 A new home for Phish guitar tabs · now in private beta
                </Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-gradient-to-r from-purple-600 via-purple-700 to-orange-500 bg-clip-text text-transparent">
                  A Community Home for
                  <br />
                  Phish Tabs &amp; Lessons
                </h1>
                <p className="mx-auto mt-4 max-w-[700px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  A collaborative platform for guitar tabs, video lessons, and
                  community-driven Phish music education. We&rsquo;re early —
                  the catalog is complete and the library is being built by the
                  first round of beta contributors.
                </p>
              </div>
              {hideWaitlist ? (
                <SearchBar />
              ) : (
                <>
                  <WaitlistForm source="hero" />
                  {/* Invited beta users need a way in without hunting for the
                      header — kept as a quiet link so the waitlist stays the
                      primary action for everyone else. */}
                  <p className="text-sm text-gray-600">
                    Already invited?{" "}
                    <Link
                      href="/sign-in"
                      className="font-medium text-purple-700 underline underline-offset-4 hover:text-purple-800"
                    >
                      Sign in
                    </Link>{" "}
                    or{" "}
                    <Link
                      href="/sign-up"
                      className="font-medium text-purple-700 underline underline-offset-4 hover:text-purple-800"
                    >
                      create your account
                    </Link>
                    .
                  </p>
                </>
              )}
            </div>
          </div>
        </section>
        {/* Features Section */}
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-white"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Everything You Need in One Place
              </h2>
              <p className="mt-4 text-gray-600 md:text-lg">
                Here&rsquo;s what we&rsquo;re building — tabs, video lessons,
                setlists, and discussion, all in one place
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2">
              <Card className="border-purple-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <BookOpen className="h-8 w-8 text-purple-600 mb-2" />
                  <CardTitle>Dynamic Tab Viewing</CardTitle>
                  <CardDescription>
                    Browse and interact with high-quality guitar tabs
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-purple-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Heart className="h-8 w-8 text-red-500 mb-2" />
                  <CardTitle>Favorite & Organize</CardTitle>
                  <CardDescription>
                    Save your favorite tabs and organize them into custom
                    collections for easy access
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-purple-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <List className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle>Build Setlists</CardTitle>
                  <CardDescription>
                    Create and share setlists for practice sessions,
                    performances, or just for fun
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-purple-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Video className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle>Video Integration</CardTitle>
                  <CardDescription>
                    Watch video lessons and live performances while following
                    along with synchronized tabs
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-purple-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Upload className="h-8 w-8 text-orange-600 mb-2" />
                  <CardTitle>Submit Content</CardTitle>
                  <CardDescription>
                    Share your own tabs, lessons, and insights with the
                    community
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-purple-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Users className="h-8 w-8 text-purple-600 mb-2" />
                  <CardTitle>Community Driven</CardTitle>
                  <CardDescription>
                    Comment, discuss, and collaborate with fellow Phish
                    enthusiasts
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
        {/* Community Section */}
        <section
          id="community"
          className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-600 to-orange-500"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                Help Build the Community
              </h2>
              <p className="mx-auto max-w-[600px] text-purple-100 md:text-lg mb-8">
                Phishub is just getting started. The first contributors shape
                what it becomes — here&rsquo;s what you can do here
              </p>
              <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-1 max-w-4xl mx-auto">
                <div className="flex flex-col items-center space-y-2">
                  <MessageCircle className="h-12 w-12 text-white" />
                  <h3 className="text-xl font-semibold">Discuss & Comment</h3>
                  <p className="text-purple-100 text-center">
                    Engage in meaningful discussions about songs, techniques,
                    and performances
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Share2 className="h-12 w-12 text-white" />
                  <h3 className="text-xl font-semibold">Share & Collaborate</h3>
                  <p className="text-purple-100 text-center">
                    Share your discoveries and collaborate on new tabs and
                    lessons
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Star className="h-12 w-12 text-white" />
                  <h3 className="text-xl font-semibold">Learn & Grow</h3>
                  <p className="text-purple-100 text-center">
                    Improve your skills with community feedback and expert
                    guidance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Stats Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Built on a complete catalog
              </h2>
              <p className="mt-4 text-gray-600 md:text-lg">
                Every Phish song, ready for the community to fill with tabs,
                lessons, and lyrics.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 text-center">
              <div className="space-y-2">
                <div className="text-5xl font-bold text-blue-600">950+</div>
                <div className="text-gray-600 text-xl">
                  Songs from phish.net
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-5xl font-bold text-purple-600">
                  Tabs &amp; chords
                </div>
                <div className="text-gray-600 text-xl">
                  Contribute the ones you know
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-5xl font-bold text-orange-500">
                  Video lessons
                </div>
                <div className="text-gray-600 text-xl">
                  Link the ones that helped you
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Dive In?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-600 md:text-lg">
                  Phishub is in a small, invite-only private beta. Leave your
                  email and we&rsquo;ll get in touch as spots open up.
                </p>
              </div>
              <div className="space-x-4 w-full flex justify-center">
                {hideWaitlist ? (
                  <Button
                    size="lg"
                    className="bg-purple-600 hover:bg-purple-700"
                    asChild
                  >
                    <Link href="/sign-up" className="flex items-center">
                      <Music className="mr-2 h-4 w-4" />
                      Start Learning Today
                    </Link>
                  </Button>
                ) : (
                  <div className="flex flex-col items-center">
                    <WaitlistForm source="cta" />
                    <p className="mt-4 text-sm text-gray-600">
                      Got an invite?{" "}
                      <Link
                        href="/sign-in"
                        className="font-medium text-purple-700 underline underline-offset-4 hover:text-purple-800"
                      >
                        Sign in
                      </Link>
                      .
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        {/* Footer */}
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white">
          <div className="flex items-center">
            <Guitar className="h-6 w-6 text-purple-600" />
            <span className="ml-2 text-lg font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
              Phishub
            </span>
          </div>
          <p className="text-xs text-gray-500 sm:ml-auto">
            © {new Date().getFullYear()} Phishub. Built with love for the Phish
            community.
          </p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link
              className="text-xs hover:underline underline-offset-4 text-gray-500"
              href="/faq"
            >
              FAQ
            </Link>
            <Link
              className="text-xs hover:underline underline-offset-4 text-gray-500"
              href="/terms"
            >
              Terms of Use
            </Link>
            <Link
              className="text-xs hover:underline underline-offset-4 text-gray-500"
              href="/privacy"
            >
              Privacy
            </Link>
            <Link
              className="text-xs hover:underline underline-offset-4 text-gray-500"
              href="/content-policy"
            >
              Content Policy
            </Link>
          </nav>
        </footer>
      </div>
    </>
  );
}

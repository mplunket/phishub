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
import { MobileNav } from "@/components/mobile-nav";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <Link className="flex items-center justify-center" href="#">
          <Guitar className="h-8 w-8 text-purple-600" />
          <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
            Phishub
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-4 lg:gap-6">
          <Link
            className="text-sm font-medium hover:text-purple-600 transition-colors"
            href="#features"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium hover:text-purple-600 transition-colors"
            href="#community"
          >
            Community
          </Link>
          <Link
            className="text-sm font-medium hover:text-purple-600 transition-colors"
            href="#about"
          >
            About
          </Link>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex gap-2">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
            Get Started
          </Button>
        </div>

        {/* Mobile Menu */}
        <MobileNav />
      </header>

      {/* Hero Section */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-4">
              <Badge
                variant="secondary"
                className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-200"
              >
                🎸 #1 Phish Guitar Tab Site on the Internet
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-gradient-to-r from-purple-600 via-purple-700 to-orange-500 bg-clip-text text-transparent">
                Your Ultimate Phish
                <br />
                Music Education Hub
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                A dynamic, collaborative platform for guitar tabs, video
                lessons, and community-driven Phish music education.
              </p>
            </div>
            <SearchBar />
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
              From tabs to video lessons, build your Phish knowledge with our
              comprehensive platform
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
                  Create and share setlists for practice sessions, performances,
                  or just for fun
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
                  Share your own tabs, lessons, and insights with the community
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
              Join the Community
            </h2>
            <p className="mx-auto max-w-[600px] text-purple-100 md:text-lg mb-8">
              Connect with passionate Phish fans, share your knowledge, and
              learn from others in our vibrant community
            </p>
            <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-1 max-w-4xl mx-auto">
              <div className="flex flex-col items-center space-y-2">
                <MessageCircle className="h-12 w-12 text-white" />
                <h3 className="text-xl font-semibold">Discuss & Comment</h3>
                <p className="text-purple-100 text-center">
                  Engage in meaningful discussions about songs, techniques, and
                  performances
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Share2 className="h-12 w-12 text-white" />
                <h3 className="text-xl font-semibold">Share & Collaborate</h3>
                <p className="text-purple-100 text-center">
                  Share your discoveries and collaborate on new tabs and lessons
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
          <div className="grid gap-6 lg:grid-cols-4 md:grid-cols-2 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-600">500+</div>
              <div className="text-gray-600">Guitar Tabs</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-orange-500">1,200+</div>
              <div className="text-gray-600">Community Members</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-600">150+</div>
              <div className="text-gray-600">Video Lessons</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600">50+</div>
              <div className="text-gray-600">Songs</div>
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
                Join thousands of Phish fans already using Phishub to enhance
                their musical journey
              </p>
            </div>
            <div className="space-x-4">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Music className="mr-2 h-4 w-4" />
                Start Learning Today
              </Button>
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
            href="#"
          >
            Terms of Service
          </Link>
          <Link
            className="text-xs hover:underline underline-offset-4 text-gray-500"
            href="#"
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

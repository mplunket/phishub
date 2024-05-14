import { createClient } from "@/utils/supabase/server";
import AuthButton from "../components/AuthButton";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ChevronRight, GuitarIcon, FileMusicIcon, AudioWaveformIcon, MicVocalIcon, VideoIcon, BookOpenCheckIcon, HeartIcon } from "lucide-react";
import Link from "next/link";
import {
  Bell,
  CircleUser,
  Home,
  Menu
} from "lucide-react"

export default async function Index() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return (
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] bg-white dark:bg-slate-900">
        <div className="hidden bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 bg-gradient-to-r from-[#6366F1] to-[#9333EA] text-white">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <GuitarIcon className="h-6 w-6" />
                <h6 className="text-xl md:2xl font-extrabold tracking-tight">phis<span className="text-violet-200">h</span><span className="text-violet-300">ub</span></h6>
              </Link>
              <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                <Bell className="h-4 w-4 text-black" />
                <span className="sr-only">Toggle notifications</span>
              </Button>
            </div>
            <div className="flex-1">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <FileMusicIcon className="h-4 w-4 text-fuchsia-500" />
                  Tabs
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                >
                  <AudioWaveformIcon className="h-4 w-4 text-cyan-500" />
                  Songs
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                >
                  <MicVocalIcon className="h-4 w-4 text-violet-500" />
                  Lyrics
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <BookOpenCheckIcon className="h-4 w-4 text-yellow-500" />
                  Lessons
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <VideoIcon className="h-4 w-4 text-green-500" />
                  Performances
                </Link>
              </nav>
            </div>
            <div className="mt-auto p-4">
              <Card x-chunk="dashboard-02-chunk-0">
                <CardHeader className="p-2 pt-0 md:p-4">
                  <CardTitle>Upgrade to Pro</CardTitle>
                  <CardDescription>
                    Unlock all features and get unlimited access to our support
                    team.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                  <Button size="sm" className="w-full">
                    Upgrade
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 bg-[#9333EA]">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <nav className="grid gap-2 text-lg font-medium">
                  <Link
                    href="#"
                    className="flex items-center gap-2 text-lg font-semibold"
                  >
                    <GuitarIcon className="h-8 w-8 text-[#6366F1]" />
                    <h6 className="text-xl md:text-2xl font-extrabold tracking-tight text-[#6366F1] dark:white">phis<span className="text-violet-400 dark:text-violet-200">h</span><span className="text-violet-300 dark:text-violet-300">ub</span></h6>
                  </Link>
                  <div className="mt-2 border-b"></div>
                  <Link
                    href="#"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                  >
                    <Home className="h-5 w-5" />
                    Home
                  </Link>
                  <Link
                    href="#"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                  >
                    <FileMusicIcon className="h-5 w-5 text-fuchsia-500" />
                    Tabs
                  </Link>
                  <Link
                    href="#"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                  >
                    <AudioWaveformIcon className="h-5 w-5 text-cyan-500" />
                    Songs
                  </Link>
                  <Link
                    href="#"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                  >
                    <MicVocalIcon className="h-5 w-5 text-violet-500" />
                    Lyrics
                  </Link>
                  <Link
                    href="#"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                  >
                    <BookOpenCheckIcon className="h-5 w-5 text-yellow-500" />
                    Lessons
                  </Link>
                  <Link
                    href="#"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                  >
                    <VideoIcon className="h-5 w-5 text-green-500" />
                    Performances
                  </Link>
                </nav>
                <div className="mt-auto">
                  <Card>
                    <CardHeader>
                      <CardTitle>Upgrade to Pro</CardTitle>
                      <CardDescription>
                        Unlock all features and get unlimited access to our
                        support team.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button size="sm" className="w-full">
                        Upgrade
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </SheetContent>
            </Sheet>
            <SearchBar />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem><Link href="/profile">My Profile</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/settings">Settings</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <AuthButton />
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold md:text-2xl">My Favorites</h1>
            </div>
            <div
              className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm" x-chunk="dashboard-02-chunk-1"
            >
              <div className="flex flex-col items-center gap-1 text-center">
                <h3 className="text-2xl font-bold tracking-tight">
                  You have no favorites
                </h3>
                <p className="text-sm text-muted-foreground px-4 py-2">
                  Click the <HeartIcon className="inline h-4 w-4 hover:fill-red-400 cursor-pointer" /> button by any song, tab, performance, or lesson to add it to your My Favorites list.
                </p>
                <Button className="mt-4">View Songs</Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  } else {
    return (
      <>
        <section className="w-full pt-8 pb-12 bg-gradient-to-r from-[#6366F1] to-[#9333EA] text-white">
          <div className="container mx-auto px-4 md:px-6 py-12 flex flex-col items-center text-center">
            <div className="flex items-center">
              <GuitarIcon className="h-24 w-24" />
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">phis<span className="text-violet-200">h</span><span className="text-violet-300">ub</span></h1>
            </div>
            <p className="mt-4 text-xl md:text-2xl text-gray-300">The #1 Site for Musicians Who Love Phish</p>
            <div className="text-center pt-10">
              <Button variant="secondary" className="group">
                <Link href="/signup">Sign Up for the <span className="text-fuchsia-500">Beta</span></Link> <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </section>
        <section className="w-full py-24 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center gap-4">
              <FileMusicIcon className="h-12 w-12 text-fuchsia-500" />
              <h3 className="text-2xl font-bold dark:text-gray-100">Tabs</h3>
              <p className="text-gray-500 dark:text-gray-400">Study, organize, and contribute guitar, bass, and piano chord charts, tablature, and lyrics</p>
            </div>
            <div className="flex flex-col items-center text-center gap-4">
              <AudioWaveformIcon className="h-12 w-12 text-cyan-500" />
              <h3 className="text-2xl font-bold dark:text-gray-100">Songs</h3>
              <p className="text-gray-500 dark:text-gray-400">Explore Phish's entire catalog of originals and covers with helpful resources</p>
            </div>
            <div className="flex flex-col items-center text-center gap-4">
              <VideoIcon className="h-12 w-12 text-green-500" />
              <h3 className="text-2xl font-bold dark:text-gray-100">Videos</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Watch lessons and performances to get some tips for your playing
              </p>
            </div>
          </div>
        </section>
      </>
    )
  }

}
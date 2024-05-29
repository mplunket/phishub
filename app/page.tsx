import { createClient } from "@/utils/supabase/server";
import Splash from "@/components/Splash";
import SearchBar from "@/components/SearchBar";
import UserDropdownMenu from "@/components/UserDropdownMenu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { GuitarIcon, FileMusicIcon, AudioWaveformIcon, MicVocalIcon, VideoIcon, BookOpenCheckIcon, HeartIcon } from "lucide-react";
import Link from "next/link";
import {
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
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] bg-white dark:bg-slate-900 dark:text-gray-100">
        <div className="hidden bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 bg-gradient-to-r from-[#6366F1] to-[#9333EA] text-white">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <GuitarIcon className="h-6 w-6" />
                <h6 className="text-xl md:2xl font-extrabold tracking-tight">phis<span className="text-violet-200">h</span><span className="text-violet-300">ub</span></h6>
              </Link>
            </div>
            <div className="flex-1">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-slate-600 hover:bg-slate-100"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-slate-600 hover:bg-slate-100"
                >
                  <FileMusicIcon className="h-4 w-4 text-fuchsia-500" />
                  Tabs
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-slate-600 hover:bg-slate-100"
                >
                  <AudioWaveformIcon className="h-4 w-4 text-cyan-500" />
                  Songs
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-slate-600 hover:bg-slate-100"
                >
                  <MicVocalIcon className="h-4 w-4 text-violet-500" />
                  Lyrics
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-slate-600 hover:bg-slate-100"
                >
                  <BookOpenCheckIcon className="h-4 w-4 text-yellow-500" />
                  Lessons
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-slate-600 hover:bg-slate-100"
                >
                  <VideoIcon className="h-4 w-4 text-green-500" />
                  Performances
                </Link>
              </nav>
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
              </SheetContent>
            </Sheet>
            <SearchBar />
            <UserDropdownMenu />
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
      <Splash />
    )
  }

}
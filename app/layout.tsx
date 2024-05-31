import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Footer from "@/components/Footer";
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

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "phishub",
  description: "The #1 Site for Musicians Who Love Phish",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <html lang="en" className={GeistSans.className}>
        <body className="bg-background text-foreground">
          <main className="min-h-screen flex flex-col items-center bg-slate-900 dark:bg-white">
            {children}
            <Footer />
          </main>
        </body>
      </html>
    );
  } else {
    return (
      <html lang="en" className={GeistSans.className}>
        <body className="bg-background text-foreground">
          <main className="min-h-screen flex flex-col items-center bg-slate-900 dark:bg-white">
            <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] bg-white dark:bg-slate-900 dark:text-gray-100">
              <div className="hidden bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                  <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 bg-gradient-to-r from-[#6366F1] to-[#9333EA] dark:from-[#393a79] dark:to-[#51356b] text-white">
                    <Link href="/" className="flex items-center gap-2 font-semibold hover:animate-pulse">
                      <GuitarIcon className="h-6 w-6" />
                      <h6 className="text-xl md:2xl font-extrabold tracking-tight">phis<span className="text-violet-200">h</span><span className="text-violet-300">ub</span></h6>
                    </Link>
                  </div>
                  <div className="flex-1 px-5 py-2">
                    <nav className="grid gap-2 text-lg font-medium">
                      <Link
                        href="/"
                        className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                      >
                        <Home className="h-5 w-5" />
                        Home
                      </Link>
                      <Link
                        href="/tabs"
                        className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                      >
                        <FileMusicIcon className="h-5 w-5 text-fuchsia-500" />
                        Tabs
                      </Link>
                      <Link
                        href="/songs"
                        className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                      >
                        <AudioWaveformIcon className="h-5 w-5 text-cyan-500" />
                        Songs
                      </Link>
                      <Link
                        href="/lyrics"
                        className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                      >
                        <MicVocalIcon className="h-5 w-5 text-violet-500" />
                        Lyrics
                      </Link>
                      <Link
                        href="/lessons"
                        className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                      >
                        <BookOpenCheckIcon className="h-5 w-5 text-yellow-500" />
                        Lessons
                      </Link>
                      <Link
                        href="/performances"
                        className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                      >
                        <VideoIcon className="h-5 w-5 text-green-500" />
                        Performances
                      </Link>
                    </nav>
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <header className="flex h-14 justify-between items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 bg-[#9333EA] dark:bg-[#51356b]">
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
                          href="/"
                          className="flex items-center gap-2 text-lg font-semibold hover:animate-pulse"
                        >
                          <GuitarIcon className="h-8 w-8 text-[#6366F1]" />
                          <h6 className="text-xl md:text-2xl font-extrabold tracking-tight text-[#6366F1] dark:white">phis<span className="text-violet-400 dark:text-violet-200">h</span><span className="text-violet-300 dark:text-violet-300">ub</span></h6>
                        </Link>
                        <div className="mt-5 mb-2 border-b dark:border-slate-700"></div>
                        <Link
                          href="/"
                          className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground dark:text-white hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                        >
                          <Home className="h-5 w-5" />
                          Home
                        </Link>
                        <Link
                          href="/tabs"
                          className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground dark:text-white hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                        >
                          <FileMusicIcon className="h-5 w-5 text-fuchsia-500" />
                          Tabs
                        </Link>
                        <Link
                          href="/songs"
                          className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground dark:text-white hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                        >
                          <AudioWaveformIcon className="h-5 w-5 text-cyan-500" />
                          Songs
                        </Link>
                        <Link
                          href="/lyrics"
                          className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground dark:text-white hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                        >
                          <MicVocalIcon className="h-5 w-5 text-violet-500" />
                          Lyrics
                        </Link>
                        <Link
                          href="/lessons"
                          className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground dark:text-white hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                        >
                          <BookOpenCheckIcon className="h-5 w-5 text-yellow-500" />
                          Lessons
                        </Link>
                        <Link
                          href="/performances"
                          className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground dark:text-white hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200"
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
                  {children}
                </main>
              </div>
            </div>
            <Footer />
          </main>
        </body>
      </html>
    );
  }
}

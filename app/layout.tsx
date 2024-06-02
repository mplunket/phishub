import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Footer from "@/components/Footer";
import { createClient } from "@/utils/supabase/server";
import Splash from "@/components/Splash";
import SearchBar from "@/components/SearchBar";
import MobileSidebar from "@/components/MobileSidebar";
import { NavigationItem } from "@/lib/types";
import { GuitarIcon, FileMusicIcon, AudioWaveformIcon, MicVocalIcon, VideoIcon, BookOpenCheckIcon, HeartIcon } from "lucide-react";
import Link from "next/link";
import {
  Home,
  Menu
} from "lucide-react"
import Sidebar from "@/components/Sidebar";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "phishub",
  description: "The #1 Site for Musicians Who Love Phish",
};

const navigation: NavigationItem[] = [
  { title: "Home", href: "/", icon: <Home className="h-5 w-5 text-black" />, color: "text-black" },
  { title: "Tabs", href: "/tabs", icon: <FileMusicIcon className="h-5 w-5 text-fuchsia-500" />, color: "text-fuchsia-500" },
  { title: "Songs", href: "/songs", icon: <AudioWaveformIcon className="h-5 w-5 text-cyan-500" />, color: "text-cyan-500" },
  { title: "Lyrics", href: "/lyrics", icon: <MicVocalIcon className="h-5 w-5 text-violet-500" />, color: "text-violet-500" },
  { title: "Lessons", href: "/lessons", icon: <BookOpenCheckIcon className="h-5 w-5 text-yellow-500" />, color: "text-yellow-500" },
  { title: "Performances", href: "/performances", icon: <VideoIcon className="h-5 w-5 text-green-500" />, color: "text-green-500" }
];

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col items-center bg-slate-900 dark:bg-white">
          <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] bg-white dark:bg-slate-900 dark:text-gray-100">
            <div className="hidden bg-muted/40 md:block">
              <Sidebar navigation={navigation} />
            </div>
            <div className="flex flex-col">
              <header className="flex h-14 justify-center items-center gap-4 bg-muted/40 px-4 lg:h-[60px] lg:px-6 bg-gradient-to-r from-[#9333EA] to-[#6366F1] ">
                <MobileSidebar navigation={navigation} />
                <SearchBar />
              </header>
              <main className="flex flex-1 flex-col gap-4 lg:gap-6">
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

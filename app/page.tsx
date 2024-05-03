/**
 * v0 by Vercel.
 * @see https://v0.dev/t/tHC3fXa8bSH
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { createClient } from "@/utils/supabase/server";
import AuthButton from "../components/AuthButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function Index() {

  const canInitSupabaseClient = () => {
    // This function is just for the interactive tutorial.
    // Feel free to remove it once you have Supabase connected.
    try {
      createClient();
      return true;
    } catch (e) {
      return false;
    }
  };

  const isSupabaseConnected = canInitSupabaseClient();

  return (
    <>
      <section className="w-full pt-8 pb-12 md:pb-24 bg-gradient-to-r from-[#6366F1] to-[#9333EA] text-white">
        <div className="flex justify-end pr-8">{isSupabaseConnected && <AuthButton />}</div>
        <div className="container mx-auto px-4 md:px-6 py-16 flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">phis<span className="text-violet-200">h</span><span className="text-violet-300">ub</span></h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-300">The #1 Site for Musicians Who Love Phish</p>
          <div className="mt-8 w-full max-w-xl">
            <div className="relative">
              <Input
                className="w-full h-12 px-4 pr-12 rounded-full bg-white text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2 shadow-lg"
                placeholder="ex. 'Reba'"
                type="text"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <SearchIcon className="h-6 w-6 text-gray-500" />
              </div>
              <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-md shadow-lg z-10 hidden ">
                <div className="p-2">
                  <Link className="flex items-center px-4 py-2 hover:bg-gray-100 border-b-2 border-b-gray-100 rounded-md cursor-pointer" href="#">
                    <MusicIcon className="h-6 w-6 mr-3 text-cyan-500 flex-shrink-0" />
                    <div className="flex flex-col items-start">
                      <div className="flex font-medium text-gray-500">Reba</div>
                      <Badge variant="song">Song</Badge>
                    </div>
                  </Link>
                  <Link className="flex items-center px-4 py-2 hover:bg-gray-100 border-b-gray-500 rounded-md cursor-pointer" href="#">
                    <StickyNoteIcon className="h-6 w-6 mr-3 text-fuchsia-500 flex-shrink-0" />
                    <div className="flex flex-col items-start">
                      <div className="font-medium text-gray-500">Reba</div>
                      <Badge variant="tab">Tab</Badge>
                    </div>
                  </Link>
                  <Link className="flex items-center px-4 py-2 hover:bg-gray-100 border-b-gray-500 rounded-md cursor-pointer" href="#">
                    <VideoIcon className="h-6 w-6 mr-3 text-green-500 flex-shrink-0" />
                    <div className="flex flex-col items-start">
                      <div className="font-medium text-gray-500">Phish - Reba - 7/13/14 - Randalls Island NYC</div>
                      <Badge variant="video">Video</Badge>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center gap-4">
            <StickyNoteIcon className="h-12 w-12 text-fuchsia-500" />
            <h3 className="text-2xl font-bold dark:text-gray-100">Tabs</h3>
            <p className="text-gray-500 dark:text-gray-400">Study, organize, and contribute guitar, bass, and piano chord charts, tablature, and lyrics</p>
          </div>
          <div className="flex flex-col items-center text-center gap-4">
            <MusicIcon className="h-12 w-12 text-cyan-500" />
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
      <section className="w-full py-12 md:py-18 bg-slate-900 dark:bg-slate-100 dark:bg-gradient-to-b dark:from-slate-200 dark:to-white">
        <h2 className="px-4 text-4xl md:text-5xl text-center font-extrabold tracking-tight text-slate-400 dark:text-gray-500">Ready to get started?</h2>
        <div className="text-center py-10">
          <Button variant="secondary" className="group">
            <Link href="/login">Sign Up for the <span className="text-fuchsia-500">Beta</span></Link> <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </section>
      <section className="w-full footer py-8 text-center text-sm bg-slate-900 text-slate-300 dark:bg-white dark:text-slate-900">
        This site voluntarily complies with the Phish fan web site policy at <Link className="underline dark:hover:text-slate-500 hover:text-slate-100" href="https://www.phish.com/faq/web-guidelines">https://www.phish.com/faq/web-guidelines</Link>.
      </section>
    </>
  )
}

function MusicIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  )
}


function SearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}


function StickyNoteIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z" />
      <path d="M15 3v6h6" />
    </svg>
  )
}


function VideoIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 8-6 4 6 4V8Z" />
      <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
    </svg>
  )
}
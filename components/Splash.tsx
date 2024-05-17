import { GuitarIcon, ChevronRight, FileMusicIcon, AudioWaveformIcon, VideoIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export default async function Splash() {
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
import { createClient } from "@/utils/supabase/client";
import { NavigationItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import AuthButton from "@/components/AuthButton"
import { GuitarIcon, FileMusicIcon, AudioWaveformIcon, MicVocalIcon, VideoIcon, BookOpenCheckIcon, HeartIcon } from "lucide-react";
import {
    Home,
    Menu
} from "lucide-react"
import Link from "next/link";

export default function Sidebar({
    navigation,
}: {
    navigation: NavigationItem[]
}) {

    return (

        <div className="flex h-full max-h-screen flex-col gap-2 transition-width duration-300">
            <div className="flex h-14 items-center px-4 lg:h-[60px] lg:px-6 bg-gradient-to-r from-[#6366F1] to-[#9333EA] text-white">
                <Link href="/" className="flex items-center gap-2 font-semibold hover:animate-pulse">
                    <GuitarIcon className="h-6 w-6" />
                    <h6 className="text-xl md:2xl font-extrabold tracking-tight">phis<span className="text-violet-200">h</span><span className="text-violet-300">ub</span></h6>
                </Link>
            </div>
            <div className="flex-1 px-5 py-2">
                <nav className="grid gap-2 text-lg font-medium">
                    {navigation.map((navItem: NavigationItem) => (
                        <>
                            <Link
                                href={navItem.href}
                                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground dark:text-white hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200">
                                {navItem.icon}
                                {navItem.title}
                            </Link>
                        </>
                    ))}
                </nav>
                <div className="text-center pt-5">
                    <AuthButton />
                </div>
            </div>
        </div>
    )
}
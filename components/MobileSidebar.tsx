import { createClient } from "@/utils/supabase/client";
import { NavigationItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import AuthButton from "@/components/AuthButton";
import { GuitarIcon, FileMusicIcon, AudioWaveformIcon, MicVocalIcon, VideoIcon, BookOpenCheckIcon, HeartIcon } from "lucide-react";
import {
    Home,
    Menu
} from "lucide-react"
import Link from "next/link";

export default async function MobileSidebar({
    navigation,
}: {
    navigation: NavigationItem[]
}) {

    return (

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
                    {navigation.map((navItem: NavigationItem, index) => (
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
            </SheetContent>
        </Sheet>
    )
}
import Link from "next/link";
import {
  Music,
  Heart,
  ListMusic,
  BookOpen,
  Play,
  Plus,
  ArrowRight,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { SearchBar } from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { TabTypeBadge } from "@/components/tab-type-badge";
import {
  getRecentTabs,
  getSetlists,
  getFavoriteTabsForUser,
} from "@/lib/api";

const quickLinks = [
  {
    href: "/songs",
    title: "Browse songs",
    description: "950+ Phish songs",
    icon: Music,
    accent: "text-purple-600",
  },
  {
    href: "/tabs",
    title: "Latest tabs",
    description: "Newest tabs & chords",
    icon: BookOpen,
    accent: "text-orange-500",
  },
  {
    href: "/favorites",
    title: "Your favorites",
    description: "Saved tabs & chords",
    icon: Heart,
    accent: "text-rose-500",
  },
  {
    href: "/setlists",
    title: "Setlists",
    description: "Build & perform sets",
    icon: ListMusic,
    accent: "text-emerald-600",
  },
];

export default async function DashboardHome() {
  const [recentTabs, setlists, favorites] = await Promise.all([
    getRecentTabs(6),
    getSetlists(4),
    getFavoriteTabsForUser(),
  ]);

  return (
    <DashboardShell>
      <div className="container max-w-5xl space-y-10 py-8">
        {/* Hero / quick search */}
        <section className="text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Find a tab,{" "}
            <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
              start playing
            </span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Search a song to jump straight to its tabs, chords, and lyrics.
          </p>
          <div className="mt-5">
            <SearchBar />
          </div>
        </section>

        {/* Quick links */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group rounded-xl border bg-card p-4 transition-colors hover:border-primary"
            >
              <link.icon className={`h-6 w-6 ${link.accent}`} />
              <p className="mt-3 font-semibold">{link.title}</p>
              <p className="text-sm text-muted-foreground">
                {link.description}
              </p>
            </Link>
          ))}
        </section>

        {/* Your favorites */}
        {favorites.length > 0 && (
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your favorites</h2>
              <Button asChild variant="ghost" size="sm">
                <Link href="/favorites">
                  View all <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.slice(0, 6).map((tab) => (
                <Link
                  key={tab.id}
                  href={`/songs/${tab.song.slug}`}
                  className="flex items-center justify-between rounded-lg border bg-card p-3 transition-colors hover:border-primary"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{tab.song.song}</p>
                    <div className="mt-1">
                      <TabTypeBadge type={tab.type} />
                    </div>
                  </div>
                  <Heart className="h-4 w-4 shrink-0 fill-rose-500 text-rose-500" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Recent tabs */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recently added tabs</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/tabs">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          {recentTabs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No tabs yet. Be the first to add one.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {recentTabs.map((tab) => (
                <Link
                  key={tab.id}
                  href={`/songs/${tab.song.slug}`}
                  className="rounded-lg border bg-card p-3 transition-colors hover:border-primary"
                >
                  <p className="truncate font-medium">{tab.song.song}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <TabTypeBadge type={tab.type} />
                    <span className="truncate text-xs text-muted-foreground">
                      by {tab.user?.username ?? "Unknown"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Setlists */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Setlists</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/setlists/new">
                <Plus className="mr-1 h-4 w-4" /> New
              </Link>
            </Button>
          </div>
          {setlists.length === 0 ? (
            <div className="rounded-xl border border-dashed p-6 text-center">
              <p className="mb-3 text-sm text-muted-foreground">
                Create a setlist to use as a hands-free cheat sheet on stage.
              </p>
              <Button asChild size="sm">
                <Link href="/setlists/new">Create your first setlist</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {setlists.map((setlist) => (
                <div
                  key={setlist.id}
                  className="flex items-center justify-between gap-2 rounded-lg border bg-card p-4"
                >
                  <Link
                    href={`/setlists/${setlist.id}`}
                    className="min-w-0 flex-1"
                  >
                    <p className="truncate font-medium">{setlist.name}</p>
                    {setlist.venue && (
                      <p className="truncate text-sm text-muted-foreground">
                        {setlist.venue}
                      </p>
                    )}
                  </Link>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/setlists/${setlist.id}/perform`}>
                      <Play className="mr-1 h-4 w-4" /> Perform
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}

import { getRecentTabs } from "@/lib/api";
import { TabTypeBadge } from "@/components/tab-type-badge";
import Link from "next/link";

export default async function TabsPage() {
  const tabs = await getRecentTabs();

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-4 sm:text-3xl">Tabs</h1>

      {tabs.length === 0 ? (
        <p className="text-muted-foreground">No tabs have been added yet.</p>
      ) : (
        <div className="divide-y overflow-hidden rounded-lg border">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={`/songs/${tab.song.slug}`}
              className="flex items-center justify-between gap-3 px-3 py-2.5 transition-colors hover:bg-accent"
            >
              <div className="min-w-0">
                <h3 className="truncate font-medium leading-tight">
                  {tab.song.song}
                </h3>
                <p className="truncate text-xs text-muted-foreground">
                  by {tab.user?.username ?? "Unknown"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2.5">
                <TabTypeBadge type={tab.type} />
                <span className="hidden text-xs text-muted-foreground sm:inline">
                  {new Date(tab.created_at).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

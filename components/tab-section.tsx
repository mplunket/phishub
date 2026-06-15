"use client";
import * as React from "react";
import { TabSelector } from "@/components/tab-selector";
import { TabViewer } from "@/components/tab-viewer";
import { FavoriteButton } from "@/components/favorite-button";
import { EditTabDialog } from "@/components/edit-tab-dialog";
import { ReportDialog } from "@/components/report-dialog";
import { AddTabDialog } from "@/components/add-tab-dialog";

export function TabSection({
  tabs,
  userFavoriteTabIds = [],
  canFavorite = false,
  canAddTab = false,
  currentUserId,
  songId,
  slug,
  revalidate,
}: {
  tabs: Array<{
    id: string;
    type: string;
    favorites: number;
    author_id: string;
    user: { username: string; avatar_url?: string };
    content: string;
  }>;
  userFavoriteTabIds?: string[];
  canFavorite?: boolean;
  canAddTab?: boolean;
  currentUserId?: string;
  songId?: string;
  slug?: string;
  revalidate?: string;
}) {
  const [selectedTabId, setSelectedTabId] = React.useState<string | undefined>(
    undefined
  );
  const selectedTab = tabs.find((t) => t.id === selectedTabId) || tabs[0];

  if (tabs.length === 0) {
    return (
      <p className="text-muted-foreground py-8">
        No tabs yet. Be the first to add one!
      </p>
    );
  }

  return (
    <div>
      {/* One toolbar: "which tab" on the left, actions on the selected tab
          (plus the secondary "add tab") grouped together on the right. */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="min-w-0 flex-1">
          <TabSelector
            tabs={tabs.map((tab) => ({
              id: tab.id,
              name: tab.user?.username ?? "Unknown", // label for the option
              type: tab.type,
              favorites: tab.favorites,
            }))}
            userFavoriteTabIds={userFavoriteTabIds}
            onSelect={setSelectedTabId}
          />
        </div>
        <div className="flex items-center gap-1.5">
          {canFavorite && selectedTab && (
            <FavoriteButton
              tabId={selectedTab.id}
              initialFavorited={userFavoriteTabIds.includes(selectedTab.id)}
              initialCount={selectedTab.favorites}
              revalidate={revalidate}
            />
          )}
          {selectedTab && currentUserId === selectedTab.author_id && (
            <EditTabDialog tab={selectedTab} revalidate={revalidate} />
          )}
          {/* Signed-in users (who aren't the author) can flag a tab. */}
          {canFavorite &&
            selectedTab &&
            currentUserId !== selectedTab.author_id && (
              <ReportDialog tabId={selectedTab.id} />
            )}
          {canAddTab && songId && slug && (
            <AddTabDialog songId={songId} slug={slug} variant="outline" />
          )}
        </div>
      </div>
      <TabViewer tab={selectedTab} />
    </div>
  );
}

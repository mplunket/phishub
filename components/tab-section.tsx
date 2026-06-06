"use client";
import * as React from "react";
import { TabSelector } from "@/components/tab-selector";
import { TabViewer } from "@/components/tab-viewer";
import { FavoriteButton } from "@/components/favorite-button";

export function TabSection({
  tabs,
  userFavoriteTabIds = [],
  canFavorite = false,
  revalidate,
}: {
  tabs: Array<{
    id: string;
    type: string;
    favorites: number;
    user: { username: string; avatar_url?: string };
    content: string;
  }>;
  userFavoriteTabIds?: string[];
  canFavorite?: boolean;
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
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1">
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
        {canFavorite && selectedTab && (
          <FavoriteButton
            tabId={selectedTab.id}
            initialFavorited={userFavoriteTabIds.includes(selectedTab.id)}
            initialCount={selectedTab.favorites}
            revalidate={revalidate}
          />
        )}
      </div>
      <TabViewer tab={selectedTab} />
    </div>
  );
}

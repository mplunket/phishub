"use client";
import * as React from "react";
import { TabSelector } from "@/components/tab-selector";
import { TabViewer } from "@/components/tab-viewer";

export function TabSection({
  tabs,
  userFavoriteTabIds = [],
}: {
  tabs: Array<{
    id: string;
    type: string;
    favorites: number;
    user: { username: string; avatar_url?: string };
    content: string;
  }>;
  userFavoriteTabIds?: string[];
}) {
  const [selectedTabId, setSelectedTabId] = React.useState<string | undefined>(
    undefined
  );
  const selectedTab = tabs.find((t) => t.id === selectedTabId) || tabs[0];

  return (
    <div>
      <TabSelector
        tabs={tabs.map((tab) => ({
          id: tab.id,
          name: tab.user.username, // or another appropriate value for 'name'
          type: tab.type,
          favorites: tab.favorites,
        }))}
        userFavoriteTabIds={userFavoriteTabIds}
        onSelect={setSelectedTabId}
      />
      <TabViewer tab={selectedTab} />
    </div>
  );
}

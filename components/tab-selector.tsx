"use client";
import * as React from "react";
import { useIsMobile } from "@/components/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TabTypeBadge } from "@/components/tab-type-badge";
import { ChevronsUpDown, Star } from "lucide-react";

export function TabSelector({
  tabs,
  userFavoriteTabIds = [],
  onSelect,
}: {
  tabs: Array<{ id: string; name: string; type: string; favorites: number }>;
  userFavoriteTabIds?: string[];
  onSelect: (tabId: string) => void;
}) {
  // Sort: user favorite(s) first, then by favorites count desc
  const sortedTabs = React.useMemo(() => {
    if (!tabs.length) return [];
    if (userFavoriteTabIds.length > 0) {
      return [
        ...tabs
          .filter((t) => userFavoriteTabIds.includes(t.id))
          .sort((a, b) => b.favorites - a.favorites),
        ...tabs
          .filter((t) => !userFavoriteTabIds.includes(t.id))
          .sort((a, b) => b.favorites - a.favorites),
      ];
    }
    return [...tabs].sort((a, b) => b.favorites - a.favorites);
  }, [tabs, userFavoriteTabIds]);

  // Default: user's favorite (most-favorited if multiple), else most-favorited overall
  const defaultTabId = React.useMemo(() => {
    if (userFavoriteTabIds.length > 0) {
      const favTabs = tabs.filter((t) => userFavoriteTabIds.includes(t.id));
      return favTabs.sort((a, b) => b.favorites - a.favorites)[0]?.id;
    }
    return sortedTabs[0]?.id;
  }, [tabs, userFavoriteTabIds, sortedTabs]);

  const [selectedTabId, setSelectedTabId] = React.useState(defaultTabId);
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (selectedTabId) onSelect(selectedTabId);
  }, [selectedTabId, onSelect]);

  const tabOptions = sortedTabs.map((tab) => ({
    value: tab.id,
    name: tab.name,
    type: tab.type,
    favorites: tab.favorites,
    isFavorite: userFavoriteTabIds.includes(tab.id),
  }));

  const selected = tabOptions.find((o) => o.value === selectedTabId);

  // Color-coded type pill, then the author ("by …"), then favorite count.
  const renderAttribution = (
    option: (typeof tabOptions)[number],
    { emphasizeAuthor = false }: { emphasizeAuthor?: boolean } = {}
  ) => (
    <span className="flex min-w-0 items-center gap-2">
      {option.isFavorite && (
        <Star className="h-4 w-4 shrink-0 text-yellow-500" />
      )}
      <TabTypeBadge type={option.type} />
      <span
        className={
          emphasizeAuthor
            ? "truncate text-sm"
            : "truncate text-sm text-muted-foreground"
        }
      >
        by {option.name}
      </span>
      {option.favorites > 0 && (
        <span className="shrink-0 text-xs text-muted-foreground">
          ★{option.favorites}
        </span>
      )}
    </span>
  );

  // Only one tab — there's nothing to switch between, so show a plain
  // attribution line instead of a dropdown that implies a choice.
  if (tabOptions.length <= 1) {
    const only = tabOptions[0];
    if (!only) return null;
    return (
      <div className="flex h-9 items-center px-1">
        {renderAttribution(only)}
      </div>
    );
  }

  const triggerButton = (
    <Button variant="outline" className="w-full justify-between">
      {selected ? (
        renderAttribution(selected, { emphasizeAuthor: true })
      ) : (
        <span className="text-muted-foreground">Select a tab…</span>
      )}
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  );

  const ComboList = (
    <Command>
      <CommandInput placeholder="Filter tabs by author…" />
      <CommandList>
        <CommandEmpty>No tabs found.</CommandEmpty>
        <CommandGroup>
          {tabOptions.map((option) => (
            <CommandItem
              key={option.value}
              value={option.value}
              keywords={[option.name, option.type]}
              onSelect={() => {
                setSelectedTabId(option.value);
                setOpen(false);
              }}
            >
              {renderAttribution(option)}
              {option.value === selectedTabId && (
                <Star className="ml-auto h-4 w-4 shrink-0 text-purple-600" />
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );

  if (!isMobile) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          {ComboList}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">{ComboList}</div>
      </DrawerContent>
    </Drawer>
  );
}

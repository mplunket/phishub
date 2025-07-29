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
import { Star } from "lucide-react";

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
    label:
      `${tab.name} (${tab.type}) ${tab.favorites ? `★${tab.favorites}` : ""}`.trim(),
    icon: userFavoriteTabIds.includes(tab.id) ? (
      <Star className="text-yellow-500 w-4 h-4" />
    ) : undefined,
  }));

  const selected = tabOptions.find((o) => o.value === selectedTabId);

  const ComboList = (
    <Command>
      <CommandInput placeholder="Filter tabs..." />
      <CommandList>
        <CommandEmpty>No tabs found.</CommandEmpty>
        <CommandGroup>
          {tabOptions.map((option) => (
            <CommandItem
              key={option.value}
              value={option.value}
              onSelect={() => {
                setSelectedTabId(option.value);
                setOpen(false);
              }}
            >
              {option.icon}
              {option.label}
              {option.value === selectedTabId && (
                <Star className="w-4 h-4 ml-auto text-purple-600" />
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
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="flex items-center gap-2">
              {selected?.icon}
              {selected ? selected.label : <>Select a tab...</>}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          {ComboList}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span className="flex items-center gap-2">
            {selected?.icon}
            {selected ? selected.label : <>Select a tab...</>}
          </span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">{ComboList}</div>
      </DrawerContent>
    </Drawer>
  );
}

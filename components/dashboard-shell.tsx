import { ReactNode } from "react";
import {
  Music,
  Users,
  Heart,
  List,
  Upload,
  MessageCircle,
  Share2,
  Guitar,
  Star,
  BookOpen,
  Video,
} from "lucide-react";
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarInset,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { SearchBar } from "@/components/search-bar";
import { DashboardHeader } from "@/components/dashboard-header";
import { waitlistDisabled } from "@/flags";
import { cn } from "@/lib/utils";

const items = [
  { title: "Songs", url: "/songs", icon: Music, color: "text-purple-600" },
  { title: "Tabs", url: "/tabs", icon: BookOpen, color: "text-blue-500" },
  { title: "Videos", url: "/videos", icon: Video, color: "text-orange-500" },
  { title: "Favorites", url: "/favorites", icon: Heart, color: "text-rose-500" },
  { title: "Setlists", url: "/setlists", icon: List, color: "text-emerald-500" },
];

export async function DashboardShell({ children }: { children: ReactNode }) {
  const waitlist = await waitlistDisabled();

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarContent>
          <Link className="flex items-center pt-4 pl-4" href="/">
            <Guitar className="h-8 w-8 text-purple-600" />
            <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
              Phishub
            </span>
          </Link>
          <SearchBar shadow={false} />
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1.5">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild size="lg">
                      <a href={item.url}>
                        <item.icon className={cn("!size-6", item.color)} />
                        <span className="text-base font-medium">
                          {item.title}
                        </span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <DashboardHeader hideWaitlist={waitlist} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

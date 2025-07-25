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
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { SearchBar } from "@/components/search-bar";
import { UserMenu } from "@/components/user-menu";
import { waitlistDisabled } from "@/flags";

const items = [
  { title: "Tabs", url: "/tabs", icon: BookOpen },
  { title: "Videos", url: "/videos", icon: Video },
  { title: "Favorites", url: "/favorites", icon: Heart },
  { title: "Setlists", url: "/setlists", icon: List },
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
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
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
        <main>
          <div className="w-full flex items-center justify-between pl-4 pt-2 pb-2 pr-4">
            <SidebarTrigger />
            <UserMenu hideWaitlist={waitlist} />
          </div>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

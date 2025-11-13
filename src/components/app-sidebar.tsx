import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Globe,
  Telescope,
  Zap,
  Network,
  MessageSquare,
  Database,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Globe,
  },
  {
    title: "Objects",
    url: "/objects",
    icon: Telescope,
  },
  {
    title: "Events",
    url: "/events",
    icon: Zap,
  },
  {
    title: "Patterns",
    url: "/patterns",
    icon: Network,
  },
  {
    title: "AI Assistant",
    url: "/ai",
    icon: MessageSquare,
  },
  {
    title: "Data Sources",
    url: "/sources",
    icon: Database,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">
              Nexus Cosmos Map
            </span>
            <Badge
              variant="outline"
              className="w-fit text-[10px] px-1.5 py-0 h-4 bg-amber-500/10 text-amber-400 border-amber-500/20"
              data-testid="badge-prototype"
            >
              Prototype
            </Badge>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-muted-foreground px-4 py-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarMenu>
            {menuItems.map((item) => {
              const isActive = location === item.url;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : ""
                    }
                    data-testid={`link-${item.title.toLowerCase().replace(" ", "-")}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-muted-foreground">
          <p className="font-mono">v1.0.0-alpha</p>
          <p className="mt-1">Explore the cosmos</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

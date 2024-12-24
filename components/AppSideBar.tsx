import { RouteItems } from "@/utils/config";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "./ui/SideBar";
import Link from "next/link";
import { ThemeToggle } from "./Drawer/SideDrawer";

export function AppSidebar() {
  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarTrigger className="flex ml-auto" />
      <SidebarHeader className="flex mx-auto mb-8">
        Viable Product
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="flex items-center space-y-4 mx-0">
              {RouteItems.map((item) => (
                <SidebarMenuItem key={item.text}>
                  <SidebarMenuButton asChild className="space-x-4">
                    <Link href={item.href}>
                      <item.icon />
                      <span className="">{item.text}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}

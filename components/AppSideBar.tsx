"use client";
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
  useSidebar,
} from "./ui/SideBar";
import Link from "next/link";
import { ThemeToggle } from "./Drawer/SideDrawer";

export function AppSidebar() {
  const {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  } = useSidebar();

  console.log(isMobile);

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarTrigger className="flex ml-auto" />
      <SidebarHeader className="flex mx-auto mb-8">
        {isMobile || state === "collapsed" ? "VP" : "Viable Product"}
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

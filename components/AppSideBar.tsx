"use client";
import { RouteItems } from "@/utils/config";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "./ui/SideBar";
import Link from "next/link";
import { ThemeToggle } from "./Drawer/SideDrawer";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/Sheet";
import { Logo, ShortenedLogo } from "./Logo";

export function AppSidebar() {
  const { state, openMobile, setOpenMobile, isMobile } = useSidebar();

  return (
    <>
      <div className="flex items-center md:hidden fixed top-4 left-4 z-50">
        <div className="relative w-28 h-10">
          <ShortenedLogo />
        </div>
        <SidebarTrigger />
      </div>

      {/* Mobile drawer */}
      {isMobile ? (
        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
            <SheetHeader className="p-6 pb-0">
              <SheetTitle className="font-extrabold">Viable Product</SheetTitle>
            </SheetHeader>
            <div className="flex h-full w-full flex-col p-6 pt-2">
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu className="flex flex-col space-y-4">
                      {RouteItems.map((item) => (
                        <SidebarMenuItem key={item.text}>
                          <SidebarMenuButton
                            asChild
                            className="flex items-center space-x-4"
                            onClick={() => setOpenMobile(false)} // Close drawer when clicking a link
                          >
                            <Link href={item.href}>
                              <item.icon />
                              <span>{item.text}</span>
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
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        // Desktop sidebar
        <Sidebar collapsible="icon">
          <SidebarTrigger
            className={`${
              state === "collapsed" ? "mx-auto" : "ml-auto relative right-3"
            } flex`}
          />
          <SidebarHeader className="none"></SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="flex items-center space-y-4 mx-0">
                  {RouteItems.map((item) => (
                    <SidebarMenuItem key={item.text}>
                      <SidebarMenuButton asChild className="space-x-4">
                        <Link href={item.href}>
                          <item.icon />
                          {state !== "collapsed" && <span>{item.text}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            {state === "expanded" ? <ThemeToggle /> : <></>}
          </SidebarFooter>
        </Sidebar>
      )}
    </>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerClose,
  DrawerTitle,
} from "./StandardDrawer";

import { useTheme } from "next-themes";
import { Button } from "../ui/Button";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { useSidebar } from "../ui/SideBar";
import { ShortenedLogo } from "../Logo";
import { CombinedThemeIcons, MoonIcon, SunIcon } from "@/lib/Icon";
import { RouteItems } from "../../../utils/config";

export const DrawerMenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="2.5"
    stroke="currentColor"
    className="size-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);

export const ThemeToggle = () => {
  const { setTheme, theme } = useTheme();
  const { isMobile } = useSidebar();

  const themeOptions = [
    { value: "dark", icon: MoonIcon },
    { value: "light", icon: SunIcon },
    { value: "system", icon: CombinedThemeIcons },
  ];

  return (
    <div className="flex flex-col items-center space-y-2">
      <ToggleGroup
        type="single"
        variant="outline"
        value={theme}
        defaultValue="system"
      >
        {themeOptions.map(({ value, icon }) => (
          <ToggleGroupItem
            key={value}
            value={value}
            onClick={() => setTheme(value)}
            className="data-[state=on]:bg-accent"
          >
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};
const SideDrawer = () => (
  <>
    <Drawer>
      <DrawerTrigger className="absolute top-4 left-4">
        <DrawerMenuIcon />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="mb-4">
          <ShortenedLogo />
          <DrawerTitle className="font-bold">Viable Product</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 space-y-8">
          {RouteItems.map((elements) => (
            <Button
              asChild
              className="flex items-center space-x-4"
              variant={"link"}
              key={elements.key}
            >
              <Link href={elements.href}>
                <elements.icon />
                <span>{elements.text}</span>
              </Link>
            </Button>
          ))}
          <ThemeToggle />
        </div>
        <DrawerFooter>
          <DrawerClose />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  </>
);

export default SideDrawer;

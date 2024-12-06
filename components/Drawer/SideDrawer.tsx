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
} from "./StandardDrawer";
import { RouteItems } from "@/utils/config";
import { Button } from "../Button";

const DrawerMenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    className="size-6"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);

const SideDrawer = () => (
  <>
    <Drawer>
      <DrawerTrigger className="absolute top-4 left-4">
        <DrawerMenuIcon />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader></DrawerHeader>
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
        </div>
        <DrawerFooter>
          <DrawerClose />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  </>
);

export default SideDrawer;

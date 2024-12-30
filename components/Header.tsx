"use client";

import { SearchBar } from "./SearchBar";
import { AuthButton } from "./AuthButton";
import { useSidebar } from "./ui/SideBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/DropDownMenu";
import { UserCircleIcon } from "@/lib/Icon";
import { ThemeToggle } from "./Drawer/SideDrawer";
import Image from "next/image";
import { Logo } from "./Logo";

const UserDropDown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserCircleIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <ThemeToggle />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default function Header() {
  const { isMobile } = useSidebar();
  return isMobile ? (
    <div className="mx-4 mt-4">
      <div className=" flex flex-row-reverse md:flex-row ml-auto md:justify-between gap-4 mt-2 align-middle">
        {isMobile && <UserDropDown />}
        <div className="flex align-middle items-center gap-4 mr-auto">
          <div className="hidden md:block relative h-10 w-36">
            <Logo />
            {!isMobile && <AuthButton />}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <SearchBar />
      </div>
    </div>
  ) : (
    <div className="mx-4 mt-4">
      <div className=" flex flex-row-reverse md:flex-row ml-auto md:justify-between gap-4 mt-2 align-middle">
        {isMobile && <UserDropDown />}
        <div className="flex align-middle items-center gap-4 mr-auto">
          <div className="hidden md:block relative h-10 w-36">
            <Logo />
          </div>
          <div>
            <SearchBar />
          </div>
        </div>
        {!isMobile && <AuthButton />}
      </div>
    </div>
  );
}

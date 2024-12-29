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
  return (
    <div className="mx-4">
      <div className=" flex flex-row-reverse md:flex-row ml-auto md:justify-between gap-4 mt-2 align-middle">
        {isMobile && <UserDropDown />}

        <SearchBar />
        {!isMobile && <AuthButton />}
      </div>
    </div>
  );
}

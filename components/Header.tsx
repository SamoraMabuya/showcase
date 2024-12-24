"use client";

import { SearchBar } from "./SearchBar";
import { AuthButton } from "./AuthButton";
import SideDrawer from "./Drawer/SideDrawer";

export default function Header() {
  return (
    <div className="mx-4">
      <div className="flex flex-row justify-between gap-16 mt-2 align-middle">
        <div>{/* <SideDrawer /> */}</div>
        <div>
          <AuthButton />
        </div>
      </div>
      <div className="my-10">
        <SearchBar />
      </div>
    </div>
  );
}

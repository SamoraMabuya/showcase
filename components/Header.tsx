import { Filter } from "lucide-react";
import NextLogo from "./NextLogo";
import SupabaseLogo from "./SupabaseLogo";
import { Textarea } from "./Textarea";

import { Button } from "@/components/Button";
import SideDrawer from "./Drawer";

const SignInButton = () => (
  <Button className="md: float-end" variant={"outline"}>
    Sign In
  </Button>
);

const FilterSearch = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
    />
  </svg>
);

export function SearchBoxWithText() {
  return (
    <div className="gap-0.5 md:min-w-[42%]">
      <Textarea placeholder="Type your message here." id="message-2" />
      <div className="flex flex-row justify-between">
        <p className="text-sm text-muted-foreground mt-2">
          What app are looking for?
        </p>
        <FilterSearch />
      </div>
    </div>
  );
}

export default function Header() {
  return (
    <div className="mx-4">
      <div className="flex flex-row justify-between gap-16 mt-2 align-middle">
        <div>
          <SideDrawer />
        </div>
        <div>
          <SignInButton />
        </div>
      </div>
      <div className="mt-10">
        <SearchBoxWithText />
      </div>
    </div>
  );
}

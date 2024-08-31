import { Filter } from "lucide-react";
import NextLogo from "./NextLogo";
import SupabaseLogo from "./SupabaseLogo";

import { Button } from "@/components/Button";
import SideDrawer from "./Drawer";
import { Textarea } from "./TextArea";

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
        <small className="text-sm text-muted-foreground mt-2">
          What app are looking for?
        </small>
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

// import NextLogo from "./NextLogo";
// import SupabaseLogo from "./SupabaseLogo";

// export default function Header() {
//   return (
//     <div className="flex flex-col gap-16 items-center">
//       <div className="flex gap-8 justify-center items-center">
//         <a
//           href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
//           target="_blank"
//           rel="noreferrer"
//         >
//           <SupabaseLogo />
//         </a>
//         <span className="border-l rotate-45 h-6" />
//         <a href="https://nextjs.org/" target="_blank" rel="noreferrer">
//           <NextLogo />
//         </a>
//       </div>
//       <h1 className="sr-only">Supabase and Next.js Starter Template</h1>
//       <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
//         The fastest way to build apps with{" "}
//         <a
//           href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
//           target="_blank"
//           className="font-bold hover:underline"
//           rel="noreferrer"
//         >
//           Supabase
//         </a>{" "}
//         and{" "}
//         <a
//           href="https://nextjs.org/"
//           target="_blank"
//           className="font-bold hover:underline"
//           rel="noreferrer"
//         >
//           Next.js
//         </a>
//       </p>
//       <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
//     </div>
//   );
// }

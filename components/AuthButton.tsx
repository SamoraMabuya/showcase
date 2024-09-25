import Link from "next/link";
import { buttonVariants } from "./Button";
import { useAuth } from "@/app/hooks/useAuth";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { createClient } from "@/utils/supabase/client";

export function AuthButton() {
  const { user, isLoading } = useAuth();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <button
            className={buttonVariants({
              variant: "ghost",
              className: "md:float-end",
            })}
          >
            {user.email}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-50">
          <button
            onClick={handleSignOut}
            className={buttonVariants({
              variant: "ghost",
              className: "w-full",
            })}
          >
            Sign Out
          </button>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Link
      href="/login"
      className={buttonVariants({
        variant: "outline",
        className: "md:float-end",
      })}
    >
      Sign In
    </Link>
  );
}

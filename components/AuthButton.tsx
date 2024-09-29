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

  if (user) {
    const displayName =
      user.user_metadata?.username ||
      user.user_metadata?.display_name ||
      user.email ||
      "User";

    return (
      <Popover>
        <PopoverTrigger asChild>
          <button
            className={buttonVariants({
              variant: "ghost",
              className: "md:float-end",
            })}
          >
            {displayName}
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

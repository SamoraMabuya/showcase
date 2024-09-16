"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { buttonVariants } from "./Button";

export function AuthButton() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (isAuthenticated) {
    return (
      <button
        onClick={handleSignOut}
        className={buttonVariants({
          variant: "outline",
          className: "md: float-end",
        })}
      >
        Sign Out
      </button>
    );
  }

  return (
    <Link
      href="/login"
      className={buttonVariants({
        variant: "outline",
        className: "md: float-end",
      })}
    >
      Sign In
    </Link>
  );
}

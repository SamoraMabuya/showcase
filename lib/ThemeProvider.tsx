"use client";

import { useState, useEffect } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  const [mounted, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <NextThemesProvider
        attribute={"class"}
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </NextThemesProvider>
    </>
  );
}

"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Search } from "lucide-react";
import { Input } from "./Input";
import { Button } from "./Button";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?${createQueryString("q", searchQuery.trim())}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="relative mx-auto flex w-full max-w-screen-sm items-center justify-center"
    >
      <Input
        type="text"
        placeholder="Search apps..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="rounded-r-none"
      />
      <Button type="submit" size="icon" className="right-0 rounded-l-none">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
}

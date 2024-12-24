"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/Tooltip";

interface CoinsAwardedProps {
  videoId: string;
}

/*************  ✨ Codeium Command ⭐  *************/
/**
 * A small coin icon, used in the CoinsAwarded component to
 * represent coins.
 * @returns A small coin icon.
 */
/******  1c73ac45-b31f-489c-88e5-c1cbbbd16a32  *******/ const CoinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="size-6 fill-amber-400 stroke-amber-400"
  >
    <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z"
      clipRule="evenodd"
    />
  </svg>
);

const SendIcon = () => (
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
      d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
    />
  </svg>
);

export default function CoinsAwarded({ videoId }: CoinsAwardedProps) {
  const [coins, setCoins] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [showInput, setShowInput] = useState<boolean>(false);
  const [coinsToAward, setCoinsToAward] = useState<string>("");
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);
  const [tooltipContent, setTooltipContent] = useState<string>("");
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowInput(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchTotalCoins();
  }, [videoId]);

  const fetchTotalCoins = async () => {
    const { data, error } = await supabase
      .from("videos")
      .select("total_coins")
      .eq("id", videoId)
      .single();

    if (error) {
      console.error("Error fetching total coins:", error.message);
    } else {
      setCoins(data?.total_coins || 0);
    }
    setLoading(false);
  };

  const handleCoinsClick = () => {
    if (!user) {
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
    } else {
      setShowInput(true);
    }
  };

  const handleAwardCoins = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const coinsAmount = parseInt(coinsToAward, 10);
    if (isNaN(coinsAmount) || coinsAmount <= 0) {
      setTooltipContent("Please enter a valid number of coins.");
      setTooltipOpen(true);
      setTimeout(() => setTooltipOpen(false), 3000);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.rpc("award_coins", {
      video_id: videoId,
      amount: coinsAmount,
    });

    if (error) {
      console.error("Error awarding coins:", error.message);
      setTooltipContent("Failed to award coins. Please try again.");
      setTooltipOpen(true);
      setTimeout(() => setTooltipOpen(false), 3000);
    } else {
      setCoins(coins + coinsAmount);
      setCoinsToAward("");
      setShowInput(false);
    }
    setLoading(false);
  };

  if (loading) {
    return <p>Loading total coins awarded...</p>;
  }

  return (
    <TooltipProvider>
      <div className="flex items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={handleCoinsClick}>
              <CoinIcon />
              <Label className="ml-3" htmlFor="coins">
                {coins > 0 ? coins : 0}
              </Label>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Click to award coins</TooltipContent>
        </Tooltip>
        {showInput && (
          <div ref={inputRef} className="relative ml-2">
            <form onSubmit={handleAwardCoins}>
              <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
                <TooltipTrigger asChild>
                  <div className="flex">
                    <Input
                      type="number"
                      value={coinsToAward}
                      onChange={(e) => setCoinsToAward(e.target.value)}
                      placeholder="Enter coins"
                      className="pr-10 w-32"
                      onBlur={() => !coinsToAward && setShowInput(false)}
                    />
                    <Button
                      type="submit"
                      disabled={loading}
                      className="absolute right-0 top-0 bottom-0"
                    >
                      <SendIcon />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {tooltipContent ||
                    "Enter a valid number of coins. Click away to cancel."}
                </TooltipContent>
              </Tooltip>
            </form>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

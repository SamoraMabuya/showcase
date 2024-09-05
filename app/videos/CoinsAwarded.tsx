"use client"; // This ensures it's a client-side component
import { Button } from "@/components/Button";
import Coins from "@/components/Coins";
import { Label } from "@/components/Label";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";

interface CoinsAwardedProps {
  videoId: string; // The video being awarded
  userId: string; // The user awarding the coins
}

export default function CoinsAwarded({ videoId, userId }: CoinsAwardedProps) {
  const [coins, setCoins] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTotalCoins = async () => {
      const { data, error } = await createClient()
        .from("videos")
        .select("total_coins") // Fetch only the coins_awarded column
        .eq("id", videoId);

      if (error) {
        console.error("Error fetching total coins:", error.message);
        setError("Failed to load total coins.");
      } else {
        const total = data.reduce(
          (sum: number, award: { total_coins: number }) =>
            sum + award.total_coins,
          0
        );
        setCoins(total);
      }
      setLoading(false);
    };

    fetchTotalCoins();
  }, [videoId]);

  if (loading) {
    return <p>Loading total coins awarded...</p>;
  }

  return <Coins coins={coins} />;
}

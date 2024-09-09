import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import { createClient } from "@/utils/supabase/client";
import { Suggested, Videos } from "../../lib/types";
import Coins from "@/components/Coins";
import Likes from "./Likes";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import dayjs from "dayjs";
import VideoGrid from "@/components/VideoGrid";

export default function SuggestedVideos({ currentVideoId }: Suggested) {
  const [suggestedVideos, setSuggestedVideos] = useState<Videos[]>([]); // Use type annotations for state
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state

  useEffect(() => {
    const fetchSuggestedVideos = async () => {
      setLoading(true);
      const { data, error } = await createClient()
        .from("videos")
        .select("*")
        .neq("id", currentVideoId); // Exclude the currently selected video

      if (error) {
        setError("Failed to load suggested videos");
      } else {
        setSuggestedVideos(data || []); // Update state with fetched data
      }
      setLoading(false); // Set loading to false after fetch completes
    };

    fetchSuggestedVideos();
  }, [currentVideoId]);

  if (loading) {
    return <p>Loading suggested videos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!suggestedVideos.length) {
    return <p>No suggested videos available</p>;
  }

  return <VideoGrid videos={suggestedVideos} />;
}

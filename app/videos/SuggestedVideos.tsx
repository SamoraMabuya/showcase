import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import { createClient } from "@/utils/supabase/client";
import { Suggested, Videos } from "./types";
import Coins from "@/components/Coins";

export default function SuggestedVideos({ currentVideoId }: Suggested) {
  const [suggestedVideos, setSuggestedVideos] = useState<Videos[]>([]); // Use type annotations for state
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state

  useEffect(() => {
    const fetchSuggestedVideos = async () => {
      setLoading(true); // Set loading state to true
      const { data, error } = await createClient()
        .from("videos")
        .select("*")
        .neq("id", currentVideoId) // Exclude the currently selected video
        .limit(5); // Limit to 5 suggestions

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

  return (
    <div className="mt-10">
      <div className="grid gap-4">
        {suggestedVideos.map((video) => (
          <Link
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-auto"
            href={`/video/${video.id}`}
            key={video.id}
          >
            <video
              width={300}
              height={300}
              src={video.video_url}
              poster={video.thumbnail_url}
            />
            <h4 className="font-bold">{video.title}</h4>
            <p className="text-sm text-muted-foreground">{video.tagline}</p>
            <Coins coins={video.total_coins} />
          </Link>
        ))}
      </div>
    </div>
  );
}

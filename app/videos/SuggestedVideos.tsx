import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import { VideoType } from "./type";
import { createClient } from "@/utils/supabase/client";

interface SuggestedVideosProps {
  currentVideoId: string; // Accept the current video ID as a prop
}

export default function SuggestedVideos({
  currentVideoId,
}: SuggestedVideosProps) {
  const [suggestedVideos, setSuggestedVideos] = useState<VideoType[]>([]); // Use type annotations for state
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
        setError("Failed to load suggested videos"); // Handle errors
        console.error("Error fetching suggested videos:", error.message);
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
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Suggested Videos</h3>
      <div className="grid gap-4">
        {suggestedVideos.map((video) => (
          <Link href={`/video/${video.id}`} key={video.id}>
            <Card className="p-4">
              <h4 className="font-bold">{video.title}</h4>
              <p className="text-sm text-muted-foreground">{video.tagline}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

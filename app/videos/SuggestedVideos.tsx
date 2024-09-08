import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import { createClient } from "@/utils/supabase/client";
import { Suggested, Videos } from "./types";
import Coins from "@/components/Coins";
import Likes from "./Likes";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import dayjs from "dayjs";

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

  return (
    <div className="mt-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {suggestedVideos.map((video) => (
          <Link
            className="flex flex-col"
            href={`/video/${video.id}`}
            key={video.id}
          >
            <div className="relative">
              <AspectRatio ratio={16 / 9}>
                <video
                  className="w-full h-full object-cover rounded-md"
                  src={video.video_url}
                  poster={video.thumbnail_url}
                />
              </AspectRatio>
            </div>
            <article className="flex flex-col mt-4">
              <dl className="block">
                <dt className="font-bold text-lg">{video.title}</dt>
                <dd className="text-sm text-muted-foreground">
                  {video.tagline}
                </dd>
              </dl>
              <aside className="flex justify-between">
                <span>
                  <small>{dayjs(video.created_at).fromNow()}</small>
                </span>

                <span>
                  <Coins coins={video.total_coins} />

                  <Likes videoId={video.id} />
                </span>
              </aside>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}

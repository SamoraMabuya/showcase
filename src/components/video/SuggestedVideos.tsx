import { useQuery } from "@tanstack/react-query";
import { createClient } from "../../../utils/supabase/client";
import { getSuggestedVideos, VideosType } from "@/queries";
import VideoGrid from "../VideoGrid";

export default function SuggestedVideos({
  currentVideoId,
}: {
  currentVideoId: string;
}) {
  const client = createClient();

  const {
    data: suggestedVideos,
    isLoading,
    error,
  } = useQuery<VideosType[], Error>({
    queryKey: ["suggestedVideos", currentVideoId],
    queryFn: () => getSuggestedVideos(client, currentVideoId),
  });

  if (isLoading) {
    return <p>Loading suggested videos...</p>;
  }

  if (error) {
    return <p>Error loading suggested videos: {error.message}</p>;
  }

  if (!suggestedVideos || suggestedVideos.length === 0) {
    return <p>No suggested videos available</p>;
  }

  return <VideoGrid videos={suggestedVideos} />;
}

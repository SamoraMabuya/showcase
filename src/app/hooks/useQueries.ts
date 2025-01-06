import { useQuery } from "@tanstack/react-query";
import { createClient } from "../../../utils/supabase/client";
import { Tables } from "../../../utils/database.types";

type VideosType = Tables<"videos">;

type VideoWithUser = VideosType & {
  users: {
    username: string;
    avatar_url: string | null;
  };
};

export function useVideo(videoId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["video", videoId],
    queryFn: async (): Promise<VideoWithUser> => {
      const { data, error } = await supabase
        .from("videos")
        .select(
          `
            *,
            users (
              username,
              avatar_url
            )
          `
        )
        .eq("id", videoId)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Video not found");

      // Return the correctly typed data
      return data as VideoWithUser; // Now this cast is correct because the data structure matches
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!videoId,
  });
}

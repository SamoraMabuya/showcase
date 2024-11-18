import { Tables } from "@/utils/database.types";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

type VideosType = Tables<"videos">;
type UsersType = Tables<"users">;

// Combine the types for the joined query
type VideoWithUser = VideosType & {
  users: Pick<UsersType, "username" | "avatar_url">;
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
      return data as VideosType;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!videoId, // Only run if videoId exists
  });
}

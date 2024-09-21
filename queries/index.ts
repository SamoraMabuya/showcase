import { TypedSupabaseClient } from "@/utils/types";
import { Database, Tables } from "@/utils/database.types";

type VideosType = Tables<"videos">;

type VideoWithUser = VideosType & {
  users: {
    username: string;
    avatar_url: string;
  };
};

export const getVideosById = async (
  client: TypedSupabaseClient,
  videoId: number
): Promise<VideoWithUser> => {
  const { data, error } = await client
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
  return data as VideoWithUser;
};

import { TypedSupabaseClient } from "@/utils/types";
import { Database, Tables } from "@/utils/database.types";
import { Videos } from "@/lib/types";

// Videos
export type VideosType = Tables<"videos">;

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

// Likes
export const getLikesCount = async (
  client: TypedSupabaseClient,
  videoId: string
) => {
  const { data, error } = await client
    .from("videos")
    .select("like_count")
    .eq("id", videoId)
    .single();

  if (error) throw error;
  return data?.like_count || 0;
};

export const updateLikes = async (
  client: TypedSupabaseClient,
  videoId: string,
  newCount: number
) => {
  const { error } = await client
    .from("videos")
    .update({ like_count: newCount })
    .eq("id", videoId);

  if (error) throw error;
  return newCount;
};

// Comments
export const getComments = async (
  client: TypedSupabaseClient,
  videoId: string
) => {
  const { data, error } = await client
    .from("comments")
    .select("*")
    .eq("video_id", videoId);

  if (error) throw error;
  return data || [];
};

// Suggested Videos

type SuggestedVideos = Tables<"videos">;

export const getSuggestedVideos = async (
  client: TypedSupabaseClient,
  currentVideoId: string
): Promise<SuggestedVideos[]> => {
  const { data, error } = await client
    .from("videos")
    .select("*")
    .neq("id", currentVideoId);

  if (error) throw error;
  return data || [];
};

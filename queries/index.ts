import { TypedSupabaseClient } from "@/utils/types";
import { Tables } from "@/utils/database.types";
import { Comments } from "@/lib/types";

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
  videoId: string
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
): Promise<Comments[]> => {
  const { data, error } = await client
    .from("comments")
    .select("*")
    .eq("video_id", videoId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};
export const addComment = async (
  client: TypedSupabaseClient,
  videoId: string,
  content: string,
  parentId?: string
): Promise<Comments> => {
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;

  const { data, error } = await client
    .from("comments")
    .insert({
      video_id: videoId,
      user_id: userData.user.id,
      content,
      parent_id: parentId,
      username: userData.user.user_metadata.username || userData.user.email,
    })
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error("No data returned from insert operation");

  return data as Comments;
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

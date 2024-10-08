import { TypedSupabaseClient } from "@/utils/types";
import { Tables } from "@/utils/database.types";
import { Comments } from "@/lib/types";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/database.types";
type VideoInsert = Database["public"]["Tables"]["videos"]["Insert"];

// Videos
export const insertVideo = async (
  client: TypedSupabaseClient,
  videoData: Database['public']['Tables']['videos']['Insert']
): Promise<void> => {
  const { error } = await client.from("videos").insert(videoData);
  if (error) throw error;
};
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
export const getUserLikeStatus = async (
  client: TypedSupabaseClient,
  videoId: string,
  userId: string | undefined
) => {
  if (!userId) return false;
  const { data, error } = await client
    .from("likes")
    .select("id")
    .eq("video_id", videoId)
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") throw error; // PGRST116 is the error code for no rows returned
  return !!data;
};
export const updateLikes = async (
  client: ReturnType<typeof createClient>,
  videoId: string,
  userId: string | undefined,
  like: boolean
) => {
  if (!userId) throw new Error("User must be logged in to like/unlike");

  const { data: existingLike, error: fetchError } = await client
    .from("likes")
    .select("id")
    .eq("video_id", videoId)
    .eq("user_id", userId)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

  if (like && !existingLike) {
    // Add like
    const { error } = await client
      .from("likes")
      .insert({ video_id: videoId, user_id: userId });
    if (error) throw error;
  } else if (!like && existingLike) {
    // Remove like
    const { error } = await client
      .from("likes")
      .delete()
      .eq("id", existingLike.id);
    if (error) throw error;
  }

  // Update like count in videos table
  const { data, error: updateError } = await client.rpc("update_like_count", {
    video_id: videoId,
  });
  if (updateError) throw updateError;

  return data?.[0]?.like_count ?? 0;
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
) => {
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;

  // Check if the user exists in the users table
  const { data: userExists, error: userCheckError } = await client
    .from("users")
    .select("id")
    .eq("id", userData.user.id)
    .single();

  if (userCheckError || !userExists) {
    console.error("User does not exist in users table:", userData.user.id);
    throw new Error("User does not exist in the database");
  }

  // If the user exists, proceed with adding the comment
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

  if (error) {
    console.error("Error inserting comment:", error);
    throw error;
  }
  return data;
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

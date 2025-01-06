import { Database, Tables } from "../../utils/database.types";
import { createClient } from "../../utils/supabase/client";
import { TypedSupabaseClient } from "../../utils/types";

export async function getCategories() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) throw error;
  return data;
}

export async function getCategoryById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}
export const insertVideo = async (
  client: TypedSupabaseClient,
  videoData: Database["public"]["Tables"]["videos"]["Insert"]
): Promise<void> => {
  const { error } = await client.from("videos").insert(videoData);
  if (error) throw error;
};
export type VideosType = Tables<"videos">;
export type CommentsType = Tables<"comments">;

type VideoWithUser = VideosType & {
  users: {
    username: string;
    avatar_url: string;
  };
};
export const getVideoById = async (
  supabase: TypedSupabaseClient,
  videoId: string
) => {
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
  return data;
};
export const getVideoUrl = async (
  client: TypedSupabaseClient,
  videoFile: File
): Promise<string> => {
  // Generate a unique filename
  const fileName = `${Date.now()}_${videoFile.name}`;

  // Upload the file to Supabase storage
  const { data, error } = await client.storage
    .from("videos")
    .upload(fileName, videoFile);

  if (error) {
    console.error("Error uploading video:", error);
    throw error;
  }

  if (!data || !data.path) {
    throw new Error("Upload successful but file path is missing");
  }

  // Generate a signed URL that expires in 1 hour (3600 seconds)
  const { data: signedData, error: signedUrlError } = await client.storage
    .from("videos")
    .createSignedUrl(data.path, 3600);

  if (signedUrlError) {
    console.error("Error generating signed URL:", signedUrlError);
    throw signedUrlError;
  }

  if (!signedData || !signedData.signedUrl) {
    throw new Error("Failed to generate signed URL");
  }

  return signedData.signedUrl;
};

export const getThumbnailUrl = async (
  client: TypedSupabaseClient,
  thumbnailFile: File
): Promise<string> => {
  // Generate a unique filename
  const fileName = `${Date.now()}_${thumbnailFile.name}`;

  // Upload the file to Supabase storage
  const { data, error } = await client.storage
    .from("thumbnails")
    .upload(fileName, thumbnailFile);

  if (error) {
    console.error("Error uploading video:", error);
    throw error;
  }

  if (!data || !data.path) {
    throw new Error("Upload successful but file path is missing");
  }

  // Generate a signed URL that expires in 1 hour (3600 seconds)
  const { data: signedData, error: signedUrlError } = await client.storage
    .from("thumbnails")
    .createSignedUrl(data.path, 3600);

  if (signedUrlError) {
    console.error("Error generating signed URL:", signedUrlError);
    throw signedUrlError;
  }

  if (!signedData || !signedData.signedUrl) {
    throw new Error("Failed to generate signed URL");
  }

  return signedData.signedUrl;
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
  const { count, error } = await client
    .from("likes")
    .select("*", { count: "exact" })
    .eq("video_id", videoId);

  if (error) throw error;
  return count || 0;
};

export const getUserLikeStatus = async (
  client: TypedSupabaseClient,
  videoId: string,
  userId?: string
) => {
  if (!userId) return false;

  const { data, error } = await client
    .from("likes")
    .select("id")
    .eq("video_id", videoId)
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
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
): Promise<CommentsType[]> => {
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

export const getSuggestedVideos = async (
  client: TypedSupabaseClient,
  currentVideoId: string
): Promise<VideosType[]> => {
  const { data, error } = await client
    .from("videos")
    .select("*")
    .neq("id", currentVideoId);

  if (error) throw error;
  return data || [];
};

// type searchVideos = Tables<'videos'>['Row'];
export type SearchVideos = Tables<"videos">;

// Move this outside of the function to ensure singleton
const supabaseClient = createClient();

export const getSearchedVideos = async (): Promise<SearchVideos[]> => {
  const { data, error } = await supabaseClient
    .from("videos")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
};

"use server";

import { createClient } from "@/utils/supabase/client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function uploadVideo(formData: FormData) {
  try {
    const cookieStore = cookies();
    const supabase = createClient();

    // Check authentication
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return { error: "Unauthorized" };
    }

    // Get files from FormData
    const video = formData.get("video") as File;
    const thumbnail = formData.get("thumbnail") as File;

    // Upload video
    const videoPath = `videos/${user.id}/${Date.now()}_${video.name}`;
    const { data: videoData, error: videoError } = await supabase.storage
      .from("videos")
      .upload(videoPath, video);

    if (videoError) throw videoError;

    // Upload thumbnail
    const thumbnailPath = `thumbnails/${user.id}/${Date.now()}_${
      thumbnail.name
    }`;
    const { data: thumbnailData, error: thumbnailError } =
      await supabase.storage
        .from("thumbnails")
        .upload(thumbnailPath, thumbnail);

    if (thumbnailError) throw thumbnailError;

    // Get URLs
    const videoUrl = supabase.storage.from("videos").getPublicUrl(videoPath)
      .data.publicUrl;
    const thumbnailUrl = supabase.storage
      .from("thumbnails")
      .getPublicUrl(thumbnailPath).data.publicUrl;

    // Insert video data
    const { error: insertError } = await supabase.from("videos").insert({
      title: formData.get("title") as string,
      tagline: formData.get("tagline") as string,
      description: formData.get("description") as string,
      video_url: videoUrl,
      thumbnail_url: thumbnailUrl,
      user_id: user.id,
      created_at: new Date().toISOString(),
      like_count: 0,
    });

    if (insertError) throw insertError;

    // Revalidate the home page
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Server Action Error:", error);
    return { error: "Failed to upload video" };
  }
}

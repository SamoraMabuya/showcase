"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/TextArea";
import { Label } from "@/components/Label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/Alert";
import { getThumbnailUrl, getVideoUrl, insertVideo } from "@/queries"; // Assuming you've added this to your queries file
import { Database } from "@/utils/database.types";

type FormData = {
  title: string;
  tagline: string;
  description: string;
  video: FileList;
  thumbnail: FileList;
  contactEmail: string;
};

type VideoInsert = Database["public"]["Tables"]["videos"]["Insert"];

export default function UploadContent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const onSubmit = async (data: FormData) => {
    setUploading(true);
    const video = data.video[0];
    const thumbnail = data.thumbnail[0];

    try {
      // Handle video URL
      console.log("Starting video upload...");
      const videoUrl = await getVideoUrl(supabase, video);
      console.log("Video uploaded successfully:", videoUrl);

      // Handle thumbnail URL
      console.log("Starting thumbnail upload...");
      const thumbnailUrl = await getThumbnailUrl(supabase, thumbnail);
      console.log("Thumbnail uploaded successfully:", thumbnailUrl);

      // Get current user
      console.log("Getting current user...");
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) {
        console.error("Error getting user:", userError);
        throw userError;
      }
      console.log("User retrieved successfully");

      // Prepare video data
      const videoInsertData: VideoInsert = {
        title: data.title,
        tagline: data.tagline,
        description: data.description,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
        user_id: user?.id,
        created_at: new Date().toISOString(),
        like_count: 0,
      };

      // Insert video data
      console.log("Inserting video data...");
      await insertVideo(supabase, videoInsertData);
      console.log("Video data inserted successfully");

      setUploading(false);
      router.push("/");
    } catch (error) {
      console.error("Detailed error in upload process:", error);
      if (error instanceof Error) {
        alert(`An error occurred during the upload process: ${error.message}`);
      } else {
        alert(
          "An unknown error occurred during the upload process. Please try again."
        );
      }
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Content</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && (
            <span className="text-red-500">{errors.title.message}</span>
          )}
        </div>

        <div>
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            {...register("tagline", { required: "Tagline is required" })}
          />
          {errors.tagline && (
            <span className="text-red-500">{errors.tagline.message}</span>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea id="description" {...register("description")} />
        </div>

        <div>
          <Label htmlFor="video">Video (max 60 seconds)</Label>
          <Input
            id="video"
            type="file"
            accept="video/*"
            {...register("video", { required: "Video is required" })}
          />
          {errors.video && (
            <span className="text-red-500">{errors.video.message}</span>
          )}
        </div>

        <div>
          <Label htmlFor="thumbnail">Thumbnail</Label>
          <Input
            id="thumbnail"
            type="file"
            accept="image/*"
            {...register("thumbnail", { required: "Thumbnail is required" })}
          />
          {errors.thumbnail && (
            <span className="text-red-500">{errors.thumbnail.message}</span>
          )}
        </div>

        <div>
          <Label htmlFor="contactEmail">Contact Email</Label>
          <Input
            id="contactEmail"
            type="email"
            {...register("contactEmail", {
              required: "Contact email is required",
            })}
          />
          {errors.contactEmail && (
            <span className="text-red-500">{errors.contactEmail.message}</span>
          )}
        </div>

        <Button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </form>
    </div>
  );
}

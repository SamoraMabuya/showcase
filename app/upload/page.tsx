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
import { insertVideo } from "@/queries"; // Assuming you've added this to your queries file
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

    // Check video duration
    const videoElement = document.createElement("video");
    videoElement.preload = "metadata";
    videoElement.onloadedmetadata = async function () {
      window.URL.revokeObjectURL(videoElement.src);
      if (videoElement.duration > 60) {
        alert("Video must be 60 seconds or less");
        setUploading(false);
        return;
      }

      try {
        // Upload video
        const { data: videoData, error: videoError } = await supabase.storage
          .from("videos")
          .upload(`${Date.now()}_${video.name}`, video);

        if (videoError) throw videoError;

        // Upload thumbnail
        const { data: thumbnailData, error: thumbnailError } = await supabase.storage
          .from("thumbnails")
          .upload(`${Date.now()}_${thumbnail.name}`, thumbnail);

        if (thumbnailError) throw thumbnailError;

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        // Prepare video data
        const videoInsertData: VideoInsert = {
          title: data.title,
          tagline: data.tagline,
          description: data.description,
          video_url: videoData?.path,
          thumbnail_url: thumbnailData?.path,
          contact_email: data.contactEmail,
          user_id: user?.id,
          created_at: new Date().toISOString(),
          like_count: 0,
          total_coins: 0,
        };

        // Insert video data
        await insertVideo(supabase, videoInsertData);

        setUploading(false);
        router.push("/");
      } catch (error) {
        console.error("Error in video upload process:", error);
        alert("An error occurred during the upload process. Please try again.");
        setUploading(false);
      }
    };
    videoElement.src = URL.createObjectURL(video);
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

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Note</AlertTitle>
          <AlertDescription>
            Videos will be automatically adjusted to fit the appropriate aspect
            ratio. For thumbnails, please upload images in 16:9 aspect ratio for
            best results.
          </AlertDescription>
        </Alert>

        <Button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </form>
    </div>
  );
}

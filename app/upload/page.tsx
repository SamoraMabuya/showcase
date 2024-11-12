"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Database } from "@/utils/database.types";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/TextArea";
import { Label } from "@/components/Label";
import { uploadVideo } from "./actions";

type FormData = {
  title: string;
  tagline: string;
  description: string;
  video: FileList;
  thumbnail: FileList;
  contactEmail: string;
};

export default function UploadContent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    setUploading(true);

    try {
      // Create FormData to handle file uploads
      const formData = new FormData();
      formData.append("video", data.video[0]);
      formData.append("thumbnail", data.thumbnail[0]);
      formData.append("title", data.title);
      formData.append("tagline", data.tagline);
      formData.append("description", data.description);
      formData.append("contactEmail", data.contactEmail);

      // Call server action
      const result = await uploadVideo(formData);

      if (result.error) {
        throw new Error(result.error);
      }

      router.push("/");
      router.refresh(); // Refresh the page to show new data
    } catch (error) {
      console.error("Error in video upload process:", error);
      alert("An error occurred during the upload process. Please try again.");
    } finally {
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

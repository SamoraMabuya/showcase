"use client"; // Client-side page
import { useState, useEffect } from "react";
import CommentSection from "./CommentSection";
import SuggestedVideos from "./SuggestedVideos";
import { Card } from "@/components/Card";
import { createClient } from "@/utils/supabase/client";
import { Videos } from "./types"; // Use the renamed type
import Likes from "./Likes";
import CoinsAwarded from "./CoinsAwarded";
import { Label } from "@/components/Label";
import { Button } from "@/components/Button";
import { shortenText } from "@/lib/text";

export default function VideoPage() {
  const [video, setVideo] = useState<Videos | null>(null); // Use VideoType for type definition
  const [loading, setLoading] = useState(true);
  const [uploader, setUploader] = useState<string | null>(null);
  const [expandText, setExpandText] = useState(false);

  // Fetch the selected video (hardcoded for now as an example)
  useEffect(() => {
    const fetchVideo = async () => {
      const { data, error } = await createClient()
        .from("videos")
        .select(
          `
          *,
          users (
            username
          )
        `
        )
        .eq("id", "21fab2f2-840a-40aa-8531-1196819c2f6a") // Replace with actual video ID
        .single(); // Fetch the selected video

      if (error) {
        console.error("Error fetching video:", error.message);
      } else {
        setVideo(data as Videos);
        setUploader(data.users.username);
      }
      setLoading(false);
    };

    fetchVideo();
  }, []);

  if (loading) {
    return <p>Loading video...</p>;
  }

  if (!video) {
    return <p>No video found</p>;
  }

  const handleExpandText = () => setExpandText(!expandText);
  const maxLengthOfText = 200;

  return (
    <div className="container mx-auto p-4">
      {/* Selected Video */}
      <div className="mb-4">
        <div className="relative mb-4">
          <video controls className="w-full rounded-lg">
            <source src={video.video_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="px-4 flex justify-between mt-8">
          <div>
            <h2 className="text-lg font-bold">{video.title}</h2>
            <p className="text-sm text-muted-foreground mb-2">
              {video.tagline}
            </p>
          </div>
          <div className="block">
            <div className="flex">
              <Likes videoId={video.id} />
              <CoinsAwarded videoId={video.id} userId={video.user_id} />
            </div>
            <div className="float-right">
              <Label htmlFor="username">{uploader}</Label>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <p>
            {" "}
            {expandText
              ? video.description
              : shortenText(video.description, maxLengthOfText)}
          </p>
          {video.description.length > maxLengthOfText && (
            <Button
              variant={"outline"}
              onClick={handleExpandText}
              className="mt-2 hover:text-blue-700"
            >
              {expandText ? "Less" : "More"}
            </Button>
          )}
        </div>
      </div>
      <CommentSection videoId={video.id} />
      <SuggestedVideos currentVideoId={video.id} />
    </div>
  );
}

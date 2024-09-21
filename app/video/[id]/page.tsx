"use client"; // Client-side page
import { useState, useEffect } from "react";
import { Card } from "@/components/Card";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/Button";
import { shortenText } from "@/lib/text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { useParams } from "next/navigation";
import CoinsAwarded from "@/app/videos/CoinsAwarded";
import CommentSection from "@/app/videos/CommentSection";
import Likes from "@/app/videos/Likes";
import SuggestedVideos from "@/app/videos/SuggestedVideos";
import { Videos } from "@/lib/types";
import { Label } from "@radix-ui/react-label";

export default function VideoPage() {
  const [video, setVideo] = useState<Videos | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploader, setUploader] = useState<string | null>(null);
  const [expandText, setExpandText] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const params = useParams();

  // Fetch the selected video (hardcoded for now as an example)
  useEffect(() => {
    const fetchVideo = async () => {
      const { data, error } = await createClient()
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
        .eq("id", params.id) // Replace with actual video ID
        .single(); // Fetch the selected video

      if (error) {
        console.error("Error fetching video:", error.message);
      } else {
        setVideo(data as Videos);
        setUploader(data?.users?.username);
        setAvatarUrl(data?.users.avatar_url);
      }
      setLoading(false);
    };

    fetchVideo();
  }, [params.id]);

  if (loading) {
    return <p>Loading video...</p>;
  }

  if (!video) {
    return <p>No video found</p>;
  }

  const handleExpandText = () => setExpandText(!expandText);
  const maxLengthOfText = 200;
  const avatarFallBack = uploader?.slice(0, 2).toUpperCase();

  const avatarImage = avatarUrl || avatarFallBack;

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
            <div className="float-right flex align-middle items-center space-x-2">
              <Avatar>
                <AvatarImage
                  src={avatarImage}
                  alt={avatarFallBack}
                  className="object-cover"
                />
                <AvatarFallback>{avatarFallBack}</AvatarFallback>
              </Avatar>

              <Label htmlFor="username">{uploader}</Label>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <p>
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
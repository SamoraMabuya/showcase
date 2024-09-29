"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { getVideosById } from "@/queries";

export default function VideoPage() {
  const [expandText, setExpandText] = useState(false);
  const params = useParams();
  const videoId = params.id as string;
  const supabase = createClient();

  const {
    data: video,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["video", videoId],
    queryFn: () => getVideosById(supabase, videoId),
  });

  const handleExpandText = () => setExpandText(!expandText);
  const maxLengthOfText = 200;

  if (isLoading) {
    return <p>Loading video...</p>;
  }

  if (error) {
    return <p>Error loading video: {(error as Error).message}</p>;
  }

  if (!video) {
    return <p>No video found</p>;
  }

  const avatarFallBack = video.users?.username?.slice(0, 2).toUpperCase();
  const avatarImage = video.users?.avatar_url || avatarFallBack;

  return (
    <div className="container mx-auto p-4">
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
              <CoinsAwarded videoId={video.id} />
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

              <Label htmlFor="username">{video.users?.username}</Label>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <p>
            {expandText
              ? video.description !== undefined
              : shortenText(video.description || "", maxLengthOfText)}
          </p>
          {video.description && video.description.length > maxLengthOfText && (
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

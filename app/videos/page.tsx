"use client"; // Client-side page
import { useState, useEffect } from "react";
import CommentSection from "./CommentSection";
import SuggestedVideos from "./SuggestedVideos";
import { Card } from "@/components/Card";
import { createClient } from "@/utils/supabase/client";
import { Videos } from "../../lib/types"; // Use the renamed type
import Likes from "./Likes";
import CoinsAwarded from "./CoinsAwarded";
import { Label } from "@/components/Label";
import { Button } from "@/components/Button";
import { shortenText } from "@/lib/text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useSupabaseServer from "@/utils/supabase/server";
import useSupabaseBrowser from "@/utils/supabase-browser";
import { getVideosById } from "@/queries";
export default function VideoPage() {
  const params = useParams();
  const videoId = params.id as string;
  const [expandText, setExpandText] = useState(false);

  const {
    data: video,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["video", videoId],
    queryFn: () => getVideosById(createClient(), parseInt(videoId)),
    enabled: !!videoId,
  });

  const handleExpandText = () => setExpandText(!expandText);
  const maxLengthOfText = 200;

  if (isLoading) return <p>Loading video...</p>;
  if (error) return <p>Error loading video: {(error as Error).message}</p>;
  if (!video) return <p>No video found</p>;

  const avatarFallBack = video.users?.username?.slice(0, 2).toUpperCase();
  const avatarImage = video.users?.avatar_url || avatarFallBack;
  const videoDescription = video.description ? video.description : "";

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

              <Label htmlFor="username">{video.users?.username}</Label>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <p>
            {expandText
              ? video.description
              : shortenText(videoDescription, maxLengthOfText)}
          </p>
          {videoDescription.length > maxLengthOfText && (
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

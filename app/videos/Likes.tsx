"use client";
import { Button } from "@/components/Button";
import { Label } from "@/components/Label";
import { getLikesCount, getUserLikeStatus, updateLikes } from "@/queries";
import { createClient } from "@/utils/supabase/client";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface LikesProps {
  videoId: string;
}

export default function Likes({ videoId }: LikesProps) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const client = createClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: likes, isLoading: likesLoading } = useQuery({
    queryKey: ["likes", videoId],
    queryFn: () => getLikesCount(client, videoId),
  });

  const { data: userLiked, isLoading: userLikeLoading } = useQuery({
    queryKey: ["userLike", videoId, user?.id],
    queryFn: () => getUserLikeStatus(client, videoId, user?.id),
    enabled: !!user,
  });

  const mutation = useMutation({
    mutationFn: () => updateLikes(client, videoId, user?.id, !userLiked),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes", videoId] });
      queryClient.invalidateQueries({
        queryKey: ["userLike", videoId, user?.id],
      });
    },
  });

  const handleLike = () => {
    if (!mounted) return;
    if (!user) {
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    mutation.mutate();
  };

  if (!mounted || likesLoading || userLikeLoading) {
    return <p>Loading likes...</p>;
  }

  const LikeIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={userLiked ? "currentColor" : "none"}
      stroke="currentColor"
      className="size-6 fill-amber-400 stroke-amber-400"
    >
      <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
    </svg>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" onClick={handleLike}>
            <LikeIcon />
            <Label className="ml-3" htmlFor="like">
              {likes}
            </Label>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{userLiked ? "Unlike" : "Like"}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

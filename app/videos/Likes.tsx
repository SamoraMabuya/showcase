import { Button } from "@/components/Button";
import { Label } from "@/components/Label";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";

interface LikesProps {
  videoId: string;
}

export default function Likes({ videoId }: LikesProps) {
  const [likes, setLikes] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch likes from the "videos" table
  useEffect(() => {
    const fetchLikesData = async () => {
      const { data, error } = await createClient()
        .from("videos") // Fetch likes count from videos table
        .select("like_count")
        .eq("id", videoId)
        .single();

      if (error) {
        console.error("Error fetching likes:", error.message);
      } else {
        setLikes(data.like_count || 0); // Set likes to the fetched count
      }
      setLoading(false);
    };

    fetchLikesData();
  }, [videoId]);

  // Handle like button click
  const handleLike = async () => {
    setLikes(likes + 1); // Optimistic UI update
    const { error } = await createClient()
      .from("videos")
      .update({ likes: likes + 1 }) // Increment likes count
      .eq("id", videoId);

    if (error) {
      console.error("Error updating likes:", error.message);
    }
  };

  if (loading) {
    return <p>Loading likes...</p>;
  }

  const LikeIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6 fill-amber-400 stroke-amber-400"
    >
      <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
    </svg>
  );

  return (
    <Button variant="ghost" onClick={handleLike}>
      <LikeIcon />
      <Label className="ml-3" htmlFor="like">
        {likes}
      </Label>
    </Button>
  );
}

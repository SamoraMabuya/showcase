"use client";
import { useEffect, useState } from "react";
import VideoGrid from "@/components/VideoGrid";
import { createClient } from "@/utils/supabase/client";
import { Videos } from "@/lib/types";

export default function Index() {
  const [videos, setVideos] = useState<Videos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError("Error loading videos. Please try again later.");
      } else {
        setVideos(data || []);
      }
      setLoading(false);
    };

    fetchVideos();
  }, []); // Empty dependency array means this effect runs once on mount

  if (loading) {
    return <p>Loading videos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!videos.length) {
    return <p>No videos available</p>;
  }

  return (
    <div className="container mx-auto px-4">
      <VideoGrid videos={videos} />
    </div>
  );
}

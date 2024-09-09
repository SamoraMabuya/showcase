"use client";
import { useEffect, useState } from "react";
import VideoGrid from "@/components/VideoGrid";
import { createClient } from "@/utils/supabase/client";
import { Videos } from "@/lib/types";
import { useSearchParams } from "next/navigation";

export default function Index() {
  const [videos, setVideos] = useState<Videos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredVideos, setFilteredVideos] = useState<Videos[]>([]);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q");

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
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = videos.filter(
        (video) =>
          video.title.toLowerCase().includes(lowerCaseQuery) ||
          video.tagline.toLowerCase().includes(lowerCaseQuery) ||
          video.description?.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredVideos(filtered);
    } else {
      setFilteredVideos(videos);
    }
  }, [searchQuery, videos]);

  if (loading) {
    return <p>Loading videos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!filteredVideos.length) {
    return <p>No videos available</p>;
  }

  return (
    <div className="container mx-auto px-4">
      <VideoGrid videos={filteredVideos} />
    </div>
  );
}

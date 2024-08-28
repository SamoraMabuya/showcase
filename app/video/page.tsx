"use client"; // Mark this component as a client-side component
import { useEffect, useState } from "react";

import Image from "next/image"; // For optimized image rendering
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/Button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/Card";

interface Video {
  id: string;
  title: string;
  tagline: string;
  video_url: string;
  thumbnail_url: string;
}

export default function VideoList() {
  const [videos, setVideos] = useState<Video[]>([]); // State to store the videos
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch videos from Supabase
  useEffect(() => {
    const fetchVideos = async () => {
      const { data, error } = await createClient()
        .from("videos")
        .select("id, title, tagline, video_url, thumbnail_url");

      if (error) {
        console.error("Error fetching videos:", error.message);
      } else {
        setVideos(data || []); // Set the videos data
      }
      setLoading(false); // Stop loading
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <p>Loading videos...</p>;
  }

  if (!videos.length) {
    return <p>No videos found</p>;
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            {/* Thumbnail (fallback if video fails to load) */}
            <div className="h-48 w-full relative mb-2">
              <video
                poster={video.thumbnail_url} // Display the thumbnail before the video plays
                className="w-full h-full object-cover rounded"
              >
                <source src={video.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Video Details */}
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800">{video.title}</h3>
              <p className="text-sm text-gray-600">{video.tagline}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// export function Video() {
//   return (
//     <video width="320" height="240" controls preload="none">
//       <source src="/path/to/video.mp4" type="video/mp4" />
//       <track
//         src="/path/to/captions.vtt"
//         kind="subtitles"
//         srcLang="en"
//         label="English"
//       />
//       Your browser does not support the video tag.
//     </video>
//   )
// }

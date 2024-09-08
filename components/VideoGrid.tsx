import React from "react";
import Link from "next/link";
import { Videos } from "@/app/videos/types";
import dayjs from "dayjs";

interface VideoGridProps {
  videos: Videos[];
}

const VideoGrid: React.FC<VideoGridProps> = ({ videos }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {videos.map((video) => (
        <div
          key={video.id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <Link href={`/video/${video.id}`}>
            <img
              src={video.thumbnail_url || "/placeholder-thumbnail.jpg"}
              alt={video.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="font-bold text-lg mb-2 truncate">{video.title}</h2>
              <p className="text-gray-600 text-sm mb-2 truncate">
                {video.tagline}
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{video.like_count} likes</span>
                <span>{video.total_coins} coins</span>
              </div>
              <p className="text-gray-600 text-xs mt-2">
                {dayjs(video.created_at).format("MMMM D, YYYY")}
              </p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;

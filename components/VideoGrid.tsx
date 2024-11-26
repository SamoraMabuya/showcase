"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Coins from "./Coins";
import Likes from "@/app/videos/Likes";
import relativeTime from "dayjs/plugin/relativeTime";
import { Tables } from "@/utils/database.types";
dayjs.extend(relativeTime);
import { VideoGridSkeleton } from "./VideoGridSkeleton";
import Image from "next/image";
import { Suspense } from "react";

type VideoGridProps = Tables<"videos">;

const VideoGrid = ({ videos }: { videos: VideoGridProps[] }) => {
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const handleMouseEnter = (videoId: string) => {
    setHoveredVideo(videoId);
    const videoElement = videoRefs.current[videoId];
    if (videoElement) {
      videoElement
        .play()
        .catch((error) => console.error("Error playing video:", error));
    }
  };

  const handleMouseLeave = (videoId: string) => {
    setHoveredVideo(null);
    const videoElement = videoRefs.current[videoId];
    if (videoElement) {
      videoElement.pause();
      videoElement.currentTime = 0;
    }
  };

  return (
    <div className="mt-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <Link
            className="flex flex-col "
            href={`/video/${video.id}`}
            key={video.id}
            onMouseEnter={() => handleMouseEnter(video.id)}
            onMouseLeave={() => handleMouseLeave(video.id)}
          >
            <div className="relative">
              <AspectRatio ratio={16 / 9}>
                <div className="w-full h-full">
                  <Image
                    src={video.thumbnail_url || ""}
                    alt={video.title}
                    fill={true}
                    quality={75}
                    priority={false}
                    placeholder="empty"
                    className={`absolute inset-0 w-full h-full object-cover rounded-md ${
                      hoveredVideo === video.id ? "opacity-0" : "opacity-100"
                    }`}
                  />
                  <video
                    ref={(el) => (videoRefs.current[video.id] = el)}
                    className={`absolute inset-0 w-full h-full object-cover rounded-md ${
                      hoveredVideo === video.id ? "opacity-100" : "opacity-0"
                    }`}
                    src={video.video_url || ""}
                    muted
                    playsInline
                    loop
                  />
                </div>
              </AspectRatio>
            </div>
            <article className="flex flex-col mt-4">
              <dl className="block">
                <dt className="font-bold text-lg">{video.title}</dt>
                <dd className="text-sm text-muted-foreground">
                  {video.tagline}
                </dd>
              </dl>
              <aside className="flex justify-between">
                <span>
                  <small>{dayjs(video?.created_at).fromNow()}</small>
                </span>

                <span>
                  <Coins coins={video.total_coins || 0} />
                  <Likes videoId={video.id} />
                </span>
              </aside>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
};

const VideoGridLayout = ({
  videos,
  skeletonCount = 8,
}: {
  videos: VideoGridProps[];
  skeletonCount?: number;
}) => (
  <Suspense fallback={<VideoGridSkeleton count={skeletonCount} />}>
    <VideoGrid videos={videos} />
  </Suspense>
);

export default VideoGridLayout;

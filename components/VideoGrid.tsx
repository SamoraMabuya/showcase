"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Coins from "./Coins";
import relativeTime from "dayjs/plugin/relativeTime";
import { Tables } from "@/utils/database.types";
dayjs.extend(relativeTime);
import { VideoGridSkeleton } from "./VideoGridSkeleton";
import Image from "next/image";
import { Suspense } from "react";
import { error } from "console";
import Likes from "@/app/videos/Likes";
type VideoGridProps = Tables<"videos">;
interface VideoWithBlur extends VideoGridProps {
  blurDataUrl?: string | null;
}

const VideoGrid = ({ videos }: { videos: VideoWithBlur[] }) => {
  const videoReference = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const [hoveredVideo, sethoveredVideo] = useState<string | null>(null);

  const handleMouseEnter = (videoId: string) => {
    const currentVideo = videoReference.current[videoId];
    if (currentVideo) {
      if (!currentVideo.paused) {
        return;
      }
      currentVideo.muted = true; // Ensure the video is muted
      currentVideo
        .play()
        .then(() => {
          sethoveredVideo(videoId);
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            console.error(
              "Encountered error while attempting to play hovered video",
              error
            );
          }
        });
    }
  };

  const handleMouseLeave = (videoId: string) => {
    const currentVideo = videoReference.current[videoId];
    currentVideo?.muted;
    if (currentVideo) {
      currentVideo.pause();
      sethoveredVideo(null);
    }
  };

  const getVideoRef = (videoRef: HTMLVideoElement | null, videoId: string) => {
    if (videoRef) {
      videoReference.current[videoId] = videoRef;
    }
  };

  return (
    <div className="mt-10">
      <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
        {videos.map((video) =>
          video.thumbnail_url ? (
            <Link
              className="flex flex-col"
              href={`/video/${video.id}`}
              key={video.id}
            >
              <div className="relative">
                <AspectRatio ratio={16 / 9}>
                  <div className="w-full h-full relative">
                    <Image
                      src={video.thumbnail_url}
                      alt={video.title}
                      fill={true}
                      quality={75}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={true}
                      blurDataURL={video.blurDataUrl || undefined}
                      className={`absolute inset-0 w-full h-full object-cover rounded-md ${
                        hoveredVideo === video.id ? "opacity-0" : "opacity-100"
                      }`}
                    />
                    <video
                      ref={(videoRef) => getVideoRef(videoRef, video.id)}
                      preload="none"
                      onMouseEnter={() => handleMouseEnter(video.id)}
                      onMouseLeave={() => handleMouseLeave(video.id)}
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
                  <span></span>
                  <span>
                    <Coins coins={video.total_coins || 0} />
                    <Likes videoId={video.id} />
                  </span>
                </aside>
              </article>
            </Link>
          ) : null
        )}
      </div>
    </div>
  );
};

export default VideoGrid;

"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getSearchedVideos, SearchVideos } from "@/queries";
import Header from "@/components/Header";
import { VideoGridSkeleton } from "@/components/VideoGridSkeleton";
import VideoGridLayout from "@/components/VideoGridLayout";

export default function Index() {
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q");

  const { data: videos } = useQuery<SearchVideos[], Error>({
    queryKey: ["videos"],
    queryFn: getSearchedVideos,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: false, // Disable fetching if hydrated data is already present
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const filteredVideos = useMemo(() => {
    if (!videos) return [];
    if (!searchQuery) return videos;

    const lowerCaseQuery = searchQuery.toLowerCase();
    return videos.filter(
      (video) =>
        video.title.toLowerCase().includes(lowerCaseQuery) ||
        video.tagline.toLowerCase().includes(lowerCaseQuery) ||
        video.description?.toLowerCase().includes(lowerCaseQuery)
    );
  }, [videos, searchQuery]);

  const skeletonCount = filteredVideos.length || 8;

  return (
    <div className="container mx-auto ">
      {verificationSuccess && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline">
            Your email has been verified. Welcome to VideoShare!
          </span>
        </div>
      )}
      <Header />

      <Suspense fallback={<VideoGridSkeleton count={skeletonCount} />}>
        <VideoGridLayout videos={filteredVideos} />
      </Suspense>
    </div>
  );
}

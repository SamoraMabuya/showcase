"use client";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import VideoGrid from "@/components/VideoGrid";
import { createClient } from "@/utils/supabase/client";
import { Videos } from "@/lib/types";
import { useSearchParams, useRouter } from "next/navigation";
import { getSearchedVideos, SearchVideos } from "@/queries";

export default function Index() {
  const [filteredVideos, setFilteredVideos] = useState<SearchVideos[]>([]);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q");
  const router = useRouter();

  const {
    data: videos,
    isLoading,
    error,
  } = useQuery<SearchVideos[], Error>({
    queryKey: ["videos"],
    queryFn: getSearchedVideos,
  });

  useEffect(() => {
    // Check if the user just verified their email
    const success = searchParams.get("verified");
    if (success === "true") {
      setVerificationSuccess(true);

      // Create a new URLSearchParams object without the 'verified' parameter
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("verified");

      // Construct the new URL
      const newPathname = `${window.location.pathname}${
        newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""
      }`;

      // Replace the current URL without the 'verified' parameter
      router.replace(newPathname, { scroll: false });

      // Hide the success message after 5 seconds
      setTimeout(() => setVerificationSuccess(false), 5000);
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (videos && searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = videos.filter(
        (video) =>
          video.title.toLowerCase().includes(lowerCaseQuery) ||
          video.tagline.toLowerCase().includes(lowerCaseQuery) ||
          video.description?.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredVideos(filtered);
    } else {
      setFilteredVideos(videos || []);
    }
  }, [searchQuery, videos]);

  if (isLoading) {
    return <p>Loading videos...</p>;
  }

  if (error) {
    return <p>Error loading videos. Please try again later.</p>;
  }

  return (
    <div className="container mx-auto px-4">
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
      {!filteredVideos.length ? (
        <p>No videos available</p>
      ) : (
        <VideoGrid videos={filteredVideos} />
      )}
    </div>
  );
}

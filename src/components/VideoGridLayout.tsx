import { Suspense } from "react";
import { VideoGridSkeleton } from "./VideoGridSkeleton";

import VideoGrid from "./VideoGrid";
import { Tables } from "../../utils/database.types";
import { getBlurDataUrl } from "@/lib/getBlurDataUrl";

type VideoGridProps = Tables<"videos">;

interface VideoGridLayoutProps {
  videos: VideoGridProps[];
  skeletonCount?: number;
}

async function VideoBlurUrl({ videos }: { videos: VideoGridProps[] }) {
  // Pre-generate blur data on the server
  const videosWithBlur = await Promise.all(
    videos.map(async (video) => {
      if (video.thumbnail_url) {
        const blurDataUrl = await getBlurDataUrl(video.thumbnail_url);
        return {
          ...video,
          blurDataUrl,
        };
      }
      return video;
    })
  );

  return <VideoGrid videos={videosWithBlur} />;
}

const VideoGridLayout = ({
  videos,
  skeletonCount = 8,
}: VideoGridLayoutProps) => (
  <Suspense fallback={<VideoGridSkeleton count={skeletonCount} />}>
    <VideoBlurUrl videos={videos} />
  </Suspense>
);

export default VideoGridLayout;

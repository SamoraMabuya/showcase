// components/VideoGridSkeleton.tsx
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Skeleton } from "./ui/Skeleton";

export function VideoGridSkeleton({ count = 1 }: { count?: number }) {
  return (
    <div className="mt-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(count)].map((_, index) => (
          <div key={index} className="flex flex-col">
            <div className="relative">
              <AspectRatio ratio={16 / 9}>
                <Skeleton className="absolute inset-0 w-full h-full rounded-md" />
              </AspectRatio>
            </div>
            <div className="flex flex-col mt-4 space-y-2">
              <Skeleton className="h-6 w-3/4" /> {/* Title */}
              <Skeleton className="h-4 w-1/2" /> {/* Tagline */}
              <div className="flex justify-between mt-2">
                <Skeleton className="h-4 w-20" /> {/* Date */}
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-12" /> {/* Coins */}
                  <Skeleton className="h-4 w-12" /> {/* Likes */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

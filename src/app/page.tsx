import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import IndexPage from "./IndexPage";
import { getSearchedVideos } from "@/queries";

export default async function Page() {
  const queryClient = new QueryClient();

  // Prefetch videos
  await queryClient.prefetchQuery({
    queryKey: ["videos"],
    queryFn: getSearchedVideos,
    // staleTime: 5 * 60 * 1000,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <IndexPage />
    </HydrationBoundary>
  );
}

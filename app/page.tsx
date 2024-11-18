// app/page.tsx
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/server";
import { getSearchedVideos } from "@/queries";
import IndexPage from "./IndexPage";

export default async function Page() {
  const queryClient = new QueryClient();

  // Prefetch videos
  await queryClient.prefetchQuery({
    queryKey: ["videos"],
    queryFn: getSearchedVideos,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <IndexPage />
    </HydrationBoundary>
  );
}

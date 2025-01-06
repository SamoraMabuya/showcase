import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import Video from "../../../components/video/Video";
import { createClient } from "../../../../utils/supabase/client";
import { getVideoById } from "@/queries";

export default async function VideoPage({
  params,
}: {
  params: { id: string };
}) {
  const queryClient = new QueryClient();
  const supabase = await createClient();

  await queryClient.prefetchQuery({
    queryKey: ["video", params.id],
    queryFn: () => getVideoById(supabase, params.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Video />
    </HydrationBoundary>
  );
}

import { Videos } from "./types";

export default function VideoCard({ video }: { video: Videos }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-bold">{video.title}</h2>
      <p>{video.tagline}</p>
      <video controls className="w-full mt-2">
        <source src={video.video_url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
